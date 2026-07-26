import sharp from 'sharp'

// Re-encodes an uploaded photo as a size-capped, compressed JPEG so storage
// and page weight stay small regardless of what the admin's camera/phone produced.
export async function compressImage(
  input: Uint8Array,
  maxDimension = 1600,
): Promise<{ buffer: Buffer; contentType: string }> {
  const buffer = await sharp(Buffer.from(input))
    .rotate() // apply EXIF orientation, then strip it
    .resize({ width: maxDimension, height: maxDimension, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()

  return { buffer, contentType: 'image/jpeg' }
}
