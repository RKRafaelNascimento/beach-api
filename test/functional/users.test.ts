import { User } from '@src/models/user';
import AuthService from '@src/services/auth';

describe('Users functional tests', () => {
  describe('When creating a new user ', () => {
    beforeAll(async () => {
      await User.deleteMany({});
    });
    it('should successfully create a new user with encrypted password', async () => {
      const newUser = {
        name: 'John',
        email: 'john@teste.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/user').send(newUser);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePassword(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    }),
      it('should return 422 when there is a validation error', async () => {
        const newUser = {
          email: 'john@teste2.com',
          password: '123456',
        };

        const response = await global.testRequest.post('/user').send(newUser);
        expect(response.status).toBe(422);
        expect(response.body).toEqual({
          message: 'User validation failed: name: Path `name` is required.',
          code: 422,
          error: 'Unprocessable Entity',
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
          message:
            'User validation failed: email: already exists in the database',
          code: 409,
          error: 'Conflict',
        });
      });
  });
  describe('When authenticating a user', () => {
    it('should generate a token for a valid user', async () => {
      const newUser = {
        name: 'John Token',
        email: 'johnToken@token.com',
        password: '123456',
      };
      await new User(newUser).save();

      const response = await global.testRequest
        .post('/user/authenticate')
        .send({ email: newUser.email, password: newUser.password });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({ token: expect.any(String) })
      );
    });
    it('should return UNAUTHORIZED if the user with the given email is not found', async () => {
      const response = await global.testRequest
        .post('/user/authenticate')
        .send({ email: 'some-email@teste.com', password: '1234' });

      expect(response.status).toBe(401);
    });
    it('should return ANAUTHORIZED if the user is found but the password does not match', async () => {
      const newUser = {
        name: 'John Token',
        email: 'johnToken@token.com',
        password: '1234',
      };

      const response = await global.testRequest
        .post('/user/authenticate')
        .send({ email: newUser.email, password: 'different password' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        code: 401,
        error: 'Unauthorized',
        message: 'Password does not match!',
      });
    });
  });
});
