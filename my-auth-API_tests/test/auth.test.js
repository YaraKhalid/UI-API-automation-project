const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const addContext = require('mochawesome/addContext');
const BASE_URL = 'http://localhost:3000';

// Helper to log the full response safely
function logResponse(title, res) {
    console.log(`\n--- ${title} ---`);
    if (!res) {
        console.error('No response received.');
        return;
    }
    console.log('Status:', res.status);
    console.log('Headers:', res.headers);
    console.log('Body:', res.body);
    console.log('Text:', res.text);
    console.log('--- End ---\n');
}

// Valid Data Inputs
const timestamp = Date.now();
const name = `user_${timestamp}`;
const email = `user_${timestamp}@example.com`;
const password = `pass_${Math.random().toString(36).slice(-8)}`;
let token = "";

// InValid Data Inputs
const invalidName = "invalidname";
const invalidEmail = "invalid email";
const invalidPassword = "invalid Pass";
const invalidToken = "invalidtoken123";
const contentType = "application/json";
const wrongKeyAdmin = "wrongkey";

// End Points
const create_EndPoint = "/api/v1/users";
const auth_EndPoint = "/api/v1/auth";
const patch_EndPoint = "/api/v1/users";
const get_EndPoint = "/api/v1/users";
const deleteUser_EndPoint = "/api/v1/users";
const deleteAllUsers_EndPoint = "/api/v1/all-users";

describe('Test Suite 1 - Verify that API Routes for mock-user-auth return correctly (Valid paths)', function () {

    it('CREATE USER - Valid', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ name, email, password })
            .expect(200)
            .end((err, res) => {
                logResponse('CREATE USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('User registered with success');
                    addContext(this, { title: 'Create User Response', value: res.body });
                    done();
                } catch (assertErr) {
                    done(assertErr);
                }
            });
    });

    it('AUTH USER - Valid', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email, password })
            .expect(200)
            .end((err, res) => {
                logResponse('AUTH USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('token');
                    token = res.body.token;
                    addContext(this, { title: 'Auth User Response', value: res.body });
                    done();
                } catch (assertErr) {
                    done(assertErr);
                }
            });
    });

    it('PATCH USER - Valid', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Authorization', token)
            .send({ name: "Updated_Yara_name", email, password })
            .expect(200)
            .end((err, res) => {
                logResponse('PATCH USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('User updated with success!');
                    addContext(this, { title: 'Patch User Response', value: res.body });
                    done();
                } catch (assertErr) {
                    done(assertErr);
                }
            });
    });
