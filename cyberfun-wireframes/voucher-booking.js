(() => {
  const init=()=>{
    const form=document.querySelector('form.checkout');
    if(!form?.querySelector('[data-category=ticket]')||typeof updateSummary!=='function')return;
    const tabs=form.querySelector('.category-tabs'),summary=form.querySelector('.summary');
    const tab=document.createElement('button');tab.type='button';tab.className='category-tab';tab.textContent='Voucher';tab.dataset.category='voucher';
    tabs.append(tab);tabs.style.gridTemplateColumns='repeat(3,minmax(0,1fr))';
    let active=false;
    const panel=document.createElement('section');panel.className='field voucher-product-panel';panel.hidden=true;
    panel.innerHTML='<label for="voucher-product">Choose product</label><select id="voucher-product"></select><label for="voucher-quantity">Number of guests / vouchers</label><input id="voucher-quantity" type="number" min="1" value="1" step="1" inputmode="numeric"><p>No date or time is selected. The recipient books their visit later, subject to availability and the product’s group limits.</p>';
    const items=[];
    const addGroup=(label,products)=>{
      const group=document.createElement('optgroup');group.label=label;
      products.forEach(([name,price])=>{const option=document.createElement('option');option.value=String(items.length);option.textContent=name+' · '+new Intl.NumberFormat('de-DE').format(price)+' Ft / person';items.push({name,price});group.append(option);});
      panel.querySelector('select').append(group);
    };
    addGroup('Attractions',[
      ['Jump · 1 hour',4500],['Jump · 2 hours',6500],
      ['Pixel · 30 minutes',3000],['Pixel · 60 minutes',5500],
      ['Karaoke · 30 minutes',3000],['Karaoke · 60 minutes',4500],
      ['Lasertag · 30 minutes',3500],['Lasertag · 60 minutes',4500],
      ['Darts · 30 minutes',3000],['Darts · 60 minutes',4500],
    ]);
    addGroup('Birthday & Parties',[
      ['CyberParty · Mon–Thu',6250],['CyberParty · Fri–Sun',7150],
      ['CyberStar · Mon–Thu',7850],['CyberStar · Fri–Sun',9150],
      ['CyberFun Party · Mon–Thu',9650],['CyberFun Party · Fri–Sun',10650],
      ['Fun Party',6800],
    ]);
    addGroup('Memberships',[
      ['Basic VIP Card+ · first payment (2 months)',7400],
      ['Premium VIP Card+ · first payment (2 months)',11200],
      ['Basic VIP Card 3 · 90 days',15900],
      ['Premium VIP Card 3 · 90 days',24120],
    ]);
    summary.before(panel);
    const state=new Map(),rowState=new Map();
    const price=value=>new Intl.NumberFormat('de-DE').format(value)+' Ft';
    const original=updateSummary;
    updateSummary=function(...args){
      original(...args);
      if(!active)return;
      const body=form.querySelector('.checkout-body');
      for(const child of body.children){
        if(child===summary||child===panel||child.contains(tabs)||child.classList.contains('gift-voucher-field'))continue;
        if(!state.has(child))state.set(child,{hidden:child.hidden,display:child.style.display});
        child.hidden=true;child.style.display='none';
      }
      panel.hidden=false;
      const item=items[Number(panel.querySelector('select').value)||0];
      const quantity=panel.querySelector('input');
      const count=Math.max(1,Math.floor(Number(quantity.value)||1));
      if(args[0]?.type!=='input')quantity.value=String(count);
      summary.querySelectorAll('.summary-row').forEach(row=>{
        const label=row.querySelector('span')?.textContent.trim();
        const keep=['Category','Selection','Guests / units','Price per person','Total','Gift voucher'].includes(label);
        if(!rowState.has(row))rowState.set(row,{hidden:row.hidden,display:row.style.display});
        row.style.display=keep?'':'none';
        if(keep)row.classList.remove('hidden');
      });
      form.querySelector('#summary-category').textContent='Voucher';
      form.querySelector('#summary-product').textContent=item.name;
      form.querySelector('#summary-guests').textContent=String(count);
      form.querySelector('#summary-basis').textContent=price(item.price);
      const gift=window.CyberfunBenefits?.benefit();
      const total=item.price*count;
      summary.querySelectorAll('.summary-row').forEach(row=>{
        if(row.querySelector('span')?.textContent.trim()==='Gift voucher'){
          row.style.display=gift?'':'none';
          row.querySelector('strong').textContent=gift?'−'+price(Math.min(total,gift.value)):'';
        }
      });
      form.querySelector('#summary-total').textContent=price(Math.max(0,total-(gift?.value||0)));
    };
    const restore=()=>{
      active=false;panel.hidden=true;
      for(const [child,old]of state){child.hidden=old.hidden;child.style.display=old.display;}state.clear();
      for(const [row,old]of rowState){row.hidden=old.hidden;row.style.display=old.display;}rowState.clear();
    };
    tabs.querySelectorAll('button:not([data-category=voucher])').forEach(button=>button.addEventListener('click',restore,true));
    tab.onclick=()=>{
      form.querySelector('[data-category=ticket]').click();
      active=true;
      tabs.querySelectorAll('button').forEach(button=>{button.classList.toggle('active',button===tab);button.setAttribute('aria-pressed',String(button===tab));});
      updateSummary();
    };
    panel.addEventListener('input',updateSummary);panel.addEventListener('change',updateSummary);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
