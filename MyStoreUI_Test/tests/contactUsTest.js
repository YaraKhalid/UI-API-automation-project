/*const path = require('path');



};*/
const email = 'test@example.com';
const message = 'This is a test message.';
const subjectHeading = 'Customer service';
const invalidEmail = 'invalid-email';
const path = require('path');
const longMessage = 'A'.repeat(5000);
const shortMessage = 'Hi'; // for minimum letters test

module.exports = {
  before: function () {
    console.log('Starting test suite...');
  },
   beforeEach: function (browser) {
    browser.page.ContactUsPage().navigate().waitForElementVisible('@emailInput', 5000);
  },

  after: function (browser) {
    browser.end();
  },

  'TC1: Submit Contact Us Form with file upload Successfully': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, email, message, true)
      .assertSuccessMessage();
  },

  'TC2: Submit Contact Form with invalid email': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, invalidEmail, message)
      .assertErrorMessage('Invalid email address.');
  },

  'TC3: Submit Contact Form without subject heading': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm('', email, message)
      .assertErrorMessage('Please select a subject from the list provided.');
  },

  'TC4: Submit Contact Form without message': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, email, '')
      .assertErrorMessage('The message cannot be blank.');
  },

  'TC5: Submit Contact Form with all mandatory fields missing': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm('', '', '')
      .assertErrorMessage('Invalid email address.');
  },


  'TC6: Submit Contact Form successfully without file upload': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, email, message)
      .assertSuccessMessage();
  },

  'TC7: Submit Contact Form with minimum letters in message': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, email, shortMessage)
      .assertSuccessMessage();
  },

  'TC8: Submit Contact Form with 50,000 characters in message': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, email, longMessage)
      .assertSuccessMessage();
  },

  'TC9: Submit Contact Form with empty email field': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .fillContactForm(subjectHeading, '', message)
      .assertErrorMessage('Invalid email address.');
  }
};


