var scriptProperties = PropertiesService.getScriptProperties();

/**
 * Checks if the response limit has been reached every time the form is submitted.
 * @param {object} e The event parameter for an onFormSubmit trigger.
 */
function checkResponseLimit(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // Wait for any other modifications to finish.
  try {
    var form = FormApp.getActiveForm();
    var maxResponses = parseInt(scriptProperties.getProperty('maxResponses') || '0', 10);

    if (maxResponses <= 0) return;

    // We only need to check if the form is still open
    if (form.isAcceptingResponses()) {
      var currentResponseCount = form.getResponses().length;
      if (currentResponseCount >= maxResponses) {
        form.setAcceptingResponses(false);
      }
    }
  } finally {
    lock.releaseLock(); // Release the lock
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