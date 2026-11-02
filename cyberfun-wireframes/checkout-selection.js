(() => {
  const query=new URLSearchParams(window.location.search);
  let rows;
  try{rows=JSON.parse(query.get('booking')||'[]');}catch{return;}
  if(!Array.isArray(rows)||!rows.length)return;
  const summary=document.createElement('section');summary.setAttribute('aria-label','Your selection');
  summary.style.cssText='padding:20px;border-bottom:1px solid #c8d4e0;background:#fff';
  const heading=document.createElement('h3');heading.textContent='Your selection';summary.append(heading);
  rows.forEach(row=>{
    if(!Array.isArray(row)||row.length!==2)return;
    const line=document.createElement('div');line.style.cssText='display:flex;justify-content:space-between;gap:16px;padding:6px 0;flex-wrap:wrap';
    const label=document.createElement('span');label.textContent=String(row[0]);const value=document.createElement('strong');value.textContent=String(row[1]);line.append(label,value);summary.append(line);
  });
  document.querySelector('.screen-top')?.after(summary);
  const intro=document.querySelector('.registration-intro h3');if(intro)intro.textContent='Your selection is ready.';
  document.querySelector('.register-button')?.addEventListener('click',()=>{window.location.href=new URL('03-payment-page.html?'+query.toString(),window.location.href).href;});
  document.querySelector('.login-option button')?.addEventListener('click',()=>{window.location.href=new URL('../account-wireframes/login-page-v3.html',window.location.href).href;});
})();
