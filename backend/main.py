from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # safer than "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient("mongodb://mongo:27017")
db = client["carshop"]
cars_collection = db["cars"]

# Car model
class Car(BaseModel):
    brand: str
    model: str
    year: int
    price: float

# Serializer for ObjectId
def car_serializer(car):
    car["_id"] = str(car["_id"])
    return car

# ✅ GET all cars
@app.get("/cars")
async def get_cars():
    cars = []
    async for c in cars_collection.find():
        cars.append(car_serializer(c))
    return cars

# ✅ POST new car
@app.post("/cars")
async def create_car(car: Car):
    new_car = car.dict()
    result = await cars_collection.insert_one(new_car)
    created_car = await cars_collection.find_one({"_id": result.inserted_id})
    return car_serializer(created_car)

# ✅ PUT update car
@app.put("/cars/{car_id}")
async def update_car(car_id: str, car: Car):
    updated = await cars_collection.update_one(
        {"_id": ObjectId(car_id)}, {"$set": car.dict()}
    )
    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    updated_car = await cars_collection.find_one({"_id": ObjectId(car_id)})
    return car_serializer(updated_car)

# ✅ DELETE car
@app.delete("/cars/{car_id}")
async def delete_car(car_id: str):
    deleted = await cars_collection.delete_one({"_id": ObjectId(car_id)})
    if deleted.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Car not found")
    return {"message": "Car deleted successfully"}
