from pymongo import MongoClient
from datetime import datetime

# Kết nối MongoDB
try:
    client = MongoClient('mongodb://localhost:27017/')
    db = client['gogo_db']
    print("Kết nối MongoDB thành công!")
except Exception as e:
    print(f"Lỗi kết nối MongoDB: {e}")

# Collections
users = db.users
drivers = db.drivers
rides = db.rides

# Các hàm thao tác với Users
def create_user(name, phone, email, password):
    user = {
        "name": name,
        "phone": phone,
        "email": email,
        "password": password,  # Cần hash password trước khi lưu
        "created_at": datetime.now()
    }
    return users.insert_one(user)

def get_user_by_email(email):
    return users.find_one({"email": email})

# Các hàm thao tác với Drivers
def create_driver(name, phone, email, password, vehicle_type, vehicle_plate):
    driver = {
        "name": name,
        "phone": phone,
        "email": email,
        "password": password,  # Cần hash password
        "vehicle_info": {
            "type": vehicle_type,
            "plate": vehicle_plate
        },
        "status": "available",
        "current_location": {
            "lat": 0,
            "lng": 0
        },
        "created_at": datetime.now()
    }
    return drivers.insert_one(driver)

def update_driver_status(driver_id, status):
    return drivers.update_one(
        {"_id": driver_id},
        {"$set": {"status": status}}
    )

def update_driver_location(driver_id, lat, lng):
    return drivers.update_one(
        {"_id": driver_id},
        {"$set": {"current_location": {"lat": lat, "lng": lng}}}
    )

# Các hàm thao tác với Rides
def create_ride(user_id, pickup_location, destination_location):
    ride = {
        "user_id": user_id,
        "driver_id": None,
        "pickup": {
            "lat": pickup_location["lat"],
            "lng": pickup_location["lng"],
            "address": pickup_location["address"]
        },
        "destination": {
            "lat": destination_location["lat"],
            "lng": destination_location["lng"],
            "address": destination_location["address"]
        },
        "status": "pending",
        "created_at": datetime.now(),
        "completed_at": None
    }
    return rides.insert_one(ride)

def get_ride_status(ride_id):
    return rides.find_one({"_id": ride_id})

def update_ride_status(ride_id, status):
    update_data = {"status": status}
    if status == "completed":
        update_data["completed_at"] = datetime.now()
    
    return rides.update_one(
        {"_id": ride_id},
        {"$set": update_data}
    )

def assign_driver_to_ride(ride_id, driver_id):
    return rides.update_one(
        {"_id": ride_id},
        {"$set": {"driver_id": driver_id, "status": "accepted"}}
    )
