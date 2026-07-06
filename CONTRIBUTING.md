# Contributing to Aana

Thank you for your interest in contributing to Aana! Here's how you can help.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/aana.git`
3. **Create** a feature branch: `git checkout -b feature/your-feature-name`
4. **Follow** the [SETUP.md](./SETUP.md) guide for local development

## Development Workflow

### Setup Local Environment
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your local values (or test values)
# Then start the dev server
npm run dev
```

### Making Changes

1. **Create** a descriptive branch name:
   - `feature/description` - New features
   - `fix/description` - Bug fixes
   - `docs/description` - Documentation
   - `style/description` - Styling changes

2. **Write** clean, well-commented code
3. **Test** your changes locally
4. **Check** code quality:
   ```bash
   npm run lint    # Check for linting errors
   npm run build   # Verify build succeeds
   ```

### Commit Guidelines

Use conventional commits:
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: maintenance tasks
```

### Submitting a Pull Request

1. **Push** to your fork
2. **Create** a Pull Request with:
   - Clear title describing the changes
   - Description of what was changed and why
   - Related issue number (if applicable)
   - Screenshots (for UI changes)

3. **Wait** for CI/CD checks to pass
4. **Respond** to code review feedback
5. **Keep** your PR up-to-date with main

## Code Style

- **TypeScript**: Use proper types, avoid `any`
- **React**: Use functional components and hooks
- **Tailwind**: Use class names, avoid inline styles
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **Comments**: Explain the "why", not the "what"

## Testing

Before submitting a PR:
```bash
# Format your code
npm run lint -- --fix

# Run build to catch errors
npm run build

# Test pages locally
npm run dev
```

## Security

- **Never** commit secrets or `.env` files with real values
- **Use** environment variables for all sensitive data
- **Review** the [SECURITY.md](./SECURITY.md) guide
- **Report** security vulnerabilities privately (don't create public issues)

## Project Structure

```
app/                    # Next.js app directory
├── api/                # API routes
├── admin/              # Admin dashboard pages
├── blog/               # Blog pages
└── [other routes]      # Public pages

components/            # React components
├── admin/              # Admin-specific components
├── blog/               # Blog components
├── layout/             # Layout components
└── ui/                 # Shared UI components

lib/                   # Utility functions and helpers
├── auth.ts            # Authentication logic
├── posts.ts           # Post-related utilities
└── [other utils]      # Other utilities

prisma/                # Database schema and migrations
types/                 # TypeScript type definitions
public/                # Static files
```

## Need Help?

- 📖 **Read**: [SETUP.md](./SETUP.md) for development setup
- 🔐 **Security**: Check [SECURITY.md](./SECURITY.md)
- 💬 **Ask**: Open a discussion or create an issue
- 🐛 **Report Bug**: Use GitHub Issues

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to make Aana better! 🙌
