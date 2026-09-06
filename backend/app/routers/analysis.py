from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.ai_analysis import AIAnalysisResponse
from ..dependencies import get_current_user
from ..services.analysis_service import get_organization_analyses

router = APIRouter(prefix="/api/analysis", tags=["AI Analysis"])

@router.get("", response_model=List[AIAnalysisResponse])
def list_completed_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves all completed AI analyses belonging to the authenticated organization."""
    return get_organization_analyses(db, current_user.organization_id)
