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
const invalidEmail = "invalid email";
const invalidPassword = "invalid Pass";
const invalidToken = "invalidtoken123";
const wrongKeyAdmin = "wrongkey";

// End Points
const create_EndPoint = "/api/v1/users";
const auth_EndPoint = "/api/v1/auth";
const patch_EndPoint = "/api/v1/users";
const get_EndPoint = "/api/v1/users";
const deleteUser_EndPoint = "/api/v1/users";
const deleteAllUsers_EndPoint = "/api/v1/all-users";

describe('Test Suite 1 - Valid API Paths', function () {

    it('CREATE USER - Valid', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ name, email, password })
            .expect(200)
            .end((err, res) => {
                logResponse('CREATE USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message', 'User registered with success');
                    token = res.body.token || token;
                    addContext(this, { title: 'Create User Response', value: res.body });
                    done();
                } catch (error) {
                    done(error);
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
                } catch (error) {
                    done(error);
                }
            });
    });

    it('PATCH USER - Valid', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Authorization', token)
            .send({ name: "Updated_Yara", email, password })
            .expect(200)
            .end((err, res) => {
                logResponse('PATCH USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message', 'User updated with success!');
                    addContext(this, { title: 'Patch User Response', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('GET USER - Valid', function (done) {
        request(BASE_URL)
            .get(get_EndPoint)
            .set('Authorization', token)
            .expect(200)
            .end((err, res) => {
                logResponse('GET USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.include.keys('name', 'email', 'id', 'password', 'imageUrl');
                    addContext(this, { title: 'Get User Response', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('DELETE USER - Valid', function (done) {
        request(BASE_URL)
            .delete(deleteUser_EndPoint)
            .set('Authorization', token)
            .expect(200)
            .end((err, res) => {
                logResponse('DELETE USER', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message', 'User deleted with success!');
                    addContext(this, { title: 'Delete User Response', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('DELETE ALL USERS - Valid', function (done) {
        request(BASE_URL)
            .delete(deleteAllUsers_EndPoint)
            .set('Content-Type', 'application/json')
            .send({ key_admin: 'keyadmin123' })
            .expect(200)
            .end((err, res) => {
                logResponse('DELETE ALL USERS', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message', 'Users deleted with success');
                    addContext(this, { title: 'Delete All Users Response', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

});

describe('Test Suite 2 - Invalid API Cases', function () {

    it('AUTH USER - Invalid credentials', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email: invalidEmail, password: invalidPassword })
            .expect(401)
            .end((err, res) => {
                logResponse('AUTH USER - Invalid credentials', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message');
                    addContext(this, { title: 'Invalid Auth Response', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('PATCH USER - No token', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .send({ name: "NoToken" })
            .expect(403)
            .end((err, res) => {
                logResponse('PATCH USER - No token', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message');
                    addContext(this, { title: 'Patch Without Token', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('GET USER - Invalid token', function (done) {
        request(BASE_URL)
            .get(get_EndPoint)
            .set('Authorization', invalidToken)
            .expect(403)
            .end((err, res) => {
                logResponse('GET USER - Invalid token', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message');
                    addContext(this, { title: 'Get User Invalid Token', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('DELETE ALL USERS - Wrong key', function (done) {
        request(BASE_URL)
            .delete(deleteAllUsers_EndPoint)
            .set('Content-Type', 'application/json')
            .send({ key_admin: wrongKeyAdmin })
            .expect(403)
            .end((err, res) => {
                logResponse('DELETE ALL USERS - Wrong key', res);
                if (err || !res) return done(err);
                try {
                    expect(res.body).to.have.property('message');
                    addContext(this, { title: 'Delete All Users Wrong Key', value: res.body });
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

});
