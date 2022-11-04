import cors, { CorsOptions } from 'cors';

const getApplicationAllowedOrigins = (): string[] => {
  const dev = process.env.APP_ENV !== 'production';
  if (dev) {
    return [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pixl-game.netlify.app',
      'https://pixl-staging.netlify.app',
      'https://pixl-admin.netlify.app',
    ];
  } else {
    return [
      'https://pixl.xyz',
      'https://beets-staging.netlify.app',
      'https://pixl-game.netlify.app',
      'https://pixl-staging.netlify.app',
      'https://pixl-admin.netlify.app',
    ];
  }
};

const AppliationCorsOptions: CorsOptions = {
  origin: getApplicationAllowedOrigins(),
  methods: ['PUT', 'GET', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
};

//export default cors(AppliationCorsOptions);
export default cors({
  origin: '*',
});
