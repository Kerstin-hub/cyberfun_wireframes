(() => {
  const form=document.querySelector('form.checkout');
  if(!form?.querySelector('#birthday-attraction'))return;
  // Prices are per person; index 0 is Mon-Thu, index 1 is Fri-Sun.
  const packages=[
    {name:'Jump Party',price:[6250,7150],food:[8100,9000],jump:1,games:0,gameMinutes:0,socks:true},
    {name:'Jump Star',price:[7850,9150],food:[9700,11000],jump:2,games:0,gameMinutes:0,socks:true},
    {name:'Jump Fun Party',price:[6800,6800],food:[8650,8650],jump:0,games:1,gameMinutes:60,socks:true},
  ];
  products.birthday=packages.map(item=>({name:item.name,price:item.price[0],basis:'Per person'}));
  const product=form.querySelector('#product');
  const guests=form.querySelector('#guests');
  const attraction=form.querySelector('#birthday-attraction');
  const attractionField=form.querySelector('#birthday-attraction-field');
  const food=form.querySelector('#birthday-food');
  const extra=form.querySelector('#birthday-extras');
  const foodSection=food.closest('.field');
  food.hidden=true;
  const foodOptions=document.createElement('div');foodOptions.className='birthday-food-options';
  ['Chicken nuggets & Fries','Pizza',''].forEach(value=>{
    const label=document.createElement('label');const input=document.createElement('input');
    input.type='radio';input.name='birthday-food-choice';input.value=value;input.checked=!value;
    const text=document.createElement('span');text.dataset.foodName=value;
    label.append(input,text);foodOptions.append(label);
    input.addEventListener('change',()=>{food.value=value;updateSummary();});
  });
  food.after(foodOptions);
  const cake=form.querySelector('#birthday-cake');
  cake.hidden=true;
  const cakeOptions=document.createElement('div');cakeOptions.className='birthday-food-options';
  [...cake.options].filter(option=>option.value).forEach(option=>{
    const label=document.createElement('label');const input=document.createElement('input');
    input.type='radio';input.name='birthday-cake-choice';input.value=option.value;input.checked=cake.value===option.value;
    label.append(input,document.createTextNode(option.value));cakeOptions.append(label);
    input.addEventListener('change',()=>{cake.value=input.value;updateSummary();});
  });
  cake.after(cakeOptions);
  form.querySelector('#birthday-cake-label').textContent='Choose cake (included)';
  foodSection.after(cake.closest('.field'));
  const extrasSection=extra.closest('.field');extra.hidden=true;
  const champagneRow=document.createElement('div');champagneRow.className='birthday-champagne-option';
  const champagneLabel=document.createElement('label');champagneLabel.className='birthday-decoration-option';
  const champagneEnabled=document.createElement('input');champagneEnabled.type='checkbox';
  const champagneText=document.createElement('span');champagneText.textContent='Kids Champagne · 5.000 Ft / bottle';
  champagneLabel.append(champagneEnabled,champagneText);
  const champagne=document.createElement('select');champagne.id='birthday-champagne';champagne.setAttribute('aria-label','Number of Kids Champagne bottles');champagne.disabled=true;
  for(let count=1;count<=20;count++){const option=document.createElement('option');option.value=String(count);option.textContent=String(count);champagne.append(option);}
  champagneRow.append(champagneLabel,champagne);
  const decorationLabel=document.createElement('label');decorationLabel.className='birthday-decoration-option';
  const decoration=document.createElement('input');decoration.type='checkbox';
  const decorationText=document.createElement('span');decorationText.textContent='Decoration · 10.000 Ft';
  decorationLabel.append(decoration,decorationText);
  extrasSection.append(champagneRow,decorationLabel);
  champagneEnabled.addEventListener('change',()=>{champagne.disabled=!champagneEnabled.checked;updateSummary();});
  champagne.addEventListener('change',()=>updateSummary());decoration.addEventListener('change',()=>updateSummary());
  const timeHint=document.createElement('p');timeHint.className='birthday-time-hint';timeHint.textContent='Your time is not available? Try another day or a different attraction.';
  form.querySelector('#party-slots').after(timeHint);
  const cleanLimited=()=>{
    form.querySelectorAll('.limited').forEach(node=>node.classList.remove('limited'));
    form.querySelectorAll('.availability-legend span').forEach(node=>{if(node.textContent.trim()==='Limited')node.hidden=true;});
  };
  new MutationObserver(cleanLimited).observe(form,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  cleanLimited();
  const extrasStyle=document.createElement('style');extrasStyle.textContent='.field .birthday-decoration-option{display:flex;align-items:center;gap:10px;min-width:0;margin-top:12px;white-space:normal}.field .birthday-decoration-option input{flex:0 0 18px;width:18px;height:18px;min-height:18px;padding:0;margin:0}.birthday-decoration-option span{min-width:0;overflow-wrap:break-word}';document.head.append(extrasStyle);
  const includes=form.querySelector('.birthday-package-includes ul');
  extrasStyle.textContent+='.birthday-champagne-option{display:flex;align-items:center;gap:10px;margin-top:12px}.field .birthday-champagne-option label{flex:1;margin-top:0}.field .birthday-champagne-option select{flex:0 0 64px;width:64px;min-height:36px;padding:6px}.birthday-champagne-option select:disabled{opacity:.5}';
  [foodSection,cake.closest('.field'),extrasSection].forEach(section=>section.classList.add('birthday-compact-options'));
  extrasStyle.textContent+=`
    .birthday-compact-options{margin-top:14px!important;gap:4px}
    .birthday-compact-options select[hidden]{display:none!important}
    .birthday-compact-options .birthday-food-options label,
    .birthday-compact-options .birthday-decoration-option{display:flex;align-items:center;gap:8px;min-height:36px;margin:0;padding:6px 0;box-sizing:border-box;border:0;border-bottom:1px solid var(--line);font-size:13px;font-weight:500;line-height:1.35;text-transform:none;background:transparent!important;cursor:pointer}
    .birthday-compact-options .birthday-champagne-option{gap:8px;margin:0;border-bottom:1px solid var(--line);min-height:40px}
    .birthday-compact-options .birthday-champagne-option label{border:0}
    .birthday-compact-options input[type=radio],.birthday-compact-options input[type=checkbox]{appearance:none!important;display:block;flex:0 0 16px;width:16px!important;height:16px!important;min-height:16px!important;margin:0!important;padding:0!important;border:1px solid var(--muted)!important;background:var(--paper)!important;box-shadow:none!important;position:relative}
    .birthday-compact-options input[type=radio]{border-radius:50%!important}
    .birthday-compact-options input[type=checkbox]{border-radius:3px!important}
    .birthday-compact-options input:checked{border-color:var(--ink)!important;background:var(--ink)!important;box-shadow:inset 0 0 0 3px var(--paper)!important}
    .birthday-compact-options input:focus-visible{outline:2px solid #1684d8;outline-offset:3px}
    .field .birthday-compact-options select#birthday-champagne{flex-basis:54px;width:54px;min-height:30px;padding:3px 5px;font-size:13px}
  `;
  const calendar=form.querySelector('.calendar-grid');
  const calendarField=calendar.closest('.field');
  const calendarMinimums=new Map();
  calendar.querySelectorAll('.calendar-day:not(.empty)').forEach(button=>{
    const minimum=document.createElement('span');minimum.className='birthday-calendar-minimum';
    button.querySelector('.birthday-calendar-price').after(minimum);
    calendarMinimums.set(button,minimum);
  });
  const next=form.querySelector('.summary .button.block');
  const note=document.createElement('p');note.className='birthday-package-pricing';note.setAttribute('aria-live','polite');
  product.after(note);
  const secondField=document.createElement('div');secondField.className='field';
  const secondLabel=document.createElement('label');secondLabel.textContent='Choose second attraction';secondLabel.htmlFor='birthday-second-attraction';
  const second=document.createElement('select');second.id='birthday-second-attraction';
  secondField.append(secondLabel,second);attractionField.after(secondField);
  const minimumRow=document.createElement('div');minimumRow.className='summary-row hidden';
  const minimumLabel=document.createElement('span');minimumLabel.textContent='Minimum guests';
  const minimumValue=document.createElement('strong');minimumValue.id='summary-birthday-minimum';
  minimumRow.append(minimumLabel,minimumValue);form.querySelector('#summary-person-row').before(minimumRow);
  const warning=document.createElement('div');warning.className='ticket-minimum-warning birthday-minimum-warning';warning.hidden=true;
  const warningText=document.createElement('p');warningText.setAttribute('role','status');
  const actions=document.createElement('div');actions.className='ticket-minimum-actions';
  const increase=document.createElement('button');increase.type='button';
  const changeDay=document.createElement('button');changeDay.type='button';changeDay.textContent='Choose another day';actions.append(increase,changeDay);warning.append(warningText,actions);calendarField.after(warning);
  const style=document.createElement('style');style.textContent='.birthday-package-pricing{margin:8px 0;font-size:12px;line-height:1.5;color:var(--muted)}.birthday-package-pricing[hidden],.birthday-minimum-warning[hidden]{display:none!important}.birthday-calendar-minimum{display:none}.birthday-flow .calendar-day:not(.empty){min-height:84px}.birthday-flow .birthday-calendar-price{margin-top:10px}.birthday-flow .birthday-calendar-minimum{display:block;margin-top:5px;font-size:8px;line-height:1.2;font-weight:400;white-space:normal}';document.head.append(style);
  const format=value=>new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const dayIndex=(date=currentDate)=>{
    const [day,month,year]=date.split(' ');
    const index=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month);
    const weekday=new Date(Number(year),index,Number(day)).getDay();return weekday===0||weekday>=5?1:0;
  };
  const chosen=()=>packages[Number(product.value)||0]||packages[0];
  const populateAttractions=()=>{
    const allowed=['Pixel','Karaoke','Lasertag','Darts'];
    [attraction,second].forEach(select=>{
      const value=select.value;select.replaceChildren();
      allowed.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option);});
      if(allowed.includes(value))select.value=value;
    });
  };
  const originalSummary=updateSummary;
  updateSummary=function(){
    if(currentCategory==='birthday')currentDuration=chosen().jump||chosen().games*chosen().gameMinutes/60;
    originalSummary();
    warning.hidden=true;minimumRow.classList.add('hidden');note.hidden=currentCategory!=='birthday';
    secondField.style.display='none';
    if(currentCategory!=='birthday')return;
    if(currentMode==='adult'&&chosen().jump){product.value=String(packages.findIndex(item=>!item.jump));}
    [...product.options].forEach(option=>{option.hidden=currentMode==='adult'&&!!packages[Number(option.value)]?.jump;option.disabled=option.hidden;});
    const productField=product.closest('.field');
    product.after(form.querySelector('.birthday-package-includes'));
    product.after(note);
    productField.after(attractionField);
    attractionField.after(guests.closest('.field'));
    const item=chosen(),day=dayIndex(),minimum=day===1?8:4;
    const count=Math.max(0,Math.floor(Number(guests.value)||0));
    guests.min='1';
    form.querySelector('label[for="guests"]').textContent='Number of guests (Mon–Thu from 4 guests. Fri–Sun from 8 guests.)';
    note.textContent='Prices and minimum guest numbers vary by day of the week.';
    [...product.options].forEach((option,index)=>{if(packages[index])option.textContent=`${packages[index].name} - from ${format(Math.min(...packages[index].price))} / person · from 4 guests`;});
    const included=[];
    if(item.jump)included.push(`${item.jump} ${item.jump===1?'hour':'hours'} jumping`);
    if(item.games)included.push(`${item.games===2?'2 games':'1 game'} · ${item.gameMinutes} minutes${item.games===2?' each':''}`);
    included.push('1 hour at the party table','Cake / Shot','Drink');if(item.socks)included.push('Socks');
    includes.replaceChildren(...included.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
    attractionField.style.display=item.games?'':'none';
    secondField.style.display=item.games===2?'':'none';
    const row=form.querySelector('#summary-attractions-row');row.classList.remove('hidden');
    form.querySelector('#summary-attractions').textContent=item.games?`${item.jump?'Jumping + ':''}${attraction.value}${item.games===2?' + '+second.value:''}`:'Jumping';
    const perPerson=food.value?item.food[day]:item.price[day];
    const bottles=champagneEnabled.checked?Math.max(0,Math.floor(Number(champagne.value)||0)):0;
    const extrasPrice=bottles*5000+(decoration.checked?10000:0);
    form.querySelector('#summary-product').textContent=item.name;
    form.querySelector('#summary-guests').textContent=String(count);
    form.querySelector('#summary-basis').textContent=format(perPerson);
    form.querySelector('#summary-total').textContent=format(perPerson*count+extrasPrice);
    form.querySelector('#birthday-food-label').textContent='Choose Food';
    foodOptions.querySelectorAll('[data-food-name]').forEach(label=>{label.textContent=label.dataset.foodName?`${label.dataset.foodName} · +${format(item.food[day]-item.price[day])} / person`:'No additional food';});
    const extrasSummary=form.querySelector('#summary-birthday-extras');
    extrasSummary.textContent=[bottles?`${bottles} × Kids Champagne (${format(bottles*5000)})`:'',decoration.checked?'Decoration (10.000 Ft)':''].filter(Boolean).join(' + ');
    extrasSummary.closest('.summary-row').classList.toggle('hidden',!extrasPrice);
    if(food.value)form.querySelector('#summary-birthday-food').textContent=`${food.value} (+${format(item.food[day]-item.price[day])} / person, included in total)`;
    minimumValue.textContent=String(minimum);minimumRow.classList.remove('hidden');
    calendar.querySelectorAll('.calendar-day:not(.empty)').forEach(button=>{
      const date=button.dataset.date||button.dataset.birthdayDate;
      button.querySelector('.birthday-calendar-price').textContent=format(food.value?item.food[dayIndex(date)]:item.price[dayIndex(date)]);
      calendarMinimums.get(button).replaceChildren(document.createTextNode(`Min. ${dayIndex(date)?8:4}`),document.createElement('br'),document.createTextNode('guests'));
    });
    guests.setCustomValidity('');next.disabled=false;
    if(count<minimum){
      warning.hidden=false;warningText.textContent=`This day requires at least ${minimum} guests. You selected ${count}. The package total for ${minimum} guests is ${format(perPerson*minimum+extrasPrice)}.`;
      increase.textContent=`Increase to ${minimum} guests`;next.disabled=true;guests.setCustomValidity(`At least ${minimum} guests are required.`);
    }
  };
  const originalGuestRules=applyGuestRules;
  applyGuestRules=function(){if(currentCategory==='birthday'){guests.min='1';updateSummary();}else originalGuestRules();};
  const sync=()=>{
    if(currentCategory!=='birthday'){note.hidden=true;secondField.style.display='none';warning.hidden=true;return;}
    const index=Math.min(Number(product.value)||0,packages.length-1);
    product.replaceChildren(...packages.map((item,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=item.name;return option;}));
    product.value=String(index);populateAttractions();updateSummary();
  };
  form.querySelectorAll('.category-tab').forEach(button=>button.addEventListener('click',sync));
  form.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',sync));
  product.addEventListener('change',()=>{if(currentCategory==='birthday'){populateAttractions();updateSummary();}});
  guests.addEventListener('change',event=>{if(currentCategory==='birthday'){event.stopImmediatePropagation();updateSummary();}},true);
  guests.addEventListener('input',()=>{if(currentCategory==='birthday')updateSummary();});
  second.addEventListener('change',updateSummary);
  form.addEventListener('change',()=>{if(currentCategory==='birthday')updateSummary();});
  increase.addEventListener('click',()=>{guests.value=String(dayIndex()?8:4);updateSummary();guests.closest('.field').scrollIntoView({block:'center',behavior:'smooth'});guests.focus({preventScroll:true});});
  changeDay.addEventListener('click',()=>{calendarField.scrollIntoView({block:'center',behavior:'smooth'});calendar.querySelector('.calendar-day.selected')?.focus({preventScroll:true});});
  sync();
})();
