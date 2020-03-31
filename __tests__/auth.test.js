const { getAgent } = require('../db/data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('auth routes', () => {
  it('signs up a user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'bob@bob.com',
        password: 'bobspassword',
        profilePhotoUrl: 'cat@cat.com'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'bob@bob.com',
          // passwordHash: 'bobspassword',
          profilePhotoUrl: 'cat@cat.com',
          __v: 0
        });
      });
  });

  it('logs in a user', async() => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'test@test.com',
        password: 'password'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test@test.com',
          profilePhotoUrl: 'placekitten',
          __v: 0
        });
      });
  });

  it('verifies a logged in user', () => {
    return getAgent()
      .get('/api/v1/auth/verify')
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          username: 'test@test.com',
          profilePhotoUrl: 'placekitten',
          __v: 0
        });
      });
  });
});
