"""
main.py
GrowBro Multi-CMS Backend API — Separated modules with robust slug generation and query filtering.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import os
import re
import secrets
import uuid

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

import models
import schemas
from database import Base, engine, get_db

load_dotenv()

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="GrowBro Multi-CMS & Mini-CRM API",
    version="2.1.1",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"status": "ok", "service": "GrowBro Multi-CMS API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


# ==============================================================
# Helper for Slugs (Collision safe)
# ==============================================================
def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or secrets.token_hex(4)


async def generate_unique_slug(model_cls, base_text: str, db: AsyncSession) -> str:
    base_slug = slugify(base_text)
    slug = base_slug
    counter = 1
    while True:
        res = await db.execute(select(model_cls).where(func.lower(model_cls.slug) == slug))
        if not res.scalar_one_or_none():
            return slug
        slug = f"{base_slug}-{counter}"
        counter += 1


# ==============================================================
# 1. BLOGS ENDPOINTS (/api/blogs)
# ==============================================================
@app.get("/api/blogs", response_model=list[schemas.BlogResponse])
async def list_blogs(
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(models.Blog).order_by(models.Blog.created_at.desc())
    if status and status.upper() != "ALL":
        query = query.where(func.upper(models.Blog.status) == status.upper())
    result = await db.execute(query)
    return result.scalars().all()


@app.get("/api/blogs/{slug}", response_model=schemas.BlogResponse)
async def get_blog(slug: str, db: AsyncSession = Depends(get_db)):
    clean_slug = slug.strip().lower()
    result = await db.execute(select(models.Blog).where(func.lower(models.Blog.slug) == clean_slug))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Blog not found")
    return item


@app.post("/api/blogs", response_model=schemas.BlogResponse, status_code=status.HTTP_201_CREATED)
async def create_blog(payload: schemas.BlogCreate, db: AsyncSession = Depends(get_db)):
    slug = await generate_unique_slug(models.Blog, payload.slug or payload.title, db)
    blog = models.Blog(
        title=payload.title,
        slug=slug,
        summary=payload.summary,
        content=payload.content,
        cover_image=payload.cover_image,
        category=payload.category,
        author=payload.author,
        status=(payload.status.value if hasattr(payload.status, "value") else str(payload.status)).upper(),
        published_at=datetime.now(timezone.utc),
    )
    db.add(blog)
    try:
        await db.commit()
        await db.refresh(blog)
        return blog
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Database constraint error") from e


@app.delete("/api/blogs/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Blog).where(models.Blog.id == id))
    item = res.scalar_one_or_none()
    if item:
        await db.delete(item)
        await db.commit()


# ==============================================================
# 2. CASE STUDIES ENDPOINTS (/api/case-studies)
# ==============================================================
@app.get("/api/case-studies", response_model=list[schemas.CaseStudyResponse])
async def list_case_studies(
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(models.CaseStudy).order_by(models.CaseStudy.created_at.desc())
    if status and status.upper() != "ALL":
        query = query.where(func.upper(models.CaseStudy.status) == status.upper())
    result = await db.execute(query)
    return result.scalars().all()


@app.get("/api/case-studies/{slug}", response_model=schemas.CaseStudyResponse)
async def get_case_study(slug: str, db: AsyncSession = Depends(get_db)):
    clean_slug = slug.strip().lower()
    result = await db.execute(select(models.CaseStudy).where(func.lower(models.CaseStudy.slug) == clean_slug))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Case Study not found")
    return item


@app.post("/api/case-studies", response_model=schemas.CaseStudyResponse, status_code=status.HTTP_201_CREATED)
async def create_case_study(payload: schemas.CaseStudyCreate, db: AsyncSession = Depends(get_db)):
    slug = await generate_unique_slug(models.CaseStudy, payload.slug or payload.title, db)
    
    raw_status = getattr(payload, "status", "PUBLISHED")
    status_str = raw_status.value if hasattr(raw_status, "value") else str(raw_status)

    cs = models.CaseStudy(
        title=payload.title,
        slug=slug,
        summary=payload.summary or "",
        content=payload.content,
        cover_image=payload.cover_image,
        client_name=payload.client_name or "Enterprise Client",
        metrics=payload.metrics or "",
        status=status_str.upper(),
        published_at=datetime.now(timezone.utc),
    )
    db.add(cs)
    try:
        await db.commit()
        await db.refresh(cs)
        return cs
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@app.delete("/api/case-studies/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_case_study(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.CaseStudy).where(models.CaseStudy.id == id))
    item = res.scalar_one_or_none()
    if item:
        await db.delete(item)
        await db.commit()


# ==============================================================
# 3. USE CASES ENDPOINTS (/api/use-cases)
# ==============================================================
@app.get("/api/use-cases", response_model=list[schemas.UseCaseResponse])
async def list_use_cases(
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(models.UseCase).order_by(models.UseCase.created_at.desc())
    if status and status.upper() != "ALL":
        query = query.where(func.upper(models.UseCase.status) == status.upper())
    result = await db.execute(query)
    return result.scalars().all()


@app.get("/api/use-cases/{slug}", response_model=schemas.UseCaseResponse)
async def get_use_case(slug: str, db: AsyncSession = Depends(get_db)):
    clean_slug = slug.strip().lower()
    result = await db.execute(select(models.UseCase).where(func.lower(models.UseCase.slug) == clean_slug))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Use Case not found")
    return item


@app.post("/api/use-cases", response_model=schemas.UseCaseResponse, status_code=status.HTTP_201_CREATED)
async def create_use_case(payload: schemas.UseCaseCreate, db: AsyncSession = Depends(get_db)):
    slug = await generate_unique_slug(models.UseCase, payload.slug or payload.title, db)
    uc = models.UseCase(
        title=payload.title,
        slug=slug,
        summary=payload.summary,
        content=payload.content,
        cover_image=payload.cover_image,
        industry=payload.industry,
        status=(payload.status.value if hasattr(payload.status, "value") else str(payload.status)).upper(),
        published_at=datetime.now(timezone.utc),
    )
    db.add(uc)
    try:
        await db.commit()
        await db.refresh(uc)
        return uc
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Database constraint error") from e


@app.delete("/api/use-cases/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_use_case(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.UseCase).where(models.UseCase.id == id))
    item = res.scalar_one_or_none()
    if item:
        await db.delete(item)
        await db.commit()


# ==============================================================
# 4. TUTORIALS ENDPOINTS (/api/tutorials)
# ==============================================================
@app.get("/api/tutorials", response_model=list[schemas.TutorialResponse])
async def list_tutorials(
    status: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    query = select(models.Tutorial).order_by(models.Tutorial.created_at.desc())
    if status and status.upper() != "ALL":
        query = query.where(func.upper(models.Tutorial.status) == status.upper())
    result = await db.execute(query)
    return result.scalars().all()


@app.get("/api/tutorials/{slug}", response_model=schemas.TutorialResponse)
async def get_tutorial(slug: str, db: AsyncSession = Depends(get_db)):
    clean_slug = slug.strip().lower()
    result = await db.execute(select(models.Tutorial).where(func.lower(models.Tutorial.slug) == clean_slug))
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return item


@app.post("/api/tutorials", response_model=schemas.TutorialResponse, status_code=status.HTTP_201_CREATED)
async def create_tutorial(payload: schemas.TutorialCreate, db: AsyncSession = Depends(get_db)):
    slug = await generate_unique_slug(models.Tutorial, payload.slug or payload.title, db)
    tut = models.Tutorial(
        title=payload.title,
        slug=slug,
        summary=payload.summary,
        content=payload.content,
        category=payload.category,
        duration=payload.duration,
        cta_text=payload.cta_text,
        cta_link=payload.cta_link,
        status=(payload.status.value if hasattr(payload.status, "value") else str(payload.status)).upper(),
        published_at=datetime.now(timezone.utc),
    )
    db.add(tut)
    try:
        await db.commit()
        await db.refresh(tut)
        return tut
    except IntegrityError as e:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Database constraint error") from e


@app.delete("/api/tutorials/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_tutorial(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Tutorial).where(models.Tutorial.id == id))
    item = res.scalar_one_or_none()
    if item:
        await db.delete(item)
        await db.commit()


# ==============================================================
# 5. LEADS / CRM ENDPOINTS
# ==============================================================
@app.post("/api/leads", response_model=schemas.LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(payload: schemas.LeadCreate, db: AsyncSession = Depends(get_db)):
    lead = models.Lead(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        channel=payload.channel.value if hasattr(payload.channel, "value") else str(payload.channel),
        notes=payload.notes,
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return lead


@app.get("/api/leads", response_model=list[schemas.LeadResponse])
async def list_leads(db: AsyncSession = Depends(get_db)):
    query = select(models.Lead).order_by(models.Lead.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


@app.patch("/api/leads/{id}/status", response_model=schemas.LeadResponse)
async def update_lead_status(
    id: uuid.UUID,
    payload: schemas.LeadStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(models.Lead).where(models.Lead.id == id))
    lead = res.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.status = payload.status.value if hasattr(payload.status, "value") else str(payload.status)
    await db.commit()
    await db.refresh(lead)
    return lead


@app.delete("/api/leads/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Lead).where(models.Lead.id == id))
    item = res.scalar_one_or_none()
    if item:
        await db.delete(item)
        await db.commit()