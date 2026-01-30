const WEBHOOK_URL = 'https://yashsingh4564657.app.n8n.cloud/webhook/fcd2bb54-d5ba-4171-9fb0-c6ac30c1e098';
function formatResponse(data) {
  if (typeof data === 'string') return data;

  if (data && typeof data === 'object') {
    var keys = ['message', 'data', 'result', 'prediction', 'reading', 'text', 'output', 'response'];

    for (var i = 0; i < keys.length; i++) {
      if (data[keys[i]] != null) {
        return typeof data[keys[i]] === 'string'
          ? data[keys[i]]
          : JSON.stringify(data[keys[i]], null, 2);
      }
    }

    // Fallback: pretty-print the full object
    return JSON.stringify(data, null, 2);
  }

  return String(data);
}

/**
 * Show a message inside the modal dialog.
 */
function showResponse(text, isError) {
  var modal = document.getElementById('response-modal');
  var body = document.getElementById('response-content');
  if (!modal || !body) return;

  body.textContent = text;
  body.className = 'modal-body' + (isError ? ' modal-body--error' : '');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

/**
 * Hide the response modal.
 */
function hideResponse() {
  var modal = document.getElementById('response-modal');
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
}

/**
 * Show a friendly inline success message under the form.
 */
function showInlineSuccess(email) {
  var box = document.getElementById('success-message');
  var emailSpan = document.getElementById('success-email');

  if (box) {
    if (emailSpan) {
      emailSpan.textContent = email || '';
    }
    box.hidden = false;
  }
}

/**
 * Clear any previous inline error message.
 */
function clearInlineError() {
  var error = document.getElementById('submit-error');
  if (error) {
    error.textContent = '';
    error.hidden = true;
  }
}

/**
 * Show a friendly inline error message under the form.
 */
function showInlineError(message) {
  var error = document.getElementById('submit-error');
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
}

/**
 * Send the form data to the n8n webhook using fetch() + async/await.
 * Maps DOM fields to the required JSON keys:
 *  - fullName
 *  - dateOfBirth
 *  - timeOfBirth (optional)
 *  - placeOfBirth
 *  - gender (optional)
 *  - focusArea
 *  - email
 */
async function sendToWebhook(form) {
  var payload = {
    fullName: (form.fullname && form.fullname.value || '').trim(),
    dateOfBirth: form.dob && form.dob.value || '',
    timeOfBirth: form.tob && form.tob.value ? form.tob.value : null,
    placeOfBirth: (form.place && form.place.value || '').trim(),
    gender: form.gender && form.gender.value ? form.gender.value : null,
    focusArea: form.focus && form.focus.value || '',
    email: (form.email && form.email.value || '').trim()
  };

  var response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  var contentType = (response.headers.get('content-type') || '').toLowerCase();
  var data;

  if (contentType.indexOf('application/json') !== -1) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { ok: response.ok, data: data };
}

/**
 * Attach the submit handler once the DOM is ready.
 * The handler:
 *  - prevents default HTML form submission
 *  - validates the form
 *  - sends data to n8n with fetch() + async/await
 *  - shows user-friendly success / error messages
 */
(function initFormHandler() {
  var form = document.getElementById('astrology-form');
  if (!form) return;

  var submitButton = document.getElementById('submit-btn');

  form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent page reload
    clearInlineError();

    // Let the browser run built-in HTML5 validation first
    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      return;
    }

    var buttonLabel = submitButton && submitButton.querySelector('.btn-text');
    if (submitButton) {
      submitButton.disabled = true;
      if (buttonLabel) buttonLabel.textContent = 'Sending…';
    }

    try {
      var result = await sendToWebhook(form);
      var messageText = formatResponse(result.data);

      if (result.ok) {
        // Show success both inline and in the modal
        showInlineSuccess(form.email && form.email.value ? form.email.value.trim() : '');
        showResponse(messageText || 'Your astrology reading request has been sent successfully.', false);
      } else {
        var baseError = 'The request could not be completed. Please try again in a moment.';
        showInlineError(baseError);
        showResponse(baseError + '\n\n' + (messageText || ''), true);
      }
    } catch (error) {
      var friendly = 'Could not reach the server. Please check your internet connection and try again.';
      showInlineError(friendly);
      showResponse(error && error.message ? error.message : friendly, true);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        if (buttonLabel) buttonLabel.textContent = 'Get My Reading';
      }
    }
  });

  // Modal close behaviour
  var backdrop = document.querySelector('.modal-backdrop');
  var closeBtn = document.querySelector('.modal-close');

  if (backdrop) backdrop.onclick = hideResponse;
  if (closeBtn) closeBtn.onclick = hideResponse;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !document.getElementById('response-modal').hidden) {
      hideResponse();
    }
  });
})();
