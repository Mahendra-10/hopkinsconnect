# 🚀 GitHub Repository Setup Guide

## ✅ What's Already Done

✅ Git initialized in the project  
✅ .gitignore created  
✅ README.md created  
✅ Project structure created  
✅ Git user configured (Mahendra / mshahi2@jhu.edu)  

---

## 📋 Step-by-Step: Create GitHub Repo

### Step 1: Create Repository on GitHub.com (5 minutes)

1. **Go to GitHub:** https://github.com

2. **Login** to your account

3. **Click the "+" icon** (top right) → **"New repository"**

4. **Fill in repository details:**
   ```
   Repository name: hopkinsconnect
   Description: Student Collaboration Platform for Johns Hopkins University - Cloud Security Project
   Visibility: ✅ Private (recommended for academic work)
            or ⚪ Public (if you want to showcase)
   
   ❌ DO NOT initialize with README (we already have one!)
   ❌ DO NOT add .gitignore (we already have one!)
   ❌ DO NOT choose a license yet
   ```

5. **Click "Create repository"**

6. **You'll see a page with commands** - Keep it open!

---

### Step 2: Connect Local Repo to GitHub (2 minutes)

**Open terminal and run these commands:**

```bash
# Navigate to project
cd "/Users/mahendra/Documents/Cloud Security/OpenStack_K8s/Homework6/hopkinsconnect"

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: HopkinsConnect project structure

- Added project documentation (README, guides)
- Created directory structure for frontend, backend, kubernetes
- Added .gitignore for Node.js, Docker, and secrets
- Setup for Homework 6 - Cloud Security project"

# Add GitHub remote (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/hopkinsconnect.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANT:** Replace `yourusername` with your actual GitHub username!

For example:
```bash
git remote add origin https://github.com/mshahi2/hopkinsconnect.git
```

---

### Step 3: Verify on GitHub (1 minute)

1. **Refresh your GitHub repository page**

2. **You should see:**
   - ✅ README.md displayed
   - ✅ All folders (frontend, backend, kubernetes, docs, security)
   - ✅ .gitignore file
   - ✅ Your commit message

3. **Take a screenshot!** (You'll need this for assignment)

---

## 👥 Step 4: Add Your Partner as Collaborator (2 minutes)

**So Abdulaziz can contribute:**

1. **On GitHub repo page**, click **"Settings"** tab

2. **Click "Collaborators"** (left sidebar)

3. **Click "Add people"** button

4. **Enter Abdulaziz's GitHub username or email**

5. **Click "Add [username] to this repository"**

6. **Abdulaziz will receive an email invitation**
   - He needs to accept it to get write access

---

## 🔄 Daily Workflow for Your Team

### Mahendra's Workflow (Backend/K8s)

```bash
# Before starting work
cd hopkinsconnect
git pull origin main

# Make changes to backend/kubernetes files
# ... work on backend ...

# Commit and push
git add backend/ kubernetes/
git commit -m "Add backend API endpoints for user registration"
git push origin main
```

### Abdulaziz's Workflow (Frontend/Docs)

```bash
# Before starting work
cd hopkinsconnect
git pull origin main

# Make changes to frontend/docs
# ... work on frontend ...

# Commit and push
git add frontend/ docs/
git commit -m "Update frontend UI and add architecture diagrams"
git push origin main
```

---

## 🎯 Git Best Practices for Your Team

### DO ✅

```bash
# Pull before you start working
git pull origin main

# Commit frequently with clear messages
git commit -m "Add user authentication JWT logic"

# Push regularly (at least daily)
git push origin main

# Check status often
git status
```

### DON'T ❌

```bash
# Don't commit secrets or passwords
git add kubernetes/*-secret.yaml  # ❌ Bad!

# Don't commit node_modules
git add backend/node_modules/     # ❌ Bad! (blocked by .gitignore)

# Don't commit database files
git add backend/data/*.db         # ❌ Bad! (blocked by .gitignore)

# Don't use vague commit messages
git commit -m "changes"           # ❌ Bad!
git commit -m "fixes"             # ❌ Bad!
```

---

## 🚨 Handling Merge Conflicts

**If you both edit the same file:**

```bash
git pull origin main
# Error: Merge conflict in filename

# Open the file and look for:
<<<<<<< HEAD
Your changes
=======
Partner's changes
>>>>>>> branch-name

# Choose which to keep or combine both
# Remove the <<<, ===, >>> markers

# Commit the resolution
git add filename
git commit -m "Resolve merge conflict in filename"
git push origin main
```

**Prevention tip:** Communicate! Use different files when possible.

---

## 📂 Recommended Folder Ownership

To minimize conflicts, divide work by folder:

**Mahendra focuses on:**
- `backend/` - Your primary responsibility
- `kubernetes/` - Your primary responsibility
- `security/` - Scanning scripts

**Abdulaziz focuses on:**
- `frontend/` - His primary responsibility
- `docs/` - His primary responsibility
- `README.md` - Can both edit (be careful!)

---

## 🔐 Important: Keep Secrets Out of Git!

**Never commit these:**
- ❌ API keys
- ❌ Passwords
- ❌ Private keys
- ❌ JWT secrets
- ❌ Database connection strings
- ❌ CloudLab credentials

**Use Kubernetes Secrets instead:**
```yaml
# kubernetes/secrets.yaml - This is OK to commit (template)
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  JWT_SECRET: "CHANGE_THIS_IN_PRODUCTION"
  DB_PASSWORD: "CHANGE_THIS_IN_PRODUCTION"
```

**For real deployment, create actual secret manually:**
```bash
kubectl create secret generic app-secrets \
  --from-literal=JWT_SECRET='<real-secret>' \
  --from-literal=DB_PASSWORD='<real-password>'
```

---

## 🎓 Git Commands Cheat Sheet

```bash
# Check status
git status

# See what changed
git diff

# Add specific files
git add backend/server.js frontend/public/index.html

# Add all changes
git add .

# Commit with message
git commit -m "Your descriptive message here"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes (CAREFUL!)
git checkout -- filename

# Create a branch (optional, for larger features)
git checkout -b feature-messaging
git push origin feature-messaging
```

---

## 📱 GitHub Desktop (Optional Easy Alternative)

If command line is confusing, you can use **GitHub Desktop:**

1. Download: https://desktop.github.com
2. Login with GitHub account
3. Add local repository: File → Add Local Repository
4. Use GUI to commit and push

**But command line is better for learning!** 💪

---

## ✅ Verification Checklist

After setup, you should have:

- [ ] Repository created on GitHub
- [ ] Local git connected to GitHub remote
- [ ] Initial commit pushed successfully
- [ ] README.md visible on GitHub
- [ ] Partner added as collaborator
- [ ] Both can clone/pull/push
- [ ] Screenshot of GitHub repo taken

---

## 🎯 Next Steps After GitHub Setup

1. **Start copying code** from `SIMPLE_STACK.md` into proper files
2. **Commit after each working component:**
   ```bash
   git add backend/
   git commit -m "Add backend server with SQLite database"
   git push origin main
   ```
3. **Test locally** before pushing
4. **Communicate with partner** about what you're working on
5. **Pull regularly** to get partner's updates

---

## 🆘 Troubleshooting

### Problem: "Permission denied (publickey)"
**Solution:** Setup SSH key or use HTTPS URL

```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/yourusername/hopkinsconnect.git
```

### Problem: "failed to push some refs"
**Solution:** Pull first, then push

```bash
git pull origin main --rebase
git push origin main
```

### Problem: "Merge conflict"
**Solution:** See "Handling Merge Conflicts" section above

### Problem: "Too large file"
**Solution:** Don't commit large files. Check .gitignore

```bash
# Remove accidentally added large file
git rm --cached path/to/large/file
git commit -m "Remove large file"
```

---

## 📞 Need Help?

- **Git Documentation:** https://git-scm.com/doc
- **GitHub Guides:** https://guides.github.com
- **Git Cheat Sheet:** https://education.github.com/git-cheat-sheet-education.pdf

---

**You're all set! 🎉**

Now go create that GitHub repository and start collaborating!

