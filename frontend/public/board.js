// Message Board functionality
// API_URL is already defined in app.js

// Show/hide new post form
document.getElementById('newPostBtn')?.addEventListener('click', () => {
    const form = document.getElementById('newPostForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('cancelPostBtn')?.addEventListener('click', () => {
    document.getElementById('newPostForm').style.display = 'none';
    document.getElementById('postForm').reset();
});

// Create new post
document.getElementById('postForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        alert('Please login first to create a post');
        window.location.href = 'index.html';
        return;
    }
    
    const postData = {
        userId: user.id,
        category: document.getElementById('category').value,
        title: document.getElementById('postTitle').value,
        message: document.getElementById('postMessage').value
    };
    
    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Hide form and reload posts
            document.getElementById('newPostForm').style.display = 'none';
            document.getElementById('postForm').reset();
            loadPosts();
            alert('Post created successfully!');
        } else {
            alert(data.error || 'Failed to create post');
        }
    } catch (error) {
        console.error('Post creation error:', error);
        alert('Connection error. Please check if backend is running.');
    }
});

// Load all posts
async function loadPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '<p>Loading posts...</p>';
    
    try {
        const response = await fetch(`${API_URL}/posts`);
        const data = await response.json();
        
        if (response.ok && data.posts.length > 0) {
            displayPosts(data.posts);
        } else {
            container.innerHTML = '<p>No posts yet. Be the first to post!</p>';
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        container.innerHTML = '<p class="error">Error loading posts. Please check if the backend is running.</p>';
    }
}

// Display posts
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');
    
    container.innerHTML = posts.map(post => {
        const date = new Date(post.created_at);
        const timeAgo = getTimeAgo(date);
        const categoryEmoji = getCategoryEmoji(post.category);
        
        return `
            <div class="post-card">
                <div class="post-category">${categoryEmoji} ${escapeHtml(post.category)}</div>
                <h3 class="post-title">${escapeHtml(post.title)}</h3>
                <p class="post-message">${escapeHtml(post.message)}</p>
                <div class="post-footer">
                    <div class="post-author">
                        <strong>${escapeHtml(post.user_name)}</strong>
                        ${post.user_major ? `<span class="post-major">• ${escapeHtml(post.user_major)}</span>` : ''}
                    </div>
                    <div class="post-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Helper function to get category emoji
function getCategoryEmoji(category) {
    const emojis = {
        'Research': '🔬',
        'Startup': '🚀',
        'Project': '💻',
        'Study': '📚',
        'Other': '🔧'
    };
    return emojis[category] || '📌';
}

// Helper function to calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

// Helper function to escape HTML (prevent XSS)
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load posts when page loads
document.addEventListener('DOMContentLoaded', loadPosts);

