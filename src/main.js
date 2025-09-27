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

  // The .setWidth() and .setHeight() methods have been removed to make the dialog responsive.
  var ui = template.evaluate();
  FormApp.getUi().showModalDialog(ui, 'Limiter Settings');
}

