/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  webpack: (config, { isServer }) => {
    // Fix case sensitivity issues on Windows
    config.resolve.symlinks = false;
    
    // Disable problematic cache strategies on Windows
    if (config.cache) {
      config.cache = {
        ...config.cache,
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    // Ignore Windows system files and directories to prevent Watchpack errors
    if (!isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/C:/DumpStack.log.tmp',
          '**/C:/System Volume Information/**',
          '**/C:/hiberfil.sys',
          '**/C:/pagefile.sys',
          '**/C:/swapfile.sys',
          '**/C:/$Recycle.Bin/**',
          '**/C:/Recovery/**',
          '**/C:/Windows/**',
        ],
      };
    }
    
    return config;
  },
}

module.exports = nextConfig

