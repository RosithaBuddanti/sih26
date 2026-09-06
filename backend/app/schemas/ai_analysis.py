from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class AIAnalysisResponse(BaseModel):
    id: int
    report_id: int
    organization_id: str
    analysis_context: Optional[str] = None
    identified_action: Optional[str] = None
    identified_condition: Optional[str] = None
    identified_event: Optional[str] = None
    identified_hazard: Optional[str] = None
    safety_signals: Optional[List[str]] = []
    energy_source: Optional[str] = None
    exposure: Optional[str] = None
    barrier_information: Optional[str] = None
    potential_consequence: Optional[str] = None
    sif_precursor_assessment: str # YES, NO, INSUFFICIENT_INFORMATION
    explanation: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
