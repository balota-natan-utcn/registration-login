// Configuration
const API_URL = 'http://localhost:3100';

// Global variables
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (authToken && currentUser) {
        showDashboard();
    } else {
        showLogin();
    }

    // Set up event listeners
    setupEventListeners();
});

// Event listeners setup
function setupEventListeners() {
    // Login form handler
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        await login(email, password);
    });

    // Register form handler
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const phone = document.getElementById('registerPhone').value;
        
        await register(email, password, firstName, lastName, phone);
    });
}

// Authentication functions
async function login(email, password) {
    const loginBtn = document.getElementById('loginBtn');
    const responseDiv = document.getElementById('loginResponse');
    
    // Update UI state
    setLoadingState(loginBtn, 'Signing in...', true);
    showMessage(responseDiv, 'Authenticating...', 'loading');

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store authentication data
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage(responseDiv, 
                `✅ Login successful! Welcome back, ${currentUser.firstName || currentUser.email}!`, 
                'success'
            );
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                showDashboard();
            }, 1000);
        } else {
            showMessage(responseDiv, `❌ Login failed: ${data.message}`, 'error');
        }
    } catch (error) {
        showMessage(responseDiv, 
            `❌ Connection Error: Could not connect to server. Make sure your backend is running.\n${error.message}`, 
            'error'
        );
    } finally {
        setLoadingState(loginBtn, 'Sign In', false);
    }
}

async function register(email, password, firstName, lastName, phone) {
    const registerBtn = document.getElementById('registerBtn');
    const responseDiv = document.getElementById('registerResponse');
    
    // Update UI state
    setLoadingState(registerBtn, 'Creating account...', true);
    showMessage(responseDiv, 'Creating your account...', 'loading');

    try {
        // Build request body
        const requestBody = { email, password };
        if (firstName) requestBody.firstName = firstName;
        if (lastName) requestBody.lastName = lastName;
        if (phone) requestBody.phone = parseInt(phone);

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (response.ok) {
            // Store authentication data
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showMessage(responseDiv, 
                `✅ Account created successfully! Welcome, ${currentUser.firstName || currentUser.email}!`, 
                'success'
            );
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                showDashboard();
            }, 1000);
        } else {
            showMessage(responseDiv, `❌ Registration failed: ${data.message}`, 'error');
        }
    } catch (error) {
        showMessage(responseDiv, 
            `❌ Connection Error: Could not connect to server. Make sure your backend is running.\n${error.message}`, 
            'error'
        );
    } finally {
        setLoadingState(registerBtn, 'Create Account', false);
    }
}

function logout() {
    // Clear authentication data
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Clear forms and responses
    clearAllForms();
    clearAllResponses();
    
    // Show login screen
    showLogin();
}

// UI Navigation functions
function showLogin() {
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('registerContainer').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showRegister() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('registerContainer').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('registerContainer').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    displayUserInfo();
}

function displayUserInfo() {
    const userInfoDiv = document.getElementById('userInfo');
    userInfoDiv.innerHTML = `
        <h3>Welcome, ${currentUser.firstName || 'User'}!</h3>
        <p><strong>Email:</strong> ${currentUser.email}</p>
        ${currentUser.firstName ? `<p><strong>First Name:</strong> ${currentUser.firstName}</p>` : ''}
        ${currentUser.lastName ? `<p><strong>Last Name:</strong> ${currentUser.lastName}</p>` : ''}
        ${currentUser.phone ? `<p><strong>Phone:</strong> ${currentUser.phone}</p>` : ''}
    `;
}

// API functions
async function getProfile() {
    await makeAuthenticatedRequest('/profile', 'Getting profile...');
}

async function getUsers() {
    await makeAuthenticatedRequest('/users', 'Fetching all users...');
}

async function testBackend() {
    await makeRequest('/', 'Testing backend...');
}

async function makeAuthenticatedRequest(endpoint, loadingText) {
    const responseDiv = document.getElementById('dashboardResponse');
    showMessage(responseDiv, loadingText, 'loading');

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            const isArray = Array.isArray(data);
            const itemCount = isArray ? data.length : null;

            let successMessage = `✅ Success! Request to ${endpoint} completed successfully`;
            if (itemCount !== null) {
                successMessage += `\nFound ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
            }
            successMessage += `\n\nResponse:\n${JSON.stringify(data, null, 2)}`;

            showMessage(responseDiv, successMessage, 'success');
        } else {
            // Handle authentication errors
            if (response.status === 401 || response.status === 403) {
                logout();
                return;
            }
            
            showMessage(responseDiv, 
                `❌ Error! ${data.message}\nStatus: ${response.status} ${response.statusText}`, 
                'error'
            );
        }
    } catch (error) {
        showMessage(responseDiv, 
            `❌ Connection Error! Could not connect to server.\n${error.message}`, 
            'error'
        );
    }
}

async function makeRequest(endpoint, loadingText) {
    const responseDiv = document.getElementById('dashboardResponse');
    showMessage(responseDiv, loadingText, 'loading');

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(responseDiv, 
                `✅ Success! Backend is running and responding\n\nResponse:\n${JSON.stringify(data, null, 2)}`, 
                'success'
            );
        } else {
            showMessage(responseDiv, 
                `❌ Error! Backend responded with an error\nStatus: ${response.status}`, 
                'error'
            );
        }
    } catch (error) {
        showMessage(responseDiv, 
            `❌ Connection Error! Could not connect to backend\n${error.message}`, 
            'error'
        );
    }
}

// Utility functions
function setLoadingState(button, text, isLoading) {
    button.disabled = isLoading;
    button.textContent = text;
}

function showMessage(element, message, type) {
    let className = '';
    let icon = '';
    
    switch (type) {
        case 'success':
            className = 'success';
            break;
        case 'error':
            className = 'error';
            break;
        case 'loading':
            className = 'loading';
            break;
        default:
            className = '';
    }

    if (type === 'loading') {
        element.innerHTML = `<div class="${className}">${message}</div>`;
    } else {
        element.innerHTML = `
            <div class="${className}">
                <strong>${message.split('\n')[0]}</strong>
                ${message.includes('\n') ? `<pre>${message.split('\n').slice(1).join('\n')}</pre>` : ''}
            </div>
        `;
    }
}

function clearAllForms() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

function clearAllResponses() {
    document.getElementById('loginResponse').innerHTML = '';
    document.getElementById('registerResponse').innerHTML = '';
    document.getElementById('dashboardResponse').innerHTML = '';
}

// Make functions globally available for onclick handlers
window.showLogin = showLogin;
window.showRegister = showRegister;
window.getProfile = getProfile;
window.getUsers = getUsers;
window.testBackend = testBackend;
window.logout = logout;