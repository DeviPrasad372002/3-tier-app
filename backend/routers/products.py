from fastapi import APIRouter
from typing import List
from models.schemas import Product

BASE_URL = "http://localhost:8000"

products = [
    Product(id=1, name="T-Shirt", description="Cotton T-Shirt", price=499.99, image=f"{BASE_URL}/images/tshirt.png"),
    Product(id=2, name="Jeans", description="Denim Blue Jeans", price=1299.00, image=f"{BASE_URL}/images/jeans.png"),
    Product(id=3, name="Sneakers", description="Running Sneakers", price=2499.50, image=f"{BASE_URL}/images/sneakers.png"),
]

router = APIRouter(prefix="/api/products", tags=["Products"])

@router.get("/", response_model=List[Product])
def get_products():
    return products
