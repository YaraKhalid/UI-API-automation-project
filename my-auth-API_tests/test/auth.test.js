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

// Example for the "AUTH USER - Valid" test case
it('AUTH USER - Valid', function (done) {
    request(BASE_URL)
        .post('/api/v1/auth')
        .send({ email, password })
        .expect(200)
        .end((err, res) => {
            if (err || !res) {
                console.error('Request failed:', err);
                return done(err);
            }
            logResponse('AUTH USER', res);
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

// Repeat this pattern for all your other tests where you access res.body or res.status
