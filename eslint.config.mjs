import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "prisma/migrations/**", "desktop-bundle/**", "dist-desktop/**"],
  },
];

export default config;
