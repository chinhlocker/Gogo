// Component loader
function loadComponent(elementId, componentPath) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/static/components/${componentPath}`, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById(elementId).innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}

// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-component', 'header.html');
    loadComponent('footer-component', 'footer.html');
});

// Loading modal functions
const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));

function showLoading() {
    loadingModal.show();
}

function hideLoading() {
    loadingModal.hide();
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
