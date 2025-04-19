/** @type {import('next').NextConfig} */
const nextConfig = {
  // говорим Next.js, что нужно делать статический экспорт
  output: 'export',
  // добавляем под‑путь, совпадающий с именем репозитория
  basePath: '/nickai-chatgpt-style',
  assetPrefix: '/nickai-chatgpt-style',
};

module.exports = nextConfig;
