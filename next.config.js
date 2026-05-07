/** @type {import('next').NextConfig} */

const isDev =
  process.env.NODE_ENV ===
  'development'

const withPWA =
  require('next-pwa')({
    dest: 'public',
    disable: isDev,
  })

module.exports =
  withPWA({
    reactStrictMode: true,
  })