const WEBHOOK_URL = 'https://yash775446.app.n8n.cloud/webhook/fcd2bb54-d5ba-4171-9fb0-c6ac30c1e098';
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

    return JSON.stringify(data, null, 2);
  }

  return String(data);
}

function showResponse(text, isError) {
  var modal = document.getElementById('response-modal');
  var body = document.getElementById('response-content');
  if (!modal || !body) return;

  body.textContent = text;
  body.className = 'modal-body' + (isError ? ' modal-body--error' : '');
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function hideResponse() {
  var modal = document.getElementById('response-modal');
  if (modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
}

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

function clearInlineError() {
  var error = document.getElementById('submit-error');
  if (error) {
    error.textContent = '';
    error.hidden = true;
  }
}

function showInlineError(message) {
  var error = document.getElementById('submit-error');
  if (error) {
    error.textContent = message;
    error.hidden = false;
  }
}

async function sendToWebhook(form) {
  var raw = {
    fullname: (form.fullname && form.fullname.value || '').trim(),
    dob: form.dob && form.dob.value || '',
    tob: form.tob && form.tob.value ? form.tob.value : null,
    place: (form.place && form.place.value || '').trim(),
    gender: form.gender && form.gender.value ? form.gender.value : null,
    focus: form.focus && form.focus.value || '',
    email: (form.email && form.email.value || '').trim()
  };

  var payload = {
    raw: raw,
    fullName: raw.fullname,
    dateOfBirth: raw.dob,
    timeOfBirth: raw.tob,
    placeOfBirth: raw.place,
    gender: raw.gender,
    focusArea: raw.focus,
    email: raw.email
  };

  console.log('Sending payload to webhook:', payload);

  var response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  console.log('Response status:', response.status);

  var contentType = (response.headers.get('content-type') || '').toLowerCase();
  var bodyText = await response.text();
  var data;

  console.log('Response body:', bodyText);

  if (contentType.indexOf('application/json') !== -1 && bodyText.trim()) {
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      data = bodyText;
    }
  } else if (bodyText.trim()) {
    data = bodyText;
  } else {
    data = 'Request processed successfully';
  }

  return { ok: response.ok, data: data };
}

(function initFormHandler() {
  var form = document.getElementById('astrology-form');
  if (!form) return;

  var submitButton = document.getElementById('submit-btn');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    clearInlineError();

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
