from sqlalchemy import create_engine
from datetime import datetime
from sqlalchemy.orm import Session
from . import models
from fastapi import HTTPException
from typing import Optional


def get_user_posts(db: Session, user_id: str):
    try:
        # Get the posts for the user
        posts = db.query(models.Post).filter(models.Post.user_id == user_id).order_by(models.Post.created_at.desc()).all()

        return posts
    except Exception as e:
        print(f"Error fetching user contents: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch contents")
    

def get_generated_content(db: Session, user_id: str):
    try:
        # Get the generated content for the user
        content = db.query(models.Content).filter(models.Content.user_id == user_id,
                                                  models.Content.is_curated == True).order_by(models.Content.created_at.desc()).first()
        if not content:
            raise HTTPException(status_code=404, detail="Content not found")
        # Return the generated content
        generated_content= content.generated_content
        media_path = content.media_path
        content_id = content.id

        if not generated_content:
            raise HTTPException(status_code=404, detail="Generated content not found")
        return generated_content, content_id, media_path
    except Exception as e:
        print(f"Error fetching generated content: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


def create_content(
    db: Session,
    user_id: str,
    raw_text: str,
    media_path: str,
    created_at: datetime,
    is_curated: bool,
    generated_content: dict
):
    try:
        # Validate (optional)
        if not raw_text:
            raise HTTPException(status_code=400, detail="raw_text cannot be empty")
        # Create the content
        db_content = models.Content(
            user_id=user_id,
            raw_text=raw_text,
            generated_content = generated_content,
            media_path=media_path,
            created_at=created_at,
            is_curated=is_curated,
        )
            
        db.add(db_content)
        db.commit()
        db.refresh(db_content)
        return db_content
    except Exception as e:
        db.rollback()
        print(f"Error creating content: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create content")


def create_business_profile(
    db: Session,
    user_id: str,
    business_name: str,
    description: str,
    website: str,
    tone: Optional[str] = "professional"

):
    try:
        if not business_name:
            raise HTTPException(status_code=400, detail="business_name cannot be empty")
        if not description:
            raise HTTPException(status_code=400, detail="description cannot be empty")
        # Create the business profile
        db_business_profile = models.BusinessProfile(
            user_id=user_id,
            business_name=business_name,
            description=description,
            website=website,
            tone=tone,
                    )
    except Exception as e:
        db.rollback()
        print(f"Error creating business profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create business profile")
        
   
    db.add(db_business_profile)
    db.commit()
    db.refresh(db_business_profile)
    return db_business_profile


def get_business_profile(db: Session, user_id: str):
    try:
        # Get the business profile
        profile = (db.query(models.BusinessProfile).filter(models.BusinessProfile.user_id == user_id).first())
        return profile
    except Exception as e:
        print(f"Error fetching business profile: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch business profile")
    


def create_post(db: Session, 
                user_id : str,
                content_id: str,
                generated_content: dict,
                media_path: str, 
                scheduled_time:datetime,
                platform: str='X',  
                status: str = "pending"):
    try:
        # Create the post
        db_post = models.Post(
            user_id=user_id,
            content_id = content_id,
            generated_content=generated_content,
            media_path=media_path,
            scheduled_time=scheduled_time,
            platform=platform,
            status=status
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post
    except Exception as e:
        db.rollback()
        print(f"Error creating post: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create post")
    
def whatsapp_contact(db:Session, user_id: str, phone_numbers:list):
    try:
        # Create the post
        db_whatsapp_contact = models.WhatsappContact(
            user_id=user_id,
            phone_numbers=phone_numbers)
        db.add(db_whatsapp_contact)
        db.commit()
        db.refresh(db_whatsapp_contact)
        return db_whatsapp_contact
    except Exception as e:
        db.rollback()
        print(f"Error creating whatsapp contact: {str(e)}")
        raise HTTPException(status_code=500, detail= "failed to create post")
        

