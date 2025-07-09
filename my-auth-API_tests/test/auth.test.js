const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const addContext = require('mochawesome/addContext');
const BASE_URL = 'http://localhost:3000';

const timestamp = Date.now();
const name = `user_${timestamp}`;
const email = `user_${timestamp}@example.com`;
const password = `pass_${Math.random().toString(36).slice(-8)}`;
let token = "";

const auth_EndPoint = "/api/v1/auth";
const create_EndPoint = "/api/v1/users";
const patch_EndPoint = "/api/v1/users";

function logResponse(res, testName) {
  console.log(`\n--- ${testName} ---`);
  console.log('Status:', res.status);
  console.log('Headers:', res.headers);
  console.log('Body:', res.body);
  console.log('Text:', res.text);
  console.log('--- End ---\n');
}

describe('Test Suite 1 - Verify that API Routes for mock-user-auth return correctly (Valid paths)', function () {

    it('CREATE USER - Valid', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ name, email, password })
            .expect(200)
            .end((err, res) => {
                logResponse(res, 'CREATE USER');
                addContext(this, { title: 'Create User Response', value: res.body });
                if (err) return done(err);
                expect(res.body || {}).to.have.property('message', 'User registered with success');
                done();
            });
    });

    it('AUTH USER - Valid', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email, password })
            .expect(200)
            .end((err, res) => {
                logResponse(res, 'AUTH USER');
                addContext(this, { title: 'Auth User Response', value: res.body });
                if (err) return done(err);
                expect(res.body || {}).to.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('PATCH USER - Valid', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Authorization', token)
            .send({ name: "Updated_Yara_name", email, password })
            .expect(200)
            .end((err, res) => {
                logResponse(res, 'PATCH USER');
                addContext(this, { title: 'Patch User Response', value: res.body });
                if (err) return done(err);
                expect(res.body || {}).to.have.property('message', 'User updated with success!');
                done();
            });
    });

});

describe('Test Suite 2 - Verify that API Routes for mock-user-auth handle INVALID cases correctly', function () {

    it('AUTH USER - Invalid credentials', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email: "wrong@example.com", password: "wrongpass" })
            .expect(401)
            .end((err, res) => {
                logResponse(res, 'AUTH USER - Invalid Credentials');
                addContext(this, { title: 'Auth User Invalid Credentials', value: res.body });
                if (err) return done(err);
                expect(res.body || {}).to.have.property('message');
                done();
            });
    });

});
