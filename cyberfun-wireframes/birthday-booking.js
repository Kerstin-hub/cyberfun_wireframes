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
  const productField = product.closest('.field');
  const productPosition = document.createComment('Default product field position');
  productField.before(productPosition);
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
  const guestsField = guests.closest('.field');
  const guestsPosition = document.createComment('Default guest field position');
  guestsField.before(guestsPosition);
  const calendar = form.querySelector('.calendar-grid');
  const dateField = calendar.closest('.field');
  const productLabel = form.querySelector('label[for="product"]');
  const guestsLabel = form.querySelector('label[for="guests"]');
  const dateLabel = dateField.querySelector('.field-label');
  const visitModeFields = form.querySelector('#package-primary-fields');
  const ticketDurationField = visitModeFields.querySelector('[data-hours]').closest('.field');
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
  const foodField = document.createElement('select');
  foodField.id = 'birthday-food'; foodField.name = 'birthday-food';
  const foodSection = document.createElement('div');
  foodSection.className = 'field birthday-food-section';
  const foodLegend = document.createElement('label');
  foodLegend.htmlFor = foodField.id;
  foodLegend.className = 'field-label';
  foodLegend.id = 'birthday-food-label';
  foodLegend.textContent = 'Additional Food Options · 2.000 Ft';
  foodField.setAttribute('aria-labelledby',foodLegend.id);
  foodSection.append(foodLegend,foodField);
  [['','No additional food'],['Chicken nuggets & Fries','Chicken nuggets & Fries'],['Pizza','Pizza']].forEach(([value,text])=>{
    const option=document.createElement('option');option.value=value;option.textContent=text;foodField.append(option);
  });
  const extrasSection=document.createElement('div');extrasSection.className='field birthday-food-section';
  const extrasLabel=document.createElement('label');extrasLabel.className='field-label';extrasLabel.textContent='Extras';extrasLabel.htmlFor='birthday-extras';
  const extrasField=document.createElement('select');extrasField.id='birthday-extras';extrasField.name='birthday-extras';
  [['','No extras'],['Kindersekt','Kindersekt - 5.000 Ft per bottle'],['Dekoration','Dekoration - 10.000 Ft'],['Present','Present']].forEach(([value,text])=>{
    const option=document.createElement('option');option.value=value;option.textContent=text;extrasField.append(option);
  });
  extrasSection.append(extrasLabel,extrasField);
  const cakeSection = document.createElement('div');
  cakeSection.className = 'field birthday-food-section';
  const cakeTitle = document.createElement('label');
  cakeTitle.className = 'field-label'; cakeTitle.id = 'birthday-cake-label';
  cakeTitle.textContent = 'Choose your cake';
  const cakeField = document.createElement('select');
  cakeField.id = 'birthday-cake';
  cakeField.name = 'birthday-cake';
  cakeTitle.htmlFor = cakeField.id;
  cakeField.setAttribute('aria-labelledby',cakeTitle.id);
  const cakePlaceholder = document.createElement('option');
  cakePlaceholder.value = ''; cakePlaceholder.textContent = 'Choose your cake';
  cakeField.append(cakePlaceholder);
  cakeSection.append(cakeTitle,cakeField);
  [
    {name:'Strawberry Cake',price:'Included',cake:true},
    {name:'Chocolate Cake',price:'Included',cake:true},
    {name:'Apple Cake',price:'Included',cake:true}
  ].forEach(({name,price:priceText,cake}) => {
    if (cake) {
      const option = document.createElement('option');
      option.value = name; option.textContent = `${name} - Included`;
      cakeField.append(option);
      return;
    }
    const optionLabel = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = cake ? 'radio' : 'checkbox'; checkbox.name = cake ? 'birthday-cake' : 'birthday-food'; checkbox.value = name;
    const offer = document.createElement('span');
    offer.className = 'birthday-food-offer';
    const offerName = document.createElement('span'); offerName.textContent = name;
    const price = document.createElement('strong'); price.textContent = priceText;
    offer.append(offerName,price);
    optionLabel.append(checkbox,offer);
    (cake ? cakeField : foodField).append(optionLabel);
  });
  form.querySelector('#birthday-fields').append(foodSection,extrasSection);
  packageIncludes.after(cakeSection);
  const foodRow = document.createElement('div');
  foodRow.className = 'summary-row hidden';
  const foodSummaryLabel = document.createElement('span'); foodSummaryLabel.textContent = 'Food options';
  const foodSummary = document.createElement('strong'); foodSummary.id = 'summary-birthday-food';
  foodRow.append(foodSummaryLabel,foodSummary);
  form.querySelector('.summary-row.total').before(foodRow);
  const extrasRow=document.createElement('div');extrasRow.className='summary-row hidden';
  const extrasSummaryLabel=document.createElement('span');extrasSummaryLabel.textContent='Extras';
  const extrasSummary=document.createElement('strong');extrasSummary.id='summary-birthday-extras';
  extrasRow.append(extrasSummaryLabel,extrasSummary);form.querySelector('.summary-row.total').before(extrasRow);
  const cakeRow = document.createElement('div');
  cakeRow.className = 'summary-row hidden';
  const cakeSummaryLabel = document.createElement('span'); cakeSummaryLabel.textContent = 'Cake';
  const cakeSummary = document.createElement('strong'); cakeSummary.id = 'summary-birthday-cake';
  cakeRow.append(cakeSummaryLabel,cakeSummary);
  form.querySelector('.summary-row.total').before(cakeRow);
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
  style.textContent += '.birthday-calendar-price{display:none}.birthday-flow .calendar-day:not(.empty){min-height:54px;padding:5px 1px 10px}.birthday-flow .birthday-calendar-price{display:block;margin-top:3px;font-size:9px;line-height:1.2;font-weight:600;white-space:normal}.birthday-flow .calendar-day::after{width:5px;height:5px;bottom:3px;right:3px}';
  document.head.append(style);
  const days = [...calendar.querySelectorAll('.calendar-day:not(.empty)')];
  days.forEach(day => {
    if (!day.dataset.date) {
      const month = form.querySelector('.calendar-head strong').textContent.trim().split(/\s+/);
      day.dataset.birthdayDate = `${day.textContent.trim()} ${month[0].slice(0,3)} ${month[1]}`;
    }
    const date = day.dataset.date || day.dataset.birthdayDate;
    const [dateNumber,monthName,year] = date.split(' ');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const weekday = new Date(Number(year),months.indexOf(monthName),Number(dateNumber)).getDay();
    const price = document.createElement('span');
    price.className = 'birthday-calendar-price';
    price.textContent = weekday === 0 || weekday >= 5 ? '9.150 Ft' : '7.850 Ft';
    day.append(price);
  });
  const originalSummary = updateSummary;
  updateSummary = function () {
    originalSummary();
    packageIncludes.hidden = currentCategory !== 'birthday';
    cakeSection.hidden = currentCategory !== 'birthday';
    cakeSection.style.display = currentCategory === 'birthday' ? '' : 'none';
    foodRow.classList.add('hidden');
    extrasRow.classList.add('hidden');
    cakeRow.classList.add('hidden');
    if (currentCategory !== 'birthday') return;
    const row = form.querySelector('#summary-attractions-row');
    row.classList.remove('hidden');
    form.querySelector('#summary-attractions').textContent = select.value;
    form.querySelector('#summary-duration-row').classList.add('hidden');
    foodSummary.textContent = foodField.value ? `${foodField.value} - 2.000 Ft` : '';
    foodRow.classList.toggle('hidden',!foodField.value);
    extrasSummary.textContent = extrasField.value ? extrasField.selectedOptions[0].textContent : '';
    extrasRow.classList.toggle('hidden',!extrasField.value);
    const chosenCake = cakeField.value;
    cakeSummary.textContent = chosenCake ? `${chosenCake} (Included)` : '';
    cakeRow.classList.toggle('hidden',!chosenCake);
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
    cakeSection.hidden = !birthday;
    cakeSection.style.display = birthday ? '' : 'none';
    form.classList.toggle('birthday-flow',birthday);
    if (currentCategory === 'ticket') ticketDurationField.before(productField);
    else productPosition.after(productField);
    if (birthday || currentCategory === 'ticket') product.after(guestsField);
    else guestsPosition.after(guestsField);
    modeButtons.forEach((button,index) => {
      button.innerHTML = birthday
        ? (button.dataset.mode === 'family' ? 'Kids Party<br>9:30-19:00' : 'Adult Party<br>17:00-22:00')
        : currentCategory === 'ticket'
          ? (button.dataset.mode === 'family' ? 'Family Time<br>(Kids until 15)' : 'Adult Time<br>(from 16 onwards)')
          : modeLabels[index];
    });
    field.hidden = !birthday;
    field.style.display = birthday ? '' : 'none';
    productLabel.textContent = birthday ? 'Choose package' : currentCategory === 'ticket' ? 'Choose attraction' : originalLabels[0];
    guestsLabel.textContent = birthday || currentCategory === 'ticket' ? 'Number of guests' : originalLabels[1];
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
  extrasField.addEventListener('change',updateSummary);
  cakeField.addEventListener('change',updateSummary);
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
