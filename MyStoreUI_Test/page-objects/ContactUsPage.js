const path = require('path');

module.exports = {
  url: 'http://automationpractice.multiformis.com/index.php?controller=contact', //site URL

  // Locators
  elements: {
    subjectHeading: '#id_contact',
    emailInput: '#email',
    orderReference: '#id_order',
    messageTextArea: '#message',
    uploadFileInput: '#fileUpload',
    submitButton: '#submitMessage',
    successAlert: '.alert-success',
    errorAlert: '.alert-danger'
  },

  //Functions
  commands: [{
    fillContactForm(subject, email, message, uploadFile = false) {   // a function to fill in the contact us form
      const filePath = path.resolve(__dirname, '../uploads/tesstt.pdf');

      this.setValue('@subjectHeading', subject)
          .setValue('@emailInput', email)
          .setValue('@messageTextArea', message);

      if (uploadFile) {
        this.api.execute(() => {
          const fileInput = document.getElementById('fileUpload');
          if (fileInput) {
            fileInput.classList.remove('hidden-xs');
            fileInput.style.display = 'block';
          }
        });

        this.setValue('@uploadFileInput', filePath);
      }

      return this.click('@submitButton');
    },

    assertSuccessMessage() { // Function to assert the successful form submition
      return this
        .waitForElementVisible('@successAlert', 5000)
        .assert.containsText('@successAlert', 'Your message has been successfully sent to our team.');
    },

    assertErrorMessage(expectedError) { // Function to assert the failure in submitting the form
      return this
        .waitForElementVisible('@errorAlert', 5000)
        .assert.containsText('@errorAlert', expectedError);
    }
  }]
};
