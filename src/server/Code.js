/**
 * @OnlyCurrentDoc
 * The above comment directs Apps Script to limit the scope of file access for this script
 * to only the current document containing the script.
 */

var scriptProperties = PropertiesService.getScriptProperties();

/**
 * Creates a menu entry in the Google Forms UI when the form is opened.
 * @param {object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  FormApp.getUi()
    .createMenu('Form Limiter')
    .addItem('⚙️ Configure Limiter', 'showLimitDialog')
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 * @param {object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Displays a modal dialog with the limiter settings.
 */
function showLimitDialog() {
  var form = FormApp.getActiveForm();

  var currentResponseCount = form.getResponses().length;
  var maxResponses = scriptProperties.getProperty('maxResponses') || "Not set";
  var confirmationMessage = form.getConfirmationMessage() || "Your response has been recorded.";
  var closedMessage = form.getCustomClosedFormMessage() || "This form is no longer accepting responses.";

  var template = HtmlService.createTemplateFromFile('index');
  template.maxResponses = maxResponses;
  template.currentResponses = currentResponseCount;
  template.confirmationMessage = confirmationMessage;
  template.closedMessage = closedMessage;

  var ui = template.evaluate().setWidth(450).setHeight(550);
  FormApp.getUi().showModalDialog(ui, 'Limiter Settings');
}

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
    return 'Error: Please enter a valid number greater than zero.';
  } catch (e) {
    if (e.message.includes('PERMISSION_DENIED')) {
      return 'Permission Error: It seems you have multiple Google accounts logged in. Please log out of other accounts and try again.';
    }
    return 'Unexpected error: ' + e.message;
  }
}

/**
 * Checks if the response limit has been reached every time the form is submitted.
 * Uses the real response count for better accuracy.
 * @param {object} e The event parameter for an onFormSubmit trigger.
 */
function checkResponseLimit(e) {
  var form = FormApp.getActiveForm();
  var maxResponses = parseInt(scriptProperties.getProperty('maxResponses') || '0', 10);

  if (maxResponses <= 0) return; // If no limit is set, do nothing.

  var currentResponseCount = form.getResponses().length;

  // If the current response count is greater than or equal to the limit, close the form.
  // This is the correct logic cause the script runs AFTER the `maxResponses`-th response has been recorded.
  if (currentResponseCount >= (maxResponses)) {
    form.setAcceptingResponses(false);
  }
}

/**
 * Creates an onFormSubmit trigger for the checkResponseLimit function if it doesn't exist.
 */
function setTrigger() {
  var formId = FormApp.getActiveForm().getId();
  var triggers = ScriptApp.getProjectTriggers();
  var triggerExists = triggers.some(function(trigger) {
    return trigger.getHandlerFunction() === 'checkResponseLimit' &&
           trigger.getTriggerSourceId() === formId;
  });

  if (!triggerExists) {
    ScriptApp.newTrigger('checkResponseLimit')
      .forForm(FormApp.getActiveForm())
      .onFormSubmit()
      .create();
  }
}
