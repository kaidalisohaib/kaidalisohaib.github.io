# kaidalisohaib.github.io

My portfolio: <https://kaidalisohaib.github.io>

Plain HTML, CSS and JavaScript. There is no build step and there are no dependencies.

```
index.html            home page
work/*.html           one case study per main project
assets/css/site.css   all styles (light and dark theme)
assets/js/site.js     theme toggle, video autoplay on scroll, the pole-balancing demo
assets/media/         videos (H.264 mp4 + jpg poster) and images
assets/documents/     CV (PDF)
sw.js                 removes the service worker the old site installed; delete after a few months
```

## Preview locally

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

Links are root-relative (`/assets/...`), so open it through a server, not as a file.

## Adding a video

```bash
ffmpeg -i in.mp4 -an -vf "scale=720:-2" -c:v libx264 -crf 27 -preset slow -pix_fmt yuv420p -movflags +faststart assets/media/name.mp4
ffmpeg -ss 2 -i assets/media/name.mp4 -frames:v 1 -q:v 4 assets/media/name.jpg
```

Pushing to `main` deploys to GitHub Pages.
