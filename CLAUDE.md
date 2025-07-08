# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Architecture

This is a monorepo containing multiple applications and services:

### Apps Structure
- **portfolio** (current directory) - Astro-based blog/portfolio site
- **coffee** - Another Astro blog site 
- **mtg-backend** - NestJS backend service with PostgreSQL and MikroORM
- **mtg-backend-python** - FastAPI backend service with PostgreSQL and Alembic migrations

### Portfolio App (Astro)
- **Framework**: Astro v5 with TypeScript
- **Content**: Blog posts in Markdown/MDX format stored in `src/content/blog/`
- **Components**: Astro components in `src/components/`
- **Layout**: Page layouts in `src/layouts/`
- **Routing**: File-based routing in `src/pages/`
- **Styling**: Global CSS in `src/styles/global.css`

### MTG Backend Services
The repository contains two backend implementations for MTG (Magic: The Gathering) card data:

**NestJS Backend (mtg-backend)**:
- Uses MikroORM with PostgreSQL
- Scheduled tasks for Scryfall data synchronization
- Module-based architecture (CardsModule)
- Database migrations via MikroORM

**FastAPI Backend (mtg-backend-python)**:
- Uses SQLAlchemy with PostgreSQL
- Alembic for database migrations
- Background schedulers for Scryfall bulk data processing
- Router-based architecture (cards, packs)

## Common Development Commands

### Portfolio App Commands
```bash
# From apps/portfolio directory
npm run dev          # Start development server at localhost:4321
npm run build        # Build production site to ./dist/
npm run preview      # Preview build locally
```

### MTG Backend (NestJS) Commands
```bash
# From apps/mtg-backend directory
npm run start:dev    # Start development server with watch mode
npm run build        # Build the application
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:cov     # Run tests with coverage
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier

# Database migrations
npm run migration:create --name="migration_name"
npm run migration:up
npm run migration:down
```

### MTG Backend (Python) Commands
```bash
# From apps/mtg-backend-python directory
# Note: This project uses Poetry for dependency management
poetry run uvicorn server.main:app --reload  # Start development server
poetry run alembic upgrade head              # Run database migrations
poetry run alembic revision --autogenerate -m "description"  # Create new migration
```

### Root Level Commands
```bash
# From monorepo root
npm test  # Currently returns error - no tests configured at root level
```

## Development Workflow

### Working with Astro Sites (portfolio, coffee)
- Content is managed through Astro's Content Collections
- Blog posts use frontmatter for metadata
- Static assets go in `public/` directory
- Components follow Astro's component syntax (.astro files)

### Working with Backend Services
- Both backends handle MTG card data from Scryfall API
- NestJS backend uses decorators and dependency injection
- FastAPI backend uses async/await patterns with Pydantic models
- Database schemas managed through respective migration systems

### Database Configuration
Both backends expect PostgreSQL connection via environment variables:
- `DATABASE_HOST`
- `DATABASE_NAME` 
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_PORT`

## Key Architectural Patterns

### Astro Content Collections
- Blog content stored in `src/content/blog/`
- Content validation via `src/content.config.ts`
- Type-safe content queries using `getCollection()`

### NestJS Module System
- Feature modules (CardsModule) encapsulate related functionality
- Global configuration module for environment variables
- Scheduled tasks using `@nestjs/schedule`

### FastAPI Router Pattern
- Feature routers (cards, packs) organize endpoints
- Lifespan management for background tasks
- Database operations through SQLAlchemy models

## Testing

### NestJS Backend
- Jest for unit testing
- Supertest for e2e testing
- Coverage reports generated in `../coverage`

### Python Backend
- No test configuration currently present in pyproject.toml

### Astro Sites
- No test configuration currently present