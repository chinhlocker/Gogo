import webbrowser
import threading
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Bật chế độ debug
app.config['DEBUG'] = True

# Địa chỉ server Flask
HOST = "127.0.0.1"
PORT = 4662

@app.route("/")
def index():
    return render_template("index.html")

# Chỉ mở trình duyệt nếu đây là tiến trình chính (tránh auto-reload)
def open_browser():
    if os.environ.get("WERKZEUG_RUN_MAIN") == "true":  # Chỉ chạy khi Flask khởi động lần đầu
        webbrowser.open(f"http://{HOST}:{PORT}/", new=2)

if __name__ == "__main__":
    threading.Thread(target=open_browser).start()
    app.run(host=HOST, port=PORT)