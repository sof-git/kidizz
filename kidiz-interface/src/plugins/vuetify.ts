import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
const kidizzTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#471bfe',
    secondary: '#424242',
    accent: '#FFD700',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'kidizzTheme',
    themes: {
      kidizzTheme,
    },
  },
});

export default vuetify;