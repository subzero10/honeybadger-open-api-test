const request = require('supertest');
const app = require('../app');

test('api', function (done) {
    request(app)
        .get('/users')
        .expect(200, done);
})
