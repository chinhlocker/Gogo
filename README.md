# Gogo - Nền Tảng Đặt Xe

Một phiên bản đơn giản hóa của hệ thống đặt xe Grab, được xây dựng bằng Python Flask và MongoDB.

## Tổng Quan Dự Án

Gogo là một nền tảng đặt xe trực tuyến kết nối hành khách với tài xế ở gần. Hệ thống có các tính năng theo dõi vị trí thời gian thực, ghép đôi tài xế thông minh, và giao diện riêng biệt cho cả hành khách và tài xế.

## Tính Năng Chính

### Dành Cho Hành Khách
- Đặt xe thông qua bản đồ tương tác
- Chọn vị trí đón và điểm đến thời gian thực
- Tích hợp thông tin thời tiết
- Đăng ký và xác thực tài khoản
- Theo dõi lịch sử chuyến đi
- Gửi phản hồi và liên hệ

### Dành Cho Tài Xế
- Chuyển đổi trạng thái sẵn sàng
- Nhận thông báo đơn hàng thời gian thực
- Giao diện quản lý chuyến đi
- Tự động ghép đơn dựa trên khoảng cách
- Đăng ký và xác thực tài khoản tài xế

### Dành Cho Quản Trị Viên
- Bảng điều khiển theo dõi hệ thống
- Quản lý người dùng và tài xế
- Phân tích chuyến đi
- Quản lý phản hồi

## Công Nghệ Sử Dụng

### Frontend (Giao Diện)
- **HTML5/CSS3/JavaScript** - Nền tảng web cơ bản
- **Bootstrap 5.3** - Framework UI
- **Font Awesome 6.4** - Thư viện biểu tượng
- **Google Maps API** - Dịch vụ bản đồ
- **TikTok Sans** - Font chữ chính
- **XHR** - Giao tiếp API
- **Component System** - Hệ thống component tái sử dụng

### Backend (Máy Chủ)
- **Python Flask** - Framework máy chủ
- **MongoDB** - Cơ sở dữ liệu
- **Google Maps API** - Tính toán khoảng cách
- **Weather API** - Dữ liệu thời tiết thời gian thực

## Bảng Màu
- Xanh Chính: `#093FB4`
- Trắng Tinh: `#FFFCFB`
- Hồng Nhạt: `#FFD8D8`
- Đỏ Nhấn: `#ED3500`

## Cấu Trúc Dự Án
```
├── main.py                 # Khởi tạo máy chủ và định tuyến API
├── database.py            # Kết nối MongoDB và thao tác dữ liệu
├── static/
│   ├── components/        # Components HTML có thể tái sử dụng
│   │   ├── footer.html    # Chân trang
│   │   └── header.html    # Đầu trang
│   ├── css/
│   │   └── variables.css  # Biến CSS và giao diện
│   ├── js/
│   │   └── component-loader.js  # Hệ thống tải component
│   └── img/              # Thư mục chứa hình ảnh
├── templates/
│   ├── index.html        # Trang chọn vai trò
│   ├── home.html         # Giao diện chính người dùng
│   ├── driver.html       # Giao diện tài xế
│   ├── about.html        # Trang giới thiệu
│   ├── contact.html      # Biểu mẫu liên hệ
│   ├── dashboard.html    # Bảng điều khiển admin
│   ├── auth/
│   │   ├── user/        # Trang xác thực người dùng
│   │   └── driver/      # Trang xác thực tài xế
└── start.bat             # Script khởi động máy chủ
```

## Các Điểm Cuối API (Kế Hoạch)

### API Người Dùng
- `POST /api/auth/user/register` - Đăng ký tài khoản người dùng
- `POST /api/auth/user/login` - Đăng nhập người dùng
- `POST /api/rides/request` - Tạo yêu cầu đặt xe
- `GET /api/rides/status/:id` - Kiểm tra trạng thái chuyến đi

### API Tài Xế
- `POST /api/auth/driver/register` - Đăng ký tài khoản tài xế
- `POST /api/auth/driver/login` - Đăng nhập tài xế
- `PUT /api/driver/status` - Cập nhật trạng thái sẵn sàng
- `GET /api/driver/orders` - Lấy danh sách đơn được giao
- `PUT /api/rides/complete/:id` - Đánh dấu hoàn thành chuyến đi

### API Quản Trị
- `GET /api/admin/dashboard` - Thống kê bảng điều khiển
- `GET /api/admin/users` - Quản lý người dùng
- `GET /api/admin/drivers` - Quản lý tài xế

## Cấu Trúc Cơ Sở Dữ Liệu (Kế Hoạch)

### Bảng Người Dùng (Users)
```json
{
    "id": "ObjectId",
    "name": "String",          // Tên người dùng
    "phone": "String",         // Số điện thoại
    "email": "String",         // Email
    "password": "String",      // Mật khẩu (đã mã hóa)
    "created_at": "DateTime"   // Thời gian tạo tài khoản
}
```

### Bảng Tài Xế (Drivers)
```json
{
    "id": "ObjectId",
    "name": "String",          // Tên tài xế
    "phone": "String",         // Số điện thoại
    "email": "String",         // Email
    "password": "String",      // Mật khẩu (đã mã hóa)
    "vehicle_info": {
        "type": "String",      // Loại xe
        "plate": "String"      // Biển số xe
    },
    "status": "String",        // Trạng thái (sẵn sàng/bận)
    "current_location": {
        "lat": "Number",       // Vĩ độ
        "lng": "Number"        // Kinh độ
    },
    "created_at": "DateTime"   // Thời gian tạo tài khoản
}
```

### Bảng Chuyến Đi (Rides)
```json
{
    "id": "ObjectId",
    "user_id": "ObjectId",     // ID người dùng
    "driver_id": "ObjectId",   // ID tài xế
    "pickup": {
        "lat": "Number",       // Vĩ độ điểm đón
        "lng": "Number",       // Kinh độ điểm đón
        "address": "String"    // Địa chỉ điểm đón
    },
    "destination": {
        "lat": "Number",       // Vĩ độ điểm đến
        "lng": "Number",       // Kinh độ điểm đến
        "address": "String"    // Địa chỉ điểm đến
    },
    "status": "String",        // Trạng thái (chờ/đã nhận/hoàn thành/hủy)
    "created_at": "DateTime",  // Thời gian tạo chuyến
    "completed_at": "DateTime" // Thời gian hoàn thành
}
```

## Hướng Dẫn Cài Đặt (Sẽ được triển khai)

1. Cài đặt các thư viện Python cần thiết
2. Thiết lập MongoDB cục bộ
3. Cấu hình biến môi trường
4. Chạy máy chủ bằng start.bat

## Các Giai Đoạn Phát Triển

### Giai Đoạn 1 - Thiết Lập Cơ Bản
- Xây dựng cấu trúc dự án
- Kết nối cơ sở dữ liệu
- Hệ thống xác thực
- Components giao diện cơ bản

### Giai Đoạn 2 - Tính Năng Đặt Xe
- Tích hợp bản đồ
- Chọn vị trí
- Thuật toán ghép tài xế
- Thông báo thời gian thực

### Giai Đoạn 3 - Tính Năng Nâng Cao
- Tích hợp thời tiết
- Lịch sử chuyến đi
- Hệ thống đánh giá
- Bảng điều khiển phân tích

### Giai Đoạn 4 - Tối Ưu Hóa
- Cải thiện hiệu suất
- Nâng cao trải nghiệm người dùng
- Tăng cường bảo mật
- Kiểm thử và gỡ lỗi

## Đóng Góp

Đây là dự án học tập. Mọi đóng góp và góp ý đều được hoan nghênh.

## Giấy Phép

Dự án này chỉ phục vụ mục đích giáo dục.

## Ghi nhận các lỗi hiện tại
- Cần loại bỏ phần điền họ tên và sđt, sẽ thay đổi bằng cơ chế đăng nhập, đăng kí
- Thêm nút đặt xe