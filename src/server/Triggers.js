/**
 * Checks if the response limit has been reached every time the form is submitted.
 * @param {object} e The event parameter for an onFormSubmit trigger.
 */
function checkResponseLimit(e) {
  var form = FormApp.getActiveForm();
  var maxResponses = parseInt(scriptProperties.getProperty('maxResponses') || '0', 10);

  if (maxResponses <= 0) return; // If no limit is set, do nothing.

  var currentResponseCount = form.getResponses().length;

  // If the current response count is greater than or equal to the limit, close the form.
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