import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import products, cart, auth, orders
from database import Base, engine

app = FastAPI()

# Ensure database is connected
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("❌ DATABASE_URL environment variable is not set")

# ⚠️ Development only: auto-create tables if they don’t exist
# In production, manage schema with Alembic migrations instead
Base.metadata.create_all(bind=engine)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (images folder in container)
images_dir = os.path.join(os.path.dirname(__file__), "images")
if os.path.exists(images_dir):
    app.mount("/images", StaticFiles(directory=images_dir), name="images")

# Routers
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(auth.router)
app.include_router(orders.router)

@app.get("/")
def root():
    return {"message": "Backend running with PostgreSQL in Kubernetes"}
    1