/*const path = require('path');

module.exports = {
    before: function (browser) {
    console.log('Starting test suite...');
  },

  after: function (browser) {
    browser.end();
  },

  'TC1: Submit Contact Us Form with upload file Successfully': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    const email = 'test@example.com';
    const message = 'This is a test message.';
    const subjectHeading = 'customer Service';  
    const filePath = path.resolve(__dirname, '../uploads/tesstt.pdf');  
  contactUs
  .navigate()
  .waitForElementVisible('@emailInput', 5000);

// Switch to the browser object to run JS in the page context
browser.execute(function () {
  const fileInput = document.getElementById('fileUpload');
  if (fileInput) {
    fileInput.classList.remove('hidden-xs');
    fileInput.style.display = 'block';
  }
});

// Then continue using your contactUs page object
contactUs
  .setValue('@uploadFileInput', filePath)
  .setValue('@subjectHeading', subjectHeading)
  .setValue('@emailInput', email)
  .setValue('@messageTextArea', message)
  .click('@submitButton')
  .waitForElementVisible('@successAlert', 5000)
  .assert.containsText('@successAlert', 'Your message has been successfully sent to our team.');
  },

  'TC2: Submit Contact Form with invalid email': function (browser) {
    const contactUs = browser.page.ContactUsPage();

    contactUs
      .navigate()
      .setValue('@emailInput', 'invalid-email')
      .setValue('@messageTextArea', 'Test message 2')
      .click('@submitButton')
      .waitForElementVisible('@errorAlert', 5000)
      .assert.containsText('@errorAlert', 'Invalid email address.');
  }

  /*'TC3: All fields correct (Success)': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    const email = 'test@example.com';
    const message = 'This is a test message.';
    const subjectHeading = '2';
    contactUs.navigate();
    contactUs.submitForm(subjectHeading, email, message, true);
    contactUs.assertSuccess();
  }

};
const email = 'test@example.com';
const message = 'This is a test message.';
const subjectHeading = 'Customer service';
module.exports = {
  before: function (browser) {
    console.log('Starting test suite...');
  },

  after: function (browser) {
    browser.end();
  },

  'TC1: Submit Contact Us Form with upload file Successfully': function (browser) {
    const contactUs = browser.page.ContactUsPage();

    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, email, message, true)
      .assertSuccessMessage();
  },

  'TC2: Submit Contact Form with invalid email': function (browser) {
    const contactUs = browser.page.ContactUsPage();

    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm('Customer service', 'invalid-email', 'Test message 2')
      .assertErrorMessage('Invalid email address.');
  },
  'Test with 50,000 characters in message': function (browser) {
    const contactUs = browser.page.ContactUsPage();

    contactUs
      .navigate()
      .setValue('@subjectHeading', 'Customer service')
      .setValue('@emailInput', 'test@example.com')
      .setValue('@messageTextArea', longMessage)
      .click('@submitButton')
      .waitForElementVisible('@successAlert', 5000)
      .assert.containsText('@successAlert', 'Your message has been successfully sent to our team.');
  }
};
const email = 'test@example.com';
const message = 'This is a test message.';
const subjectHeading = 'Customer service';
const invalidEmail = 'invalid-email';
const path = require('path');
const longMessage = 'A'.repeat(50000);
const shortMessage = 'Hi'; // for minimum letters test

module.exports = {
  before: function (browser) {
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
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, email, message, true)
      .assertSuccessMessage();
  },

  'TC2: Submit Contact Form with invalid email': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, invalidEmail, message)
      .assertErrorMessage('Invalid email address.');
  },

  'TC3: Submit Contact Form without subject heading': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm('', email, message)
      .assertErrorMessage('Please select a subject from the list provided.');
  },

  'TC4: Submit Contact Form without message': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, email, '')
      .assertErrorMessage('The message cannot be blank.');
  },

  'TC5: Submit Contact Form with all mandatory fields missing': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm('', '', '')
      .assertErrorMessage('Invalid email address.');
  },

  'TC6: Submit Contact Form with invalid file format': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    // Change the file path inside the page object if you want to test a .exe or .bat file
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, invalidEmail, message, true)
      .assertErrorMessage('Invalid file format.');
  },

  'TC7: Submit Contact Form successfully without file upload': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, email, message)
      .assertSuccessMessage();
  },

  'TC8: Upload an unsupported file format': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs.api.execute(() => {
      const fileInput = document.getElementById('fileUpload');
      if (fileInput) {
        fileInput.classList.remove('hidden-xs');
        fileInput.style.display = 'block';
      }
    });

    const unsupportedFilePath = path.resolve(__dirname, '../uploads/testfile.exe');

    contactUs
      .navigate()
      .waitForElementVisible('@uploadFileInput', 5000)
      .setValue('@uploadFileInput', unsupportedFilePath)
      .fillContactForm(subjectHeading, email, message)
      .assertErrorMessage('Invalid file format.');
  },

  'TC9: Submit Contact Form with minimum letters in message': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, email, shortMessage)
      .assertSuccessMessage();
  },

  'TC10: Submit Contact Form with 50,000 characters in message': function (browser) {
    const contactUs = browser.page.ContactUsPage();
    contactUs
      .navigate()
      .waitForElementVisible('@emailInput', 5000)
      .fillContactForm(subjectHeading, email, longMessage)
      .assertSuccessMessage();
  },
  'TC11: Submit Contact Form with empty email field': function (browser) {
  const contactUs = browser.page.ContactUsPage();
  
  contactUs
    .navigate()
    .waitForElementVisible('@emailInput', 5000)
    .fillContactForm(subjectHeading, '', message)
    .assertErrorMessage('Invalid email address.');
},

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


