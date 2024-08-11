// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server:{
//     proxy:{
//       '/api':
//     }
//   }

// })

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";
import react from "@vitejs/plugin-react";

export default {
  plugins: [react()],
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    // loaders: {
    //   // ".js": "jsx", // Set the loader for .js files to 'jsx'
    // },
  },
};
