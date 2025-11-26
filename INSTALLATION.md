# Installation Guide

## Quick Start

Follow these steps to get CoagCompanion running on your local machine:

### Step 1: Prerequisites

Ensure you have the following installed:
- **Node.js** version 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

Verify installations:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
git --version
```

### Step 2: Clone the Repository

```bash
git clone git@github.com:kolesarp1/CoagCompanion.git
cd CoagCompanion
```

### Step 3: Install Dependencies

```bash
npm install
```

**If you encounter issues**, try:
```bash
npm install --legacy-peer-deps
```

**Expected packages** (as defined in package.json):
- Next.js 16.0.4
- React 19.2.0
- TypeScript 5.9.3
- Tailwind CSS 3.4.1
- And 20+ other dependencies for forms, charts, animations, etc.

### Step 4: Run Development Server

```bash
npm run dev
```

The application will start at: [http://localhost:3000](http://localhost:3000)

### Step 5: Build for Production (Optional)

To create an optimized production build:

```bash
npm run build
npm start
```

## Troubleshooting Installation

### Problem: npm install fails with network errors

**Solution 1**: Check your network connection
```bash
npm config get registry  # Should be https://registry.npmjs.org/
```

**Solution 2**: Clear npm cache
```bash
npm cache clean --force
npm install
```

**Solution 3**: Use a different registry (if behind firewall)
```bash
npm config set registry https://registry.npmjs.org/
```

**Solution 4**: Install with legacy peer deps
```bash
npm install --legacy-peer-deps
```

### Problem: TypeScript errors during build

**Solution**: Ensure TypeScript is properly installed
```bash
npm install --save-dev typescript @types/react @types/node
```

### Problem: Tailwind CSS not working

**Solution**: Reinstall Tailwind and dependencies
```bash
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### Problem: Port 3000 already in use

**Solution**: Use a different port
```bash
PORT=3001 npm run dev
```

Or kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## Environment Setup

### Windows

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Open Command Prompt or PowerShell
3. Navigate to project directory
4. Run installation commands

### macOS

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Clone and install
git clone git@github.com:kolesarp1/CoagCompanion.git
cd CoagCompanion
npm install
npm run dev
```

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone git@github.com:kolesarp1/CoagCompanion.git
cd CoagCompanion
npm install
npm run dev
```

## Verifying Installation

After installation, verify everything works:

1. **Homepage**: Navigate to http://localhost:3000
   - Should see welcome screen with stats cards
   - Seed data should be pre-loaded (2 entries from September 2025)

2. **Dashboard**: Click "Dashboard" or visit http://localhost:3000/dashboard
   - Should see charts, stats, and dose suggestion
   - INR predictions should be displayed

3. **Logs**: Click "Logs" or visit http://localhost:3000/logs
   - Should see 2 seed entries
   - Try adding a new log
   - Test edit and delete functions

4. **Dark Mode**: Toggle the theme switch in top-right
   - Page should smoothly transition to dark mode

5. **Export/Import**: On Logs page
   - Click "Export CSV" - should download a CSV file
   - Click "Backup JSON" - should download a JSON file

## Development Tips

### Hot Reload
The dev server supports hot reloading. Changes to files will automatically refresh the browser.

### TypeScript
All files are type-checked. If you see errors, check:
```bash
npx tsc --noEmit
```

### Linting
Run ESLint to check code quality:
```bash
npm run lint
```

### Clear Data
To reset all stored data:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Delete `coag-companion-logs` and `coag-companion-settings`
4. Refresh page

## Next Steps

After successful installation:

1. Read the [README.md](README.md) for full feature documentation
2. Customize the INR target range in your settings (if different from 2.0-3.0)
3. Start logging your daily INR readings and doses
4. Review the dose suggestions (always consult your doctor!)
5. Export your data regularly for backup

## Getting Help

If installation issues persist:
1. Check Node.js and npm versions
2. Review error messages carefully
3. Search for the error on Stack Overflow or GitHub Issues
4. Open an issue on the GitHub repository with:
   - Your OS and Node.js version
   - Complete error message
   - Steps you've tried

---

**Happy tracking! Remember to always consult your healthcare provider for medical decisions.**
