import * as crypto from 'crypto';

export class JwtEngine {
  private static readonly SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_32_chars_long!';

  static sign(payload: any, expiresInSeconds: number): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = {
      ...payload,
      iat: now,
      exp: now + expiresInSeconds,
    };

    const encodedHeader = this.base64url(JSON.stringify(header));
    const encodedPayload = this.base64url(JSON.stringify(fullPayload));

    const signature = this.hmac(`${encodedHeader}.${encodedPayload}`);
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static verify(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = this.hmac(`${encodedHeader}.${encodedPayload}`);

    if (signature !== expectedSignature) {
      return null;
    }

    const payloadStr = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    try {
      const payload = JSON.parse(payloadStr);
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return null; // Expired
      }
      return payload;
    } catch {
      return null;
    }
  }

  private static base64url(str: string): string {
    return Buffer.from(str, 'utf8').toString('base64url');
  }

  private static hmac(data: string): string {
    return crypto
      .createHmac('sha256', this.SECRET)
      .update(data)
      .digest('base64url');
  }
}
