// Component loader
function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with id '${elementId}' not found`);
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/static/components/${componentPath}`, true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            element.innerHTML = xhr.responseText;
            // Trigger để Bootstrap khởi tạo lại các components
            const event = new Event('components-loaded');
            document.dispatchEvent(event);
        } else {
            console.error(`Failed to load component '${componentPath}':`, xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error(`Network error loading component '${componentPath}'`);
    };

    xhr.send();
}

// Load components khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
    // Load components
    loadComponent('header-component', 'header.html');
    loadComponent('footer-component', 'footer.html');

    // Khởi tạo loading modal sau khi DOM đã load
    document.addEventListener('components-loaded', function() {
        if (typeof bootstrap !== 'undefined') {
            window.loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        }
    });
});

// Loading modal functions
function showLoading() {
    if (window.loadingModal) {
        window.loadingModal.show();
    }
}

function hideLoading() {
    if (window.loadingModal) {
        window.loadingModal.hide();
    }
}

// XHR helper function
function makeRequest(method, url, data = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    response: xhr.responseText
                });
            }
        };
        
        xhr.onerror = function() {
            reject({
                status: xhr.status,
                statusText: xhr.statusText,
                response: xhr.responseText
            });
        };

        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}
