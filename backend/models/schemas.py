from pydantic import BaseModel
from typing import List

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image: str

class CartItem(BaseModel):
    product_id: int
    quantity: int

class DetailedCartItem(BaseModel):
    product_id: int
    quantity: int
    name: str
    image: str

class User(BaseModel):
    username: str
    password: str

class CheckoutRequest(BaseModel):
    full_name: str
    street: str
    city: str
    state: str
    postal_code: str
    phone: str
    items: List[CartItem]

