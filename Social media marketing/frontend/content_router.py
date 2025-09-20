from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request, Form, File, UploadFile
from sqlalchemy.orm import Session
from ..database.db import (create_content,
                           create_business_profile,
                           get_business_profile,
                           get_generated_content,
                           create_post,
                           get_user_posts
                        )
from ..authentication import authenticate_and_get_user_details
from ..caption_curator import curate_caption
from ..schemas import BusinessProfileCreate,ScheduleRequest,PostNow
from ..scheduler import schedule_post_job 
from ..database.models import Post, Content, get_db
import json
from datetime import datetime, timezone   
import os
from ..TwitterX import TwitterX
from dotenv import load_dotenv
load_dotenv()
router = APIRouter()

@router.get("/business-profile")
async def my_business_profile(request: Request, db: Session = Depends(get_db)):
    try:
        print("fetching business profile...")
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")
        
        #check if the profile actually exists
        business_profile = get_business_profile(db, user_id)
        if not business_profile:
            raise HTTPException(status_code=400, detail="business profile does not exist")
        return {
            "id": business_profile.id,
            "user_id": business_profile.user_id,
            "business_name": business_profile.business_name,
            "description": business_profile.description,
            "website": business_profile.website,
            "tone": business_profile.tone,
        }
    except Exception as e:
        print(f"unexpected error in business profile end point: {e}")
        raise HTTPException(status_code=400, detail=f"internal server error: {str(e)}")
    


@router.post("/create-business-profile")
async def set_business_profile(request:BusinessProfileCreate, request_obj: Request, db: Session= Depends(get_db)):
    try:
        print("creating business profile...")
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")
        

        if not user_id:
            raise HTTPException(status_code=401, detail="user id not found")
        
        #check if the profile actually exists
        existing_profile = get_business_profile(db, user_id)
        if existing_profile:
            # Update existing profile instead of creating new one
            existing_profile.business_name = request.business_name
            existing_profile.description = request.description
            existing_profile.website = request.website
            existing_profile.tone = request.tone
            db.commit()
            db.refresh(existing_profile)
            
            return {
                "id": existing_profile.id,
                "user_id": existing_profile.user_id,
                "business_name": existing_profile.business_name,
                "description": existing_profile.description,
                "website": existing_profile.website,
                "tone": existing_profile.tone,
            }
        #create new profile
        new_profile = create_business_profile(db=db,
                                                       user_id=user_id,
                                                       business_name=request.business_name,
                                                       description=request.description,
                                                       website=request.website,
                                                       tone=request.tone
                                                       )

        # Commit the changes to the database
        return {
            "id": new_profile.id,
            "user_id": new_profile.user_id,
            "business_name": new_profile.business_name,
            "description": new_profile.description,
            "website": new_profile.website,
            "tone": new_profile.tone,
            }
    
    except Exception as e:
        print(f"error creating business profile: {e}")
        raise HTTPException(status_code=500, detail=f"internal server error from business: {str(e)}")


@router.post("/Create-content")
async def generate_content(request_obj: Request,
                           raw_text: str = Form(...),  
                           media: UploadFile = File(None),
                           db: Session = Depends(get_db)):
    try:
        print("creating content...")
        user_details = authenticate_and_get_user_details(request_obj)
        user_id = user_details.get("user_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="user id not found")

        # get the business profile        
        business_profile = get_business_profile(db, user_id)
        if not business_profile:
            raise HTTPException(status_code=400, detail="business profile does not exist, please create one first")
    
        # Generate the caption    
        generated_caption = curate_caption(
            business_name=business_profile.business_name,
            business_description=business_profile.description,  
            raw_text=raw_text,                                           
            tone=business_profile.tone,
            )
        media_path = None

        # Handle the case where the request actually included a file
        if media:
            upload_dir = "uploads"
            os.makedirs(upload_dir, exist_ok=True)

            # Save the file inside uploads/
            file_location = os.path.join(upload_dir, media.filename)  # stores the file on disk
            with open(file_location, "wb") as f:                      # opens the file in write-binary mode ("wb")
                f.write(await media.read())                           # writes the contents of the file to disk
                media_path = file_location                            # stores the file path string (for DB or response)
        local_time = datetime.now().astimezone()
        new_content = create_content(db=db, user_id=user_id,
                                     raw_text=raw_text,
                                     media_path=media_path,
                                     created_at=local_time,
                                     is_curated=True,
                                     generated_content=json.dumps({"caption": generated_caption, "media_path": media_path})
                                     )

        db.commit()
        db.refresh(new_content)
        
        return {
            "id": new_content.id, 
            "user_id": new_content.user_id,
            "raw_text": new_content.raw_text,
            "media_path": new_content.media_path,
            "generated_content": json.loads(new_content.generated_content)} 
    except Exception as e:
        print(f"Error generating content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error from content: {str(e)}")

@router.get("/generated-content")
async def content_generated(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="user id not found")
    # Get the generated content, content id and media path
    generated_content, content_id, media_path = get_generated_content(db, user_id)
    
    print("we succesfully got generated content")
    # Return them
    return {"generated_content": generated_content,
            "content_id": content_id,
            "media": media_path}
    
@router.post("/schedule-post")
async def schedule_post(request: ScheduleRequest, request_obj: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request_obj)
    user_id = user_details.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="user id not found")
    # Get the content 
    content = db.query(Content).filter(Content.id == request.content_id, Content.user_id == user_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="content not found")

    generated_content = json.loads(content.generated_content)["caption"]

    # Create DB entry for the scheduled post
    new_post = create_post(
        db=db,
        user_id=user_id,
        content_id=content.id,
        generated_content=generated_content,
        scheduled_time=request.scheduled_time,
        media_path= content.media_path,
        platform=request.platform,
        status="scheduled"
    )
    db.commit()
    db.refresh(new_post)

    # Schedule job
    schedule_post_job(new_post.id, request.scheduled_time, db, post_to_x)

    # return post parameters
    return {
        "message": "Post scheduled successfully",
        "post_id": new_post.id,
        "scheduled_time": request.scheduled_time,
        "platform": request.platform,
    }

@router.post("/post-to-socials")    
async def post_content_to_socials(request: PostNow, request_obj: Request, db: Session = Depends(get_db)):
    print("posting to socials...")
    user_details = authenticate_and_get_user_details(request_obj)
    user_id = user_details.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="user details not found")

    content_id = request.content_id    
    if not content_id:
        raise HTTPException(status_code=404, detail="missing content_id")
     # query the last generated content   
    content = db.query(Content).filter(
        Content.id == content_id,
        Content.user_id == user_id
    ).first()
    if not content:
        raise HTTPException(status_code=404, detail="content not found")

    try:
        # unpack generated content safely
        content_data = json.loads(content.generated_content)
        message = content_data.get("caption", "")
        media_path = content.media_path

        local_time = datetime.now().astimezone()
        new_post = create_post(
            db=db,
            user_id=user_id,
            content_id=content.id,
            generated_content=message,
            media_path=media_path,
            scheduled_time=local_time,
            platform=request.platform,
            status="pending"
        )
        db.commit()
        db.refresh(new_post)

        # --- Handle Twitter ---
        if "X" in new_post.platform or "both" in new_post.platform:
            post_to_x(new_post, db)

        else:
            raise HTTPException(status_code=400, detail="Invalid platform")    
            
        db.commit()    
        return {"message": "Content posted successfully", "post_id": new_post.id}

    except Exception as e:
        db.rollback()
        print(f"Error posting content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

def post_to_x(post, db: Session):
    try:
        # Initialize Twitter service
        twitter_service = TwitterX()
        # Post the content to Twitter (X)
        success = twitter_service.post_tweet(post.generated_content, post.media_path)
        local_time = datetime.now().astimezone()

        # Update post status
        if success:
            post.status = "posted"
            post.posted_to_x = local_time
            
        else:
            post.status = "failed"
            post.posted_to_x = local_time
        db.commit()
        return success
    except Exception as e:
        print(f"Error in post_to_x: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error in post_to_x: {str(e)}")
    
# Get all scheduled posts that are pending
@router.get("/scheduled-posts")
async def get_scheduled_posts(request: Request, db: Session = Depends(get_db)):
    user_details = authenticate_and_get_user_details(request)
    user_id = user_details.get("user_id")
    # Get the scheduled posts
    scheduled_posts = (
        db.query(Post)
        .filter(Post.user_id == user_id, Post.status == "scheduled")
        .order_by(Post.scheduled_time.asc())
        .all()
    )
    return scheduled_posts

@router.get("/content-history")
async def content_history(request: Request, db: Session = Depends(get_db)):
    try:
        print("fetching content history...")
        user_details = authenticate_and_get_user_details(request)
        user_id = user_details.get("user_id")

        if not user_id:
            raise HTTPException(status_code=401, detail="user id not found")
        # Get the user posts
        posts = get_user_posts(db, user_id)    
        return posts
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching content history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

 

    
        

          