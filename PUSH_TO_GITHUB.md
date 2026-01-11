# 🚀 Push to GitHub Guide

## Steps to Push Your Code to GitHub

### 1. Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Enter repository name: `placement-prep-tracker` (or your preferred name)
5. Add description: "120-Day Placement Preparation Tracker App"
6. Choose **Public** (or Private if you prefer)
7. ❌ Do NOT initialize with README (we already have one)
8. Click **Create repository**

### 2. Connect Local Git to GitHub

After creating the repository, GitHub will show you the commands. Copy and run these in your terminal:

```bash
cd d:\daily progress tracker

# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/placement-prep-tracker.git

# Verify remote
git remote -v
```

### 3. Push Code to GitHub

```bash
cd d:\daily progress tracker

# Push to GitHub (main branch)
git branch -M main
git push -u origin main
```

### 4. (Alternative) Using GitHub CLI

If you have GitHub CLI installed:

```bash
cd d:\daily progress tracker
gh repo create placement-prep-tracker --source=. --public --push
```

## ✅ After Pushing

1. Go to your GitHub repository URL
2. Verify all files are there
3. Check the README displays correctly
4. Share the link: `https://github.com/YOUR-USERNAME/placement-prep-tracker`

## 🔒 Important: Protect Sensitive Data

Make sure `.env` file is:
- ✅ Listed in `.gitignore`
- ✅ Never committed to GitHub
- ✅ Only stored locally

Verify with:
```bash
git status
# Should NOT show .env or .env.* files
```

## 📲 Share Your Project

Once pushed, you can share the GitHub link with:
- Recruiters
- Interviewers
- Friends & family
- Portfolio

## 🔄 Future Updates

After the initial push, to update your code:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

## 🆘 Troubleshooting

### "fatal: 'origin' does not appear to be a repository"
```bash
git remote add origin https://github.com/YOUR-USERNAME/your-repo.git
```

### "Permission denied (publickey)"
Set up GitHub SSH keys:
1. Generate SSH key: `ssh-keygen -t ed25519 -C "your-email@example.com"`
2. Add to GitHub: Settings → SSH and GPG keys → New SSH key
3. Test: `ssh -T git@github.com`

### "fatal: The current branch master has no upstream branch"
```bash
git branch -M main
git push -u origin main
```

---

**You're all set! 🎉 Your code is now on GitHub!**
