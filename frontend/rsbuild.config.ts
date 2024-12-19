import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: {
      index: './src/main.tsx',
    },
  },
  html: {
    template: './index.html',
  },
  server: {
    port: 5173,
  },
  output: {
    copy: [{ from: './images', to: 'images' }],
  },
  tools: {
    rspack: {
      module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif|svg|ico)$/i,
            type: 'asset/resource',
          },
        ],
      },
    },
  },
});
