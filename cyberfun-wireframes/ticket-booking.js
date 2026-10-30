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
  products.ticket = catalog.map(item => ({name:item.name,price:Math.min(...item.variants.map(v=>v.price)),basis:'Per person'}));
  const product = form.querySelector('#product');
  const guests = form.querySelector('#guests');
  const socksPrice=850;
  const socks=document.createElement('div');socks.className='ticket-required-socks';socks.hidden=true;
  const socksTitle=document.createElement('strong');socksTitle.textContent='Grip socks · Required';
  const socksCost=document.createElement('span');socksCost.id='ticket-socks-cost';
  socks.append(socksTitle,socksCost);guests.closest('.field').append(socks);
  const ticketSubtotalRow=document.createElement('div');ticketSubtotalRow.className='summary-row hidden';
  const ticketSubtotalLabel=document.createElement('span');ticketSubtotalLabel.textContent='Tickets subtotal';
  const ticketSubtotal=document.createElement('strong');ticketSubtotal.id='summary-tickets-subtotal';
  ticketSubtotalRow.append(ticketSubtotalLabel,ticketSubtotal);
  const socksRow=document.createElement('div');socksRow.className='summary-row hidden';
  const socksLabel=document.createElement('span');socksLabel.textContent='Grip socks (required)';
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
  style.textContent+='.ticket-required-socks[hidden]{display:none!important}.ticket-required-socks{display:grid;gap:6px;margin-top:12px;padding:12px 0;border-top:1px solid var(--line);font-size:13px;line-height:1.5}.ticket-required-socks span{color:var(--muted)}';
  let selectedVariant=0;
  const selectedItem=()=>catalog[Number(product.value)||0];
  const priceText=value=>new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const weekend=(date=currentDate)=>{
    const [day,month,year]=date.split(' ');
    const monthIndex=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month);
    const weekday=new Date(Number(year),monthIndex,Number(day)).getDay();
    return weekday===0||weekday>=5;
  };
  const originalSummary=updateSummary;
  updateSummary=function(){
    originalSummary();
    minRow.classList.add('hidden');
    socks.hidden=true;ticketSubtotalRow.classList.add('hidden');socksRow.classList.add('hidden');
    calendarNote.hidden=true;
    continueButton.disabled=originalContinueDisabled;
    guests.setCustomValidity('');
    if(currentCategory!=='ticket')return;
    const item=selectedItem(),variant=item.variants[selectedVariant]||item.variants[0];
    const minimum=variant.min[weekend()?1:0];
    const count=Math.max(0,Math.floor(Number(guests.value)||0));
    socks.hidden=false;ticketSubtotalRow.classList.remove('hidden');socksRow.classList.remove('hidden');
    socksCost.textContent=`${priceText(socksPrice)} / person × ${count} ${count===1?'guest':'guests'} = ${priceText(socksPrice*count)}`;
    ticketSubtotal.textContent=`${count} × ${priceText(variant.price)} = ${priceText(variant.price*count)}`;
    socksSummary.textContent=`${count} × ${priceText(socksPrice)} = ${priceText(socksPrice*count)}`;
    guests.min='1';
    form.querySelector('label[for="guests"]').textContent=`Number of guests (min. ${minimum})`;
    pricing.textContent=`${priceText(variant.price)} per person · Minimum ${minimum} ${minimum===1?'guest':'guests'} (${weekend()?'Fri-Sun':'Mon-Thu'})`;
    dayLabels.forEach(({button,marker})=>{
      const date=button.dataset.date||button.dataset.birthdayDate;
      const dayMinimum=variant.min[weekend(date)?1:0];
      marker.replaceChildren(document.createTextNode(`Min. ${dayMinimum}`),document.createElement('br'),document.createTextNode('guests'));
    });
    if(count<minimum){
      calendarNote.hidden=false;
      warningText.textContent=`This day requires at least ${minimum} guests for ${item.name}. You selected ${count}. Increasing to ${minimum} guests changes the total including required socks to ${priceText((variant.price+socksPrice)*minimum)}.`;
      increase.textContent=`Increase to ${minimum} guests`;
      continueButton.disabled=true;
      guests.setCustomValidity(`At least ${minimum} guests are required for this day.`);
    }
    minRow.classList.remove('hidden');minValue.textContent=String(minimum);
    form.querySelector('#summary-product').textContent=item.name;
    form.querySelector('#summary-duration').textContent=variant.label;
    form.querySelector('#summary-guests').textContent=String(count);
    form.querySelector('#summary-basis').textContent=priceText(variant.price);
    form.querySelector('#summary-total').textContent=priceText((variant.price+socksPrice)*count);
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
    const ticket=currentCategory==='ticket';form.classList.toggle('ticket-pricing-flow',ticket);duration.style.display=ticket?'':'none';
    if(!ticket){minRow.classList.add('hidden');return;}
    product.innerHTML=catalog.map((item,index)=>`<option value="${index}">${item.name} - ${priceText(Math.min(...item.variants.map(variant=>variant.price)))} / person</option>`).join('');
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
