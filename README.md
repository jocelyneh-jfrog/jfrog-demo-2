# JFrog Security Demo — Vulnerable NPM Project

A purposely vulnerable Node.js/NPM project for demonstrating JFrog's end-to-end
software supply chain security pipeline.

---

## What This Demo Shows

| Step | JFrog Capability | What Gets Found |
|------|-----------------|-----------------|
| 🔑 Secret Detection | JFrog Advanced Security | AWS keys, API tokens, DB passwords, .env file, private key in `scripts/`, `config/` |
| 🔒 Curation Audit | JFrog Curation | Malicious/risky packages blocked before download |
| 🛠️ Build Info | Artifactory | Full dependency graph, Git context, CI environment captured |
| 🔎 Xray Scan | JFrog Xray | 15+ CVEs across 10 packages, license violations |
| ✅ Attestation | JFrog Evidence | Signed SLSA-style provenance bundle stored in Artifactory |

---

## Vulnerable Packages (15+ CVEs)

| Package | Version | CVE | Severity | Type |
|---------|---------|-----|----------|------|
| lodash | 4.17.4 | CVE-2019-10744 | Critical | Prototype pollution |
| lodash | 4.17.4 | CVE-2018-16487 | High | Deep clone RCE |
| lodash | 4.17.4 | CVE-2021-23337 | High | Template command injection |
| minimist | 1.2.0 | CVE-2020-7598 | Medium | Prototype pollution |
| node-fetch | 2.6.0 | CVE-2022-0235 | High | Open redirect / SSRF |
| handlebars | 4.0.11 | CVE-2019-19919 | Critical | RCE via template injection |
| jsonwebtoken | 8.0.0 | CVE-2018-3721 | High | Algorithm confusion (alg:none) |
| axios | 0.18.0 | CVE-2020-28168 | High | SSRF via redirect |
| marked | 0.3.6 | CVE-2017-16114 | High | ReDoS |
| ejs | 2.6.1 | CVE-2022-29078 | Critical | RCE via template injection |
| ws | 5.1.1 | CVE-2021-32640 | High | ReDoS |
| express | 4.17.1 | CVE-2022-24999 | High | ReDoS |
| serialize-javascript | 1.7.0 | CVE-2019-16769 | High | XSS |
| y18n | 4.0.0 | CVE-2021-23358 | Critical | Prototype pollution |
| tar | 2.2.1 | CVE-2021-37701 | High | Path traversal |

---

## Secrets Intentionally Embedded (for Secret Detection demo)

| File | Secret Type | Variable |
|------|------------|----------|
| `src/index.js` | AWS Access Key | `AWS_ACCESS_KEY` |
| `src/index.js` | AWS Secret Key | `AWS_SECRET_KEY` |
| `src/index.js` | JWT Secret | `JWT_SECRET` |
| `src/index.js` | Stripe Key (test format) | `STRIPE_KEY` |
| `src/index.js` | GitHub Token | `GITHUB_TOKEN` |
| `src/index.js` | SendGrid API Key | `SENDGRID_KEY` |
| `config/database.js` | DB Passwords (prod + staging) | `password` |
| `config/database.js` | MongoDB URI with credentials | `mongo.uri` |
| `config/database.js` | Redis auth token | `redis.password` |
| `config/services.js` | Stripe key | `stripe.secretKey` |
| `config/services.js` | SendGrid key | `sendgrid.apiKey` |
| `config/services.js` | Twilio auth token | `twilio.authToken` |
| `config/services.js` | Slack bot token | `slack.botToken` |
| `config/services.js` | GitHub PAT | `github.token` |
| `scripts/deploy.js` | RSA private key (PEM) | `privateKey` |
| `scripts/deploy.js` | Artifactory API key | `artifactory.apiKey` |
| `scripts/deploy.js` | Kubernetes service token | `kubernetes.token` |
| `scripts/deploy.js` | Docker registry password | `docker.password` |
| `scripts/db-migrate.js` | MySQL root password | `PROD_DB.password` |
| `scripts/db-migrate.js` | MongoDB URI with creds | `MONGO_URI` |
| `.env` | All of the above in .env format | multiple |

> All secrets are fake/non-functional demo values using realistic formats.

---

## Pipeline Flow

```
GitHub Push
    │
    ▼
🔑 Secret Detection     ← Scans all files + git history for leaked secrets
    │
    ▼
🔒 Curation Audit       ← Blocks malicious/risky packages at intake
    │
    ▼
🛠️ Build via Artifactory ← Resolves deps through Artifactory; publishes Build Info
    │
    ▼
🔎 Xray Scan            ← Deep CVE + license analysis on published build
    │
    ▼
✅ Attestation Created   ← Signed evidence bundle stored in Artifactory
```

---

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `JF_URL` | Artifactory base URL e.g. `https://myorg.jfrog.io` |
| `JF_ACCESS_TOKEN` | Artifactory access token with deploy + scan permissions |
| `EVIDENCE_PRIVATE_KEY` | PEM private key for signing the attestation |

---

## Artifactory Setup

1. Create a **remote npm repo** pointing to `https://registry.npmjs.org`
2. Create a **virtual npm repo** named `demo-npm-virtual` aggregating the remote
3. Enable **Xray indexing** on the virtual repo
4. Configure **Curation policies** (malicious package blocking, high CVE threshold)
5. Enable **Advanced Security** (for secret detection)
6. Generate a **signing key pair** and register the public key in Artifactory under
   *Administration → Evidence → Keys* with alias `demo-signing-key`

---

## Local Run (without CI)

```bash
# Install JFrog CLI
curl -fL https://install-cli.jfrog.io | sh

# Configure
jf config add --url=https://myorg.jfrog.io --access-token=<token>

# Secret detection
jf audit --secrets=true --format=table

# Curation audit
jf audit --format=table

# Build with Build Info
jf npmc --repo-resolve demo-npm-virtual
jf npm install --build-name=jfrog-vulnerable-demo --build-number=1
jf rt build-publish jfrog-vulnerable-demo 1

# Xray scan
jf build-scan jfrog-vulnerable-demo 1

# Create attestation
jf evidence create \
  --subject-build-name=jfrog-vulnerable-demo \
  --subject-build-number=1 \
  --predicate=evidence-predicate.json \
  --predicate-type=https://jfrog.com/evidence/build-scan/v1 \
  --key=private.pem \
  --key-alias=demo-signing-key
```
