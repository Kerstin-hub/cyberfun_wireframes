(() => {
  let profile={};
  try{profile=JSON.parse(sessionStorage.getItem('cyberfun-profile')||'{}');}catch{}
  const form=document.getElementById('profile-form'),params=new URLSearchParams(location.search);
  const destination=new URL('../membership-wireframes/membership-page-v3.html',location.href);
  for(const key of ['plan','activation'])if(params.has(key))destination.searchParams.set(key,params.get(key));
  destination.hash='membership-checkout';
  document.getElementById('profile-back').href=destination.href;
  for(const key of ['firstName','lastName','email','birthday'])form.elements[key].value=profile[key]||'';
  const children=document.getElementById('profile-children');
  const add=person=>{
    const block=document.createElement('fieldset');
    block.innerHTML='<legend>Child</legend><label>First name *<input name="childFirst" required></label><label>Last name *<input name="childLast" required></label><label>Birthday *<input type="date" name="childBirthday" required></label><button type="button">Remove child</button>';
    for(const [name,key]of [['childFirst','firstName'],['childLast','lastName'],['childBirthday','birthday']])block.querySelector('[name="'+name+'"]').value=person[key]||'';
    block.querySelector('button').onclick=()=>block.remove();children.append(block);
  };
  (profile.children||[]).forEach(add);
  document.getElementById('profile-add').onclick=()=>add({});
  form.onsubmit=event=>{
    event.preventDefault();if(!form.reportValidity())return;
    for(const key of ['firstName','lastName','email','birthday'])profile[key]=form.elements[key].value.trim();
    profile.children=[...children.children].map(block=>({firstName:block.querySelector('[name=childFirst]').value.trim(),lastName:block.querySelector('[name=childLast]').value.trim(),birthday:block.querySelector('[name=childBirthday]').value}));
    sessionStorage.setItem('cyberfun-profile',JSON.stringify(profile));
    location.href=destination.href;
  };
})();
