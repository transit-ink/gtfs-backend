import { resolve } from "path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginRadar } from 'vite-plugin-radar';
import htmlPlugin from 'vite-plugin-html-config';

interface IHTMLTag {
  [key: string]: string;
}

const htmlPluginOptions = process.env.NODE_ENV !== "development" ? {} : {
  metas: [
    {
      name: 'Content-Security-Policy',
      content: `default-src *.bengawalk.com *.sentry.io *.mapbox.com maps.googleapis.com *.google-analytics.com 'self';
        img-src * 'self' data:;
        style-src *.mapbox.com fonts.googleapis.com 'unsafe-inline' 'self';
        font-src fonts.gstatic.com;
        worker-src 'self' blob:;`,
    }
  ] as IHTMLTag[],
};

export default defineConfig({
  envDir: resolve(__dirname),
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
    }),
    VitePluginRadar({
      // Google Analytics tag injection
      analytics: {
        id: 'G-PEVSJ5Y1KM',
      },
    }),
    htmlPlugin(htmlPluginOptions)
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}) 