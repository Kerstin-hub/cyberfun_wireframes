document.querySelectorAll('.group-inquiry').forEach(form => {
  const status = form.querySelector('.inquiry-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.hidden = false;
    status.textContent = 'Your details are ready. This wireframe preview does not send a request.';
    status.focus();
  });
});
