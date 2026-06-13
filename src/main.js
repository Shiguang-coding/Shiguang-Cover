import { createApp } from 'vue';
import App from './App.vue';
import './assets/index.css';

const fontFamily = `${import.meta.env.VITE_APP_FONT_FAMILY}, sans-serif`;
document.documentElement.style.setProperty('--vue-app-font-family', fontFamily);

const fontCssUrl = import.meta.env.VITE_APP_FONT_CSS_URL;
if (fontCssUrl) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontCssUrl;
  document.head.appendChild(link);
}

const app = createApp(App);
app.mount('#app');