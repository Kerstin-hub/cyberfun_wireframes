(() => {
  const plans = [
    {id:'premium-plus',name:'Premium VIP Card+',tier:'Premium',billing:'Monthly subscription',monthly:5600,due:11200,term:'3-month minimum term',access:'Unlimited jumping on school days; 2 hours on weekends and school holidays.',premium:true,recurring:true},
    {id:'premium-three',name:'Premium VIP Card 3',tier:'Premium',billing:'90-day pass',monthly:8040,due:24120,term:'Valid for 90 days from purchase',access:'Unlimited jumping on school days; 2 hours on weekends and school holidays.',premium:true,recurring:false},
    {id:'basic-plus',name:'Basic VIP Card+',tier:'Basic',billing:'Monthly subscription',monthly:3700,due:7400,term:'3-month minimum term',access:'1 hour of jumping on school days, weekends and school holidays.',premium:false,recurring:true},
    {id:'basic-three',name:'Basic VIP Card 3',tier:'Basic',billing:'90-day pass',monthly:5300,due:15900,term:'Valid for 90 days from purchase',access:'1 hour of jumping on school days, weekends and school holidays.',premium:false,recurring:false}
  ];
  const format = value => new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const form=document.getElementById('membership-form');
  if(!form)return;
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
  const rows=document.getElementById('membership-plan-rows');
  const recipient=document.getElementById('membership-for');
  const otherAdult=document.createElement('option');otherAdult.value='adult';otherAdult.textContent='Another adult (18+)';
  recipient.options[0].after(otherAdult);
  form.querySelector('.membership-steps').hidden=true;
  const singlePageStyle=document.createElement('style');singlePageStyle.textContent='.membership-steps[hidden]{display:none!important}.membership-panel{margin-bottom:20px}.membership-panel h3{font-size:18px}.membership-panel textarea{width:100%;box-sizing:border-box;min-height:80px;border:1px solid var(--line);border-radius:6px;padding:10px;font:inherit}';document.head.append(singlePageStyle);
  plans.forEach(plan=>{
    const option=document.createElement('option');option.value=plan.id;option.textContent=plan.recurring?`${plan.name} - ${format(plan.monthly)} / month`:`${plan.name} - ${format(plan.due)} / 90 days`;select.append(option);
  });
  const comparisonPlans=[...plans].sort((a,b)=>a.tier.localeCompare(b.tier));
  const bestsellerId='premium-plus';
  const planHead=document.getElementById('membership-plan-head');
  for(const item of comparisonPlans){
    const heading=document.createElement('th');heading.scope='col';
    heading.textContent=item.name;
    if(item.id===bestsellerId){
      heading.classList.add('membership-bestseller');
      const badge=document.createElement('span');badge.className='membership-bestseller-label';badge.textContent='Bestseller';
      heading.append(badge);
    }
    planHead.append(heading);
  }
  const benefits=[
    ['School days',item=>item.premium?'Unlimited jumping':'1 hour'],
    ['Weekends & school holidays',item=>item.premium?'2 hours':'1 hour'],
    ['Welcome pack',item=>item.premium?'Included':'Not included'],
    ['Birthday benefit',item=>item.premium?'Included':'Not included'],
    ['Price',item=>`<strong>${format(item.recurring?item.monthly:item.due)}</strong><small>${item.recurring?'/ month':'Paid upfront'}</small>`],
    ['Term',item=>item.term],
    ['Select plan',item=>`<button class="wire-button" type="button" data-choose-plan="${item.id}" aria-label="Choose ${item.name}">Choose plan</button>`],
  ];
  for(const [label,value] of benefits){
    const row=document.createElement('tr');
    const heading=document.createElement('th');heading.scope='row';heading.textContent=label;
    row.append(heading);
    for(const item of comparisonPlans){
      const cell=document.createElement('td');cell.dataset.planColumn=item.id;cell.innerHTML=value(item);row.append(cell);
      cell.classList.toggle('membership-bestseller',item.id===bestsellerId);
    }
    rows.append(row);
  }
  const plan=()=>plans.find(item=>item.id===select.value);
  const status=document.getElementById('membership-status');
  const update=()=>{
    const item=plan();
    rows.querySelectorAll('[data-plan-column]').forEach(cell=>{
      const chosen=cell.dataset.planColumn===item.id;cell.classList.toggle('selected',chosen);
      const button=cell.querySelector('button');
      if(button){button.textContent=chosen?'Selected':'Choose plan';button.setAttribute('aria-pressed',String(chosen));}
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
  rows.addEventListener('click',event=>{
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
    const item=plan();
    const target=new URL('../checkout-html-screens/02-registration-page.html',window.location.href);
    target.searchParams.set('booking',JSON.stringify([['Category','Membership'],['Selection',item.name],['Activation date',activation.value],['Total',format(item.due)]]));
    window.location.href=target.href;
  });
  const requestedPlan=new URLSearchParams(window.location.search).get('plan');
  if(plans.some(item=>item.id===requestedPlan))select.value=requestedPlan;
  showStep(1);
})();
