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

const invalidEmail = "invalid email";
const invalidPassword = "invalid Pass";
const invalidToken = "invalidtoken123";
const contentType = "application/json";
const wrongKeyAdmin = "wrongkey";

const create_EndPoint = "/api/v1/users";
const auth_EndPoint = "/api/v1/auth";
const patch_EndPoint = "/api/v1/users";
const get_EndPoint = "/api/v1/users";
const deleteUser_EndPoint = "/api/v1/users";
const deleteAllUsers_EndPoint = "/api/v1/all-users";

function logResponse(res) {
    console.log('--- Response Start ---');
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    console.log('Body:', res.body);
    console.log('Text:', res.text);
    console.log('--- Response End ---');
    if (!res.body) throw new Error(`Response body is undefined. Raw response: ${res.text}`);
}

describe('Test Suite 1 - Valid paths', function () {

    it('CREATE USER - Valid', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ name, email, password })
            .expect(200)
            .expect(res => {
                logResponse(res);
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Create User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });

    it('AUTH USER - Valid', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email, password })
            .expect(200)
            .expect(res => {
                logResponse(res);
                expect(res.body).to.have.property('token');
            })
            .end((err, res) => {
                addContext(this, { title: 'Auth User Response', value: res.body });
                if (err) return done(err);
                token = res.body.token;
                done();
            });
    });

    // Add logResponse(res); in all other tests as done above.
    // Example for PATCH USER:

    it('PATCH USER - Valid', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Authorization', token)
            .send({ name: "Updated_Yara_name", email, password })
            .expect(200)
            .expect(res => {
                logResponse(res);
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Patch User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });

    // Repeat logResponse(res); for all the other test cases following this pattern.
});

describe('Test Suite 2 - Invalid cases', function () {

    it('AUTH USER - Invalid credentials', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email: invalidEmail, password: invalidPassword })
            .expect(401)
            .expect(res => {
                logResponse(res);
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Auth User Invalid Credentials', value: res.body });
                done(err);
            });
    });

    // Repeat the same for other invalid cases...

});
