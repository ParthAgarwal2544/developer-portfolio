# Sketch Hall – 3D developer portfolio

A walkable, hand-drawn 3D corridor. Scroll (or swipe / use ↑ ↓) to walk down the hall. Doors lead to **Work**, **About** and **Contact** rooms. Sketches on the walls "paint themselves in" as you approach.

Built with React, Vite, React Three Fiber, GSAP and a small custom GLSL shader. All artwork is drawn procedurally on canvas, so there are no image assets.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Make it yours

1. **Content** – edit `src/content.js` (name, bio, skills, projects, socials). Project titles also appear on the framed sketches in the hall.
2. **Page title / meta** – edit `index.html`.
3. **Doors and layout** – `src/world.js` (door positions, colors, frame positions).
4. **Look** – paper textures and doodles are in `src/textures.js`; colors and fonts in `src/styles.css`.
5. **Deploy** – push to GitHub and import the repo in Vercel or Netlify (build command `npm run build`, output `dist`).

## Notes

- Needs WebGL. Mobile works with swipe-to-walk.
- Colors in the hall come from `ROOMS[].color` and `FRAMES[].color` in `src/world.js`.
