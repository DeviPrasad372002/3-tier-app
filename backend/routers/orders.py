from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.schemas import CheckoutRequest
from models.db_models import OrderDB
import json

router = APIRouter(prefix="/api", tags=["Orders"])

@router.post("/checkout")
def checkout(data: CheckoutRequest, db: Session = Depends(get_db)):
    items_data = [item.dict() for item in data.items]
    order = OrderDB(
        user_id=None,
        full_name=data.full_name,
        street=data.street,
        city=data.city,
        state=data.state,
        postal_code=data.postal_code,
        phone=data.phone,
        items_json=json.dumps(items_data)
    )
    db.add(order)
    db.commit()
    return {"message": "Order placed successfully", "order_id": order.id}

@router.get("/orders/{user_id}")
def get_orders(user_id: int, db: Session = Depends(get_db)):
    orders = db.query(OrderDB).filter(OrderDB.user_id == user_id).all()
    return [
        {
            "order_id": o.id,
            "full_name": o.full_name,
            "address": f"{o.street}, {o.city}, {o.state}, {o.postal_code}",
            "phone": o.phone,
            "items": json.loads(o.items_json)
        }
        for o in orders
    ]
