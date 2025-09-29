
# <img src="https://raw.githubusercontent.com/NicolasSchkurko/Form-Limiter/refs/heads/main/misc/Limiter.svg" alt="Lofo" width="50"/> Form Limiter


A simple yet powerful free Google Forms add-on to limit the number of responses a form will accept. Once the limit is reached, the form is closed automatically, and a custom message can be displayed to visitors.

### Features
- **Set Response Limits:** Easily set a maximum number of responses for your form.
- **Automated Closing:** The add-on automatically closes the form as soon as the limit is reached.
- **Custom Messages:** Customize both the confirmation message (after a successful submission) and the message shown when the form is closed.
- **Modern UI:** A clean, responsive, and easy-to-use interface to manage the settings.


### How to Use
- **Install the Add-on:** Install it from the Google Workspace Marketplace.
- **Open the Add-on:** In your Google Form, click on the puzzle piece icon (Add-ons), select "Form Limiter," and then click "⚙️ Configure Limiter."
- **Set the Limit:** In the dialog, enter the maximum number of responses you want to accept in the "Set Response Limit" field and click "Save Limit."
- **Customize Messages (Optional):** You can also update the confirmation message and the message that will be shown once the form is closed. Click the corresponding "Update" button to save each message.

The add-on will then monitor new submissions. When the total number of responses reaches the limit you set, it will automatically stop accepting new responses.


### Technical Notes
This section documents some specific behaviors and design choices.

**Updating the "Closed Form" Message**
- **Problem:** The Google Apps Script API can throw an error if you try to modify the closed-form message while the form is already closed.
- **Solution:** To work around this, the function temporarily re-opens the form, applies the new message, and then immediately closes it again. This is almost invisible to the user and ensures the message can be updated at any time.

Preventing Race Conditions
- The add-on uses Google's LockService to prevent "race conditions." This ensures that simultaneous form submissions or administrative actions don't cause conflicts or exceed the response limit.

### License
This project is licensed under the GNU General Public License v3.0.