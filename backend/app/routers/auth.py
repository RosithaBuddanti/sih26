import jwt
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.organization import Organization
from ..models.user import User
from ..schemas.auth import LoginRequest, TokenResponse, UserResponse
from ..dependencies import get_current_user
from ..config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# Predefined 5 Organization accounts
PRESET_ORGS = [
    {"id": "id001", "name": "Oil India Limited – Operational Safety Unit", "email": "admin1@gmail.com", "pass": "Admin1@123", "officer": "HSE Lead Officer 01"},
    {"id": "id002", "name": "Offshore Rig Operations & Drilling Division", "email": "admin2@gmail.com", "pass": "Admin2@123", "officer": "HSE Lead Officer 02"},
    {"id": "id003", "name": "Refinery & Petrochemical Processing Center", "email": "admin3@gmail.com", "pass": "Admin3@123", "officer": "HSE Lead Officer 03"},
    {"id": "id004", "name": "Exploration & Production Field Command", "email": "admin4@gmail.com", "pass": "Admin4@123", "officer": "HSE Lead Officer 04"},
    {"id": "id005", "name": "Cross-Country Gas Transmission & Integrity", "email": "admin5@gmail.com", "pass": "Admin5@123", "officer": "HSE Lead Officer 05"},
]

def ensure_initial_seed(db: Session):
    """Ensures the 5 authorized organizations and admin accounts exist in the DB."""
    for org_info in PRESET_ORGS:
        org = db.query(Organization).filter(Organization.id == org_info["id"]).first()
        if not org:
            org = Organization(id=org_info["id"], name=org_info["name"])
            db.add(org)
            db.commit()
            db.refresh(org)
        
        user = db.query(User).filter(User.email == org_info["email"]).first()
        if not user:
            user = User(
                organization_id=org.id,
                email=org_info["email"],
                password=org_info["pass"],
                full_name=org_info["officer"],
                role="CHIEF_HSE_AUDITOR"
            )
            db.add(user)
            db.commit()

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    ensure_initial_seed(db)
    
    org_id_clean = payload.org_id.strip().lower()
    email_clean = payload.email.strip().lower()
    
    user = db.query(User).filter(
        User.organization_id == org_id_clean,
        User.email == email_clean
    ).first()

    if not user or user.password != payload.password.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Organization ID, Email, or Password."
        )

    # Issue JWT token containing verified user ID and organization ID
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token_claims = {
        "sub": str(user.id),
        "org_id": user.organization_id,
        "email": user.email,
        "exp": expire
    }
    encoded_jwt = jwt.encode(token_claims, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    return TokenResponse(
        access_token=encoded_jwt,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            organization_id=user.organization_id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            organization_name=user.organization.name if user.organization else None
        )
    )

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        organization_id=current_user.organization_id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        organization_name=current_user.organization.name if current_user.organization else None
    )
