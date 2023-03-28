import svg from '@poppanator/sveltekit-svg'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    svg({
      svgoOptions: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeTitle: false,
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
})
