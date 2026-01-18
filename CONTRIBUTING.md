# Contributing to barelab

Thank you for your interest in contributing to barelab! This document provides guidelines for contributing to the project.

## Core Principles

Before contributing, please understand barelab's core principles:

1. **Data-driven**: All insights must come from real user feedback
2. **Transparent**: Never hide data or methodology
3. **Neutral**: No marketing claims, no sponsored content
4. **Privacy-first**: Anonymize all user data

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, browser)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature aligns with barelab's principles
- Explain the use case and benefits
- Consider how it maintains neutrality and transparency

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**: `git commit -m "Add feature: description"`
6. **Push to your fork**: `git push origin feature/your-feature`
7. **Open a Pull Request**

### Code Style

- Use TypeScript for type safety
- Follow existing code structure
- Write clear, descriptive variable names
- Add comments for complex logic
- Use Prettier for formatting (coming soon)

### Testing

Before submitting:
- Test all user-facing features
- Verify admin panel functionality
- Check mobile responsiveness
- Test with different data scenarios

## Areas for Contribution

### High Priority

- **Tag expansion**: Add more keywords to existing tags
- **Bug fixes**: Any reported issues
- **Performance**: Optimize queries and rendering
- **Accessibility**: Improve a11y compliance
- **Documentation**: Expand guides and comments

### Medium Priority

- **New visualizations**: Additional chart types
- **Export features**: CSV/PDF export of data
- **Search functionality**: Product and comment search
- **Filtering improvements**: More filter options

### Low Priority (Future Features)

- **User authentication**: Public user accounts
- **Review submission**: Public review form
- **Advanced analytics**: More detailed tracking
- **API development**: Public API endpoints

## What We Don't Accept

Please **do not** submit contributions that:

- Add affiliate links or tracking
- Introduce sponsored content features
- Make absolute product claims
- Compromise user privacy
- Add unnecessary dependencies
- Include marketing or advertising features

## Development Setup

See SETUP.md for detailed instructions.

Quick start:
```bash
npm install
npm run prisma:push
npm run seed
npm run dev
```

## Pull Request Process

1. Update README.md if needed
2. Add yourself to contributors list
3. Ensure all tests pass
4. Request review from maintainers
5. Address any feedback
6. Wait for approval and merge

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on what's best for the community
- Show empathy toward others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## Questions?

Open an issue with the "question" label or start a discussion.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make barelab better! 🙏
