import { Server } from '@src/server';
import supertest from 'supertest';

beforeAll(() => {
  const server = new Server();
  server.init();
  global.testRequest = supertest(server.getApp());
});
