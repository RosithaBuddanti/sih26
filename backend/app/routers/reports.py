from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.safety_report import SafetyReport
from ..schemas.safety_report import SafetyReportCreate, SafetyReportListItem, SafetyReportDetail
from ..schemas.ai_analysis import AIAnalysisResponse
from ..dependencies import get_current_user
from ..services.report_service import create_report, get_organization_reports, get_report_by_id
from ..services.analysis_service import execute_ai_analysis

router = APIRouter(prefix="/api/reports", tags=["Safety Reports"])

@router.post("", response_model=SafetyReportDetail, status_code=status.HTTP_201_CREATED)
def submit_report(
    payload: SafetyReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits an industrial safety report under the authenticated user's organization
    and executes the real modular AI/NLP SIF analysis pipeline.
    """
    if not payload.description or len(payload.description.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please describe the safety observation in detail."
        )
    if not payload.location or len(payload.location.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a valid location or operational area."
        )

    # 1. Create Report in DB
    report = create_report(db, payload, current_user)

    # 2. Run AI Analysis Pipeline
    try:
        execute_ai_analysis(db, report)
    except Exception as e:
        # If analysis fails, report status is set to FAILED
        pass

    db.refresh(report)
    return report

@router.get("", response_model=List[SafetyReportListItem])
def list_reports(
    search: Optional[str] = Query(None),
    report_type: Optional[str] = Query(None),
    analysis_status: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists safety reports strictly isolated to the authenticated organization."""
    return get_organization_reports(
        db=db,
        org_id=current_user.organization_id,
        search=search,
        report_type=report_type,
        analysis_status=analysis_status
    )

@router.get("/{report_id}", response_model=SafetyReportDetail)
def get_report_details(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves full details and AI analysis for a report belonging to the organization."""
    report = get_report_by_id(db, report_id, current_user.organization_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety report not found or access denied."
        )
    return report

@router.post("/{report_id}/analyze", response_model=AIAnalysisResponse)
def trigger_analysis(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Triggers or re-executes AI analysis on an existing organization report."""
    report = get_report_by_id(db, report_id, current_user.organization_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Safety report not found or access denied."
        )
    
    analysis = execute_ai_analysis(db, report)
    return analysis

@router.get("/{report_id}/analysis", response_model=AIAnalysisResponse)
def get_report_analysis(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves AI analysis for a specific report."""
    report = get_report_by_id(db, report_id, current_user.organization_id)
    if not report or not report.ai_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="AI analysis not found for this report."
        )
    return report.ai_analysis
