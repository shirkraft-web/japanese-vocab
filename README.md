# Japanese Vocabulary Quiz

Static site. Multiple-choice drill: shows a word as **japanglish** (romaji) or
**Hebrew**, reads the Japanese aloud, you pick the matching answer in the other
language. Right/wrong answers play a short 8-bit sound (toggle with the 🔊 button
in the stat bar). Second tab lists every word grouped by topic.

Per-browser `localStorage` holds the weak-word history plus your XP and streak
(`+10` XP per correct answer; the streak grows on every correct answer and resets
to 0 on any wrong one). Clearing browser data resets all of it.

## Files

- `index.html` — the whole app.
- `vocab.json` — the word list you edit by hand.

## Adding words

Edit `vocab.json`. It is a JSON array; every entry needs all five string fields:

```json
{
  "topic":   "professions",
  "kana":    "せんせい",
  "romaji":  "sensei",
  "hebrew":  "מורה",
  "hint":    "sen-SÉI — a teacher SAYs things"
}
```

- `topic` — groups the word in the picker and the Vocabulary tab. Free text.
- `kana` — hiragana/katakana. Spoken aloud (ja-JP) and shown next to the romaji.
- `romaji` — the "japanglish" pronunciation. Also the word's identity for progress.
- `hebrew` — the Hebrew meaning.
- `hint` — mnemonic shown when you answer wrong. May be `""` but the key must exist.

JSON has no comments and no trailing commas. If a row is malformed the app shows an
error banner listing the bad rows and does not start the quiz.

## Running locally

Browsers block a `file://` page from reading `vocab.json`, so use a tiny server:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

(or `npx serve` — anything that serves the folder over HTTP).

## Publishing on GitHub Pages

One-time setup (needs `git` installed and a GitHub account):

```bash
cd "C:/Users/User/Documents/claude code/japanese-vocab"
git init
git add .
git commit -m "Japanese vocab quiz"
# create an empty repo on github.com (e.g. named japanese-vocab), then:
git remote add origin https://github.com/<you>/japanese-vocab.git
git branch -M main
git push -u origin main
```

Then enable Pages: repo → **Settings → Pages → Source: Deploy from a branch →
`main` / `/(root)` → Save**. Live in about a minute at
`https://<you>.github.io/japanese-vocab/` — send that link; it works on phones.

### Editing the vocabulary after it's live

On github.com: open the repo → click `vocab.json` → the pencil (Edit) → change the
words → **Commit changes**. The site rebuilds in ~30–60 seconds; reload the page
(hard-refresh) to see the update. This works from a phone browser too — no local
tools, no re-upload.

Keep the JSON valid (no trailing comma, all five keys per entry). A broken file
makes the app show its red error banner instead of starting.

Share the resulting URL. Spoken words depend on the viewer's browser/OS having a
Japanese voice; the answer sound effects and the quiz itself work either way.

Visual theme is a Shōwa-era retro-poster style (cream paper, burnt orange + ink,
grain, hard shadows). Display and Japanese fonts (Anton, DM Sans, Reggae One) load
from Google Fonts with a system fallback, so it still renders offline — the
Japanese font subset is large, so first load over a slow link may briefly show the
fallback face.
