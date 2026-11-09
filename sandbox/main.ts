import { createApp } from 'vue';
import App from './App.vue';
import './sandbox.css';
import { createLnx } from 'lnxjs-components/src';

const app = createApp(App);

// Open the sandbox with ?lang=es to try the components in another language
const lang = new URLSearchParams(location.search).get('lang');
if(lang) {
	app.use(createLnx({
		locale: lang,
		texts: { search: 'Buscar...', notFound: 'Sin resultados', today: 'Hoy', close: 'Cerrar' },
	}));
}

app.mount('#app');
