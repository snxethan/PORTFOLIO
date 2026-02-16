# Security Advisory: Dependency Vulnerabilities

## Status: MONITORING

This document tracks known security vulnerabilities and their mitigation status in the portfolio project.

---

## Current Advisories

### 1. PDF.js Vulnerability (Historical)

**Status:** ✅ MITIGATED

#### Summary
Previously, this project had high severity vulnerabilities related to the `pdfjs-dist` package through `@react-pdf-viewer` dependencies.

#### Issue Details
- **Package**: `pdfjs-dist@2.16.105`
- **Vulnerability**: PDF.js vulnerable to arbitrary JavaScript execution upon opening a malicious PDF
- **Advisory**: [GHSA-wgrm-67xf-hhpq](https://github.com/advisories/GHSA-wgrm-67xf-hhpq)
- **Severity**: High
- **CVE**: Multiple CVEs associated with older PDF.js versions

#### Impact
The PDF viewer implementation could potentially be exploited if a malicious PDF was processed.

#### Affected Components
- `PDFModalViewer.tsx` - PDF modal viewer component
- `Resume.tsx` - Resume PDF display functionality

#### Resolution
**Current Implementation:**
- Using browser native PDF viewer (window.open) for PDF display
- Removed direct dependency on vulnerable `@react-pdf-viewer` packages
- Only displaying trusted, self-hosted PDF files from `/public/resume/` directory
- Implemented device detection to disable PDF viewer on potentially vulnerable platforms (iOS/Safari)

#### Verification
```bash
npm audit --audit-level=high
# Should show no high-severity vulnerabilities related to PDF.js
```

---

## Security Monitoring Process

### Regular Audits
1. **Weekly:** Run `npm audit` to check for new vulnerabilities
2. **Monthly:** Review GitHub Security Advisories
3. **Quarterly:** Full dependency update and security review
4. **As Needed:** Immediate response to critical vulnerabilities

### Tools Used
- `npm audit` - Dependency vulnerability scanning
- GitHub Dependabot - Automated dependency updates
- CodeQL - Static code analysis
- Vercel Security Scanner - Deployment-time scanning

---

## Dependency Security Best Practices

### Current Measures
1. **Minimal Dependencies:** Only essential packages included
2. **Regular Updates:** Dependencies updated monthly
3. **Version Pinning:** Package versions explicitly specified
4. **Audit Before Deploy:** Security audit run before production deployment
5. **No Dev Dependencies in Production:** Only production dependencies deployed

### Monitoring Strategy
```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update dependencies safely
npm update

# Install specific security fixes
npm audit fix
```

---

## Known Low-Priority Issues

### Development Dependencies
Some development-only dependencies may show low or moderate severity issues. These are acceptable because:
- They are not included in production builds
- They don't handle user data
- They run in controlled development environments

**Action:** Monitor and update during regular maintenance windows.

---

## Emergency Response Plan

### Critical Vulnerability Discovered

**Immediate Actions (Within 24 hours):**
1. Assess severity and exploitability
2. Determine affected components
3. Identify available patches or workarounds
4. Deploy emergency fix if actively exploited

**Short-term Actions (Within 1 week):**
1. Update dependencies to patched versions
2. Test thoroughly in staging environment
3. Deploy to production
4. Update security documentation
5. Notify users if data was potentially compromised

**Long-term Actions (Within 1 month):**
1. Review and update security policies
2. Implement additional safeguards
3. Update monitoring and detection systems
4. Conduct security audit of similar components

---

## Vulnerability Disclosure

### If You Discover a Vulnerability

**Please DO:**
- Email details to snxethan@gmail.com
- Include proof of concept (if safe)
- Provide reproduction steps
- Allow 90 days for fix before public disclosure
- Work with us on coordinated disclosure

**Please DON'T:**
- Publicly disclose before fix is available
- Exploit the vulnerability
- Access or modify user data
- Test on production systems without permission

---

## Historical Vulnerabilities Log

| Date | Package | Severity | CVE | Status | Fix |
|------|---------|----------|-----|--------|-----|
| Jan 2025 | pdfjs-dist | High | GHSA-wgrm-67xf-hhpq | ✅ Fixed | Migrated to native PDF viewer |
| - | - | - | - | - | - |

---

## Security Metrics

### Current Status
- **High Severity Vulnerabilities:** 0
- **Medium Severity Vulnerabilities:** 0
- **Low Severity Vulnerabilities:** TBD (non-production only)
- **Last Security Audit:** February 16, 2026
- **Last Dependency Update:** February 16, 2026

### Target Goals
- ✅ Zero high-severity vulnerabilities in production
- ✅ Monthly security audits
- ✅ 48-hour response time for critical issues
- ✅ Automated dependency updates via Dependabot

---

## Additional Resources

### Security Tools
- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub Security Advisories](https://github.com/advisories)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)
- [CVE Database](https://cve.mitre.org/)

### Security Contacts
- **Primary:** snxethan@gmail.com
- **Repository Security:** [GitHub Security Tab](https://github.com/snxethan/Portfolio/security)
- **Response Time:** Within 48 hours

### Related Documentation
- [SECURITY.md](./SECURITY.md) - Security policy and reporting
- [README.md](./README.md) - Project documentation
- [GitHub Security](https://github.com/snxethan/Portfolio/security) - Security advisories

---

## Contribution Guidelines for Security

When contributing to this project:

1. **Run Security Checks:**
   ```bash
   npm audit
   npm run lint
   npm run build
   ```

2. **Review Dependencies:**
   - Check new dependencies for known vulnerabilities
   - Use tools like `npm-check-updates` to verify package health
   - Avoid packages with unpatched critical vulnerabilities

3. **Code Security:**
   - Never commit secrets or API keys
   - Validate all user inputs
   - Use parameterized queries (where applicable)
   - Implement proper error handling
   - Follow OWASP security guidelines

4. **Testing:**
   - Test authentication flows
   - Verify input validation
   - Check for XSS vulnerabilities
   - Test rate limiting

---

**Document Version:** 2.0  
**Last Updated:** February 16, 2026  
**Next Review:** May 16, 2026  
**Maintained By:** Ethan Townsend (@snxethan)