/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/welcome',
                permanent: true,
            },
        ];
    },

    async rewrites() {
        return [
            {
                source: '/event/view',
                destination: '/event/view.tsx',
            },
        ];
    },
};

export default nextConfig;
