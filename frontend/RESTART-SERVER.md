# Fix Chunk Loading Error - Quick Guide

## Problem
The browser is trying to load JavaScript chunks that don't exist (404 errors).

## Solution

### Step 1: Clear Browser Cache
1. Open your browser's Developer Tools (F12)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload" (or press Ctrl+Shift+R)
4. This clears the browser's cached references to old chunks

### Step 2: Restart Dev Server
Run this command in the frontend directory:

```powershell
npm run dev:next
```

The server will start on port 3000 (or 3001 if 3000 is busy).

### Step 3: Clear Next.js Build Cache (if errors persist)
If you still see errors after the hard refresh:

```powershell
Remove-Item -Recurse -Force .next
npm run dev:next
```

## Why This Happens
- Browser cached old chunk references from a previous build
- Next.js dev server was restarted but browser still has old chunk paths
- Build cache became corrupted during development

## Prevention
- Always do a hard refresh (Ctrl+Shift+R) after restarting the dev server
- Clear `.next` folder if you see persistent 404 errors on chunks

