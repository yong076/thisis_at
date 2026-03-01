import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

// ─── Lazy-init client (avoid crash when env vars are missing at import time) ──

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    if (!process.env.R2_ACCOUNT_ID) {
      throw new Error('R2_ACCOUNT_ID is not configured');
    }
    _client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

function getBucket(): string {
  return process.env.R2_BUCKET_NAME || 'thisis-at';
}

function getPublicUrl(): string {
  return process.env.R2_PUBLIC_URL || '';
}

// ─── Upload ─────────────────────────────────────────────────────

export async function uploadToR2(file: File, key: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  await getClient().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return `${getPublicUrl()}/${key}`;
}

// ─── Delete ─────────────────────────────────────────────────────

export async function deleteFromR2(url: string): Promise<void> {
  const publicUrl = getPublicUrl();
  if (!publicUrl || !url.startsWith(publicUrl)) return;

  const key = url.slice(publicUrl.length + 1);

  try {
    await getClient().send(
      new DeleteObjectCommand({
        Bucket: getBucket(),
        Key: key,
      }),
    );
  } catch {
    // ignore deletion errors
  }
}
