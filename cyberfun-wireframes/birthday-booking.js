(() => {
  const form = document.querySelector('form.checkout');
  if (!form || !form.querySelector('[data-category="birthday"]')) return;
  const product = form.querySelector('#product');
  const guests = form.querySelector('#guests');
  const calendar = form.querySelector('.calendar-grid');
  const dateField = calendar.closest('.field');
  const productLabel = form.querySelector('label[for="product"]');
  const guestsLabel = form.querySelector('label[for="guests"]');
  const dateLabel = dateField.querySelector('.field-label');
  const originalLabels = [productLabel.textContent, guestsLabel.textContent, dateLabel.textContent];
  const field = document.createElement('div');
  field.className = 'field';
  field.id = 'birthday-attraction-field';
  const label = document.createElement('label');
  label.htmlFor = 'birthday-attraction'; label.textContent = 'Choose attraction';
  const select = document.createElement('select'); select.id = 'birthday-attraction';
  ['Trampoline','Pixel','Lasertag','Darts','Karaoke'].forEach(name => {
    const option = document.createElement('option'); option.textContent = name; select.append(option);
  });
  field.append(label,select); dateField.before(field);
  const style = document.createElement('style');
  style.textContent = `.birthday-flow #birthday-duration-field{display:none!important}
    .birthday-flow .calendar-day::after{display:none!important}
    .birthday-flow .availability-legend{display:none!important}
    .birthday-flow .calendar-day:not(.empty):not(.selected){background:var(--paper);color:var(--ink);text-decoration:none;cursor:pointer}
    .birthday-flow .calendar-day.selected{background:var(--ink);color:white;text-decoration:none}`;
  document.head.append(style);
  const days = [...calendar.querySelectorAll('.calendar-day:not(.empty)')];
  const originalDisabled = days.map(day => day.disabled);
  days.forEach(day => {
    if (!day.dataset.date) {
      const month = form.querySelector('.calendar-head strong').textContent.trim().split(/\s+/);
      day.dataset.birthdayDate = `${day.textContent.trim()} ${month[0].slice(0,3)} ${month[1]}`;
    }
  });
  const originalSummary = updateSummary;
  updateSummary = function () {
    originalSummary();
    if (currentCategory !== 'birthday') return;
    const row = form.querySelector('#summary-attractions-row');
    row.classList.remove('hidden');
    form.querySelector('#summary-attractions').textContent = select.value;
    form.querySelector('#summary-duration-row').classList.add('hidden');
  };
  const setDurationFromPackage = () => {
    const name = product.selectedOptions[0]?.textContent || '';
    currentDuration = /\b1h\b/i.test(name) ? 1 : 2;
    const match = [...select.options].find(option => name.toLowerCase().includes(option.value.toLowerCase()));
    select.value = match?.value || 'Trampoline';
  };
  const sync = () => {
    const birthday = currentCategory === 'birthday';
    form.classList.toggle('birthday-flow',birthday);
    field.hidden = !birthday;
    field.style.display = birthday ? '' : 'none';
    productLabel.textContent = birthday ? 'Choose package' : originalLabels[0];
    guestsLabel.textContent = birthday ? 'Number of guests' : originalLabels[1];
    dateLabel.textContent = birthday ? 'Choose day' : originalLabels[2];
    days.forEach((day,index) => { day.disabled = birthday ? false : originalDisabled[index]; });
    if (birthday) { setDurationFromPackage(); updateSummary(); }
  };
  form.querySelectorAll('.category-tab').forEach(button => button.addEventListener('click',sync));
  product.addEventListener('change',() => { if(currentCategory === 'birthday'){setDurationFromPackage();updateSummary();} });
  select.addEventListener('change',updateSummary);
  calendar.addEventListener('click',event => {
    if(currentCategory !== 'birthday') return;
    const day = event.target.closest('.calendar-day:not(.empty)');
    if (!day) return;
    event.stopImmediatePropagation();
    days.forEach(item=>item.classList.toggle('selected',item===day));
    currentDate = day.dataset.date || day.dataset.birthdayDate;
    updateSummary();
  },true);
  sync();
})();
