from pydantic import BaseModel
from datetime import datetime
from typing import Optional,List


# Business Profile schemas
class BusinessProfileBase(BaseModel):
    business_name: str
    description: str
    website: Optional[str] = None
    tone: Optional[str] = "professional"


class BusinessProfileCreate(BusinessProfileBase):
    pass

class BusinessProfile(BusinessProfileBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

  
# Posting Schemas
class PostNow(BaseModel):
    platform: str
    content_id: int
    phone_numbers: List[str] 
    class config:
        arbitrary_types_allowed=True
        from_attributes = True
    
# Schedule Schemas
class ScheduleRequest(BaseModel):
    content_id: int
    platform: str  
    phone_numbers: Optional[List[str]] = None  
    scheduled_time: datetime   

    class Config:
        from_attributes = True



