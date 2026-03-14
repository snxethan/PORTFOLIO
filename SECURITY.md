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

This portfolio application includes layered security measures:

### API Security
- **Rate Limiting:** `POST /api/contact` enforces per-IP throttling (1 request/minute)
- **Environment Variables:** Sensitive credentials (Spotify, SMTP) are stored outside source control
- **Input Validation:** Contact form payloads are validated server-side before processing
- **Defensive Error Handling:** Spotify routes validate response content type before JSON parsing

### Authentication & Token Handling
- **OAuth 2.0:** Spotify integration uses authorization code + refresh token flow
- **Token Scope:** Access tokens are obtained server-side on demand and not persisted client-side
- **Least Exposure:** Spotify endpoint URLs are co-located within route handlers to reduce config sprawl

### Form & Client Safety
- **Contact Form Security:** Server-side validation and authenticated mail transport (Nodemailer + Gmail app password)
- **External Link Guard:** Outbound links are routed through a confirmation modal
- **Limited Client Persistence:** UI preferences use timed local storage via `timedStorage` utility

### Platform Security
- **HTTPS:** Production deployment uses HTTPS on Vercel
- **Dependency Hygiene:** Regular lint/build/typecheck and dependency review
- **No User Account System:** No password database or user-auth session store in this project

## Known Issues & Mitigations

### PDF Rendering Risk (Historical)
- **Status:** Monitored; historical PDF.js advisory was mitigated
- **Current Mitigation:** Resume and certification PDFs are trusted/self-hosted assets only
- **Implementation Detail:** PDF preview support is intentionally restricted on unsupported platforms
- **Reference:** See `SECURITY_ADVISORY.md` for full history and monitoring notes

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

- **Last Full Audit:** March 2026
- **Last Dependency Update Review:** March 2026
- **Last Security Review:** March 2026

---

**Last Updated:** March 14, 2026
