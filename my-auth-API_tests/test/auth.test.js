const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const addContext = require('mochawesome/addContext');
const BASE_URL = 'http://localhost:3000';
// Valid Data Inputs
const timestamp = Date.now();
const name = `user_${timestamp}`;                                          //to always generate a unique name
const email = `user_${timestamp}@example.com`;                            //to always generate a unique email
const password = `pass_${Math.random().toString(36).slice(-8)}`;         //to always generate a unique pass
let token = "";                                                         // Token will be set dynamically after authentication
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

    // TC1 - Create User (Use its token in the requests that requires token)
    it('CREATE USER - Valid', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ name, email, password })
            .expect(200)  // Should be 201 but it's 200 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('User registered with success');
            })
            .end((err, res) => {
                addContext(this, { title: 'Create User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });

    // TC2 - Authenticate User (Assign the token value to be stored in the token String variable)
    it('AUTH USER - Valid', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .send({ email, password })
            .expect(200) 
            .expect(res => {
                expect(res.body).to.have.property('token');
            })
            .end((err, res) => {
                addContext(this, { title: 'Auth User Response', value: res.body });
                if (err) return done(err);
                token = res.body.token; // Save token for next tests
                done();
            });
    });

    // TC3 - Patch User by Token (Use previously generated token from Auth user)
    it('PATCH USER - Valid', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Authorization', token) 
            .send({ name: "Updated_Yara_name", email, password })
            .expect(200)
            .expect(res => {
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('User updated with success!');
            })
            .end((err, res) => {
                addContext(this, { title: 'Patch User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });

    // TC4 - Get User by Token (Use previously generated token from Auth user)
    it('GET USER - Valid', function (done) {
        request(BASE_URL)
            .get(get_EndPoint)
            .set('Authorization', token)
            .expect(200)
            .expect(res => {
                expect(res.body).to.have.property('name');
                expect(res.body).to.have.property('email');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('password');
                expect(res.body).to.have.property('imageUrl');
            })
            .end((err, res) => {
                addContext(this, { title: 'Get User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });

    // TC5 - Delete User by Token (Use previously generated token from Auth user)
    it('DELETE USER - Valid', function (done) {
        request(BASE_URL)
            .delete(deleteUser_EndPoint)
            .set('Authorization', token)
            .expect(200)
            .expect(res => {
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('User deleted with success!');
            })
            .end((err, res) => {
                addContext(this, { title: 'Delete User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });

    // TC6 - Delete All Users (no token required)
    it('DELETE ALL USERS - Valid', function (done) {
    request(BASE_URL)
        .delete(deleteAllUsers_EndPoint)
        .set('Content-Type', 'application/json') // for authorization
        .send({ key_admin: 'keyadmin123' }) //  include required body
        .expect(200)
        .expect(res => {
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Users deleted with success');

        })
        .end((err, res) => {
            addContext(this, { title: 'Delete All Users Response', value: res.body });
            if (err) return done(err);
            done();
        });
    });

    // create a new user for the 2nd test suite :you should ceate any new users because they were all deleted by the last API in the 1st suite
    it('CREATE USER - Valid', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ name, email, password })
            .expect(200)  // Should be 201 but it's 200 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
                expect(res.body.message).to.equal('User registered with success');
            })
            .end((err, res) => {
                addContext(this, { title: 'Create User Response', value: res.body });
                if (err) return done(err);
                done();
            });
    });


});

describe('Test Suite 2 - Verify that API Routes for mock-user-auth handle INVALID paths/cases correctly', function () {

    // TC1 - Create user with missing fields
    it('CREATE USER - Missing name and password', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .send({ email }) // Missing name and password
            .expect(401)
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Create User with Missing Fields', value: res.body });
                done(err);
            });
    });

     // TC2 - Create user with no fields
    it('CREATE USER - No Fields', function (done) {
        request(BASE_URL)
            .post(create_EndPoint)
            .expect(401)
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Create User with Missing Fields', value: res.body });
                done(err);
            });
    });

    // TC3 - Create user that is already created
    it('CREATE USER - already created', function (done) {
        request(BASE_URL)
           // create the following user in terminal before running this test case
            .post(create_EndPoint)
            .send({ name: 'John Doe',
                    email: 'johndoe@example.com',
                    password: 'securePass123' })
            .expect(409) 
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Created User Response', value: res.body });
                if (err) return done(err);
                done();
            });
            
    });

    // TC4 - Auth user with invalid credintials 
    it('AUTH USER - invalid credentials', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .set('Content-Type', 'application/json')
            .send({ email: invalidEmail, password: invalidPassword }) //wrong credintioals
            .expect(401)          // Expexted 400 bad request, but it's 401 on Mock API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Auth User Invalid Credentials', value: res.body });
                done(err);
            });
    });

    // TC5 - Auth user with missing email or password 
    it('AUTH USER - missing credentials', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .set('Content-Type', 'application/json')
            .send({ email: email }) //missing credintioals
            .expect(401)    // Expexted 400 bad request, but it;s 401 on Mock API      
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Auth User Invalid Credentials', value: res.body });
                done(err);
            });
    });

    // TC6 - Auth user with no credintials 
    it('AUTH USER - no credentials', function (done) {
        request(BASE_URL)
            .post(auth_EndPoint)
            .set('Content-Type', 'application/json')
            //.send({ email: 'wrong@example.com', password: 'wrongpass' }) 
            .expect(401)           
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Auth User Invalid Credentials', value: res.body });
                done(err);
            });
    });

    // TC7 - PATCH user with no token
    it('PATCH USER - No token', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Content-Type', 'application/json')
            .send({ name: name })
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Patch User Without Token', value: res.body });
                done(err);
            });
    });

    // TC8 - PATCH user with invalid token
    it('PATCH USER - invalid token', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Content-Type', 'application/json')
            .set('Authorization', 'invalidtoken123')
            .send({ name: name })
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Patch User Without Token', value: res.body });
                done(err);
            });
    });

     //TC9 - PATCH user with empty body
    it('PATCH USER - empty body', function (done) {
        request(BASE_URL)
            .patch(patch_EndPoint)
            .set('Content-Type', contentType)
            .set('Authorization', token)
            .expect(403) // Should be 401 but it's 403 in mock_API
            .end((err, res) => {
                addContext(this, { title: 'Patch User Without Token', value: res.body });
                done(err);
            });
    });

    // TC10 - GET user with invalid token
    it('GET USER - Invalid token', function (done) {
        request(BASE_URL)
            .get(get_EndPoint)
            .set('Content-Type', contentType)
            .set('Authorization', invalidToken)
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Get User Invalid Token', value: res.body });
                done(err);
            });
    });
    
    // TC11 - GET user with no token
    it('GET USER - no token', function (done) {
        request(BASE_URL)
            .get(get_EndPoint)
            .set('Content-Type', contentType)
            .set('Authorization', invalidToken)
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Get User Invalid Token', value: res.body });
                done(err);
            });
    });

    // TC12 - Delete user with no token
    it('DELETE USER - No token', function (done) {
        request(BASE_URL)
            .delete(deleteUser_EndPoint)
            .set('Content-Type', contentType)
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Delete User Without Token', value: res.body });
                done(err);
            });
    });

    // TC13 - Delete user with invalid token
    it('DELETE USER - invalid token', function (done) {
        request(BASE_URL)
            .delete(deleteUser_EndPoint)
            .set('Content-Type', contentType)
            .set('Authorization', invalidToken)
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Delete User Without Token', value: res.body });
                done(err);
            });
    });

    // TC14 - Delete all users with Invalid admin key
    it('DELETE ALL USERS - Invalid admin key', function (done) {
        request(BASE_URL)
            .delete(deleteAllUsers_EndPoint)
            .set('Content-Type', contentType) // for authorization
            .send({ key_admin: wrongKeyAdmin })
            .expect(403)           // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Delete All Users Invalid Key', value: res.body });
                done(err);
            });
    });

    // TC15 - Delete all users with no admin key
    it('DELETE ALL USERS - no admin key', function (done) {
        request(BASE_URL)
            .delete(deleteAllUsers_EndPoint)
            .set('Content-Type', contentType) // for authorization
            .expect(403)           // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Delete All Users Invalid Key', value: res.body });
                done(err);
            });
    });

    // TC16 - Delete all users with no Autherization
    it('DELETE ALL USERS - no Content-Type Autherization', function (done) {
        request(BASE_URL)
            .delete(deleteAllUsers_EndPoint)
            .expect(403)            // Should be 401 but it's 403 in mock_API
            .expect(res => {
                expect(res.body).to.have.property('message');
            })
            .end((err, res) => {
                addContext(this, { title: 'Delete All Users Invalid Key', value: res.body });
                done(err);
            });
    });


});
