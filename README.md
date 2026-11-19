# coldd staff training

Internal training site for coldd Development. Each department (Customer Service, Moderation, Community Management) is behind its own password. After entering it, staff take a mixed-format assessment, get a skill radar and score graphs, then work through interactive exercises ordered by their weakest area.

Static site, no build step. Progress is stored in the browser only.

## Passwords
Passwords are stored as SHA-256 hashes in `data.js` (`pw` on each team), never in plain text. The hash is of `teamid:password`, where the team id is `cs`, `mod` or `cm`.

To change one:

    printf 'cs:your-new-password' | sha256sum

Paste the result into the `pw` field for that team.

This is a simple access gate, not real security. The site is static, so anyone determined could read the code. Do not put anything confidential in this repo.

## Editing content
Everything lives in `data.js`. Each team has `bg` (profile questions), `qs` (scored questions, each with a type `t`) and `ex` (exercises, each with a kind `k`). `c` is the index of the competency in `comps`.
