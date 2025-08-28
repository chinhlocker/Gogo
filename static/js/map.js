// Khởi tạo biến toàn cục
let map, pickupMarker, destinationMarker, routingControl;
let pickupCoords, destinationCoords;

// 1. Khởi tạo bản đồ với vị trí mặc định (Hải Phòng)
map = L.map('map').setView([20.938874, 106.681359], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 2. Xử lý tìm kiếm địa điểm
async function searchLocation(query) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi khi tìm kiếm địa điểm:', error);
        return [];
    }
}

// 3. Thêm marker vào bản đồ
function addMarker(latlng, isPickup = true) {
    const markerIcon = L.divIcon({
        className: `custom-marker ${isPickup ? 'pickup-marker' : 'destination-marker'} marker-animation`,
        html: `<i class="fas ${isPickup ? 'fa-map-marker-alt' : 'fa-location-dot'}"></i>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    const marker = L.marker(latlng, {
        draggable: true,
        icon: markerIcon
    });

    marker.on('dragend', function(e) {
        const newLatLng = e.target.getLatLng();
        if (isPickup) {
            pickupCoords = [newLatLng.lat, newLatLng.lng];
        } else {
            destinationCoords = [newLatLng.lat, newLatLng.lng];
        }
        updateRoute();
    });

    marker.addTo(map);
    return marker;
}

// 4. Xử lý khi người dùng nhập địa điểm
async function handleLocationInput(input, isPickup = true) {
    const locations = await searchLocation(input.value);
    if (locations.length > 0) {
        const location = locations[0];
        const latlng = [parseFloat(location.lat), parseFloat(location.lon)];
        
        if (isPickup) {
            if (pickupMarker) map.removeLayer(pickupMarker);
            pickupMarker = addMarker(latlng, true);
            pickupCoords = latlng;
        } else {
            if (destinationMarker) map.removeLayer(destinationMarker);
            destinationMarker = addMarker(latlng, false);
            destinationCoords = latlng;
        }

        map.setView(latlng, 15);
        updateRoute();
    }
}

// 5. Cập nhật tuyến đường
function updateRoute() {
    try {
        if (pickupCoords && destinationCoords) {
            // Hiển thị loading
            const loadingModal = document.getElementById('loadingModal');
            if (loadingModal) {
                loadingModal.style.display = 'block';
            }

            // Xóa tuyến đường cũ nếu có
            if (routingControl) {
                map.removeControl(routingControl);
            }

            // Tạo tuyến đường mới
            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(pickupCoords[0], pickupCoords[1]),
                    L.latLng(destinationCoords[0], destinationCoords[1])
                ],
                routeWhileDragging: true,
                show: false, // Không hiển thị panel chỉ đường
                lineOptions: {
                    styles: [{ 
                        color: '#093FB4', 
                        weight: 4,
                        opacity: 0.7
                    }]
                },
                createMarker: function() { return null; } // Không tạo marker mặc định
            });

            routingControl.addTo(map);

            // Xử lý khi tìm được tuyến đường
            routingControl.on('routesfound', function(e) {
                const routes = e.routes;
                const summary = routes[0].summary;
                
                // Tự động điều chỉnh view để thấy toàn bộ tuyến đường
                const bounds = L.latLngBounds([
                    [pickupCoords[0], pickupCoords[1]],
                    [destinationCoords[0], destinationCoords[1]]
                ]);
                map.fitBounds(bounds, { padding: [50, 50] });

                // Hiển thị thông tin chuyến đi
                showTripDetails(summary.totalDistance, summary.totalTime);
                const bookButton = document.querySelector('.btn-book');
                if (bookButton) {
                    bookButton.style.display = 'block';
                }
                
                // Ẩn loading
                if (loadingModal) {
                    loadingModal.style.display = 'none';
                }
            });

            // Xử lý khi có lỗi
            routingControl.on('routingerror', function(e) {
                console.error('Lỗi khi tìm đường:', e.error);
                alert('Không thể tìm được đường đi giữa hai điểm. Vui lòng thử lại.');
                if (loadingModal) {
                    loadingModal.style.display = 'none';
                }
            });
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật tuyến đường:', error);
        if (loadingModal) {
            loadingModal.style.display = 'none';
        }
    }
}

// 6. Hiển thị chi tiết chuyến đi
function showTripDetails(distance, time) {
    const distanceKm = (distance / 1000).toFixed(1);
    const timeMin = Math.round(time / 60);
    const price = calculatePrice(distance);
    
    // Xác định loại thời gian hiện tại
    const currentHour = new Date().getHours();
    let timeType = 'Giờ thường';
    let rateInfo = '';
    
    if (isOvertimeHour(currentHour)) {
        timeType = 'Giờ cao điểm';
        rateInfo = `(Phụ thu ${((moneyRates["overtime-hour-rate"] - 1) * 100).toFixed()}%)`;
    } else if (isNightHour(currentHour)) {
        timeType = 'Giờ đêm';
        rateInfo = `(Phụ thu ${((moneyRates["night-hour-rate"] - 1) * 100).toFixed()}%)`;
    }

    const tripDetailsHtml = `
        <div class="trip-detail">
            <i class="fas fa-route"></i> Khoảng cách: ${distanceKm} km
        </div>
        <div class="trip-detail">
            <i class="fas fa-clock"></i> Thời gian dự kiến: ${timeMin} phút
        </div>
        <div class="trip-detail">
            <i class="fas fa-sun"></i> ${timeType} ${rateInfo}
        </div>
        <div class="trip-detail price-total">
            <i class="fas fa-coins"></i> Giá cước: ${price.toLocaleString()}đ
        </div>
    `;

    const bookingPanel = document.querySelector('.booking-panel');
    const existingDetails = bookingPanel.querySelector('.trip-details');
    if (existingDetails) {
        existingDetails.remove();
    }

    const tripDetails = document.createElement('div');
    tripDetails.className = 'trip-details';
    tripDetails.innerHTML = tripDetailsHtml;
    
    // Chèn trước nút đặt xe
    const bookButton = bookingPanel.querySelector('.btn-book');
    bookingPanel.insertBefore(tripDetails, bookButton);

    // Hiển thị nút đặt xe và thông báo đăng nhập
    bookButton.style.display = 'block';
    showLoginPrompt();
}

// 7. Tính giá tiền
let moneyRates = null;

// Hàm tải dữ liệu từ API moneyrates
async function loadMoneyRates() {
    try {
        const response = await fetch('/api/moneyrates');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        moneyRates = await response.json();
        console.log('Đã tải xong biểu phí:', moneyRates);
    } catch (error) {
        console.error('Lỗi khi tải biểu phí:', error);
        // Giá trị mặc định nếu không tải được từ API
        moneyRates = {
            "normal-hour-rate": 1,
            "overtime-hour-rate": 1.5,
            "night-hour-rate": 1.25,
            "cost-per-km-vnd": 15000
        };
    }
}

// Hàm kiểm tra xem thời điểm có phải giờ cao điểm không
function isOvertimeHour(hour) {
    // Giờ cao điểm: 6h-9h sáng và 16h-19h chiều
    return (hour >= 6 && hour < 9) || (hour >= 16 && hour < 19);
}

// Hàm kiểm tra xem thời điểm có phải giờ đêm không
function isNightHour(hour) {
    // Giờ đêm: 22h-5h sáng
    return hour >= 22 || hour < 5;
}

// Hàm tính giá tiền dựa trên khoảng cách và thời gian
function calculatePrice(distance) {
    if (!moneyRates) return 0;

    const distanceKm = distance / 1000;
    const baseCost = distanceKm * moneyRates["cost-per-km-vnd"];
    
    // Lấy giờ hiện tại
    const currentHour = new Date().getHours();
    
    // Xác định hệ số nhân theo thời gian
    let rateMultiplier = moneyRates["normal-hour-rate"];
    if (isOvertimeHour(currentHour)) {
        rateMultiplier = moneyRates["overtime-hour-rate"];
    } else if (isNightHour(currentHour)) {
        rateMultiplier = moneyRates["night-hour-rate"];
    }
    
    // Tính tổng chi phí
    const totalCost = baseCost * rateMultiplier;
    
    return Math.round(totalCost); // Làm tròn đến đơn vị đồng
}

// Tải dữ liệu ngay khi script được load
loadMoneyRates();

// 8. Xử lý chọn điểm trên bản đồ
let isSelectingPickup = true; // Biến để theo dõi đang chọn điểm đón hay điểm đến

function toggleLocationSelection(isPickup) {
    isSelectingPickup = isPickup;
    // Cập nhật giao diện để người dùng biết đang chọn điểm nào
    document.getElementById('pickup').classList.toggle('active-input', isPickup);
    document.getElementById('destination').classList.toggle('active-input', !isPickup);
}

// 9. Khởi tạo sự kiện
document.addEventListener('DOMContentLoaded', function() {
    const pickupInput = document.getElementById('pickup');
    const destinationInput = document.getElementById('destination');

    // Thêm class để style cho input đang active
    pickupInput.classList.add('active-input');

    // Sự kiện focus vào input
    pickupInput.addEventListener('focus', () => toggleLocationSelection(true));
    destinationInput.addEventListener('focus', () => toggleLocationSelection(false));

    // Sự kiện khi nhập địa chỉ
    pickupInput.addEventListener('change', async () => {
        await handleLocationInput(pickupInput, true);
        if (pickupCoords && destinationInput.value === '') {
            destinationInput.focus(); // Tự động chuyển focus sang input điểm đến
        }
    });

    destinationInput.addEventListener('change', async () => {
        await handleLocationInput(destinationInput, false);
        if (destinationCoords && pickupInput.value === '') {
            pickupInput.focus(); // Tự động chuyển focus sang input điểm đón nếu chưa có
        }
    });

    // Sự kiện click trên bản đồ
    map.on('click', function(e) {
        const latlng = [e.latlng.lat, e.latlng.lng];
        
        if (isSelectingPickup) {
            if (pickupMarker) map.removeLayer(pickupMarker);
            pickupMarker = addMarker(latlng, true);
            pickupCoords = latlng;
            
            // Reverse geocoding để lấy địa chỉ
            reverseGeocode(latlng, (address) => {
                pickupInput.value = address;
            });

            // Tự động chuyển sang chọn điểm đến
            if (!destinationCoords) {
                toggleLocationSelection(false);
                destinationInput.focus();
            }
        } else {
            if (destinationMarker) map.removeLayer(destinationMarker);
            destinationMarker = addMarker(latlng, false);
            destinationCoords = latlng;
            
            // Reverse geocoding để lấy địa chỉ
            reverseGeocode(latlng, (address) => {
                destinationInput.value = address;
            });

            // Nếu chưa có điểm đón, chuyển sang chọn điểm đón
            if (!pickupCoords) {
                toggleLocationSelection(true);
                pickupInput.focus();
            }
        }

        // Cập nhật tuyến đường nếu có cả hai điểm
        if (pickupCoords && destinationCoords) {
            updateRoute();
        }
    });
});

// 10. Hàm reverse geocoding
async function reverseGeocode(latlng, callback) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng[0]}&lon=${latlng[1]}&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
            callback(data.display_name);
        }
    } catch (error) {
        console.error('Lỗi khi lấy địa chỉ:', error);
    }
}

// 11. Xử lý đặt xe
function bookRide() {
    // Lưu thông tin chuyến đi vào localStorage để sử dụng sau khi đăng nhập
    const tripInfo = {
        pickup: {
            coords: pickupCoords,
            address: document.getElementById('pickup').value
        },
        destination: {
            coords: destinationCoords,
            address: document.getElementById('destination').value
        },
        estimatedTime: document.querySelector('.trip-detail:nth-child(2)').textContent,
        price: document.querySelector('.price-total').textContent
    };
    
    localStorage.setItem('pendingTrip', JSON.stringify(tripInfo));
    
    // Chuyển hướng đến trang đăng nhập
    window.location.href = '/login';
}

// Hiển thị thông báo đăng nhập sau khi có tuyến đường
function showLoginPrompt() {
    const loginPrompt = document.getElementById('loginPrompt');
    if (loginPrompt) {
        loginPrompt.style.display = 'block';
    }
}