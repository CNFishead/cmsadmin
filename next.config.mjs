/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  env: {
    API_URL: process.env.API_URL,
    ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
    TINYMCE_API_KEY: process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
    AUTH_URL: `http://localhost:3003/auth/login`,
    SERVICE_NAME: 'ShepherdCMS Admin',
    ENV: process.env.NODE_ENV,
    // ENV: "development",
  },
  //Redirect / to /dash
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
};

export default nextConfig;
