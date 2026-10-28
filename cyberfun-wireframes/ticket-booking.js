(() => {
  const form = document.querySelector('form.checkout');
  if (!form?.querySelector('[data-category="ticket"]')) return;
  const catalog = [
    {name:'Jump',variants:[{label:'1 hour',price:4500,min:[1,1]},{label:'2 hours',price:6500,min:[1,1]}]},
    {name:'Pixel',variants:[{label:'30 min session',price:3000,min:[4,8]},{label:'60 min session',price:5500,min:[4,8]},{label:'1 game',price:2000,min:[2,2]}]},
    {name:'Karaoke',variants:[{label:'30 min session',price:3000,min:[4,6]},{label:'60 min session',price:4500,min:[4,6]}]},
    {name:'Lasertag',variants:[{label:'30 min session',price:3500,min:[2,2]},{label:'60 min session',price:4500,min:[2,2]}]},
    {name:'Darts',variants:[{label:'30 min session',price:3000,min:[3,4]},{label:'60 min session',price:4500,min:[3,4]}]}
  ];
  products.ticket = catalog.map(item => ({name:item.name,price:Math.min(...item.variants.map(v=>v.price)),basis:'Per person'}));
  const product = form.querySelector('#product');
  const guests = form.querySelector('#guests');
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
  const style=document.createElement('style');
  style.textContent='.ticket-pricing-flow .ticket-duration-legacy,.birthday-flow .ticket-duration-legacy{display:none!important}.ticket-variants{display:flex;flex-wrap:wrap;gap:6px}.ticket-variants button{flex:1;min-width:75px;min-height:46px;padding:8px 5px;border:1px solid var(--line);border-radius:6px;background:var(--paper);color:var(--ink);font:inherit;font-size:13px;font-weight:800;cursor:pointer}.ticket-variants button.active{background:var(--ink);color:white;border-color:var(--ink)}.ticket-price-note{margin:5px 0 0;font-size:12px;line-height:1.5;color:var(--muted)}';
  document.head.append(style);
  let selectedVariant=0;
  let previousMinimum=null;
  let previousSelection='';
  const selectedItem=()=>catalog[Number(product.value)||0];
  const priceText=value=>new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const weekend=()=>{
    const [day,month,year]=currentDate.split(' ');
    const monthIndex=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(month);
    const weekday=new Date(Number(year),monthIndex,Number(day)).getDay();
    return weekday===0||weekday>=5;
  };
  const originalSummary=updateSummary;
  updateSummary=function(){
    originalSummary();
    minRow.classList.add('hidden');
    if(currentCategory!=='ticket')return;
    const item=selectedItem(),variant=item.variants[selectedVariant]||item.variants[0];
    const minimum=variant.min[weekend()?1:0];
    const selection=`${product.value}|${selectedVariant}|${currentDate}`;
    const minimumChanged=selection!==previousSelection && minimum!==previousMinimum;
    const count=minimumChanged ? minimum : Math.max(minimum,Math.floor(Number(guests.value)||minimum));
    previousMinimum=minimum;
    previousSelection=selection;
    guests.min=String(minimum);guests.value=String(count);
    form.querySelector('label[for="guests"]').textContent=`Number of guests (min. ${minimum})`;
    pricing.textContent=`${priceText(variant.price)} per person · Minimum ${minimum} ${minimum===1?'guest':'guests'} (${weekend()?'Fri-Sun':'Mon-Thu'})`;
    minRow.classList.remove('hidden');minValue.textContent=String(minimum);
    form.querySelector('#summary-product').textContent=item.name;
    form.querySelector('#summary-duration').textContent=variant.label;
    form.querySelector('#summary-guests').textContent=String(count);
    form.querySelector('#summary-basis').textContent=priceText(variant.price);
    form.querySelector('#summary-total').textContent=priceText(variant.price*count);
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
  sync();
})();
