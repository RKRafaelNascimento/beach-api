import { Server } from './server';
import config from 'config';

(async (): Promise<void> => {
  const server = new Server(config.get('App.port'));
  await server.init();
  server.start();
})();
