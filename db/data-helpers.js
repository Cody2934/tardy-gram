require('dotenv').config();
const connect = require('../lib/utils/connect');
const seed = require('../db/seed');
const mongoose = require('mongoose');
const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');

beforeAll(() => {
  connect();
});

beforeEach(() => {
  return mongoose.connection.dropDatabase();
});

beforeEach(() => {
  return seed();
});

const agent = request.agent(app);
beforeEach(() => {
  return agent
    .post('/api/v1/auth/login')
    .send({
      username: 'test@test.com',
      password: 'password',
    });
});

afterAll(() => {
  return mongoose.connection.close();
});

const prepare = model => JSON.parse(JSON.stringify(model));
const prepareAll = models => models.map(prepare);
const files = fs.readdirSync('./lib/models');
const getters = files
  .map(file => require(`../lib/models/${file}`))
  .filter(Model => Model.prototype instanceof mongoose.Model)
  .reduce((acc, Model) => {
    return {
      ...acc,
      [`get${Model.modelName}`]: query => Model.findOne(query).then(prepare),
      [`get${Model.modelName}s`]: query => Model.find(query).then(prepareAll)
    };
  }, {});

module.exports = {
  ...getters,
  getAgent: () => agent
};
