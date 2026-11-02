import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const imageExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

type ImageFolder = 'products' | 'avatars';

function hasValidImageSignature(file: Express.Multer.File): boolean {
  if (file.mimetype === 'image/jpeg') {
    return (
      file.buffer.length >= 3 &&
      file.buffer[0] === 0xff &&
      file.buffer[1] === 0xd8 &&
      file.buffer[2] === 0xff
    );
  }

  if (file.mimetype === 'image/png') {
    return file.buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (file.mimetype === 'image/webp') {
    return (
      file.buffer.length >= 12 &&
      file.buffer.toString('ascii', 0, 4) === 'RIFF' &&
      file.buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }

  return false;
}

export async function uploadImageToStorage(
  file: Express.Multer.File,
  folder: ImageFolder
): Promise<{ key: string; url: string }> {
  const extension = imageExtensions[file.mimetype];
  if (!extension || !hasValidImageSignature(file)) {
    throw ApiError.badRequest('Nội dung tập tin không khớp với định dạng ảnh được hỗ trợ.');
  }

  const key = `${folder}/${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .upload(key, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(key);
  return { key, url: data.publicUrl };
}

export function getKeyFromPublicUrl(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const projectUrl = new URL(env.SUPABASE_URL);
    const publicPath = `/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/`;

    if (url.origin !== projectUrl.origin || !url.pathname.startsWith(publicPath)) {
      return null;
    }

    const encodedKey = url.pathname.slice(publicPath.length);
    const key = encodedKey
      .split('/')
      .map((segment) => decodeURIComponent(segment))
      .join('/');

    return key && !key.split('/').includes('..') ? key : null;
  } catch {
    return null;
  }
}

export async function deleteImages(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).remove(keys);
  if (error) {
    throw new Error(`Supabase Storage delete failed: ${error.message}`);
  }
}
