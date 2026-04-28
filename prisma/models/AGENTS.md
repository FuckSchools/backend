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
- **Tree Relations**: Node ↔ Tree ↔ StateOfCompletion strict mapping
- **Generator**: `prisma-client` provider

## ANTI-PATTERNS
- **DO NOT** import `@prisma/client` directly — use `generated/prisma/client.js`
- **DO NOT** edit `generated/prisma/` — update `.prisma` → regenerate

## COMMANDS
```bash
npx prisma generate  # Regenerate client
npx prisma format  # Format schemas
```
