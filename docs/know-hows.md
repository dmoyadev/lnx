# Know-Hows

## VitePress
### Publishing to GitHub Pages
1. Create a file named `.github/workflows/deploy.yml` with [the build process](https://vitepress.dev/guide/deploy#github-pages)

> [!WARNING]
> Make sure the `base` option in your VitePress is properly configured

2. Create the subdomain
3. Add a `CNAME` file JUST with the subdomain name
4. In your repository's settings under "Pages" menu item:
   1. Select "GitHub Actions" in "Build and deployment > Source".
   2. Add a custom domain with the subdomain you created
5. Push your changes to the `main` branch

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
   import 'lnxjs-components/dist/base.css';
   ```
   :::
3. If you don't want to use default themes, create a .scss file where you want with your custom css variables:
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
   import 'custom-theme.css';
   ```
   :::
   > [!TIP]
   > You can check available css variables in each theme docs for global styles or in each component docs for component-specific styles 

## Tooling
### Deploying a new version
1. Modify the code you need
2. Run one of these:
   ```bash
   $ release:patch # creates a path version 
   $ release:minor # creates a minor version
   $ release:major # creates a major version
   ```