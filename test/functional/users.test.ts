import { User } from '@src/models/user';

describe('Users functional tests', () => {
  describe('When creating a new user ', () => {
    beforeAll(async () => {
      await User.deleteMany({});
    });
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'John',
        email: 'john@teste.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/user').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    }),
      it('should return 422 when there is a validation error', async () => {
        const newUser = {
          email: 'john@teste2.com',
          password: '123456',
        };

        const response = await global.testRequest.post('/user').send(newUser);
        expect(response.status).toBe(422);
        expect(response.body).toEqual({
          code: 422,
          error: 'User validation failed: name: Path `name` is required.',
        });
      }),
      it('should return 409 when the email already exists', async () => {
        const newUser = {
          name: 'John',
          email: 'john@teste.com',
          password: '123456',
        };

        const response = await global.testRequest.post('/user').send(newUser);

        expect(response.status).toBe(409);
        expect(response.body).toEqual({
          code: 409,
          error:
            'User validation failed: email: already exists in the database',
        });
      });
  });
});
