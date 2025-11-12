// API endpoint - change this to your backend service URL
const API_URL = 'http://localhost:3000/api';

// Login function
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMessage('loginMessage', 'Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'profiles.html';
            }, 1500);
        } else {
            showMessage('loginMessage', data.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('loginMessage', 'Connection error. Please check if backend is running.', 'error');
    }
});

// Register function
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        major: document.getElementById('major').value,
        interests: document.getElementById('interests').value,
        bio: document.getElementById('bio').value
    };
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('registerMessage', 'Registration successful! Please login.', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showMessage('registerMessage', data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showMessage('registerMessage', 'Connection error. Please check if backend is running.', 'error');
    }
});

// Load all profiles
async function loadProfiles() {
    const container = document.getElementById('profilesContainer');
    container.innerHTML = '<p>Loading profiles...</p>';
    
    try {
        const response = await fetch(`${API_URL}/profiles`);
        const data = await response.json();
        
        if (response.ok && data.profiles.length > 0) {
            displayProfiles(data.profiles);
        } else {
            container.innerHTML = '<p>No profiles found. Be the first to register!</p>';
        }
    } catch (error) {
        console.error('Error loading profiles:', error);
        container.innerHTML = '<p class="error">Error loading profiles. Please check if the backend is running.</p>';
    }
}

// Search profiles
async function searchProfiles() {
    const searchTerm = document.getElementById('searchInput').value;
    const container = document.getElementById('profilesContainer');
    
    if (!searchTerm) {
        loadProfiles();
        return;
    }
    
    container.innerHTML = '<p>Searching...</p>';
    
    try {
        const response = await fetch(`${API_URL}/profiles/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (response.ok && data.profiles.length > 0) {
            displayProfiles(data.profiles);
        } else {
            container.innerHTML = `<p>No profiles found matching "${searchTerm}"</p>`;
        }
    } catch (error) {
        console.error('Search error:', error);
        container.innerHTML = '<p class="error">Search failed. Please try again.</p>';
    }
}

// Display profiles
function displayProfiles(profiles) {
    const container = document.getElementById('profilesContainer');
    
    container.innerHTML = profiles.map(profile => `
        <div class="profile-card">
            <h3>${escapeHtml(profile.name)}</h3>
            <p class="email">${escapeHtml(profile.email)}</p>
            ${profile.major ? `<p class="major">📚 ${escapeHtml(profile.major)}</p>` : ''}
            ${profile.interests ? `<p class="interests">🎯 ${escapeHtml(profile.interests)}</p>` : ''}
            ${profile.bio ? `<p>${escapeHtml(profile.bio)}</p>` : ''}
        </div>
    `).join('');
}

// Helper function to show messages
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
}

// Helper function to escape HTML (prevent XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

