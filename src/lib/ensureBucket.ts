import type { createAdminClient } from '@/lib/supabase/admin'

// Creates a public Storage bucket on first use so admin upload flows need no
// manual Supabase Dashboard step. Safe to call on every upload — it's a
// no-op once the bucket exists.
export async function ensureBucket(
  admin: ReturnType<typeof createAdminClient>,
  bucket: string,
  opts: { fileSizeLimitBytes: number; allowedMimeTypes?: string[] },
) {
  const { error } = await admin.storage.getBucket(bucket)
  if (error) {
    await admin.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: opts.fileSizeLimitBytes,
      allowedMimeTypes: opts.allowedMimeTypes,
    })
  }
}
