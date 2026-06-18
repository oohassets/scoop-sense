# Scoop Sense — Install on Android (PWA)

All five files in this folder must be kept together:

```
scoop-sense.html
manifest.json
sw.js
icon-192.png
icon-512.png
```

---

## Option A — GitHub Pages (free, easiest, no account needed beyond GitHub)

1. Go to https://github.com and create a free account if you don't have one.
2. Click **+** → **New repository** → name it `scoop-sense` → set to **Public** → Create.
3. Click **Add file → Upload files** and drag all five files in. Commit.
4. Go to **Settings → Pages → Branch: main → / (root) → Save**.
5. After ~60 seconds your URL appears:
   `https://YOUR-USERNAME.github.io/scoop-sense/scoop-sense.html`

**On your Android device:**
1. Open that URL in **Chrome**.
2. Tap the ⋮ menu → **"Add to Home screen"** → Install.
3. Open from your home screen — it launches fullscreen, no browser bar.

---

## Option B — Netlify Drop (drag and drop, no account)

1. Go to https://app.netlify.com/drop
2. Drag the whole folder onto the page.
3. Netlify gives you a live HTTPS URL instantly.
4. Follow the same Chrome → Add to Home Screen steps above.

---

## Option C — Run locally with a USB cable (for development)

You need Node.js installed on your computer.

```bash
# Install a simple local server
npm install -g serve

# Navigate to the folder containing the five files
cd /path/to/scoop-sense-folder

# Start the server
serve .
```

Then on your computer open Chrome DevTools:
- Go to `chrome://inspect/#devices`
- Enable USB debugging on your Android phone (Settings → Developer options)
- Connect via USB and forward port 3000:
  `adb forward tcp:3000 tcp:3000`
- On your phone open `http://localhost:3000/scoop-sense.html`
- Add to home screen as above.

---

## Camera permissions on Android

When you open the app for the first time Chrome will ask for camera access.
Tap **Allow**. If you accidentally denied it:

Settings → Apps → Chrome → Permissions → Camera → Allow

---

## Kiosk / always-on screen tip

For a fixed display kiosk:
1. Install the app via Add to Home Screen.
2. Go to Android **Settings → Display → Screen timeout** → set to **Never** (or use a kiosk lock app).
3. Open Scoop Sense from the home screen icon — it launches fullscreen automatically.

---

## Offline support

Once installed and opened once, the app shell is cached by the service worker.
The detection models are cached on first load too. After that the app works
with no internet connection (camera feed and all local detection still work).
Export features (CSV/JSON/HTML report) work fully offline.
