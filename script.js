var WEBHOOK_URL = 'https://yashsingh4564657.app.n8n.cloud/webhook-test/fcd2bb54-d5ba-4171-9fb0-c6ac30c1e098';

function callWebhook(form) {
  var payload = {
    fullname: (form.fullname && form.fullname.value || '').trim(),
    dob: form.dob && form.dob.value || '',
    place: (form.place && form.place.value || '').trim(),
    focus: form.focus && form.focus.value || '',
    email: (form.email && form.email.value || '').trim()
  };
  if (form.tob && form.tob.value) payload.tob = form.tob.value;
  if (form.gender && form.gender.value) payload.gender = form.gender.value;
  return fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
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
  if (modal) { modal.hidden = true; document.body.style.overflow = ''; }
}

function formatResponse(data) {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    var keys = ['message', 'data', 'result', 'prediction', 'reading', 'text', 'output', 'response'];
    for (var i = 0; i < keys.length; i++) {
      if (data[keys[i]] != null) return typeof data[keys[i]] === 'string' ? data[keys[i]] : JSON.stringify(data[keys[i]], null, 2);
    }
    return JSON.stringify(data, null, 2);
  }
  return String(data);
}

document.getElementById('astrology-form').onsubmit = function (e) {
  e.preventDefault();
  var form = e.target;
  var btn = document.getElementById('submit-btn');
  var btnText = btn ? btn.querySelector('.btn-text') : null;
  if (btn) { btn.disabled = true; if (btnText) btnText.textContent = 'Sending…'; }

  callWebhook(form)
    .then(function (res) {
      var ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.indexOf('application/json') !== -1) return res.json().then(function (d) { return { ok: res.ok, data: d }; });
      return res.text().then(function (t) { return { ok: res.ok, data: t }; });
    })
    .then(function (out) {
      var text = formatResponse(out.data);
      if (!out.ok) text = 'The request could not be completed.\n\n' + text;
      showResponse(text || 'No response received.', !out.ok);
    })
    .catch(function (err) {
      showResponse(err && err.message ? err.message : 'Could not reach the server. Please check your connection and try again.', true);
    })
    .finally(function () {
      if (btn) { btn.disabled = false; if (btnText) btnText.textContent = 'Get My Reading'; }
    });
};

document.querySelector('.modal-backdrop').onclick = hideResponse;
document.querySelector('.modal-close').onclick = hideResponse;
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !document.getElementById('response-modal').hidden) hideResponse();
});
