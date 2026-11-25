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
  let profile;
  try{profile=JSON.parse(sessionStorage.getItem('cyberfun-profile')||'null');}catch{}
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
  const zip=addField('membership-zip','Zip code','text',true);
  const city=addField('membership-city','City','text',true);
  address.required=true;
  const tax=addField('membership-tax','VAT / tax number','text');
  const advisor=addField('membership-advisor','On-site adviser (optional)');
  addField('membership-notes','Notes / special requests','textarea');
  const review=form.querySelector('[data-membership-step="3"]');
  const paymentBox=document.createElement('div');paymentBox.className='cf-checkout membership-payment';
  paymentBox.innerHTML='<div class="cf-simplepay-box"><label class="cf-simplepay-choice"><input type="radio" name="payment-provider" checked><strong>Online Payment with debit card</strong><span class="cf-simplepay-total"></span></label><p>SimplePay - through a secure online payment system. <a href="#membership-payment-info">Debit card payment information</a></p><div class="cf-simplepay-logos" role="img" aria-label="SimplePay, Google Pay, Apple Pay, Mastercard, Maestro, Visa and American Express"></div><p id="membership-payment-info" hidden>Payment details are entered on SimplePay. The live payment connection is pending.</p></div>';
  review.querySelector('.membership-consent').before(paymentBox);
  paymentBox.querySelector('a').onclick=event=>{event.preventDefault();const info=paymentBox.querySelector('#membership-payment-info');info.hidden=!info.hidden;};
  const subscriptions=document.createElement('section');subscriptions.className='membership-panel membership-subscriptions';
  subscriptions.innerHTML='<h3>Live VIP Cards</h3><p>No subscriptions yet.</p>';
  form.querySelector('.checkout-body').prepend(subscriptions);
  const registrationSummary=document.createElement('div');registrationSummary.className='summary membership-summary';
  review.querySelector('.summary').after(registrationSummary);
  const select=document.getElementById('membership-plan');
  const rows=document.getElementById('membership-plan-rows');
  const recipient=document.getElementById('membership-for');
  const otherAdult=document.createElement('option');otherAdult.value='adult';otherAdult.textContent='Another adult (18+)';
  recipient.options[0].after(otherAdult);
  const subscriberField=recipient.closest('.field');
  memberPanel.prepend(subscriberField,document.getElementById('membership-holder-name').closest('.field'),document.getElementById('membership-dob').closest('.field'),document.getElementById('membership-parent-field'),document.getElementById('membership-email').closest('.field'));
  form.querySelector('[data-membership-step="1"]').before(memberPanel);
  const planPanel=form.querySelector('[data-membership-step="1"]');
  document.getElementById('membership-plan-access').remove();
  document.getElementById('membership-plan-term').remove();
  planPanel.querySelector('h3').textContent='Choose your VIP Card';
  const planChoices=document.createElement('div');planChoices.className='membership-vip-choices';
  const choiceHeading=document.createElement('p');choiceHeading.textContent='Select your VIP card';
  const legacyPlanField=planPanel.querySelector('.field');
  legacyPlanField.hidden=true;
  legacyPlanField.classList.add('membership-plan-legacy');
  planPanel.prepend(choiceHeading,planChoices);
  planPanel.prepend(planPanel.querySelector('h3'));
  const recurringGroup=document.createElement('div');recurringGroup.className='membership-vip-group';
  const seasonGroup=document.createElement('div');seasonGroup.className='membership-vip-group';
  recurringGroup.innerHTML='<h4>Recurring subscriptions</h4>';
  seasonGroup.innerHTML='<h4>Season tickets</h4>';
  planChoices.append(recurringGroup,seasonGroup);
  [...plans].sort((a,b)=>a.tier.localeCompare(b.tier)).forEach(item=>{
    const choice=document.createElement('button');choice.type='button';choice.dataset.vipPlan=item.id;choice.className='membership-vip-choice';
    const title=document.createElement('strong');title.textContent=item.tier+(item.recurring?' VIP Card+ subscription':' VIP 3 months');
    const access=document.createElement('small');access.textContent=item.access;
    const term=document.createElement('small');term.textContent=item.recurring?'Minimum term: 3 months':'Validity: 90 days from purchase';
    choice.append(title,term,access);
    if(item.premium){
      const extras=document.createElement('small');extras.textContent='Welcome package* · Birthday benefit**';choice.append(extras);
    }
    const price=document.createElement('span');price.textContent=item.recurring?'First payment: '+format(item.due):'Total: '+format(item.due);
    choice.append(price);
    if(item.recurring){const monthly=document.createElement('small');monthly.textContent=format(item.monthly)+' / month';choice.append(monthly);}
    choice.onclick=()=>{document.getElementById('membership-plan').value=item.id;update();};
    (item.recurring?recurringGroup:seasonGroup).append(choice);
  });
  const benefitNotes=document.createElement('div');benefitNotes.className='membership-vip-footnotes';
  benefitNotes.innerHTML='<p>* Welcome package includes: 1 pair of jumping socks, Cyberfun bracelet, 1 bottle of water.</p><p>** If you book a birthday party for at least 9 people, your package is free, provided you are a Premium VIP cardholder.</p>';
  planChoices.after(benefitNotes);
  planChoices.id='membership-vip-choices';
  planPanel.after(activation.closest('.field'));
  const billingPanel=document.createElement('section');billingPanel.className='membership-panel';
  review.before(billingPanel);
  billingPanel.append(billingTitle,payer.closest('.field'),emailConfirm.closest('.field'),phone.closest('.field'),zip.closest('.field'),city.closest('.field'),address.closest('.field'),advisor.closest('.field'),invoiceLabel,tax.closest('.field'),form.querySelector('#membership-notes').closest('.field'));
  const accountPanel=document.createElement('section');accountPanel.className='membership-panel membership-account';
  const subscriberPanel=document.createElement('section');subscriberPanel.className='membership-panel membership-subscriber';
  subscriberPanel.innerHTML='<h3>Select your subscriber</h3><div class="membership-subscriber-list"></div><p>Need to add someone, such as your child? Add them to your profile first.</p><a class="wire-button" id="membership-profile-link">Go to profile</a>';
  planPanel.before(subscriberPanel);
  let selectedSubscriber='self';
  const chooseSubscriber=(key,person)=>{
    selectedSubscriber=key;
    recipient.value=key==='self'?'self':'saved-child-'+key;
    document.getElementById('membership-holder-name').value=[person.firstName,person.lastName].filter(Boolean).join(' ');
    document.getElementById('membership-dob').value=person.birthday||'';
    subscriberPanel.querySelectorAll('input').forEach(input=>input.checked=input.value===key);
  };
  accountPanel.innerHTML='<h3>Log in to start your membership</h3><label>Email<input type="email" id="membership-login-email" autocomplete="email"></label><label>Password<input type="password" id="membership-login-password" autocomplete="current-password"></label><button type="button" id="membership-login">Log in</button><p>No account yet? <button type="button" id="membership-register">Register</button></p><p role="status" id="membership-account-status"></p>';
  form.querySelector('.checkout-body').prepend(accountPanel);
  const applyProfile=()=>{
    if(!profile)return;
    const name=[profile.firstName,profile.lastName].filter(Boolean).join(' ');
    accountPanel.hidden=true;
    document.getElementById('membership-email').value=profile.email||'';
    emailConfirm.value=profile.email||'';
    payer.value=profile.billingName||name;
    phone.value=profile.phone||'';zip.value=profile.zip||'';city.value=profile.city||'';address.value=profile.street||'';
    document.getElementById('membership-holder-name').value=name;
    document.getElementById('membership-dob').value=profile.birthday||'';
    document.getElementById('membership-parent-name').value=name;
    recipient.querySelectorAll('[data-profile-child]').forEach(option=>option.remove());
    (profile.children||[]).forEach((child,index)=>{
      const option=document.createElement('option');option.value='saved-child-'+index;option.dataset.profileChild=String(index);
      option.textContent=[child.firstName,child.lastName].join(' ')+(child.birthday?' ('+child.birthday+')':'');recipient.append(option);
    });
    recipient.options[0].textContent=name||'Myself (18+)';
    const subscriberList=subscriberPanel.querySelector('.membership-subscriber-list');
    subscriberList.replaceChildren();
    const people=[{key:'self',person:profile},...(profile.children||[]).map((person,index)=>({key:String(index),person}))];
    people.forEach(({key,person})=>{
      const label=document.createElement('label');label.className='membership-consent';
      const radio=document.createElement('input');radio.type='radio';radio.name='subscriber';radio.value=key;radio.checked=key===selectedSubscriber;
      const text=document.createElement('span');text.textContent=([person.firstName,person.lastName].filter(Boolean).join(' ')||person.email||'Account holder')+(person.birthday?' ('+person.birthday+')':'');
      radio.onchange=()=>{chooseSubscriber(key,person);update();};
      label.append(radio,text);subscriberList.append(label);
    });
    const active=people.find(entry=>entry.key===selectedSubscriber)||people[0];
    chooseSubscriber(active.key,active.person);
  };
  recipient.addEventListener('change',()=>{
    const saved=recipient.selectedOptions[0].dataset.profileChild;
    const person=saved===undefined?(recipient.value==='self'?profile:null):profile?.children?.[Number(saved)];
    document.getElementById('membership-holder-name').value=person?[person.firstName,person.lastName].filter(Boolean).join(' '):'';
    document.getElementById('membership-dob').value=person?.birthday||'';
  });
  accountPanel.querySelector('#membership-login').onclick=()=>{
    const email=accountPanel.querySelector('#membership-login-email'),password=accountPanel.querySelector('#membership-login-password');
    if(!email.value||!password.value||!email.reportValidity()){accountPanel.querySelector('[role=status]').textContent='Enter your email and password.';return;}
    let saved;
    try{saved=JSON.parse(sessionStorage.getItem('cyberfun-profile')||'null');}catch{}
    profile=saved?.email?.toLowerCase()===email.value.trim().toLowerCase()?saved:{email:email.value.trim()};
    sessionStorage.setItem('cyberfun-profile',JSON.stringify(profile));applyProfile();update();
  };
  accountPanel.querySelector('#membership-register').onclick=()=>{
    const dialog=document.createElement('dialog');dialog.className='cf-declaration membership-registration-dialog';
    const close=document.createElement('button');close.type='button';close.textContent='Close';close.onclick=()=>dialog.close();
    const registration=document.createElement('form');registration.className='cf-checkout';
    dialog.append(close,registration);document.body.append(dialog);
    CyberfunRegistration.mount(registration,data=>{profile=data;dialog.close();applyProfile();update();});
    dialog.showModal();
  };
  applyProfile();
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
  const welcomePack='1 pair of jump socks, a Cyberfun bracelet and 1 bottle of water';
  const benefits=[
    ['School days',item=>item.premium?'Unlimited jumping':'1 hour'],
    ['Weekends & school holidays',item=>item.premium?'2 hours':'1 hour'],
    ['Welcome pack*',item=>item.premium?welcomePack:'Not included'],
    ['Birthday benefit**',item=>item.premium?'Included':'Not included'],
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
  const mobileComparison=document.querySelector('.membership-comparison-mobile');
  if(mobileComparison) for(const item of comparisonPlans){
    const section=document.createElement('section');
    section.className='membership-mobile-plan';
    section.dataset.planColumn=item.id;
    const heading=document.createElement('h3');
    heading.textContent=item.name+(item.id===bestsellerId?' · Bestseller':'');
    const details=document.createElement('dl');
    for(const [label,value] of benefits.slice(0,-1)){
      const term=document.createElement('dt');term.textContent=label;
      const description=document.createElement('dd');description.innerHTML=value(item);
      details.append(term,description);
    }
    section.append(heading,details);
    section.insertAdjacentHTML('beforeend',benefits.at(-1)[1](item));
    mobileComparison.append(section);
  }
  const plan=()=>plans.find(item=>item.id===select.value);
  const status=document.getElementById('membership-status');
  const update=()=>{
    const authenticated=Boolean(profile);
    for(const child of form.querySelector('.checkout-body').children){
      if(child===accountPanel)child.hidden=authenticated;
      else if(!child.matches('.membership-steps'))child.hidden=!authenticated;
    }
    memberPanel.hidden=true;
    memberPanel.querySelectorAll('input,select').forEach(input=>{input.disabled=true;});
    form.classList.toggle('membership-auth-required',!authenticated);
    form.querySelector('.checkout-header h2').textContent=authenticated?'Become a VIP member':'Log in or register';
    form.querySelector('.checkout-header > p:last-child').textContent=authenticated?'Choose your plan and review the payment details.':'Sign in or create an account to start your membership.';
    const item=plan();
    const profileUrl=new URL('../account-wireframes/profile-page-v3.html',location.href);
    profileUrl.searchParams.set('plan',item.id);
    profileUrl.searchParams.set('activation',activation.value);
    subscriberPanel.querySelector('a').href=profileUrl.href;
    planChoices.querySelectorAll('[data-vip-plan]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.vipPlan===item.id)));
    document.querySelectorAll('[data-plan-column]').forEach(cell=>{
      const chosen=authenticated&&cell.dataset.planColumn===item.id;cell.classList.toggle('selected',chosen);
      const button=cell.querySelector('button');
      if(button){button.textContent=!authenticated?'Log in to choose':chosen?'Selected':'Choose plan';button.setAttribute('aria-pressed',String(chosen));}
    });
    document.getElementById('membership-billing-info').textContent=item.recurring
      ? `First payment: ${format(item.due)} for two months. Then ${format(item.monthly)} per month from month three. Three-month minimum term.`
      : `One payment of ${format(item.due)} for 90 days. No automatic renewal.`;
    document.getElementById('membership-summary-plan').textContent=item.name;
    document.getElementById('membership-summary-billing').textContent=item.billing;
    document.getElementById('membership-summary-access').textContent=item.access;
    document.getElementById('membership-summary-term').textContent=item.term;
    document.getElementById('membership-summary-total').textContent=format(item.due);
    paymentBox.querySelector('.cf-simplepay-total').textContent=format(item.due);
    subscriptions.hidden=!profile;
    document.getElementById('membership-summary-renewal').textContent=item.recurring?`${format(item.monthly)} / month`:'No automatic renewal';
    emailConfirm.setCustomValidity(emailConfirm.value!==document.getElementById('membership-email').value?'Email addresses must match.':'');
    tax.closest('.field').hidden=!invoice.checked;
    registrationSummary.replaceChildren(...[['Activation date',activation.value],['Payer',payer.value],['Phone',phone.value],...(invoice.checked?[['Billing address',address.value],['VAT / tax number',tax.value]]:[])].map(([label,value])=>{
      const row=document.createElement('div');row.className='summary-row';const name=document.createElement('span');name.textContent=label;const text=document.createElement('strong');text.textContent=value||'Not entered';row.append(name,text);return row;
    }));
    document.getElementById('membership-summary-holder').textContent=document.getElementById('membership-holder-name').value||'Not entered';
    document.getElementById('membership-summary-email').textContent=document.getElementById('membership-email').value||'Not entered';
    document.getElementById('membership-summary-owner').textContent=document.getElementById('membership-for').selectedOptions[0].textContent;
    const minor=recipient.value==='child'||recipient.value.startsWith('saved-child-');
    document.getElementById('membership-parent-field').hidden=!minor;
    document.getElementById('membership-parent-name').required=minor;
  };
  const showStep=value=>{
    form.querySelectorAll('[data-membership-step]').forEach(panel=>{panel.hidden=false;});
    document.getElementById('membership-back').hidden=true;
    document.getElementById('membership-next').textContent='Finalize purchase';
    status.hidden=true;update();
  };
  (document.getElementById('memberships')||rows).addEventListener('click',event=>{
    const button=event.target.closest('[data-choose-plan]');if(!button)return;
    if(profile)select.value=button.dataset.choosePlan;
    showStep(1);
    document.getElementById('membership-checkout').scrollIntoView({block:'start',behavior:'smooth'});
    if(profile)planChoices.querySelector('[aria-pressed=true]')?.focus({preventScroll:true});
    else accountPanel.querySelector('input').focus({preventScroll:true});
  });
  select.addEventListener('change',()=>{showStep(1);});
  form.addEventListener('input',update);form.addEventListener('change',update);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!profile){accountPanel.hidden=false;accountPanel.scrollIntoView({block:'center'});accountPanel.querySelector('[role=status]').textContent='Please log in or register before purchasing a membership.';return;}
    update();
    for(const input of form.querySelectorAll('input,select,textarea')){if(!input.reportValidity())return;}
    const item=plan();
    status.hidden=false;status.textContent='SimplePay payment preview: '+format(item.due)+'. Payment provider connection pending.';
    status.focus();
  });
  const requestedPlan=new URLSearchParams(window.location.search).get('plan');
  const requestedActivation=new URLSearchParams(window.location.search).get('activation');
  if(requestedActivation&&/^\d{4}-\d{2}-\d{2}$/.test(requestedActivation)&&requestedActivation>=today)activation.value=requestedActivation;
  if(profile&&plans.some(item=>item.id===requestedPlan))select.value=requestedPlan;
  showStep(1);
})();
