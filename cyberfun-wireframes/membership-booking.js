(() => {
  const plans = [
    {id:'premium-plus',name:'Premium VIP Card+',tier:'Premium',billing:'Monthly subscription',monthly:5600,due:11200,term:'3-month minimum term',access:'Unlimited jumping on school days; 2 hours on weekends and school holidays.',premium:true,recurring:true},
    {id:'premium-three',name:'Premium VIP Card 3',tier:'Premium',billing:'90-day pass',monthly:8040,due:24120,term:'Valid for 90 days from purchase',access:'Unlimited jumping on school days; 2 hours on weekends and school holidays.',premium:true,recurring:false},
    {id:'basic-plus',name:'Basic VIP Card+',tier:'Basic',billing:'Monthly subscription',monthly:3700,due:7400,term:'3-month minimum term',access:'1 hour of jumping on school days, weekends and school holidays.',premium:false,recurring:true},
    {id:'basic-three',name:'Basic VIP Card 3',tier:'Basic',billing:'90-day pass',monthly:5300,due:15900,term:'Valid for 90 days from purchase',access:'1 hour of jumping on school days, weekends and school holidays.',premium:false,recurring:false}
  ];
  const format = value => new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const form=document.getElementById('membership-form');
  if(!form){
    const cards=document.getElementById('membership-plan-cards');
    plans.forEach(plan=>{
      const card=document.createElement('article');card.className='membership-plan-card';
      card.innerHTML=`<div class="membership-card-image" role="img" aria-label="${plan.tier} VIP Card">${plan.tier} VIP Card</div><div class="membership-card-body"><p class="wire-label">${plan.billing}</p><h3>${plan.name}</h3><p class="membership-price">${format(plan.monthly)} <small>/ month${plan.recurring?'':' equivalent'}</small></p><ul><li>${plan.access}</li><li>${plan.term}</li>${plan.premium?'<li>Welcome pack &amp; birthday benefit</li>':''}</ul><p>${plan.recurring?'Billed monthly':format(plan.due)+' paid upfront'}</p><button type="button">Choose plan</button></div>`;
      card.querySelector('button').addEventListener('click',()=>{
        document.querySelector('[data-category="ticket"]').click();const select=document.getElementById('product');select.value='membership:'+plan.id;select.dispatchEvent(new Event('change',{bubbles:true}));document.querySelector('form.checkout').scrollIntoView({block:'start',behavior:'smooth'});
      });cards.append(card);
    });
    document.querySelector('[data-category="ticket"]').click();
    const requested=new URLSearchParams(window.location.search).get('plan');
    if(plans.some(plan=>plan.id===requested)){
      const select=document.getElementById('product');select.value='membership:'+requested;select.dispatchEvent(new Event('change',{bubbles:true}));
    }
    return;
  }
  plans.filter(item=>item.recurring).forEach(item=>{item.due=item.monthly;});
  const memberPanel=form.querySelector('[data-membership-step="2"]');
  const addField=(id,label,type='text',required=false)=>{
    const field=document.createElement('div');field.className='field';
    const title=document.createElement('label');title.htmlFor=id;title.textContent=label;
    const input=document.createElement(type==='textarea'?'textarea':'input');input.id=id;
    if(type!=='textarea')input.type=type;input.required=required;
    field.append(title,input);memberPanel.append(field);return input;
  };
  const activation=addField('membership-activation','Activation date','date',true);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  activation.min=today;activation.value=today;
  const billingTitle=document.createElement('h3');billingTitle.textContent='Billing details';memberPanel.append(billingTitle);
  const payer=addField('membership-payer','Name / company','text',true);
  const emailConfirm=addField('membership-email-confirm','Confirm email','email',true);
  const phone=addField('membership-phone','Phone','tel',true);
  const invoiceLabel=document.createElement('label');invoiceLabel.className='membership-consent';
  const invoice=document.createElement('input');invoice.type='checkbox';invoiceLabel.append(invoice,document.createTextNode('Request a VAT invoice'));memberPanel.append(invoiceLabel);
  const address=addField('membership-billing-address','Billing address','text');
  const tax=addField('membership-tax','VAT / tax number','text');
  const advisor=addField('membership-advisor','On-site adviser (optional)');
  addField('membership-notes','Notes / special requests','textarea');
  const review=form.querySelector('[data-membership-step="3"]');
  const registrationSummary=document.createElement('div');registrationSummary.className='summary membership-summary';
  review.querySelector('.summary').after(registrationSummary);
  const select=document.getElementById('membership-plan');
  const cards=document.getElementById('membership-plan-cards');
  const recipient=document.getElementById('membership-for');
  const otherAdult=document.createElement('option');otherAdult.value='adult';otherAdult.textContent='Another adult (18+)';
  recipient.options[0].after(otherAdult);
  form.querySelector('.membership-steps').hidden=true;
  const singlePageStyle=document.createElement('style');singlePageStyle.textContent='.membership-steps[hidden]{display:none!important}.membership-panel{margin-bottom:20px}.membership-panel h3{font-size:18px}.membership-panel textarea{width:100%;box-sizing:border-box;min-height:80px;border:1px solid var(--line);border-radius:6px;padding:10px;font:inherit}';document.head.append(singlePageStyle);
  plans.forEach(plan=>{
    const option=document.createElement('option');option.value=plan.id;option.textContent=plan.recurring?`${plan.name} - ${format(plan.monthly)} / month`:`${plan.name} - ${format(plan.due)} / 90 days`;select.append(option);
    const card=document.createElement('article');card.className='membership-plan-card';card.dataset.planCard=plan.id;
    card.innerHTML=`<div class="membership-card-image" role="img" aria-label="${plan.tier} membership card placeholder">${plan.tier} VIP Card</div><div class="membership-card-body"><p class="wire-label">${plan.billing}</p><h3>${plan.name}</h3><p class="membership-price">${format(plan.monthly)} <small>/ month${plan.recurring?'':' equivalent'}</small></p><ul><li>${plan.access}</li><li>${plan.term}</li>${plan.premium?'<li>Welcome pack &amp; birthday benefit</li>':''}</ul><p class="membership-card-payment">${plan.recurring?`${format(plan.monthly)} billed monthly`: `${format(plan.due)} total, paid upfront`}</p><button type="button" data-choose-plan="${plan.id}">Choose plan</button></div>`;
    cards.append(card);
  });
  const plan=()=>plans.find(item=>item.id===select.value);
  const status=document.getElementById('membership-status');
  const update=()=>{
    const item=plan();
    document.querySelectorAll('[data-plan-card]').forEach(card=>{
      const chosen=card.dataset.planCard===item.id;card.classList.toggle('selected',chosen);
      const button=card.querySelector('button');button.textContent=chosen?'Selected':'Choose plan';button.setAttribute('aria-pressed',String(chosen));
    });
    document.getElementById('membership-plan-access').textContent=item.access;
    document.getElementById('membership-plan-term').textContent=item.term;
    document.getElementById('membership-billing-info').textContent=item.recurring
      ? `${format(item.monthly)} per month. Minimum commitment: ${format(item.monthly*3)} over 3 months; cancellable afterwards.`
      : `One payment of ${format(item.due)} for 90 days. No automatic renewal.`;
    document.getElementById('membership-summary-plan').textContent=item.name;
    document.getElementById('membership-summary-billing').textContent=item.billing;
    document.getElementById('membership-summary-access').textContent=item.access;
    document.getElementById('membership-summary-term').textContent=item.term;
    document.getElementById('membership-summary-total').textContent=format(item.due);
    document.getElementById('membership-summary-renewal').textContent=item.recurring?`${format(item.monthly)} / month`:'No automatic renewal';
    emailConfirm.setCustomValidity(emailConfirm.value!==document.getElementById('membership-email').value?'Email addresses must match.':'');
    address.closest('.field').hidden=!invoice.checked;tax.closest('.field').hidden=!invoice.checked;address.required=invoice.checked;
    registrationSummary.replaceChildren(...[['Activation date',activation.value],['Payer',payer.value],['Phone',phone.value],...(invoice.checked?[['Billing address',address.value],['VAT / tax number',tax.value]]:[])].map(([label,value])=>{
      const row=document.createElement('div');row.className='summary-row';const name=document.createElement('span');name.textContent=label;const text=document.createElement('strong');text.textContent=value||'Not entered';row.append(name,text);return row;
    }));
    document.getElementById('membership-summary-holder').textContent=document.getElementById('membership-holder-name').value||'Not entered';
    document.getElementById('membership-summary-email').textContent=document.getElementById('membership-email').value||'Not entered';
    document.getElementById('membership-summary-owner').textContent=document.getElementById('membership-for').selectedOptions[0].textContent;
    const minor=document.getElementById('membership-for').value==='child';
    document.getElementById('membership-parent-field').hidden=!minor;
    document.getElementById('membership-parent-name').required=minor;
  };
  const showStep=value=>{
    form.querySelectorAll('[data-membership-step]').forEach(panel=>{panel.hidden=false;});
    document.getElementById('membership-back').hidden=true;
    document.getElementById('membership-next').textContent='Continue to registration & payment';
    status.hidden=true;update();
  };
  cards.addEventListener('click',event=>{
    const button=event.target.closest('[data-choose-plan]');if(!button)return;
    select.value=button.dataset.choosePlan;showStep(1);
    document.getElementById('membership-checkout').scrollIntoView({block:'start',behavior:'smooth'});
    select.focus({preventScroll:true});
  });
  select.addEventListener('change',()=>{showStep(1);});
  form.addEventListener('input',update);form.addEventListener('change',update);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    update();
    for(const input of form.querySelectorAll('input,select,textarea')){if(!input.reportValidity())return;}
    status.textContent='Your membership selection is ready. This wireframe does not create a subscription or take payment.';status.hidden=false;status.focus();
  });
  const requestedPlan=new URLSearchParams(window.location.search).get('plan');
  if(plans.some(item=>item.id===requestedPlan))select.value=requestedPlan;
  showStep(1);
  if(new URLSearchParams(window.location.search).get('embedded')==='1'){
    document.body.replaceChildren(form);
    const embeddedStyle=document.createElement('style');embeddedStyle.textContent='html,body{margin:0!important;padding:0!important;min-width:0!important;background:#fff!important}.checkout{width:100%!important;max-width:none!important;margin:0!important;border:0!important;box-shadow:none!important}.checkout-body{padding:10px!important}';document.head.append(embeddedStyle);
    const reportHeight=()=>window.parent.postMessage({type:'cyberfun-membership-height',height:Math.ceil(form.getBoundingClientRect().height)+24},'*');
    new ResizeObserver(reportHeight).observe(form);reportHeight();
  }
})();
