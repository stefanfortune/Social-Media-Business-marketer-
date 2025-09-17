from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
    create_engine
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.types import TypeDecorator, TEXT
import json

Base = declarative_base()

Database_url =("sqlite:///datbase.db")
engine = create_engine(Database_url, echo=True)


class Content(Base):
    __tablename__ = "contents"

    id = Column(Integer, primary_key=True, index=True)
#   user_id = Column(Integer, ForeignKey("users.id"))
    user_id = Column(String, nullable=False, unique=False)#change unique to True
    generated_content = Column(Text, nullable=False)
    raw_text = Column(Text, nullable=False)
    media_path = Column(String(255))  # Path to uploaded media
    is_curated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
   
#    user = relationship("User", back_populates="contents")


    """New models Below"""

class BusinessProfile(Base):
    __tablename__ = "business_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    #user_id = Column(Integer, ForeignKey("users.id"))
    user_id = Column(String, nullable=False, unique=False)
    business_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    industry_niche = Column(String(50))
    website = Column(String(255))
    tone = Column(String(20), default="professional")  # Added tone preference  
#    user = relationship("User", back_populates="business_profile")




class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, nullable=False)
    content_id = Column(Integer, nullable=False)
    generated_content = Column(Text, nullable=False)
    scheduled_time = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    platform = Column(String(20), nullable=False)
    status = Column(String(20), default="pending")
    posted = Column(Boolean, default=False)
    media_path = Column(String(255)) 
    # X posting status
    posted_to_x = Column(DateTime)  # Timestamp when posted
    x_post_id = Column(String(100))  # Twitter's post ID
    x_status = Column(String(20), default="pending")  # pending, scheduled, posted, failed
        

Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close
