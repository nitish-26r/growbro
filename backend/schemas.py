"""
schemas.py
Pydantic v2 schemas for Blogs, Case Studies, Use Cases, Tutorials, and Leads.
"""

import uuid
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


# ------------------------------------------------------------
# Enums
# ------------------------------------------------------------
class PublishStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class LeadChannel(str, Enum):
    WHATSAPP = "WHATSAPP"
    INSTAGRAM = "INSTAGRAM"
    WEBSITE = "WEBSITE"
    MESSENGER = "MESSENGER"


class LeadStatus(str, Enum):
    NEW = "NEW"
    CONTACTED = "CONTACTED"
    QUALIFIED = "QUALIFIED"
    CONVERTED = "CONVERTED"
    LOST = "LOST"


# ------------------------------------------------------------
# 1. Blog Schemas
# ------------------------------------------------------------
class BlogCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    slug: Optional[str] = Field(None, max_length=300)
    summary: Optional[str] = None
    content: str = Field(..., min_length=1)
    cover_image: Optional[str] = None
    category: str = "Product Updates"
    author: str = "GrowBro Team"
    status: PublishStatus = PublishStatus.DRAFT
    published_at: Optional[datetime] = None

    @field_validator("slug")
    @classmethod
    def slug_lowercase(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v else v


class BlogUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    slug: Optional[str] = Field(None, max_length=300)
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    status: Optional[PublishStatus] = None
    published_at: Optional[datetime] = None


class BlogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    slug: str
    summary: Optional[str]
    content: str
    cover_image: Optional[str]
    category: str
    author: str
    status: PublishStatus
    published_at: datetime
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------
# 2. Case Study Schemas
# ------------------------------------------------------------
class CaseStudyCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    slug: Optional[str] = Field(None, max_length=300)
    summary: Optional[str] = None
    content: str = Field(..., min_length=1)
    cover_image: Optional[str] = None
    client_name: Optional[str] = Field(None, max_length=100)
    metrics: Optional[str] = Field(None, max_length=100)
    status: PublishStatus = PublishStatus.DRAFT
    published_at: Optional[datetime] = None

    @field_validator("slug")
    @classmethod
    def slug_lowercase(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v else v


class CaseStudyUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    client_name: Optional[str] = None
    metrics: Optional[str] = None
    status: Optional[PublishStatus] = None
    published_at: Optional[datetime] = None


class CaseStudyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    slug: str
    summary: Optional[str]
    content: str
    cover_image: Optional[str]
    client_name: Optional[str]
    metrics: Optional[str]
    status: PublishStatus
    published_at: datetime
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------
# 3. Use Case Schemas
# ------------------------------------------------------------
class UseCaseCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    slug: Optional[str] = Field(None, max_length=300)
    summary: Optional[str] = None
    content: str = Field(..., min_length=1)
    cover_image: Optional[str] = None
    industry: str = "E-Commerce"
    status: PublishStatus = PublishStatus.DRAFT
    published_at: Optional[datetime] = None

    @field_validator("slug")
    @classmethod
    def slug_lowercase(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v else v


class UseCaseUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    industry: Optional[str] = None
    status: Optional[PublishStatus] = None
    published_at: Optional[datetime] = None


class UseCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    slug: str
    summary: Optional[str]
    content: str
    cover_image: Optional[str]
    industry: str
    status: PublishStatus
    published_at: datetime
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------
# 4. Tutorial Schemas
# ------------------------------------------------------------
class TutorialCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    slug: Optional[str] = Field(None, max_length=300)
    summary: Optional[str] = None
    content: str = Field(..., min_length=1)
    category: str = "WhatsApp Setup"
    duration: Optional[str] = "5 min read"
    cta_text: Optional[str] = "Try It Free"
    cta_link: Optional[str] = "/"
    status: PublishStatus = PublishStatus.DRAFT
    published_at: Optional[datetime] = None

    @field_validator("slug")
    @classmethod
    def slug_lowercase(cls, v: Optional[str]) -> Optional[str]:
        return v.strip().lower() if v else v


class TutorialUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    duration: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    status: Optional[PublishStatus] = None
    published_at: Optional[datetime] = None


class TutorialResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    slug: str
    summary: Optional[str]
    content: str
    category: str
    duration: Optional[str]
    cta_text: Optional[str]
    cta_link: Optional[str]
    status: PublishStatus
    published_at: datetime
    created_at: datetime
    updated_at: datetime


# ------------------------------------------------------------
# 5. Lead Schemas
# ------------------------------------------------------------
class LeadCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: Optional[EmailStr] = None
    phone: str = Field(..., min_length=5, max_length=30)
    channel: LeadChannel = LeadChannel.WEBSITE
    business_type: Optional[str] = Field(None, max_length=200)
    notes: Optional[str] = None


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    channel: Optional[LeadChannel] = None
    status: Optional[LeadStatus] = None
    notes: Optional[str] = None


class LeadStatusUpdate(BaseModel):
    status: LeadStatus


class LeadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: Optional[str]
    phone: str
    channel: LeadChannel
    status: LeadStatus
    notes: Optional[str]
    created_at: datetime