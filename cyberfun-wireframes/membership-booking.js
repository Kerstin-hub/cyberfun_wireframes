(() => {
  const plans = [
    {id:'premium-plus',name:'Premium VIP Card+',tier:'Premium',billing:'Monthly subscription',monthly:5600,due:11200,term:'3-month minimum term',access:'Unlimited jumping on school days; 2 hours on weekends and school holidays.',premium:true,recurring:true},
    {id:'premium-three',name:'Premium VIP Card 3',tier:'Premium',billing:'90-day pass',monthly:8040,due:24120,term:'Valid for 90 days from purchase',access:'Unlimited jumping on school days; 2 hours on weekends and school holidays.',premium:true,recurring:false},
    {id:'basic-plus',name:'Basic VIP Card+',tier:'Basic',billing:'Monthly subscription',monthly:3700,due:7400,term:'3-month minimum term',access:'1 hour of jumping on school days, weekends and school holidays.',premium:false,recurring:true},
    {id:'basic-three',name:'Basic VIP Card 3',tier:'Basic',billing:'90-day pass',monthly:5300,due:15900,term:'Valid for 90 days from purchase',access:'1 hour of jumping on school days, weekends and school holidays.',premium:false,recurring:false}
  ];
  const format = value => new Intl.NumberFormat('de-DE').format(value)+' Ft';
  const form=document.getElementById('membership-form');
  const select=document.getElementById('membership-plan');
  const cards=document.getElementById('membership-plan-cards');
  let step=1;
  plans.forEach(plan=>{
    const option=document.createElement('option');option.value=plan.id;option.textContent=`${plan.name} - ${format(plan.monthly)} / month`;select.append(option);
    const card=document.createElement('article');card.className='membership-plan-card';card.dataset.planCard=plan.id;
    card.innerHTML=`<div class="membership-card-image" role="img" aria-label="${plan.tier} membership card placeholder">${plan.tier} VIP Card</div><div class="membership-card-body"><p class="wire-label">${plan.billing}</p><h3>${plan.name}</h3><p class="membership-price">${format(plan.monthly)} <small>/ month${plan.recurring?'':' equivalent'}</small></p><ul><li>${plan.access}</li><li>${plan.term}</li>${plan.premium?'<li>Welcome pack &amp; birthday benefit</li>':''}</ul><p class="membership-card-payment">${plan.recurring?`${format(plan.due)} initially (first 2 months)`: `${format(plan.due)} total, paid upfront`}</p><button type="button" data-choose-plan="${plan.id}">Choose plan</button></div>`;
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
      ? `First payment: ${format(item.due)}, covering months 1 and 2. From month 3: ${format(item.monthly)} each month. Minimum commitment: ${format(item.monthly*3)} over 3 months; cancellable afterwards.`
      : `One payment of ${format(item.due)} for 90 days. No automatic renewal.`;
    document.getElementById('membership-summary-plan').textContent=item.name;
    document.getElementById('membership-summary-billing').textContent=item.billing;
    document.getElementById('membership-summary-access').textContent=item.access;
    document.getElementById('membership-summary-term').textContent=item.term;
    document.getElementById('membership-summary-total').textContent=format(item.due);
    document.getElementById('membership-summary-renewal').textContent=item.recurring?`${format(item.monthly)} / month from month 3`:'No automatic renewal';
    document.getElementById('membership-summary-holder').textContent=document.getElementById('membership-holder-name').value||'Not entered';
    document.getElementById('membership-summary-email').textContent=document.getElementById('membership-email').value||'Not entered';
    document.getElementById('membership-summary-owner').textContent=document.getElementById('membership-for').selectedOptions[0].textContent;
    const minor=document.getElementById('membership-for').value==='child';
    document.getElementById('membership-parent-field').hidden=!minor;
    document.getElementById('membership-parent-name').required=minor;
  };
  const showStep=value=>{
    step=value;
    form.querySelectorAll('[data-membership-step]').forEach(panel=>{panel.hidden=Number(panel.dataset.membershipStep)!==step;});
    document.querySelectorAll('[data-step-indicator]').forEach(item=>{const active=Number(item.dataset.stepIndicator)===step;item.classList.toggle('active',active);if(active)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});
    document.getElementById('membership-back').hidden=step===1;
    document.getElementById('membership-next').textContent=step===1?'Continue':step===2?'Review membership':'Confirm selection';
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
  document.getElementById('membership-back').addEventListener('click',()=>showStep(Math.max(1,step-1)));
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const panel=form.querySelector(`[data-membership-step="${step}"]`);
    for(const input of panel.querySelectorAll('input,select')){if(!input.reportValidity())return;}
    if(step<3){showStep(step+1);form.querySelector(`[data-membership-step="${step}"] h3`).focus();return;}
    status.textContent='Your membership selection is ready. This wireframe does not create a subscription or take payment.';status.hidden=false;status.focus();
  });
  showStep(1);
})();
