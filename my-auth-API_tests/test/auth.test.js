const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const addContext = require('mochawesome/addContext');

const BASE_URL = 'http://localhost:3000';

// Valid Data
const timestamp = Date.now();
const name = `user_${timestamp}`;
const email = `user_${timestamp}@example.com`;
const password = `pass_${Math.random().toString(36).slice(-8)}`;
let token = '';

// Invalid Data
const invalidEmail = 'invalid@example.com';
const invalidPassword = 'wrongpass';
const invalidToken = 'invalidtoken123';
const wrongKeyAdmin = 'wrongkey';
const contentType = 'application/json';

// Endpoints
const create_EndPoint = "/api/v1/users";
const auth_EndPoint = "/api/v1/auth";
const patch_EndPoint = "/api/v1/users";
const get_EndPoint = "/api/v1/users";
const deleteUser_EndPoint = "/api/v1/users";
const deleteAllUsers_EndPoint = "/api/v1/all-users";

// Helper to safely check response body
function safeExpect(res, context, assertions = () => {}) {
  addContext(context, { title: 'Response', value: res?.body || 'No response body' });
  if (!res || !res.body) {
    throw new Error(`No response body. Full response: ${JSON.stringify(res || {})}`);
  }
  assertions(res.body);
}

describe('Test Suite 1 - Valid API Paths', function () {

  it('CREATE USER - Valid', function (done) {
    request(BASE_URL)
      .post(create_EndPoint)
      .send({ name, email, password })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body.message).to.equal('User registered with success');
        });
        done();
      });
  });

  it('AUTH USER - Valid', function (done) {
    request(BASE_URL)
      .post(auth_EndPoint)
      .send({ email, password })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.have.property('token');
          token = body.token;
        });
        done();
      });
  });

  it('PATCH USER - Valid', function (done) {
    request(BASE_URL)
      .patch(patch_EndPoint)
      .set('Authorization', token)
      .send({ name: "Updated Name", email, password })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body.message).to.equal('User updated with success!');
        });
        done();
      });
  });

  it('GET USER - Valid', function (done) {
    request(BASE_URL)
      .get(get_EndPoint)
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.include.all.keys('name', 'email', 'id', 'password', 'imageUrl');
        });
        done();
      });
  });

  it('DELETE USER - Valid', function (done) {
    request(BASE_URL)
      .delete(deleteUser_EndPoint)
      .set('Authorization', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body.message).to.equal('User deleted with success!');
        });
        done();
      });
  });

  it('DELETE ALL USERS - Valid', function (done) {
    request(BASE_URL)
      .delete(deleteAllUsers_EndPoint)
      .set('Content-Type', contentType)
      .send({ key_admin: 'keyadmin123' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body.message).to.equal('Users deleted with success');
        });
        done();
      });
  });

});

describe('Test Suite 2 - Invalid API Cases', function () {

  it('CREATE USER - Missing fields', function (done) {
    request(BASE_URL)
      .post(create_EndPoint)
      .send({ email })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.have.property('message');
        });
        done();
      });
  });

  it('AUTH USER - Invalid credentials', function (done) {
    request(BASE_URL)
      .post(auth_EndPoint)
      .send({ email: invalidEmail, password: invalidPassword })
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.have.property('message');
        });
        done();
      });
  });

  it('PATCH USER - No token', function (done) {
    request(BASE_URL)
      .patch(patch_EndPoint)
      .send({ name: 'NoToken' })
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.have.property('message');
        });
        done();
      });
  });

  it('GET USER - Invalid token', function (done) {
    request(BASE_URL)
      .get(get_EndPoint)
      .set('Authorization', invalidToken)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.have.property('message');
        });
        done();
      });
  });

  it('DELETE ALL USERS - Wrong key', function (done) {
    request(BASE_URL)
      .delete(deleteAllUsers_EndPoint)
      .send({ key_admin: wrongKeyAdmin })
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        safeExpect(res, this, body => {
          expect(body).to.have.property('message');
        });
        done();
      });
  });

});
