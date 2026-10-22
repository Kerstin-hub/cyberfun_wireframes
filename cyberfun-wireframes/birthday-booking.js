(() => {
  const form = document.querySelector('form.checkout');
  if (!form || !form.querySelector('[data-category="birthday"]')) return;
  form.querySelectorAll('[data-category="package"],[data-category="attraction"]').forEach(button => {
    button.hidden = true;
    button.style.display = 'none';
  });
  form.querySelector('.category-tabs').style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
  if (!['birthday','ticket'].includes(currentCategory)) {
    form.querySelector('[data-category="birthday"]').click();
  }
  const product = form.querySelector('#product');
  const packageIncludes = document.createElement('div');
  packageIncludes.className = 'birthday-package-includes';
  packageIncludes.setAttribute('aria-label','Included in your package');
  const includesTitle = document.createElement('span');
  includesTitle.className = 'field-label'; includesTitle.textContent = 'Included';
  const includesList = document.createElement('ul');
  ['1 hour jumping','1 hour at the party table','Cake / Shot','Drink','Socks'].forEach(text=>{
    const item=document.createElement('li'); item.textContent=text; includesList.append(item);
  });
  packageIncludes.append(includesTitle,includesList);
  product.after(packageIncludes);
  const guests = form.querySelector('#guests');
  const calendar = form.querySelector('.calendar-grid');
  const dateField = calendar.closest('.field');
  const productLabel = form.querySelector('label[for="product"]');
  const guestsLabel = form.querySelector('label[for="guests"]');
  const dateLabel = dateField.querySelector('.field-label');
  const visitModeFields = form.querySelector('#package-primary-fields');
  const partySlots = form.querySelector('#party-slots');
  const familyPartySlots = partySlots.innerHTML;
  const modeButtons = [...form.querySelectorAll('[data-mode]')];
  const modeLabels = modeButtons.map(button => button.innerHTML);
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
  const foodSection = document.createElement('div');
  foodSection.className = 'field birthday-food-section';
  const foodLegend = document.createElement('span');
  foodLegend.className = 'field-label';
  foodLegend.id = 'birthday-food-label';
  foodLegend.textContent = 'Additional Food Options';
  foodField.setAttribute('aria-labelledby',foodLegend.id);
  foodSection.append(foodLegend,foodField);
  [
    {name:'Chicken nuggets & Fries',price:'5.000 Ft'},
    {name:'Pizza',price:'5.000 Ft'},
    {name:'Kids Champagne',price:'5.000 Ft per bottle'},
    {name:'Decoration',price:'10.000 Ft'},
    {name:'Cake "Boy"',price:'Included',cake:true},
    {name:'Cake "Girl"',price:'Included',cake:true}
  ].forEach(({name,price:priceText,cake}) => {
    const optionLabel = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = cake ? 'radio' : 'checkbox'; checkbox.name = cake ? 'birthday-cake' : 'birthday-food'; checkbox.value = name;
    const offer = document.createElement('span');
    offer.className = 'birthday-food-offer';
    const offerName = document.createElement('span'); offerName.textContent = name;
    const price = document.createElement('strong'); price.textContent = priceText;
    offer.append(offerName,price);
    optionLabel.append(checkbox,offer);
    foodField.append(optionLabel);
  });
  form.querySelector('#birthday-fields').append(foodSection);
  const foodRow = document.createElement('div');
  foodRow.className = 'summary-row hidden';
  const foodSummaryLabel = document.createElement('span'); foodSummaryLabel.textContent = 'Food options';
  const foodSummary = document.createElement('strong'); foodSummary.id = 'summary-birthday-food';
  foodRow.append(foodSummaryLabel,foodSummary);
  form.querySelector('.summary-row.total').before(foodRow);
  const style = document.createElement('style');
  style.textContent = `.birthday-flow #birthday-duration-field{display:none!important}
    .birthday-package-includes{margin-top:8px;padding:12px 0;border-bottom:1px solid var(--line)}
    .birthday-package-includes .field-label{color:var(--muted);font-size:.75rem;font-weight:900;text-transform:uppercase}
    .birthday-package-includes ul{display:grid;gap:6px;margin:10px 0 0;padding-left:18px;color:var(--ink);font-size:14px;line-height:1.45}
    .birthday-flow #package-primary-fields>.field:nth-child(2){display:none!important}
    .birthday-food-section{margin-top:18px}
    .birthday-food-section>.field-label{color:var(--muted);font-size:.75rem;font-weight:900;text-transform:uppercase}
    .birthday-food-options{display:grid;grid-template-columns:minmax(0,1fr);gap:0;min-width:0;margin:0;padding:0;border:0}
    .birthday-food-options label{display:flex;gap:8px;align-items:center;min-width:0;min-height:42px;box-sizing:border-box;padding:8px 0;border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent;font-size:13px;line-height:1.35;cursor:pointer}
    .birthday-food-options label:has(input:checked){background:var(--soft)}
    .birthday-food-options label:focus-within{outline:2px solid #1684d8;outline-offset:2px}
    .birthday-food-options input{width:18px;height:18px;flex:0 0 18px;margin:0}`;
  style.textContent += '.birthday-food-offer{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;min-width:0;flex:1}.birthday-food-offer strong{font-size:12px;white-space:normal;text-align:right;max-width:100px}';
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
    packageIncludes.hidden = currentCategory !== 'birthday';
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
  const syncBirthdayTimes = () => {
    if (currentCategory !== 'birthday') return;
    partySlots.innerHTML = currentMode === 'adult'
      ? ['17:00','18:00','19:00','20:00','21:00'].map((time,index)=>`<button type="button" class="time-slot ${index===1?'limited':''}" data-time="${time}">${time}</button>`).join('')
      : familyPartySlots;
    const first = partySlots.querySelector('.time-slot:not(:disabled)');
    partySlots.querySelectorAll('.time-slot').forEach(button=>button.classList.toggle('selected',button===first));
    if(first) currentTime=first.dataset.time;
    bindTimeSlots(partySlots);
    updateSummary();
  };
  const sync = () => {
    const birthday = currentCategory === 'birthday';
    packageIncludes.hidden = !birthday;
    form.classList.toggle('birthday-flow',birthday);
    modeButtons.forEach((button,index) => {
      button.innerHTML = birthday
        ? (button.dataset.mode === 'family' ? 'Kids Party<br>9:30-19:00' : 'Adult Party<br>17:00-22:00')
        : modeLabels[index];
    });
    field.hidden = !birthday;
    field.style.display = birthday ? '' : 'none';
    productLabel.textContent = birthday ? 'Choose package' : originalLabels[0];
    guestsLabel.textContent = birthday ? 'Number of guests' : originalLabels[1];
    dateLabel.textContent = birthday ? 'Choose day' : originalLabels[2];
    if (birthday) {
      visitModeFields.classList.remove('hidden');
      setDurationFromPackage();
      syncBirthdayTimes();
      updateSummary();
    }
  };
  form.querySelectorAll('.category-tab').forEach(button => button.addEventListener('click',sync));
  product.addEventListener('change',() => { if(currentCategory === 'birthday'){setDurationFromPackage();updateSummary();} });
  select.addEventListener('change',updateSummary);
  form.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',syncBirthdayTimes));
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
