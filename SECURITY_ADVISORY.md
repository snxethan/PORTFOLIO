# Security Advisory: PDF.js Vulnerability

## Summary
This project currently has 19 high severity vulnerabilities related to the `pdfjs-dist` package and its dependencies through `@react-pdf-viewer`.

## Issue Details
- **Package**: `pdfjs-dist@2.16.105`
- **Vulnerability**: PDF.js vulnerable to arbitrary JavaScript execution upon opening a malicious PDF
- **Advisory**: [GHSA-wgrm-67xf-hhpq](https://github.com/advisories/GHSA-wgrm-67xf-hhpq)
- **Severity**: High

## Impact
The current PDF viewer implementation in this portfolio could potentially be exploited if a malicious PDF is processed.

## Affected Components
- `PDFModalViewer.tsx` - PDF modal viewer component
- `Resume.tsx` - Resume PDF display functionality

## Mitigation Options

### 1. Update Dependencies (Recommended)
The vulnerability is fixed in `pdfjs-dist@5.4.149+`, but the current `@react-pdf-viewer` packages don't support this version yet. 

**Action Required**: Monitor for updates to `@react-pdf-viewer/core` that support newer `pdfjs-dist` versions.

### 2. Alternative PDF Viewer
Consider replacing `@react-pdf-viewer` with alternative PDF viewing solutions:
- Use browser native PDF viewer (window.open)
- Implement PDF.js directly with latest version
- Use alternative React PDF libraries

### 3. Security Hardening
Until the dependency can be updated:
- Only display trusted PDF files
- Validate PDF sources
- Consider server-side PDF processing

## Monitoring
- Check for `@react-pdf-viewer` updates monthly
- Run `npm audit` regularly
- Monitor security advisories for PDF.js

## Last Updated
January 2025