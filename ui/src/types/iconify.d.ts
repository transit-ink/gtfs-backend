declare module "@iconify/react/dist/iconify.js" {
  import { FC } from "react";

  interface IconProps {
    icon: string;
    color?: string;
    width?: number | string;
    height?: number | string;
  }

  export const Icon: FC<IconProps>;
} 