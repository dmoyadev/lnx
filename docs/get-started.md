# Get started

## Installation
1. Install the library
   ::: code-group
   ```bash [pnpm]
   $ pnpm install lnxjs-components
   ```
   ```bash [npm]
   $ npm install lnxjs-components
   ```
   ```bash [yarn]
   $ yarn add lnxjs-components
   ```
   :::
2. In your entry file (usually `main.js` or `main.ts`), import the library base:
   ::: code-group
   ```ts [./main.ts]
   import { createApp } from 'vue'
   import App from './App.vue'
   
   import 'lnxjs-components/dist/base.css'; // [!code ++]
   
   createApp(App).mount('#app')
   ```
   :::
3. Set the `data-theme` attribute in your `html` tag to the theme you want to use:
   ::: code-group
   ```html [./index.html] {2}
   <!DOCTYPE html>
   <html lang=""> <!-- [!code --] -->
   <html lang="" data-theme="bobcat"> <!-- [!code ++] -->
     <head>
       <meta charset="UTF-8">
       <link rel="icon" href="/favicon.ico">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Vite App</title>
     </head>
     <body>
       <div id="app"></div>
       <script type="module" src="/src/main.ts"></script>
     </body>
   </html>
   ```
   :::
4. If you don't want to use default themes, create a .scss file where you want with your custom css variables:
   ::: code-group
   ```scss [custom-theme.scss]
   :root {
     --lnx-color-primary: <whatever>;
     --lnx-color-primary-light: <whatever>;
     --lnx-color-primary-dark: <whatever>;
     --lnx-color-primary-accent: <whatever>;
     /* ... */
   }
   ```
   :::
   And then import it in your entry file:
   ::: code-group
   ```ts [./main.ts]
   import { createApp } from 'vue'
   import App from './App.vue'
   
   import 'lnxjs-components/dist/base.css';
   import 'custom-theme.css'; // [!code ++]
   
   createApp(App).mount('#app')
   ```
   :::
   > [!TIP]
   > You can check available css variables in each theme docs for global styles or in each component docs for component-specific styles