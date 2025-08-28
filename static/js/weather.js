// Cấu hình API thời tiết
const WEATHER_CONFIG = {
    apiKey: '3c98b00882fe45e1b2775859250708',
    location: 'hai phong',
    updateInterval: 5 * 60 * 1000 // 5 phút
};

// Mapping mã thời tiết sang icon Font Awesome
const WEATHER_ICONS = {
    1000: 'fas fa-sun', // Clear
    1003: 'fas fa-cloud-sun', // Partly cloudy
    1006: 'fas fa-cloud', // Cloudy
    1009: 'fas fa-cloud', // Overcast
    1030: 'fas fa-smog', // Mist
    1063: 'fas fa-cloud-rain', // Rain
    1066: 'fas fa-snowflake', // Snow
    1087: 'fas fa-bolt', // Thunder
    // Thêm các mã khác nếu cần
};

// Các element DOM
const DOM = {
    temperature: document.getElementById('temperature'),
    weatherDesc: document.getElementById('weatherDesc'),
    humidity: document.getElementById('humidity'),
    localTime: document.getElementById('localTime'),
    weatherIcon: document.getElementById('weatherIcon')
};

// Hàm chuyển đổi mã thời tiết sang icon Font Awesome tương ứng
function getWeatherIcon(code) {
    return WEATHER_ICONS[code] || 'fas fa-cloud'; // Mặc định là icon mây
}

// Hàm cập nhật giao diện thời tiết
function updateWeatherUI(data) {
    DOM.temperature.textContent = `${data.current.temp_c}°C`;
    DOM.weatherDesc.textContent = data.current.condition.text;
    DOM.humidity.textContent = `${data.current.humidity}%`;

    const localTime = new Date(data.location.localtime);
    DOM.localTime.textContent = localTime.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    DOM.weatherIcon.className = 'weather-icon ' + getWeatherIcon(data.current.condition.code);
}

// Hàm lấy dữ liệu thời tiết từ API
async function fetchWeatherData() {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${WEATHER_CONFIG.apiKey}&q=${WEATHER_CONFIG.location}&aqi=no`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thời tiết:', error);
    }
}

// Khởi tạo và cập nhật định kỳ
function initWeatherWidget() {
    fetchWeatherData(); // Lấy dữ liệu lần đầu
    setInterval(fetchWeatherData, WEATHER_CONFIG.updateInterval); // Cập nhật định kỳ
}

// Khởi chạy widget khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', initWeatherWidget);
