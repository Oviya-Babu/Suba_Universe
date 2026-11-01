# A Little Universe Called Subashree 💜

> A bespoke, mobile-first interactive birthday ceremony and memory scrapbook from **Oviya B.** to her best friend **Subashree** (Birthday: **4 November**).

---

## 🌟 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Local Development
```bash
# Install dependencies
npm install

# Start local development server (with hot reload)
npm run dev

# Open on your phone (same Wi-Fi network)
npm run dev -- --host
```

### 3. Production Build & Test
```bash
# Run asset & content checks
npm run validate
npm run check-assets

# Compile production bundle into dist/
npm run build

# Preview the production build locally
npm run preview -- --host
```

---

## 🛠️ The 4-Step Editing Loop (Change Anything Without Code!)

All personal words, song playlists, photos, and UI copy live inside `src/content/*.json`. You **never** need to touch TypeScript or CSS to edit text or replace media.

```bash
# Step 1: Edit any JSON file in src/content/ or drop new photos/songs into public/assets/
# Step 2: Validate consistency
npm run validate

# Step 3: Check all required media assets exist
npm run check-assets

# Step 4: Rebuild and preview
npm run build
npm run preview
```

### Where to Change What:

| I want to edit... | File to update | Key fields |
|---|---|---|
| **Birthday Date / Friend Name** | `src/content/site.json` | `friendName`, `fromName`, `birthday`, `candleCount` |
| **All UI Text & Prompts** | `src/content/copy.json` | `entrance`, `countdown`, `cake`, `blessing`, `ui` |
| **Playlist (7 Songs)** | `src/content/playlist.json` | `title`, `artist`, `note` ("Oviya's note"), `src` |
| **Photos & Captions (37 Photos)** | `src/content/photos.json` | `caption`, `alt`, `featured` (for constellation collage) |
| **Video Memories (4 Clips)** | `src/content/videos.json` | `title`, `caption`, `alt` |
| **A Letter From Oviya** | `src/content/letter.json` | `paragraphs`, `memorySlot`, `closing`, `signature` |
| **Tamil Kavithaigal (Poems)** | `src/content/poems.json` | `titleTa`, `titleEn`, `linesTa`, `linesEn` |
| **Penguin Messages** | `src/content/penguins.json` | `message`, `variant` |
| **Flower Messages** | `src/content/flowers.json` | `message`, `label` |
| **Surprise Arcade** | `src/content/surprises.json` | `giftBoxes`, `scratchCards`, `wheel`, `toleranceLabels` |
| **Friendship Quotes** | `src/content/quotes.json` | Array of quote strings |
| **My Wish For You** | `src/content/wish.json` | `paragraphs` |
| **Final Universe & Hidden P.S.** | `src/content/final.json` | `lines`, `endTitle`, `endSubtitle`, `hiddenMessage` |

---

## 📸 How to Swap or Add Photos

1. Place your new photo inside `public/assets/images/memories/` (e.g. `photo-38.jpg`).
2. Open `src/content/photos.json` and add an entry:
   ```json
   {
     "id": "photo-38",
     "src": "images/memories/photo-38.jpg",
     "alt": "Two friends laughing together at a coffee shop",
     "caption": "A sweet spontaneous memory.",
     "featured": false,
     "size": "medium"
   }
   ```
3. Run `npm run validate && npm run build`.

---

## 🎵 How to Swap or Add Songs

1. Place your `.mp3` or `.m4a` file in `public/assets/audio/playlist/` (e.g. `song-08.mp3`).
2. Open `src/content/playlist.json` and update or append:
   ```json
   {
     "id": "song-08",
     "title": "Song Title",
     "artist": "Artist Name",
     "src": "audio/playlist/song-08.mp3",
     "note": "Why this song is so you 💜"
   }
   ```
3. Run `npm run build`.

---

## 🔒 Security & Privacy Features

- **No Third-Party Requests**: Zero external font calls, zero CDNs, zero analytics trackers, zero cookies.
- **Obscurity & Robots**: Pre-configured `public/robots.txt` and `public/_headers` disallow search indexing (`noindex, nofollow`).
- **Microphone Privacy**: The mic blow feature on the cake only analyzes instantaneous low-frequency audio volume in browser memory. **It is never recorded, stored, or transmitted anywhere.** Tracks are immediately shut down upon completion.
- **EXIF Stripping**: Deployed copies have all GPS coordinates and camera metadata stripped via `npm run optimize`.
- **Deploy `dist/` Only**: Never commit or upload raw original camera files or design screenshots.

---

## 🚀 Deployment Instructions

### Deploying to Netlify (Fastest & Free)

#### Method A: Drag and Drop (No Git needed!)
1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag the generated `dist` folder onto the web page.
4. Once deployed, click **Site configuration** -> **Change site name** to choose an unguessable private name (e.g. `subashree-universe-k7q2.netlify.app`).

#### Method B: Netlify CLI
```bash
npx netlify deploy --dir=dist --prod
```

### Deploying to Vercel (CLI)
```bash
cd dist
npx vercel --prod
```

---

## 📱 Mobile Testing Matrix

Before sharing with Subashree, test the live link on:
- [ ] **Android Chrome** (Check mic blow detection, audio start, Tamil conjunct rendering)
- [ ] **iPhone Safari** (Check audio start on user tap, volume controls, safe areas)
- [ ] **320px–390px Viewports** (Ensure zero horizontal overflow)
- [ ] **Sound Defaults** (Confirm sound starts only after tapping YES)
- [ ] **Tamil Proofread** (Read poems aloud and verify spelling of சுபஸ்ரீ)

