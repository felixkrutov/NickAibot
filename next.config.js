/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Убираем старый export (он нужен только для GitHub Pages)
  // 2. Никаких basePath/assetPrefix не задаём
  images: { unoptimized: true }   // ← это оставляем, иначе ругнётся на Supabase‑аватары
};

module.exports = nextConfig;
