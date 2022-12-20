// https://umijs.org/config/
import { defineConfig } from '@umijs/max';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

/* A function that returns a configuration object. */
export default defineConfig({
  hash: true,
  favicons: ['/digits.gif','/favico.png', 'favico.ico'],
  routes,
  theme: {
    'root-entry-name': 'variable',
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  fastRefresh: true,
  model: {},
  initialState: {},
  layout: {
    locale: true,
    ...defaultSettings,
  },
  locale: {
    default: 'en-US',
    antd: true,
    baseNavigator: true,
  },
  antd: {},
  request: {},
  access: {},
  presets: ['umi-presets-pro'],
  openAPI: [
    {
      requestLibPath: "import { request } from '@umijs/max'",
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
  ],
  mfsu: {
    exclude :['@playwright/test']
  },
});
