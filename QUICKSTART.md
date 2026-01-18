# barelab - Quick Start Guide

Get barelab running in 5 minutes! ⚡

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- Terminal/Command Line

## Installation

### Step 1: Install Dependencies
```bash
npm install
```
⏱️ Takes ~2 minutes

### Step 2: Setup Database
```bash
npm run prisma:push
```
⏱️ Takes ~10 seconds

### Step 3: Add Sample Data
```bash
npm run seed
```
⏱️ Takes ~20 seconds

### Step 4: Start Server
```bash
npm run dev
```
⏱️ Server starts immediately

## You're Ready! 🎉

Open your browser:

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### Admin Login
- Email: `admin@barelab.com`
- Password: `admin123`

## What's Included?

✅ 4 sample products with images
✅ 20+ user comments
✅ Automatic tag extraction
✅ Complete admin panel
✅ Analytics dashboard
✅ All visualizations working

## Next Steps

1. **Explore the website** - Browse products, view insights
2. **Login to admin** - Add products, manage comments
3. **Add your data** - Replace sample products with real ones
4. **Read SETUP.md** - Full documentation

## Need Help?

- 📖 Full guide: [SETUP.md](./SETUP.md)
- 🏗️ Architecture: [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- 🐛 Issues: Open an issue on GitHub

## One-Command Setup (Unix/Mac)

```bash
./scripts/setup.sh
```

This runs all setup steps automatically!

---

**That's it!** You now have a fully functional cosmetics review platform. 🧪✨
