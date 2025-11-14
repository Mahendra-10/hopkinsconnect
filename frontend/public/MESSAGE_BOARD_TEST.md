# 🗨️ Message Board Feature - Testing Guide

## ✅ What Was Added

**New Feature:** Hopkins Connect Board - A global message board where students can post collaboration requests!

### Files Added/Modified:

**Backend:**
- ✅ `backend/database.js` - Added `posts` table
- ✅ `backend/server.js` - Added POST `/api/posts` and GET `/api/posts` endpoints

**Frontend:**
- ✅ `frontend/public/board.html` - New message board page
- ✅ `frontend/public/board.js` - Message board JavaScript
- ✅ `frontend/public/style.css` - Added post card styles
- ✅ Updated navigation in all pages (index, register, profiles)

---

## 🚀 How to Test

### Step 1: Restart Backend (Important!)

Since we added a new table, restart the backend:

```bash
# Stop backend (Ctrl+C in backend terminal)
# Then restart:
cd backend
node server.js
```

You should see:
```
Database initialized at: ./data/hopkinsconnect.db
HopkinsConnect API running on port 3000
```

### Step 2: Refresh Frontend

Frontend should still be running. If not:
```bash
cd frontend/public
python3 -m http.server 8080
```

### Step 3: Test the Message Board

**Navigate to:** http://localhost:8080

You should now see **"Message Board"** in the navigation!

#### A. Click "Message Board" link

You should see:
- 🗨️ Hopkins Connect Board header
- "+ New Post" button
- Empty message board (no posts yet)

#### B. Try to create a post WITHOUT logging in:

1. Click "+ New Post"
2. Fill out the form
3. Click "Post"
4. Should redirect to login (requires authentication!)

#### C. Login first:

1. Go to Home
2. Login with existing account (or register new one)
3. Go back to Message Board

#### D. Create your first post:

1. Click "+ New Post"
2. Select Category: "🚀 Startup Co-founder"
3. Title: "Looking for AI Startup Co-founder"
4. Message: "Building an AI platform for education. Need technical co-founder with ML experience."
5. Click "Post"

**You should see:**
- ✅ Success message
- ✅ Your post appears in the board
- ✅ Shows your name, major, category
- ✅ Shows "Just now" or time ago

#### E. Create more posts:

Register another user and create more posts to test:
- Different categories
- Multiple posts from different users
- Check time stamps

---

## 🎯 Features Implemented

✅ **Create Posts** - Users can post what they're looking for
✅ **Categories** - Research, Startup, Project, Study, Other
✅ **User Authentication** - Must be logged in to post
✅ **Display Posts** - Shows all posts with user info
✅ **Time Stamps** - Shows how long ago post was created
✅ **Beautiful UI** - Color-coded categories, hover effects
✅ **Security** - XSS prevention with HTML escaping

---

## 📊 Database Schema

**Posts Table:**
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🎨 What It Looks Like

**Post Card:**
```
┌────────────────────────────────────┐
│ 🚀 Startup                         │
│                                    │
│ Looking for AI Startup Co-founder │
│                                    │
│ Building an AI platform for        │
│ education. Need technical...       │
│                                    │
│ ─────────────────────────────────  │
│ John Doe • Computer Science        │
│                         2 hours ago│
└────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

**Problem: "No posts yet"**
- Make sure you're logged in
- Create a post using the form
- Refresh the page

**Problem: "Connection error"**
- Make sure backend is running on port 3000
- Check backend terminal for errors
- Try restarting backend

**Problem: "Please login first"**
- This is correct! You must be logged in to post
- Go to Home and login first

**Problem: Backend error when creating post**
- Make sure you restarted backend (so new table is created)
- Check backend terminal for errors
- Delete old database: `rm backend/data/hopkinsconnect.db` and restart

---

## ✅ Success Checklist

- [ ] Message Board link appears in navigation
- [ ] Can access board without login (view only)
- [ ] Must login to create posts
- [ ] Can create posts with categories
- [ ] Posts display with user info
- [ ] Time stamps show correctly
- [ ] Multiple posts from different users work
- [ ] Posts ordered by newest first
- [ ] UI looks good with hover effects

---

## 🎯 Next Steps

Once tested and working:

```bash
cd hopkinsconnect
git add .
git commit -m "Add Message Board feature

New Features:
- Global message board for student collaboration posts
- Post categories: Research, Startup, Project, Study, Other
- User authentication required to post
- Display posts with user info and timestamps
- Beautiful UI with category color-coding

Technical:
- New posts table in database
- POST /api/posts and GET /api/posts endpoints
- board.html page with form and posts display
- XSS prevention with HTML escaping
- Time ago calculation for posts"

git push origin main
```

---

**Great addition to your app!** This makes it much more useful for students! 🚀

