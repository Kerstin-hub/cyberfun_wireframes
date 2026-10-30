(() => {
  const form=document.querySelector('form.checkout');
  if(!form?.querySelector('#birthday-attraction'))return;
  // Prices are per person; index 0 is Mon-Thu, index 1 is Fri-Sun.
  const packages=[
    {name:'JumpStar',price:[7850,9150],food:[9700,11000],jump:2,games:0,gameMinutes:0,socks:true},
    {name:'JumpParty',price:[6250,7150],food:[8100,9000],jump:1,games:0,gameMinutes:0,socks:true},
    {name:'MegaFun*Jump',price:[9650,10650],food:[11500,12500],jump:1.5,games:1,gameMinutes:30,socks:true},
    {name:'Fun*Party',price:[6800,6800],food:[8650,8650],jump:0,games:1,gameMinutes:60,socks:false},
    {name:'MegaFun*Party',price:[11800,11800],food:[13650,13650],jump:0,games:2,gameMinutes:60,socks:false}
  ];
  products.birthday=packages.map(item=>({name:item.name,price:item.price[0],basis:'Per person'}));
  const product=form.querySelector('#product');
  const guests=form.querySelector('#guests');
  const attraction=form.querySelector('#birthday-attraction');
  const attractionField=form.querySelector('#birthday-attraction-field');
  const food=form.querySelector('#birthday-food');
  const extra=form.querySelector('#birthday-extras');
  const includes=form.querySelector('.birthday-package-includes ul');
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
    const item=chosen(),day=dayIndex(),minimum=day===1?8:4;
    const count=Math.max(0,Math.floor(Number(guests.value)||0));
    guests.min='1';
    form.querySelector('label[for="guests"]').textContent='Number of guests (from 4)';
    note.textContent=`${format(item.price[day])} / person for the selected day (${day?'Fri-Sun':'Mon-Thu'}) · Minimum ${minimum} guests. With food: from ${format(Math.min(...item.food))} / person.`;
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
    const extrasPrice=extra.value==='Kindersekt'?5000:extra.value==='Dekoration'?10000:0;
    form.querySelector('#summary-product').textContent=item.name;
    form.querySelector('#summary-guests').textContent=String(count);
    form.querySelector('#summary-basis').textContent=format(perPerson);
    form.querySelector('#summary-total').textContent=format(perPerson*count+extrasPrice);
    form.querySelector('#birthday-food-label').textContent=`Additional Food Options · +${format(item.food[day]-item.price[day])} / person`;
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
  product.addEventListener('change',()=>{if(currentCategory==='birthday'){populateAttractions();updateSummary();}});
  guests.addEventListener('change',event=>{if(currentCategory==='birthday'){event.stopImmediatePropagation();updateSummary();}},true);
  guests.addEventListener('input',()=>{if(currentCategory==='birthday')updateSummary();});
  second.addEventListener('change',updateSummary);
  form.addEventListener('change',()=>{if(currentCategory==='birthday')updateSummary();});
  increase.addEventListener('click',()=>{guests.value=String(dayIndex()?8:4);updateSummary();guests.closest('.field').scrollIntoView({block:'center',behavior:'smooth'});guests.focus({preventScroll:true});});
  changeDay.addEventListener('click',()=>{calendarField.scrollIntoView({block:'center',behavior:'smooth'});calendar.querySelector('.calendar-day.selected')?.focus({preventScroll:true});});
  sync();
})();
