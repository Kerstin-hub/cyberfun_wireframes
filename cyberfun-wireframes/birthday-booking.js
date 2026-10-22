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
  const foodField = document.createElement('fieldset');
  foodField.className = 'birthday-food-options';
  const foodLegend = document.createElement('legend');
  foodLegend.textContent = 'Additional Food Options';
  foodField.append(foodLegend);
  ['Chicken nuggets & Fries','Pizza'].forEach(name => {
    const optionLabel = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox'; checkbox.name = 'birthday-food'; checkbox.value = name;
    optionLabel.append(checkbox,document.createTextNode(name));
    foodField.append(optionLabel);
  });
  form.querySelector('#birthday-fields').append(foodField);
  const foodRow = document.createElement('div');
  foodRow.className = 'summary-row hidden';
  const foodSummaryLabel = document.createElement('span'); foodSummaryLabel.textContent = 'Food options';
  const foodSummary = document.createElement('strong'); foodSummary.id = 'summary-birthday-food';
  foodRow.append(foodSummaryLabel,foodSummary);
  form.querySelector('.summary-row.total').before(foodRow);
  const style = document.createElement('style');
  style.textContent = `.birthday-flow #birthday-duration-field{display:none!important}
    .birthday-food-options{display:grid;gap:12px;min-width:0;margin:18px 0;padding:14px;border:1px solid var(--line);border-radius:6px}
    .birthday-food-options legend{padding:0 5px;color:var(--muted);font-size:12px;font-weight:800}
    .birthday-food-options label{display:flex;gap:10px;align-items:center;font-size:14px;line-height:1.4;cursor:pointer}
    .birthday-food-options input{width:18px;height:18px;flex:0 0 18px;margin:0}`;
  document.head.append(style);
  const days = [...calendar.querySelectorAll('.calendar-day:not(.empty)')];
  days.forEach(day => {
    if (!day.dataset.date) {
      const month = form.querySelector('.calendar-head strong').textContent.trim().split(/\s+/);
      day.dataset.birthdayDate = `${day.textContent.trim()} ${month[0].slice(0,3)} ${month[1]}`;
    }
  });
  const originalSummary = updateSummary;
  updateSummary = function () {
    originalSummary();
    foodRow.classList.add('hidden');
    if (currentCategory !== 'birthday') return;
    const row = form.querySelector('#summary-attractions-row');
    row.classList.remove('hidden');
    form.querySelector('#summary-attractions').textContent = select.value;
    form.querySelector('#summary-duration-row').classList.add('hidden');
    const selectedFoods = [...foodField.querySelectorAll('input:checked')].map(input=>input.value);
    foodSummary.textContent = selectedFoods.join(', ');
    foodRow.classList.toggle('hidden',selectedFoods.length === 0);
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
    if (birthday) { setDurationFromPackage(); updateSummary(); }
  };
  form.querySelectorAll('.category-tab').forEach(button => button.addEventListener('click',sync));
  product.addEventListener('change',() => { if(currentCategory === 'birthday'){setDurationFromPackage();updateSummary();} });
  select.addEventListener('change',updateSummary);
  foodField.addEventListener('change',updateSummary);
  calendar.addEventListener('click',event => {
    if(currentCategory !== 'birthday') return;
    const day = event.target.closest('.calendar-day:not(.empty)');
    if (!day || day.disabled || day.classList.contains('sold')) return;
    event.stopImmediatePropagation();
    days.forEach(item=>item.classList.toggle('selected',item===day));
    currentDate = day.dataset.date || day.dataset.birthdayDate;
    updateSummary();
  },true);
  sync();
})();
