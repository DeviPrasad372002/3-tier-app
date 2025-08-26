from fastapi import APIRouter, HTTPException
from typing import List
from models.schemas import CartItem, DetailedCartItem
from .products import products

router = APIRouter(prefix="/api/cart", tags=["Cart"])
cart: List[CartItem] = []

@router.post("/add")
def add_to_cart(item: CartItem):
    if not any(p.id == item.product_id for p in products):
        raise HTTPException(status_code=404, detail="Product not found")
    for cart_item in cart:
        if cart_item.product_id == item.product_id:
            cart_item.quantity += item.quantity
            break
    else:
        cart.append(item)
    return {"message": "Added to cart"}

@router.post("/remove")
def remove_from_cart(item: CartItem):
    global cart
    initial_len = len(cart)
    cart = [ci for ci in cart if ci.product_id != item.product_id]
    if len(cart) == initial_len:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    return {"message": "Removed from cart"}

@router.get("/", response_model=List[DetailedCartItem])
def get_cart():
    result = []
    for item in cart:
        product = next((p for p in products if p.id == item.product_id), None)
        if product:
            result.append(DetailedCartItem(
                product_id=item.product_id,
                quantity=item.quantity,
                name=product.name,
                image=product.image
            ))
    return result
