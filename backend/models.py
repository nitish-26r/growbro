"""
models.py
SQLAlchemy ORM models matching the Supabase schema with extended CMS capabilities.
"""

import uuid
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(Text, nullable=False)
    slug: Mapped[str] = mapped_column(Text, unique=True, nullable=False, index=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    cover_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # CMS Extended Fields
    content_type: Mapped[str] = mapped_column(String(30), default="BLOG")  # BLOG, CASE_STUDY, USECASE, TUTORIAL
    category: Mapped[str] = mapped_column(Text, default="Product Updates")
    language: Mapped[str] = mapped_column(String(20), default="English")   # English, Hindi, Hinglish
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)   # PostgreSQL Array: ['whatsapp', 'crm']
    
    # CTA Fields
    cta_text: Mapped[str | None] = mapped_column(String(100), default="Start Free Now")
    cta_link: Mapped[str | None] = mapped_column(Text, default="/")
    
    author: Mapped[str] = mapped_column(Text, default="GrowBro Team")
    status: Mapped[str] = mapped_column(String(20), default="DRAFT")
    
    # Published Date & Timestamps
    published_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "status IN ('DRAFT', 'PUBLISHED')", 
            name="blogs_status_check"
        ),
        CheckConstraint(
            "content_type IN ('BLOG', 'CASE_STUDY', 'USECASE', 'TUTORIAL')", 
            name="blogs_content_type_check"
        ),
    )


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str] = mapped_column(Text, nullable=False)
    channel: Mapped[str] = mapped_column(String(20), default="WEBSITE")
    status: Mapped[str] = mapped_column(String(20), default="NEW")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    __table_args__ = (
        CheckConstraint(
            "channel IN ('WHATSAPP', 'INSTAGRAM', 'WEBSITE', 'MESSENGER')",
            name="leads_channel_check",
        ),
        CheckConstraint(
            "status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST')",
            name="leads_status_check",
        ),
    )