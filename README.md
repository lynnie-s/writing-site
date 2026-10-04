# Tr. Jasmine的寫作法典

A tiny handwriting-practice website for kids learning English. For every word it can:

- **Speak** the word (normal, slow, or spelled out letter by letter)
- **Animate** the writing stroke by stroke, with numbered start points and a moving pen
- **Let the child trace** it with a finger or mouse on four-line handwriting paper

It covers 12 vocabulary lessons plus 10 sets of sight words. No build step, no dependencies,
no backend. It is plain HTML, CSS and JavaScript.

## Run it locally

```bash
cd writing-site
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` directly also works, but a local server is safer.)

## Publish on GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`.
4. Wait a minute, then open the URL GitHub shows you.

## Project structure

```
index.html        page shell and the practice modal
css/style.css     all styling
js/data.js        lessons and sight words (edit this to change content)
js/letters.js     stroke paths for each letter and the layout engine
js/app.js         routing, animation, speech and tracing
```

## Add or change words

Open `js/data.js` and add an entry to a lesson:

```js
W('apple', '蘋果', '🍎'),
```

The arguments are: English text, small Chinese hint, emoji, and an optional color swatch.
Phrases with spaces work, and long phrases wrap onto a second writing line automatically.

## Letters supported

All lowercase letters `a-z`, capital `I` and `T`, and the hyphen. If you need another capital
letter, add a glyph to `G` in `js/letters.js`. Each glyph is a list of strokes, and each stroke
is a list of points in the order a child would draw them. Until a capital exists, the lowercase
shape is used as a fallback.

## Pronunciation

Pronunciation uses the browser's built-in text-to-speech (Web Speech API), so there are no audio
files to host. Voice quality depends on the device. If you later want a consistent teacher voice,
record MP3 files and swap the `Speech.say` function in `js/app.js` to play them.

## Keyboard shortcuts (in the practice window)

| Key | Action |
| --- | --- |
| Space | Watch the animation |
| Left / Right | Previous / next word |
| Esc | Close |
