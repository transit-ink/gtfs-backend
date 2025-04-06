/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string;
  readonly VITE_PUBLIC_BACKEND_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 