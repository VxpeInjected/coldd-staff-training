# coldd staff training

Internal training site for coldd Development. Pick a team (Customer Service, Moderation, Community Management), take a mixed-format assessment, get a skill radar and score graphs, then work through interactive exercises ordered by your weakest area.

Static site, no build step. Progress is stored in the browser only.

## Question types
single choice, select all, ordering, spot the problems, self rating (compared with tested results on the radar).

## Exercise types
simulation (live meter), builder, ordering, flashcards, writing with self-check.

## Editing content
Everything lives in `data.js`. Each team has `bg` (profile questions), `qs` (scored questions, each with a type `t`), and `ex` (exercises, each with a kind `k`). `c` is the index of the competency in `comps`.
