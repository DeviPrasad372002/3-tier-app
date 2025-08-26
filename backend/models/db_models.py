from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)  # set length
    password = Column(String(255), nullable=False)  # good to limit size
    orders = relationship("OrderDB", back_populates="user")

class OrderDB(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    full_name = Column(String(255))
    street = Column(String(255))
    city = Column(String(100))
    state = Column(String(100))
    postal_code = Column(String(20))
    phone = Column(String(20))
    items_json = Column(Text)  # JSON data, fine as Text
    user = relationship("UserDB", back_populates="orders")
