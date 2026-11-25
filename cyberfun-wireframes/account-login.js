(() => {
  const base=new URL('.',document.currentScript.src);
  const params=new URLSearchParams(location.search);
  const fallback=new URL('outputs/account-wireframes/profile-page-v3.html',base);
  let destination=fallback;
  try{
    const requested=new URL(params.get('return')||fallback.href,location.href);
    if(requested.protocol===base.protocol&&requested.host===base.host&&requested.pathname.startsWith(base.pathname))destination=requested;
  }catch{}
  const panel=document.querySelector('.login-panel');
  if(destination.pathname.endsWith('/03-payment-page.html')){
    const guest=document.createElement('a');guest.className='text-link';guest.textContent='Continue as a guest';
    const guestUrl=new URL(destination);guestUrl.searchParams.set('account','guest');guest.href=guestUrl.href;
    const section=document.createElement('section');section.style.cssText='padding:20px 0;margin-top:20px;border-top:1px solid #c8d4e0';section.append(guest);
    panel.after(section);
  }
  const email=panel.querySelector('#email'),password=panel.querySelector('#password');
  email.required=true;password.required=true;
  panel.onsubmit=event=>{
    event.preventDefault();if(!panel.reportValidity())return;
    let profile;
    try{profile=JSON.parse(sessionStorage.getItem('cyberfun-profile')||'null');}catch{}
    if(!profile||profile.email?.toLowerCase()!==email.value.trim().toLowerCase())profile={email:email.value.trim()};
    sessionStorage.setItem('cyberfun-profile',JSON.stringify(profile));
    location.href=destination.href;
  };
  const register=()=>{
    panel.replaceChildren();
    panel.classList.add('cf-checkout');
    CyberfunRegistration.mount(panel,()=>{location.href=destination.href;});
    const back=document.createElement('a');const url=new URL(location.href);url.searchParams.delete('mode');
    back.href=url.href;back.textContent='Back to login';panel.append(back);
  };
  panel.querySelector('.create-account a').onclick=event=>{event.preventDefault();register();};
  panel.querySelectorAll('.social-button').forEach(button=>button.onclick=()=>{
    let status=panel.querySelector('[role=status]');
    if(!status){status=document.createElement('p');status.setAttribute('role','status');panel.append(status);}
    status.textContent='Social sign-in connection pending.';
  });
  if(params.get('mode')==='register')register();
})();
