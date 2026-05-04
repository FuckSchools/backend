# PRISMA MODELS

## OVERVIEW
Split Prisma schema: models in `prisma/models/*.prisma`, generator outputs to `generated/prisma/`.

## STRUCTURE
```
prisma/
├── schema.prisma       # Generator block only
└── models/           # Split models (users, projects, nodes, sessions, threads, messages)
    ├── users.prisma
    ├── projects.prisma
    ├── nodes.prisma
    ├── sessions.prisma
    ├── threads.prisma
    └── messages.prisma
```

## CONVENTIONS
- **Custom Generation**: `output = "../generated/prisma"` in schema.prisma
- **Node Relations**: Node relates to `Project` + `NodeContext`
- **Generator**: `prisma-client` provider

## ANTI-PATTERNS

- **DO NOT** import `@prisma/client` directly — use `generated/prisma/client.js`
- **DO NOT** edit `generated/prisma/` — update `.prisma` → regenerate

## NOTES

- **No CI**: Test/build not wired to GitHub Actions
- **Split model**: Generator in schema.prisma, models in `prisma/models/*.prisma`
- **Gen output**: `generated/prisma/` (DO NOT EDIT)

## COMMANDS
```bash
npx prisma generate  # Regenerate client
npx prisma format  # Format schemas
npx prisma db push # Push schema to database
```
