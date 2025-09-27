var scriptProperties = PropertiesService.getScriptProperties();

/**
 * Sets the maximum number of allowed responses.
 * @param {string} limit The maximum number of responses as a string.
 * @returns {string} A confirmation or error message.
 */
function setMaxResponses(limit) {
  try {
    var limitNumber = parseInt(limit, 10);
    if (!isNaN(limitNumber) && limitNumber > 0) {
      scriptProperties.setProperty('maxResponses', limitNumber.toString());
      setTrigger(); // Ensure the onFormSubmit trigger exists.
      return 'Limit set to ' + limitNumber + ' responses.';
    }
    throw new Error('Please enter a valid number greater than zero.');
  } catch (e) {
    if (e.message.includes('PERMISSION_DENIED')) {
      throw new Error('Permission Error: It seems you have multiple Google accounts logged in. Please log out of other accounts and try again.');
    }
    throw new Error(e.message);
  }
}

/**
 * Sets the confirmation message that appears after a form is submitted.
 * @param {string} message The confirmation message.
 * @returns {string} A confirmation message.
 */
function setConfirmationMessage(message) {
  try {
    if (!message || message.trim() === '') {
      throw new Error('Confirmation message cannot be empty.');
    }
    var form = FormApp.getActiveForm();
    form.setConfirmationMessage(message);
    return 'Confirmation message updated successfully.';
  } catch (e) {
    if (e.message.includes('PERMISSION_DENIED')) {
      throw new Error('Permission Error: It seems you have multiple Google accounts logged in. Please log out of other accounts and try again.');
    }
    throw new Error(e.message);
  }
}

/**
 * Sets the message that appears when the form is closed.
 * @param {string} message The closed form message.
 * @returns {string} A confirmation message.
 */
function setClosedMessage(message) {
  try {
    if (!message || message.trim() === '') {
      throw new Error('Closed form message cannot be empty.');
    }
    var form = FormApp.getActiveForm();
    form.setCustomClosedFormMessage(message);
    return 'Closed form message updated successfully.';
  } catch (e) {
    if (e.message.includes('PERMISSION_DENIED')) {
      throw new Error('Permission Error: It seems you have multiple Google accounts logged in. Please log out of other accounts and try again.');
    }
    throw new Error(e.message);
  }
}

