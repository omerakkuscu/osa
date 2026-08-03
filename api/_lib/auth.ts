import crypto from 'crypto'

export const COOKIE_NAME = 'osa_admin_session'
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 7 // 7 gün

// Oturum imzalama anahtarı SABİTTİR — giriş şifresi (DB'de değiştirilebilir) ile karıştırılmaz.
function getSigningSecret(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD ortam değişkeni tanımlı değil.')
  return secret
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_LIFETIME_MS })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', getSigningSecret()).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, sig] = parts
  let expectedSig: string
  try {
    expectedSig = crypto.createHmac('sha256', getSigningSecret()).update(payloadB64).digest('base64url')
  } catch {
    return false
  }
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expectedSig)
  if (sigBuf.length !== expectedBuf.length) return false
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return false
  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'))
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

// --- Giriş şifresi doğrulama (DB'de kayıtlı hash varsa onu, yoksa ADMIN_PASSWORD env var'ını kullanır) ---

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex')
  const hashBuf = Buffer.from(hash, 'hex')
  const candidateBuf = Buffer.from(candidate, 'hex')
  if (hashBuf.length !== candidateBuf.length) return false
  return crypto.timingSafeEqual(hashBuf, candidateBuf)
}

export function verifyLoginPassword(submitted: string, dbHash: string | null | undefined): boolean {
  if (dbHash) return verifyPasswordHash(submitted, dbHash)
  const envPassword = process.env.ADMIN_PASSWORD
  if (!envPassword) return false
  const a = Buffer.from(submitted)
  const b = Buffer.from(envPassword)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=')
    if (idx === -1) return
    const key = pair.slice(0, idx).trim()
    const value = pair.slice(idx + 1).trim()
    try { out[key] = decodeURIComponent(value) } catch { out[key] = value }
  })
  return out
}
