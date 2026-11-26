window.CyberfunRegistration = {
  mount(form, complete) {
    form.innerHTML = '<h2>Registrant’s details</h2><p>People over 18 years of age</p><fieldset class="cf-register-box"><label>First name *<input name="firstName" autocomplete="given-name" required></label><label>Last name *<input name="lastName" autocomplete="family-name" required></label><label>Email *<input name="email" type="email" autocomplete="email" required></label><label>Password *<input name="password" type="password" autocomplete="new-password" required minlength="6"></label><label>Password again *<input name="passwordAgain" type="password" autocomplete="new-password" required minlength="6"></label><div id="registrant-birthday"></div></fieldset><h2>Child details</h2><div id="registration-children"></div><button type="button" id="add-sibling">Add sibling</button><label class="cf-consent"><input name="terms" type="checkbox" required><span>I accept the <a href="../../pages/legal/terms-conditions.html">General Terms and Conditions</a> and confirm I am over 18 years old.</span></label><label class="cf-consent"><input name="privacy" type="checkbox" required><span>I agree to the processing of my personal data as described in the <a href="../../pages/legal/privacy-policy.html">Privacy Policy</a>.</span></label><label class="cf-consent"><input name="photos" type="checkbox"><span>I agree to the use of group photos and videos for communication purposes. (Optional)</span></label><label class="cf-consent"><input name="newsletter" type="checkbox"><span>I would like to receive newsletters about services, promotions, events and discounts. I can unsubscribe at any time. (Optional)</span></label><button type="submit" class="cf-finalize">Register</button>';
    const today = new Date();
    const birthday = (host, adult, required) => {
      const group = document.createElement('div');
      group.innerHTML = '<span>Birthday' + (required ? ' *' : '') + '</span><div class="cf-birthday"></div>';
      const controls = group.querySelector('div');
      const select = (label, values) => {
        const input = document.createElement('select'); input.setAttribute('aria-label', label);input.required=required;
        const empty = document.createElement('option');empty.value='';empty.textContent=label;input.append(empty);
        values.forEach(value=>{const option=document.createElement('option');option.value=String(value);option.textContent=String(value).padStart(2,'0');input.append(option);});
        controls.append(input);return input;
      };
      const year=select('Year',Array.from({length:121},(_,i)=>today.getFullYear()-i));
      const month=select('Month',Array.from({length:12},(_,i)=>i+1));
      const day=select('Day',Array.from({length:31},(_,i)=>i+1));
      const validate=()=>{
        day.setCustomValidity('');
        if(!year.value||!month.value||!day.value)return;
        const date=new Date(Number(year.value),Number(month.value)-1,Number(day.value));
        const real=date.getFullYear()===Number(year.value)&&date.getMonth()===Number(month.value)-1&&date.getDate()===Number(day.value);
        const cutoff=new Date(today.getFullYear()-18,today.getMonth(),today.getDate());
        if(!real)day.setCustomValidity('Please choose a valid date.');
        else if(date>today)day.setCustomValidity('Please choose a birthday in the past.');
        else if(adult&&date>cutoff)day.setCustomValidity('The registrant must be at least 18.');
        else if(!adult&&date<=cutoff)day.setCustomValidity('Child details are for guests under 18.');
      };
      [year,month,day].forEach(input=>input.addEventListener('change',validate));host.append(group);
      return {validate,value:()=>[year.value,month.value.padStart(2,'0'),day.value.padStart(2,'0')].join('-'),filled:()=>Boolean(year.value||month.value||day.value),inputs:[year,month,day]};
    };
    const birth=birthday(form.querySelector('#registrant-birthday'),true,true);
    const children=new Map();
    const addChild=()=>{
      const child=document.createElement('fieldset');child.className='cf-register-box';
      child.innerHTML='<legend>Child details (optional)</legend><label>First name<input name="childFirstName"></label><label>Last name<input name="childLastName"></label><div class="cf-child-birthday"></div><button type="button">Remove sibling</button>';
      const date=birthday(child.querySelector('.cf-child-birthday'),false,false);
      const names=[...child.querySelectorAll('input')];
      const update=()=>{const filled=names.some(input=>input.value.trim())||date.filled();[...names,...date.inputs].forEach(input=>input.required=filled);date.validate();};
      child.addEventListener('input',update);child.addEventListener('change',update);
      child.querySelector('button').onclick=()=>{children.delete(child);child.remove();};
      children.set(child,{names,date});form.querySelector('#registration-children').append(child);
    };
    form.querySelector('#add-sibling').onclick=addChild;addChild();
    const confirmPasswords=()=>form.elements.passwordAgain.setCustomValidity(form.elements.passwordAgain.value===form.elements.password.value?'':'Passwords must match.');
    form.elements.password.oninput=confirmPasswords;form.elements.passwordAgain.oninput=confirmPasswords;
    const dialog=document.createElement('dialog');dialog.className='cf-declaration';
    dialog.setAttribute('aria-labelledby','declaration-title');
    dialog.innerHTML='<form method="dialog"><button class="cf-dialog-close" aria-label="Close declaration" value="close" type="submit">&times;</button></form><h2 id="declaration-title">Individual Liability Declaration</h2><div class="cf-declaration-copy"></div><label class="cf-consent"><input type="checkbox" id="declaration-accept"><span>I have read, understood and accepted the Liability Declaration.</span></label><div class="cf-declaration-actions"><button type="button" id="declaration-close">Close</button><button type="button" id="declaration-register" disabled>Complete registration</button></div>';
    for(let i=1;i<=6;i++){
      const title=document.createElement('h3');title.textContent=i+'. Declaration section';
      const text=document.createElement('p');text.textContent='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
      dialog.querySelector('.cf-declaration-copy').append(title,text);
    }
    document.body.append(dialog);
    const checkbox=dialog.querySelector('#declaration-accept'), finish=dialog.querySelector('#declaration-register');
    checkbox.onchange=()=>finish.disabled=!checkbox.checked;
    dialog.querySelector('#declaration-close').onclick=()=>dialog.close();
    dialog.addEventListener('close',()=>form.querySelector('button[type=submit]').focus());
    finish.onclick=()=>{
      if(!checkbox.checked)return;
      const profile={
        firstName:form.elements.firstName.value.trim(),lastName:form.elements.lastName.value.trim(),
        email:form.elements.email.value.trim(),birthday:birth.value(),
        children:[...children.values()].filter(child=>child.names.some(input=>input.value.trim())).map(child=>({firstName:child.names[0].value.trim(),lastName:child.names[1].value.trim(),birthday:child.date.value()})),
        declarationAccepted:true,
        newsletterConsent:form.elements.newsletter.checked,
      };
      sessionStorage.setItem('cyberfun-profile',JSON.stringify(profile));
      dialog.close();complete(profile);
    };
    form.onsubmit=event=>{
      event.preventDefault();birth.validate();confirmPasswords();
      children.forEach(child=>child.date.validate());
      if(!form.reportValidity())return;
      checkbox.checked=false;finish.disabled=true;dialog.showModal();dialog.scrollTop=0;
    };
  },
};
