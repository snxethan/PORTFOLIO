# Security Policy

## Supported Versions

This project is a personal portfolio application. Security updates are provided for the latest version only.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this portfolio application, please report it responsibly by contacting:

**Email:** snxethan@gmail.com

### What to include in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if available)

### What to expect:
- **Response Time:** You will receive an acknowledgment within 48 hours
- **Updates:** Regular updates will be provided as the vulnerability is investigated
- **Resolution:** Valid vulnerabilities will be addressed as quickly as possible

## Security Features

This portfolio application includes several security measures:

### API Security
- **Rate Limiting:** API endpoints implement rate limiting to prevent abuse
- **Environment Variables:** Sensitive data (API keys, tokens) are stored securely in environment variables
- **Input Validation:** All user inputs are validated and sanitized

### Form Security
- **Contact Form:** Secure form handling with server-side validation
- **Email Security:** Contact form submissions are processed securely via authenticated email service

### External Integrations
- **Spotify API:** OAuth 2.0 authentication with secure token management
- **Third-party APIs:** All external API calls are made securely with proper authentication

### General Security
- **HTTPS:** All production deployments use HTTPS encryption
- **Security Headers:** Appropriate security headers are configured
- **Dependency Management:** Regular dependency updates and security audits

## Responsible Disclosure

We are committed to working with security researchers and the community to verify and address security vulnerabilities. We ask that you:

1. **Give us reasonable time** to investigate and fix the issue before any public disclosure
2. **Do not access or modify data** that doesn't belong to you
3. **Do not perform actions** that could negatively affect the service or its users
4. **Only interact with accounts you own** or with explicit permission from the account holder

## Security Contact

For security-related inquiries, please contact:
- **Email:** snxethan@gmail.com
- **Preferred Languages:** English
- **Security.txt:** Available at `/.well-known/security.txt`

## Additional Resources

- **Repository:** [https://github.com/snxethan/Portfolio](https://github.com/snxethan/Portfolio)
- **Website:** [https://www.snxethan.dev](https://www.snxethan.dev)
- **Security.txt:** [https://www.snxethan.dev/.well-known/security.txt](https://www.snxethan.dev/.well-known/security.txt)