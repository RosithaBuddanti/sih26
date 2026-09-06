from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class FeedbackCreate(BaseModel):
    feedback_status: str = Field(..., description="CORRECT, PARTIALLY_CORRECT, INCORRECT")
    feedback_text: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    report_id: int
    organization_id: str
    user_id: Optional[int] = None
    feedback_status: str
    feedback_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
