import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [
        react(),
        svgr({
            svgrOptions: {
                exportType: 'default',
                ref: true,
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false
                                }
                            }
                        }
                    ]
                }
            }
        })
    ],
    css: {
        postcss: './postcss.config.js',
    },
    server: {
        host: true,
        port: 5173,
        strictPort: false,
        cors: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                secure: false,
                ws: true
            },
            '/uploads': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false
            }
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    define: {
        'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://api.skk-rondo.ru')
    },
    envDir: '.'
}); 