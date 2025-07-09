const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const addContext = require('mochawesome/addContext');

const BASE_URL = 'http://localhost:3000';

// Test data
const timestamp = Date.now();
const name = `user_${timestamp}`;
const email = `user_${timestamp}@example.com`;
const password = `pass_${Math.random().toString(36).slice(-8)}`;
let token = "";

const invalidEmail = "wrong@example.com";
const invalidPassword = "wrongpass";
const invalidToken = "invalidtoken123";
const contentType = "application/json";
const wrongKeyAdmin = "wrongkey";

// Endpoints
const create_EndPoint = "/api/v1/users";
const auth_EndPoint = "/api/v1/auth";
const patch_EndPoint = "/api/v1/users";
const get_EndPoint = "/api/v1/users";
const deleteUser_EndPoint = "/api/v1/users";
const deleteAllUsers_EndPoint = "/api/v1/all-users";

// Helper: Safe response body check
function checkBody(res) {
  if (!res || !res.body) {
    console.error('⚠️ Response with no body:', res && res.statusCode, res && res.text);
    throw new Error(`No response body. Status: ${res && res.statusCode}`);
  }
}

describe('Test Suite 1 - Valid paths', function () {

  it('CREATE USER - Valid', function (done) {
    request(BASE_URL)
      .post(create_EndPoint)
      .send({ name, email, password })
      .expect(200)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message', 'User registered with success');
      })
      .end((err, res) => {
        addContext(this, { title: 'Create User Response', value: res.body || res.text });
        done(err);
      });
  });

  it('AUTH USER - Valid', function (done) {
    console.log(`Authenticating with email: ${email}, password: ${password}`);
    request(BASE_URL)
      .post(auth_EndPoint)
      .send({ email, password })
      .expect(200)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('token');
        token = res.body.token;
      })
      .end((err, res) => {
        addContext(this, { title: 'Auth User Response', value: res.body || res.text });
        done(err);
      });
  });

  it('PATCH USER - Valid', function (done) {
    request(BASE_URL)
      .patch(patch_EndPoint)
      .set('Authorization', token)
      .send({ name: "Updated Name", email, password })
      .expect(200)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message', 'User updated with success!');
      })
      .end((err, res) => {
        addContext(this, { title: 'Patch User Response', value: res.body || res.text });
        done(err);
      });
  });

  it('GET USER - Valid', function (done) {
    request(BASE_URL)
      .get(get_EndPoint)
      .set('Authorization', token)
      .expect(200)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.include.all.keys('name', 'email', 'id', 'password', 'imageUrl');
      })
      .end((err, res) => {
        addContext(this, { title: 'Get User Response', value: res.body || res.text });
        done(err);
      });
  });

  it('DELETE USER - Valid', function (done) {
    request(BASE_URL)
      .delete(deleteUser_EndPoint)
      .set('Authorization', token)
      .expect(200)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message', 'User deleted with success!');
      })
      .end((err, res) => {
        addContext(this, { title: 'Delete User Response', value: res.body || res.text });
        done(err);
      });
  });

  it('DELETE ALL USERS - Valid', function (done) {
    request(BASE_URL)
      .delete(deleteAllUsers_EndPoint)
      .set('Content-Type', contentType)
      .send({ key_admin: 'keyadmin123' })
      .expect(200)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message', 'Users deleted with success');
      })
      .end((err, res) => {
        addContext(this, { title: 'Delete All Users Response', value: res.body || res.text });
        done(err);
      });
  });

});

describe('Test Suite 2 - Invalid cases', function () {

  it('AUTH USER - Invalid credentials', function (done) {
    request(BASE_URL)
      .post(auth_EndPoint)
      .send({ email: invalidEmail, password: invalidPassword })
      .expect(401)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message');
      })
      .end((err, res) => {
        addContext(this, { title: 'Auth Invalid', value: res.body || res.text });
        done(err);
      });
  });

  it('PATCH USER - No token', function (done) {
    request(BASE_URL)
      .patch(patch_EndPoint)
      .send({ name })
      .expect(403)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message');
      })
      .end((err, res) => {
        addContext(this, { title: 'Patch No Token', value: res.body || res.text });
        done(err);
      });
  });

  it('GET USER - Invalid token', function (done) {
    request(BASE_URL)
      .get(get_EndPoint)
      .set('Authorization', invalidToken)
      .expect(403)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message');
      })
      .end((err, res) => {
        addContext(this, { title: 'Get Invalid Token', value: res.body || res.text });
        done(err);
      });
  });

  it('DELETE ALL USERS - Wrong key', function (done) {
    request(BASE_URL)
      .delete(deleteAllUsers_EndPoint)
      .send({ key_admin: wrongKeyAdmin })
      .expect(403)
      .expect(res => {
        checkBody(res);
        expect(res.body).to.have.property('message');
      })
      .end((err, res) => {
        addContext(this, { title: 'Delete All Invalid Key', value: res.body || res.text });
        done(err);
      });
  });

});
