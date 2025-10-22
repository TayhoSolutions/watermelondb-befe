# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability, please report it to us as described below.

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via:

-   Opening a private security advisory on GitHub
-   Or by email to the maintainers (check package.json for contact information)

Please include the following information in your report:

-   Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
-   Full paths of source file(s) related to the manifestation of the issue
-   The location of the affected source code (tag/branch/commit or direct URL)
-   Any special configuration required to reproduce the issue
-   Step-by-step instructions to reproduce the issue
-   Proof-of-concept or exploit code (if possible)
-   Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## Security Best Practices

When deploying this application:

1. **Environment Variables**: Never commit `.env` files with real credentials
2. **JWT Secrets**: Use strong, randomly generated secrets for JWT_SECRET and JWT_REFRESH_SECRET
3. **Database**: Use strong passwords and restrict database access
4. **HTTPS**: Always use HTTPS in production
5. **Updates**: Keep all dependencies up to date
6. **Access Control**: Implement proper authentication and authorization
7. **Rate Limiting**: Consider implementing rate limiting for API endpoints
8. **Input Validation**: All user inputs are validated, but review for your use case

## Sensitive Files

The following files should NEVER be committed:

-   `.env`, `.env.development`, `.env.production`
-   `*.key`, `*.pem`, `*.crt` (SSL certificates)
-   `*.jks`, `*.keystore` (Android keystores)
-   Any file containing credentials, API keys, or secrets

Always use `.env.example` as a template and create your own `.env` files locally.
