import webbrowser
import threading
import os
import json
from flask import Flask, render_template, request, jsonify
from database import *

app = Flask(__name__)

# Bật chế độ debug
app.config['DEBUG'] = True

# Địa chỉ server Flask
HOST = "127.0.0.1"
PORT = 4662

# Route cho trang chủ
@app.route("/")
def index():
    return render_template("index.html")

# Route cho trang người dùng
@app.route("/home")
def home():
    return render_template("home.html")

# Route cho trang tài xế
@app.route("/driver")
def driver():
    return render_template("driver.html")

# Route cho trang giới thiệu
@app.route("/about")
def about():
    return render_template("about.html")

# Route cho trang liên hệ
@app.route("/contact")
def contact():
    return render_template("contact.html")

# API endpoint để lấy dữ liệu từ moneyrate.json
@app.route("/api/moneyrates")
def get_money_rates():
    try:
        with open('data/moneyrate.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
            return jsonify(data)
    except Exception as e:
        return jsonify({
            "error": str(e),
            "normal-hour-rate": 1,
            "overtime-hour-rate": 1.5,
            "night-hour-rate": 1.25,
            "cost-per-km-vnd": 15000
        }), 500

# API endpoint cho đăng ký người dùng
@app.route("/api/auth/user/register", methods=["POST"])
def register_user():
    data = request.json
    try:
        create_user(
            name=data["name"],
            phone=data["phone"],
            email=data["email"],
            password=data["password"]
        )
        return jsonify({"success": True, "message": "Đăng ký thành công"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# API endpoint cho đặt xe
@app.route("/api/rides/request", methods=["POST"])
def request_ride():
    data = request.json
    try:
        ride = create_ride(
            user_id=data["user_id"],
            pickup_location=data["pickup"],
            destination_location=data["destination"]
        )
        return jsonify({
            "success": True,
            "message": "Đã tạo yêu cầu đặt xe",
            "ride_id": str(ride.inserted_id)
        })
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# API endpoint cho cập nhật vị trí tài xế
@app.route("/api/driver/location", methods=["PUT"])
def update_location():
    data = request.json
    try:
        update_driver_location(
            driver_id=data["driver_id"],
            lat=data["lat"],
            lng=data["lng"]
        )
        return jsonify({"success": True, "message": "Đã cập nhật vị trí"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

# Chỉ mở trình duyệt nếu đây là tiến trình chính (tránh auto-reload)
def open_browser():
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":  # Chỉ chạy khi Flask khởi động lần đầu
        webbrowser.open(f"http://{HOST}:{PORT}/", new=2)

if __name__ == "__main__":
    threading.Thread(target=open_browser).start()
    app.run(host=HOST, port=PORT)