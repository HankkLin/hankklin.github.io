# Han (Hank) Lin — portfolio

Static GitHub Pages site for [HankkLin](https://github.com/HankkLin). The site is dependency-free: `index.html`, `styles.css`, `demo.js`, and `headshot.jpg` are published from the repository root.

## Content and evidence

Professional results and education are based on Han's latest base résumé. Public project details are linked to their GitHub repositories. Internal employer source code, private repository contents, personal addresses, and application records are not published here.

The portfolio leads with project stories: problem framing, documented design decisions, implementation, demo walkthroughs, and limitations. ClimbStream, TC Token Optimizer, and Go Desktop have expanded narratives grounded in their public READMEs; ClimbStream also uses its architecture notes. Suggested research demos are labeled as future work. The narratives explain the implemented designs without inventing interviews, abandoned prototypes, or personal motivations.

The ClimbStream interaction is a JavaScript teaching model of one partition. It demonstrates publish, process/commit, consumer restart, crash before commit, and replay. It does not execute the C++ engine or persist state across page reloads. The accompanying CLI walkthrough points to the actual implementation. Core stories and native disclosure panels work without JavaScript.

## Local preview

Open `index.html` in a browser, or serve this directory with any static file server. No build step is required.

## Publishing

In repository **Settings → Pages**, select **Deploy from a branch**, `main`, and `/(root)`. GitHub Pages will serve the site at <https://hankklin.github.io/>.
