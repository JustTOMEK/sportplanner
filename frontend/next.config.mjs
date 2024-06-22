/** @type {import('next').NextConfig} */
const nextConfig = {
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
