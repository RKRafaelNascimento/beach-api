describe('Users functional tests', () => {
  describe('When creating a new user ', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'John',
        email: 'john@teste.com',
        password: '123456',
      };

      const response = await global.testRequest.post('/user').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });
  });
});
