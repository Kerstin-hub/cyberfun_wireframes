(() => {
  const form = document.querySelector('form.checkout');
  if (!form?.querySelector('[data-category="ticket"]')) return;
  const catalog = [
    {name:'Jump',variants:[{label:'1 hour',price:4500,min:[1,1]},{label:'2 hours',price:6500,min:[1,1]}]},
    {name:'Pixel',variants:[{label:'30 min session',price:3000,min:[4,8]},{label:'60 min session',price:5500,min:[4,8]}]},
    {name:'Karaoke',variants:[{label:'30 min session',price:3000,min:[4,6]},{label:'60 min session',price:4500,min:[4,6]}]},
    {name:'Lasertag',variants:[{label:'30 min session',price:3500,min:[2,2]},{label:'60 min session',price:4500,min:[2,2]}]},
    {name:'Darts',variants:[{label:'30 min session',price:3000,min:[3,4]},{label:'60 min session',price:4500,min:[3,4]}]}
  ];
  const ticketProducts=catalog.flatMap(item=>item.variants.map((variant,index)=>({item,variant,index})));
  products.ticket = ticketProducts.map(({item,variant}) => ({name:`${item.name} · ${variant.label}`,price:variant.price,basis:'Per person'}));
  const product = form.querySelector('#product');
  const registrationUrl=new URL('outputs/checkout-html-screens/02-registration-page.html',new URL('.',document.currentScript.src));
  const membershipDetails=document.createElement('div');membershipDetails.className='notice';membershipDetails.hidden=true;product.after(membershipDetails);
  const memberships=[['premium-plus','Premium VIP Card+',5600],['premium-three','Premium VIP Card 3',8040],['basic-plus','Basic VIP Card+',3700],['basic-three','Basic VIP Card 3',5300]];
  product.addEventListener('change',event=>{
    if(currentCategory==='ticket'&&product.value.startsWith('membership:')){
      event.stopImmediatePropagation();updateSummary();
    }
  },true);
  const guests = form.querySelector('#guests');
  const attractionMinimum=document.createElement('p');
  attractionMinimum.className='ticket-price-note';attractionMinimum.hidden=true;
  attractionMinimum.setAttribute('aria-live','polite');product.after(attractionMinimum);
  const socksPrice=850;
  const socks=document.createElement('div');socks.className='ticket-required-socks';socks.hidden=true;
  const socksRowControl=document.createElement('div');socksRowControl.className='birthday-champagne-option';
  const socksTitle=document.createElement('label');socksTitle.className='birthday-decoration-option';
  const socksEnabled=document.createElement('input');socksEnabled.type='checkbox';
  const socksText=document.createElement('span');socksText.textContent='Jump socks · 850 Ft / pair (size selected on site)';
  socksTitle.append(socksEnabled,socksText);
  const socksQuantity=document.createElement('select');socksQuantity.id='ticket-socks-quantity';
  socksQuantity.setAttribute('aria-label','Number of grip sock pairs');socksQuantity.disabled=true;
  const socksHeading=document.createElement('strong');socksHeading.textContent='Jump Socks';
  const socksHint=document.createElement('span');socksHint.textContent='Bring your own trampoline grip socks, or add pairs below. Sizes are selected on site.';
  const socksCost=document.createElement('span');socksCost.id='ticket-socks-cost';
  socks.classList.add('birthday-compact-options');socksRowControl.append(socksTitle,socksQuantity);
  socks.classList.add('field');socks.append(socksHeading,socksHint,socksRowControl,socksCost);
  form.querySelector('#ticket-slots').closest('.field').after(socks);
  const ticketSubtotalRow=document.createElement('div');ticketSubtotalRow.className='summary-row hidden';
  const ticketSubtotalLabel=document.createElement('span');ticketSubtotalLabel.textContent='Tickets subtotal';
  const ticketSubtotal=document.createElement('strong');ticketSubtotal.id='summary-tickets-subtotal';
  ticketSubtotalRow.append(ticketSubtotalLabel,ticketSubtotal);
  const socksRow=document.createElement('div');socksRow.className='summary-row hidden';
  const socksLabel=document.createElement('span');socksLabel.textContent='Grip socks';
  const socksSummary=document.createElement('strong');socksSummary.id='summary-ticket-socks';
  socksRow.append(socksLabel,socksSummary);
  form.querySelector('.summary-row.total').before(ticketSubtotalRow,socksRow);
  const legacyDuration = form.querySelector('[data-hours]').closest('.field');
  legacyDuration.classList.add('ticket-duration-legacy');
  const duration = document.createElement('div'); duration.className='field';duration.id='ticket-duration-options';
  const label = document.createElement('span');label.className='field-label';label.textContent='Choose duration';
  const variants = document.createElement('div');variants.className='ticket-variants';
  const pricing = document.createElement('p');pricing.className='ticket-price-note';pricing.setAttribute('aria-live','polite');
  duration.append(label,variants,pricing);
  product.closest('.field').after(duration);
  const minRow=document.createElement('div');minRow.className='summary-row hidden';
  const minLabel=document.createElement('span');minLabel.textContent='Minimum guests';
  const minValue=document.createElement('strong');minValue.id='summary-ticket-minimum';
  minRow.append(minLabel,minValue);form.querySelector('#summary-person-row').before(minRow);
  const calendar=form.querySelector('.calendar-grid');
  const calendarField=calendar.closest('.field');
  const continueButton=form.querySelector('.summary .button.block');
  const originalContinueDisabled=continueButton.disabled;
  continueButton.addEventListener('click',()=>{
    if(continueButton.disabled)return;
    const rows=[...form.querySelectorAll('.summary-row')].filter(row=>getComputedStyle(row).display!=='none').map(row=>[row.querySelector('span')?.textContent?.trim(),row.querySelector('strong')?.textContent?.trim()]).filter(([label,value])=>label&&value);
    const target=new URL(registrationUrl);target.searchParams.set('booking',JSON.stringify(rows));window.location.href=target.href;
  });
  const calendarNote=document.createElement('div');calendarNote.className='ticket-minimum-warning';calendarNote.hidden=true;
  const warningText=document.createElement('p');warningText.setAttribute('role','status');
  const increase=document.createElement('button');increase.type='button';
  const changeDay=document.createElement('button');changeDay.type='button';changeDay.textContent='Choose another day';
  const warningActions=document.createElement('div');warningActions.className='ticket-minimum-actions';warningActions.append(increase,changeDay);
  calendarNote.append(warningText,warningActions);calendarField.after(calendarNote);
  const dayLabels=[...calendar.querySelectorAll('.calendar-day:not(.empty)')].map(button=>{
    const marker=document.createElement('span');marker.className='ticket-day-minimum';button.append(marker);return{button,marker};
  });
  const style=document.createElement('style');
  style.textContent='.ticket-pricing-flow .ticket-duration-legacy,.birthday-flow .ticket-duration-legacy{display:none!important}.ticket-variants{display:flex;flex-wrap:wrap;gap:6px}.ticket-variants button{flex:1;min-width:75px;min-height:46px;padding:8px 5px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:13px;font-weight:800;cursor:pointer}.ticket-variants button.active{background:var(--ink);color:white;border-color:var(--ink)}.ticket-price-note{margin:5px 0 0;font-size:12px;line-height:1.5;color:var(--muted)}';
  style.textContent+='.ticket-day-minimum{display:none}.ticket-pricing-flow .calendar-day:not(.empty){min-height:64px;padding:5px 1px 10px}.ticket-pricing-flow .ticket-day-minimum{display:block;margin-top:4px;font-size:9px;line-height:1.2;font-weight:600;white-space:normal}.ticket-minimum-warning[hidden]{display:none!important}.ticket-minimum-warning{padding:12px;margin:0 0 16px;border-left:3px solid #d18b00;background:#fff6de;color:var(--ink)}.ticket-minimum-warning p{margin:0 0 10px;font-size:13px;line-height:1.5;color:inherit}.ticket-minimum-actions{display:flex;flex-wrap:wrap;gap:8px}.ticket-minimum-actions button{min-height:40px;padding:8px 10px;border:1px solid var(--ink);border-radius:6px;background:var(--ink);color:white;font:inherit;font-size:12px;cursor:pointer}.ticket-minimum-actions button+button{background:white;color:var(--ink)}.checkout .button:disabled{opacity:.45;cursor:not-allowed}';
  document.head.append(style);
  style.textContent+='.membership-product-flow .field:not(:has(#product)),.membership-product-flow #ticket-fields,.membership-product-flow .calendar,.membership-product-flow .calendar-wrap,.membership-product-flow .availability-legend,.membership-product-flow .ticket-required-socks,.membership-product-flow .ticket-minimum-warning,.membership-product-flow .ticket-price-note,.membership-product-flow .summary-row:not(:has(#summary-category)):not(:has(#summary-product)):not(:has(#summary-basis)):not(.total){display:none!important}';
  style.textContent+='.ticket-required-socks[hidden]{display:none!important}.ticket-required-socks{display:grid;gap:6px;margin-top:12px;padding:12px 0;border-top:1px solid var(--line);font-size:13px;line-height:1.5}.ticket-required-socks span{color:var(--muted)}';
  style.textContent+='.ticket-required-socks .birthday-decoration-option{cursor:pointer}.ticket-required-socks input[type=checkbox]{pointer-events:auto;cursor:pointer}.ticket-required-socks #ticket-socks-quantity{width:60px;flex:0 0 60px;min-height:34px;padding:4px}';
  let selectedVariant=0;
  const selectedProduct=()=>ticketProducts[Number(product.value)||0]||ticketProducts[0];
  const selectedItem=()=>selectedProduct().item;
  const priceText=value=>new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const weekend=(date=currentDate)=>{
    const [day,month,year]=date.split(' ');
    const monthIndex=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month);
    const weekday=new Date(Number(year),monthIndex,Number(day)).getDay();
    return weekday===0||weekday>=5;
  };
  const originalSummary=updateSummary;
  socksEnabled.addEventListener('change',()=>{socksQuantity.disabled=!socksEnabled.checked;if(socksEnabled.checked&&!Number(socksQuantity.value))socksQuantity.value='1';updateSummary();});
  socksQuantity.addEventListener('change',()=>updateSummary());
  updateSummary=function(){
    const member=currentCategory==='ticket'&&product.value.startsWith('membership:')?memberships.find(item=>item[0]===product.value.slice(11)):null;
    form.classList.toggle('membership-product-flow',!!member);
    membershipDetails.hidden=!member;
    if(member){
      const [id,name,monthly]=member,recurring=id.endsWith('plus'),premium=id.startsWith('premium');
      product.after(membershipDetails);
      membershipDetails.textContent=`${name} · ${priceText(monthly)} / month${recurring?'':' equivalent'}. ${premium?'Unlimited jumping on school days; 2 hours on weekends and school holidays. Welcome pack and birthday benefit.':'1 hour of jumping on school days, weekends and school holidays.'} ${recurring?'3-month minimum term; cancellable afterwards.':'90-day pass. '+priceText(monthly*3)+' paid upfront. No automatic renewal.'}`;
      form.querySelector('#summary-category').textContent='Membership';
      form.querySelector('#summary-product').textContent=name;
      form.querySelector('#summary-basis').textContent=recurring?`${priceText(monthly)} / month`: `${priceText(monthly*3)} / 90 days`;
      form.querySelector('#summary-total').textContent=priceText(recurring?monthly:monthly*3);
      continueButton.disabled=false;guests.setCustomValidity('');return;
    }
    originalSummary();
    attractionMinimum.hidden=currentCategory!=='ticket';
    minRow.classList.add('hidden');
    socks.hidden=true;ticketSubtotalRow.classList.add('hidden');socksRow.classList.add('hidden');
    calendarNote.hidden=true;
    continueButton.disabled=originalContinueDisabled;
    guests.setCustomValidity('');
    if(currentCategory!=='ticket')return;
    selectedVariant=selectedProduct().index;
    duration.style.display='none';
    product.closest('.field').after(duration);
    duration.after(guests.closest('.field'));
    form.querySelectorAll('[data-mode]').forEach(button=>{button.textContent=button.dataset.mode==='family'?'Before 19h: all ages':'After 19h: 16+ only';});
    form.querySelectorAll('#ticket-slots [data-time]').forEach(button=>{
      button.hidden=currentMode==='adult'&&button.dataset.time<'19:00';
    });
    if(currentMode==='adult'&&currentTime<'19:00'){
      const first=form.querySelector('#ticket-slots [data-time]:not([hidden]):not(:disabled)');
      if(first){currentTime=first.dataset.time;form.querySelectorAll('#ticket-slots [data-time]').forEach(button=>button.classList.toggle('selected',button===first));form.querySelector('#summary-time').textContent=currentTime;}
    }
    const item=selectedItem(),variant=item.variants[selectedVariant]||item.variants[0];
    const minimum=variant.min[weekend()?1:0];
    attractionMinimum.textContent=`Minimum guests: Mon–Thu ${variant.min[0]} · Fri–Sun ${variant.min[1]}`;
    if(Number(guests.value)<minimum)guests.value=String(minimum);
    const count=Math.max(0,Math.floor(Number(guests.value)||0));
    const pairs=socksEnabled.checked?Math.min(count,Math.max(1,Number(socksQuantity.value)||1)):0;
    socksQuantity.replaceChildren(...Array.from({length:count},(_,index)=>{
      const quantity=index+1;
      const option=document.createElement('option');option.value=String(quantity);
      option.textContent=String(quantity);return option;
    }));
    socksQuantity.value=String(pairs||1);
    socks.hidden=false;ticketSubtotalRow.classList.remove('hidden');socksRow.classList.remove('hidden');
    socksCost.textContent=`${pairs} × ${priceText(socksPrice)} = ${priceText(socksPrice*pairs)}`;
    ticketSubtotal.textContent=`${count} × ${priceText(variant.price)} = ${priceText(variant.price*count)}`;
    socksSummary.textContent=pairs?`${pairs} × ${priceText(socksPrice)} = ${priceText(socksPrice*pairs)}`:'Bringing own socks · 0 Ft';
    guests.min=String(minimum);
    form.querySelector('label[for="guests"]').textContent=`Number of guests (min. ${minimum})`;
    pricing.textContent=`${priceText(variant.price)} per person · Minimum ${minimum} ${minimum===1?'guest':'guests'} (${weekend()?'Fri-Sun':'Mon-Thu'})`;
    dayLabels.forEach(({button,marker})=>{
      const date=button.dataset.date||button.dataset.birthdayDate;
      const dayMinimum=variant.min[weekend(date)?1:0];
      marker.replaceChildren(document.createTextNode(`Min. ${dayMinimum}`),document.createElement('br'),document.createTextNode('guests'));
    });
    if(count<minimum){
      calendarNote.hidden=false;
      warningText.textContent=`This day requires at least ${minimum} guests for ${item.name}. You selected ${count}. Increasing to ${minimum} guests changes the total to ${priceText(variant.price*minimum+socksPrice*pairs)}.`;
      increase.textContent=`Increase to ${minimum} guests`;
      continueButton.disabled=true;
      guests.setCustomValidity(`At least ${minimum} guests are required for this day.`);
    }
    minRow.classList.remove('hidden');minValue.textContent=String(minimum);
    form.querySelector('#summary-product').textContent=`${item.name} · ${variant.label}`;
    form.querySelector('#summary-duration').textContent=variant.label;
    form.querySelector('#summary-guests').textContent=String(count);
    form.querySelector('#summary-basis').textContent=priceText(variant.price);
    form.querySelector('#summary-total').textContent=priceText(variant.price*count+socksPrice*pairs);
    form.querySelector('#ticket-fields .notice').textContent='The displayed price is per person. The minimum group size depends on the attraction, duration and selected day.';
  };
  const renderVariants=()=>{
    selectedVariant=0;variants.replaceChildren();
    selectedItem().variants.forEach((variant,index)=>{
      const button=document.createElement('button');button.type='button';button.classList.toggle('active',index===0);button.textContent=variant.label;
      button.setAttribute('aria-pressed',String(index===0));
      button.addEventListener('click',()=>{selectedVariant=index;[...variants.children].forEach((child,i)=>{child.classList.toggle('active',i===index);child.setAttribute('aria-pressed',String(i===index));});updateSummary();});
      variants.append(button);
    });
    updateSummary();
  };
  const sync=()=>{
    const ticket=currentCategory==='ticket';form.classList.toggle('ticket-pricing-flow',ticket);duration.style.display='none';
    if(!ticket){minRow.classList.add('hidden');return;}
    product.innerHTML=ticketProducts.map(({item,variant},index)=>`<option value="${index}">${item.name} · ${variant.label} — ${priceText(variant.price)} / person</option>`).join('');
    const jumpTwoHours=product.options[1];
    jumpTwoHours.after(...memberships.map(([id,name,monthly])=>{
      const option=document.createElement('option');option.value=`membership:${id}`;
      option.textContent=`${name} — ${priceText(monthly)} / month${id.endsWith('three')?' equivalent':''}`;return option;
    }));
    product.closest('.field').after(duration);
    renderVariants();
  };
  form.querySelectorAll('.category-tab').forEach(button=>button.addEventListener('click',sync));
  product.addEventListener('change',()=>{if(currentCategory==='ticket')renderVariants();});
  guests.addEventListener('change',()=>{if(currentCategory==='ticket')updateSummary();});
  increase.addEventListener('click',()=>{
    const variant=selectedItem().variants[selectedVariant]||selectedItem().variants[0];
    guests.value=String(variant.min[weekend()?1:0]);updateSummary();
    guests.closest('.field').scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    guests.focus({preventScroll:true});
  });
  changeDay.addEventListener('click',()=>{
    const day=calendar.querySelector('.calendar-day.selected:not(:disabled)')||calendar.querySelector('.calendar-day:not(.empty):not(:disabled)');
    calendarField.scrollIntoView({block:'center',behavior:'smooth'});day?.focus({preventScroll:true});
  });
  sync();
})();
