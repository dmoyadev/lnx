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
   import './custom-theme.scss'; // [!code ++]
   
   createApp(App).mount('#app')
   ```
   :::
   > [!TIP]
   > You can check available css variables in each theme docs for global styles or in each component docs for component-specific styles

## Language
Without any setup, the components are in English and show dates as `dd-mm-yyyy`. To change that for the whole app, install `createLnx` in your entry file:

::: code-group
```ts [./main.ts]
import { createApp } from 'vue'
import { createLnx } from 'lnxjs-components';
import App from './App.vue'

createApp(App)
  .use(createLnx({ // [!code ++]
    locale: 'es', // [!code ++]
    texts: { search: 'Buscar...', notFound: 'Sin resultados', today: 'Hoy', close: 'Cerrar' }, // [!code ++]
  })) // [!code ++]
  .mount('#app')
```
:::

- `locale` gives the names of months and week days, the first day of the week and how dates are written in fields (`9/11/2026` in Spanish), all from the browser's `Intl`.
- `texts` sets whatever `Intl` can't give: any text you leave out stays in English.
- A prop set on a component, like `today-text` or `search-placeholder-text`, still wins over the global setting.

These are all the texts and their defaults:

<<< ../packages/components/src/config.ts#LnxTexts

## Sizing
Buttons and form fields (input, select, date picker, OTP) share the same CSS variables, so they always line up when placed side by side. There are no size props: change these variables instead.

| Variable | Default | What it changes |
|---|---|---|
| `--lnx-control-height` | `28px` | Height of buttons and fields |
| `--lnx-control-padding-x` | `var(--lnx-spacing-2)` | Horizontal space inside them |
| `--lnx-control-font-size` | `var(--lnx-font-size-small)` | Their text size |
| `--lnx-control-radius` | `var(--lnx-radius-2)` | Corner radius |
| `--lnx-control-border-width` | `1px` | Border width |
| `--lnx-control-gap` | `var(--lnx-spacing-1)` | Space between a field, its label and its messages |
| `--lnx-control-height-small` | `var(--lnx-spacing-5)` | Height inside `.lnx-size-small` |
| `--lnx-control-height-large` | `var(--lnx-spacing-7)` | Height inside `.lnx-size-large` |

For the usual cases there are two classes, `lnx-size-small` and `lnx-size-large`. Put one on a button or a field, or on a container to resize everything inside it, so a row of controls keeps the same height:
```vue
<div class="lnx-size-small">
  <LnxInput placeholder="Search" />
  <LnxSelect v-model="status" :options="statuses" />
  <LnxButton>Filter</LnxButton>
</div>
```

For other sizes, set the variables on `:root` to resize the whole app, or on any element to resize only what is inside it:
::: code-group
```scss [custom-theme.scss]
:root {
  --lnx-control-height: 36px;
  --lnx-control-padding-x: var(--lnx-spacing-3);
}

.toolbar {
  --lnx-control-height: 24px;
  --lnx-control-font-size: var(--lnx-font-size-legal);
}
```
```vue [Component.vue]
<LnxButton style="--lnx-control-height: 40px">Bigger button</LnxButton>
```
:::
