# coldd staff training

Internal training site for coldd Development. Pick a team (Customer Service, Moderation, Community Management), answer scenario questions, get a level overview and a prioritised set of exercises.

Static site, no build step. Progress is stored in the browser only.

## Editing content

All questions and exercises live in `data.js`. Each team has background questions (`bg`), scored scenario questions (`qs`, options scored 0 to 3), and exercises (`ex`). `c` is the index of the competency in `comps`.
