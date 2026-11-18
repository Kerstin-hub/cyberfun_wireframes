document.querySelectorAll('.group-inquiry').forEach(form => {
  const duration = form.elements.namedItem('duration');
  const attraction = form.elements.namedItem('bundleAttraction');
  if (duration && attraction) {
    const updateBundle = () => {
      const isBundle = duration.value === '1 hour + attraction';
      attraction.closest('label').hidden = !isBundle;
      attraction.disabled = !isBundle;
      attraction.required = isBundle;
    };
    duration.addEventListener('change', updateBundle);
    updateBundle();
  }
  const status = form.querySelector('.inquiry-status');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.hidden = false;
    status.textContent = 'Your details are ready. This wireframe preview does not send a request.';
    status.focus();
  });
});
