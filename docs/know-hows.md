# Know-Hows

## VitePress
### Publishing to GitHub Pages
1. Create a file named `.github/workdflows/deploy.yml` with [the build process](https://vitepress.dev/guide/deploy#github-pages)

::: warning
Make sure the `base` option in your VitePress is properly configured
:::

2. Create the subdomain
3. Add a `CNAME` file JUST with the subdomain name
4. In your repository's settings under "Pages" menu item:
   1. Select "GitHub Actions" in "Build and deployment > Source".
   2. Add a custom domain with the subdomain you created
5. Push your changes to the `main` branch