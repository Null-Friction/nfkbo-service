# Security Findings Report - NFKBO Service
**Date:** 2025-09-30
**Status:** 4 CRITICAL, 3 HIGH, 4 MEDIUM, 3 LOW

---

## CRITICAL FINDINGS

### 1. Environment Files Committed to Version Control ⚠️
**Severity:** CRITICAL
**File:** `.env.development`, `.env.production`, `.env.test`

**Issue:** These files contain sensitive credentials and are tracked in Git.

**Immediate Actions:**
```bash
# 1. Update .gitignore
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore

# 2. Remove from Git
git rm --cached .env.development .env.production .env.test
git commit -m "security: remove environment files from version control"

# 3. ROTATE ALL SECRETS
- Database passwords
- Bootstrap API keys
- Any other credentials
```

---

### 2. Hash Prefix Timing Attack Vulnerability ⚠️
**Severity:** CRITICAL
**File:** `src/auth/services/api-key.service.ts:130-152`

**Issue:** Bcrypt generates different hashes each time, making `hashPrefix` lookup useless.

**Fix:** Use HMAC-based deterministic lookup
```typescript
import { createHmac } from 'crypto';

// In createApiKey
const lookupKey = createHmac('sha256', SECRET_KEY).update(key).digest('hex').substring(0, 16);

// In validateApiKey
const lookupKey = createHmac('sha256', SECRET_KEY).update(key).digest('hex').substring(0, 16);
const candidate = await this.apiKeyRepository.findOne({ where: { lookupKey, isActive: true } });
```

---

### 3. CORS Wildcard Configuration ⚠️
**Severity:** CRITICAL
**File:** `src/main.ts:17`

**Issue:** `app.enableCors()` allows ANY origin.

**Fix:**
```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = configService.get<string[]>('cors.allowedOrigins') || [];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-api-key'],
});
```

---

### 4. IP Spoofing Vulnerability ⚠️
**Severity:** CRITICAL
**File:** `src/auth/guards/api-key.guard.ts:76-88`

**Issue:** Trusts `X-Forwarded-For` header without validation.

**Fix:**
```typescript
// In main.ts
app.set('trust proxy', 1); // Trust first proxy

// In api-key.guard.ts
private extractIpAddress(request: any): string | undefined {
  return request.ip; // Express validates with trust proxy
}
```

---

## HIGH PRIORITY FINDINGS

### 5. Missing Security Headers (No Helmet)
**Fix:** Install and configure Helmet middleware

### 6. Bootstrap Key in Plaintext Memory
**Fix:** Remove plaintext storage, only keep hashed version

### 7. In-Memory Rate Limiting (Not Distributed)
**Fix:** Migrate to Redis-backed rate limiting

---

## MEDIUM PRIORITY FINDINGS

8. Bcrypt salt rounds = 10 (should be 12)
9. API key generation lacks version/checksum
10. Missing input length validation
11. DB_SYNCHRONIZE configurable in production

---

## LOW PRIORITY FINDINGS

12. console.log in bootstrap
13. Missing request body size limits
14. BigInt type potential overflow

---

See COMPREHENSIVE_CODE_REVIEW_REPORT.md for complete details.
