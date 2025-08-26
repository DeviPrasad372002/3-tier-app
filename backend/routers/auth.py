from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.schemas import User
from models.db_models import UserDB

router = APIRouter(prefix="/api", tags=["Auth"])

@router.post("/signup")
def signup(user: User, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.username == user.username).first():
        raise HTTPException(status_code=400, detail="User already exists")
    db_user = UserDB(username=user.username, password=user.password)
    db.add(db_user)
    db.commit()
    return {"message": "Signup successful"}

@router.post("/login")
def login(user: User, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": db_user.id}
