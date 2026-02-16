# Contributing to Tarot Online

Thank you for your interest in contributing to Tarot Online! This document outlines the development workflow and guidelines that all contributors must follow.

## Development Workflow

### 1. All Code Must Be Reviewed Before Pushing

**After completing any implementation, code MUST be reviewed before pushing.** No code should be pushed directly to the `master` branch. All changes must go through the Pull Request (PR) process.

### 2. Use Pull Requests for All Changes

- Create a feature branch from `master` for your work
- Branch naming convention: `feature/<description>`, `fix/<description>`, or `chore/<description>`
- Open a Pull Request when your work is ready for review
- PRs must receive at least one approval before merging

### 3. Self-Review Checklist

Before submitting a PR, review your own code and confirm the following:

- [ ] Code compiles without errors (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] No debug code, `console.log`, or temporary comments left in
- [ ] TypeScript types are properly defined (no `any` unless justified)
- [ ] Components follow the project's naming conventions (PascalCase for components, kebab-case for files)
- [ ] New features include appropriate error handling
- [ ] UI changes are tested across different screen sizes
- [ ] Environment variables are documented if added
- [ ] No sensitive data (API keys, credentials) is committed

### 4. Code Review Process

#### For Authors:
- Write a clear PR description explaining **what** changed and **why**
- Keep PRs focused and small — one feature or fix per PR
- Respond to review comments promptly
- Request re-review after making changes

#### For Reviewers:
- Review within 24 hours when possible
- Check for correctness, readability, and adherence to project conventions
- Verify TypeScript types and error handling
- Test the changes locally if the PR affects UI or API behavior
- Leave constructive, specific feedback

## Code Style

Refer to [AGENTS.md](./AGENTS.md) for detailed code style guidelines, project structure, and naming conventions.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure required variables:

```
GEMINI_API_KEY=your_gemini_api_key
```
