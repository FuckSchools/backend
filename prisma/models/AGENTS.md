# PRISMA MODELS

## OVERVIEW

Split Prisma schema: models in `prisma/models/*.prisma`, generator outputs to `generated/prisma/`.

## STRUCTURE

```
prisma/
├── schema.prisma       # Generator block only
├── config.ts          # Prisma config
└── models/           # Split models
    ├── users.prisma
    ├── projects.prisma
    ├── nodes.prisma
    ├── sessions.prisma
    ├── threads.prisma
    └── messages.prisma
```

## MODELS

| Model      | File          | Relations                |
| ---------- | ------------- | ---------------------- |
| User      | users.prisma  | → Project               |
| Project   | projects.prisma | → User, Session, Node  |
| Node      | nodes.prisma  | → Project, NodeContext |
| Session  | sessions.prisma → Project              |
| Thread   | threads.prisma → Session               |
| Message  | messages.prisma → Thread              |

## CONVENTIONS

- **Custom Generation**: `output = "../generated/prisma"` in schema.prisma
- **Generator**: `prisma-client` provider
- **Split models**: Each domain gets its own .prisma file

## ANTI-PATTERNS

- **DO NOT** import `@prisma/client` directly — use `generated/prisma/client.js`
- **DO NOT** edit `generated/prisma/` — update `.prisma` → regenerate

## COMMANDS

```bash
npx prisma generate  # Regenerate client
npx prisma format   # Format schemas
```