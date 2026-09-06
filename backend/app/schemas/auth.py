from typing import Optional
from pydantic import BaseModel

class LoginRequest(BaseModel):
    org_id: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    organization_id: str
    email: str
    full_name: str
    role: str
    organization_name: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
