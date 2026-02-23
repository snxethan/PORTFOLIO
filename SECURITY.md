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
- CVE identifier (if applicable)

### What to expect:
- **Response Time:** You will receive an acknowledgment within 48 hours
- **Updates:** Regular updates will be provided as the vulnerability is investigated
- **Resolution:** Valid vulnerabilities will be addressed as quickly as possible
- **Disclosure:** Coordinated disclosure after fix is deployed

## Security Features

This portfolio application includes several security measures:

### API Security
- **Rate Limiting:** API endpoints implement rate limiting to prevent abuse (1 request/minute per IP on contact form)
- **Environment Variables:** Sensitive data (API keys, tokens) are stored securely in environment variables
- **Input Validation:** All user inputs are validated and sanitized
- **CORS Configuration:** Proper Cross-Origin Resource Sharing policies

### Authentication & Authorization
- **OAuth 2.0:** Secure Spotify integration with refresh token management
- **Token Security:** Secure storage and handling of authentication tokens
- **Session Management:** Proper session handling with timeout mechanisms

### Form Security
- **Contact Form:** Secure form handling with server-side validation
- **Email Security:** Contact form submissions are processed securely via authenticated email service (Nodemailer with Gmail SMTP)
- **XSS Protection:** Input sanitization to prevent cross-site scripting attacks
- **CSRF Protection:** Protection against cross-site request forgery

### External Integrations
- **Spotify API:** OAuth 2.0 authentication with secure token management
- **GitHub API:** Read-only public repository access
- **Third-party APIs:** All external API calls are made securely with proper authentication
- **Vercel Analytics:** Privacy-focused analytics without personal data collection

### General Security
- **HTTPS:** All production deployments use HTTPS encryption with SSL certificates
- **Security Headers:** Appropriate security headers are configured (X-Frame-Options, X-Content-Type-Options, CSP)
- **Dependency Management:** Regular dependency updates and security audits via npm audit
- **Code Scanning:** Automated security scanning with CodeQL
- **No Sensitive Data Storage:** No user data or sensitive information stored client-side

## Known Issues & Mitigations

### PDF Viewer Security
- **Status:** Currently monitoring PDF.js vulnerability (See SECURITY_ADVISORY.md)
- **Mitigation:** Only displaying trusted, self-hosted PDF files
- **Action:** Regular monitoring for dependency updates

## Security Best Practices

When contributing to this project:

1. **Never commit sensitive data** (API keys, tokens, passwords)
2. **Use environment variables** for all sensitive configuration
3. **Validate all inputs** both client-side and server-side
4. **Keep dependencies updated** regularly
5. **Run security audits** before submitting PRs (`npm audit`)
6. **Follow secure coding practices** for TypeScript/React
7. **Test authentication flows** thoroughly

## Responsible Disclosure

We are committed to working with security researchers and the community to verify and address security vulnerabilities. We ask that you:

1. **Give us reasonable time** to investigate and fix the issue before any public disclosure (90 days)
2. **Do not access or modify data** that doesn't belong to you
3. **Do not perform actions** that could negatively affect the service or its users
4. **Only interact with accounts you own** or with explicit permission from the account holder
5. **Do not exploit vulnerabilities** beyond the minimum necessary to demonstrate the issue
6. **Do not use automated tools** that generate significant load on the system

## Security Contact

For security-related inquiries, please contact:
- **Email:** snxethan@gmail.com
- **Preferred Languages:** English
- **Security.txt:** Available at `/.well-known/security.txt`
- **Response Time:** Within 48 hours

## Security Updates

Security updates and patches are released as needed. Check the following for updates:
- **GitHub Releases:** [https://github.com/snxethan/Portfolio/releases](https://github.com/snxethan/Portfolio/releases)
- **Security Advisories:** [https://github.com/snxethan/Portfolio/security/advisories](https://github.com/snxethan/Portfolio/security/advisories)
- **Commit History:** Regular security improvements in commit messages

## Scope

### In Scope
- Authentication and authorization vulnerabilities
- API endpoint security issues
- XSS, CSRF, and injection vulnerabilities
- Sensitive data exposure
- Rate limiting bypass
- Dependency vulnerabilities with active exploits

### Out of Scope
- Social engineering attacks
- Physical security
- Denial of Service (DoS/DDoS) attacks
- Issues in third-party services (Spotify, GitHub, Vercel)
- Previously reported issues
- Issues requiring significant user interaction or unlikely scenarios

## Additional Resources

- **Repository:** [https://github.com/snxethan/Portfolio](https://github.com/snxethan/Portfolio)
- **Website:** [https://www.snxethan.dev](https://www.snxethan.dev)
- **Security.txt:** [https://www.snxethan.dev/.well-known/security.txt](https://www.snxethan.dev/.well-known/security.txt)
- **npm Security:** [https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities)

## Security Audit History

- **Last Full Audit:** February 2026
- **Last Dependency Update:** February 2026
- **Last Security Review:** February 2026

---

**Last Updated:** February 16, 2026