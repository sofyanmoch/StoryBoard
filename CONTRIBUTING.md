# Contributing to StoryBoard

Thank you for considering contributing to StoryBoard! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/storyboard.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes: `npm run dev` and `npm run build`
6. Commit your changes: `git commit -m 'Add some feature'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Use TypeScript for all new files
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Component Guidelines

- Create reusable components in `src/components/ui/`
- Feature-specific components go in their respective folders
- Use TypeScript interfaces for props
- Add JSDoc comments for public APIs

### State Management

- Use Zustand for global state
- Keep state close to where it's used
- Use React hooks for local component state
- Don't over-centralize state

### Styling

- Use Tailwind CSS utility classes
- Follow the design system colors in `tailwind.config.js`
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

### Performance

- Use Next.js Image for images
- Implement proper loading states
- Avoid unnecessary re-renders
- Use React.memo when appropriate

## Testing

Before submitting a PR:

1. **Run the app**: `npm run dev`
2. **Test all features**: Swipe, filter, modals, licensing
3. **Check responsiveness**: Test on mobile and desktop
4. **Type check**: `npm run type-check`
5. **Build**: `npm run build`

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the CHANGELOG.md (if we have one)
3. Ensure all tests pass and the build succeeds
4. Request review from maintainers
5. Address any feedback
6. Once approved, your PR will be merged

## Reporting Bugs

When reporting bugs, include:

- **Description**: Clear description of the bug
- **Steps to reproduce**: How to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, Node version

## Feature Requests

We welcome feature requests! Please:

- Check if it's already requested in Issues
- Provide a clear use case
- Explain why it would be useful
- Consider submitting a PR if you can implement it

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Give constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Questions?

- Open an issue with the "question" label
- Join the Story Protocol Discord
- Check existing issues and PRs

Thank you for contributing to StoryBoard!
