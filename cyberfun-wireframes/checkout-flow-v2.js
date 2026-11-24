(() => {
  const params = new URLSearchParams(location.search);
  let rows;
  try { rows = JSON.parse(params.get('booking') || '[]'); } catch { rows = []; }
  rows = Array.isArray(rows) ? rows.filter(row => Array.isArray(row) && row.length === 2) : [];
  const payment = location.pathname.endsWith('03-payment-page.html');
  const screen = document.querySelector('.checkout-screen');
  if (!screen) return;
  screen.innerHTML = '<div class="cf-checkout"><h1></h1><div id="flow"></div></div>';
  const root = screen.querySelector('.cf-checkout'), flow = root.querySelector('#flow');
  root.querySelector('h1').textContent = payment ? 'Your details & payment' : 'How would you like to continue?';
  const go = (file, extra = {}) => {
    const query = new URLSearchParams(params);
    Object.entries(extra).forEach(([key,value]) => query.set(key,value));
    location.href = new URL(file + '?' + query, location.href).href;
  };
  const addSummary = parent => {
    const section = document.createElement('section'); section.setAttribute('aria-label','Your selection');
    const title = document.createElement('h2'); title.textContent = 'Your selection';
    const total = rows.find(([label]) => label === 'Total')?.[1] || '0 Ft';
    const giftRow = rows.find(([label]) => label === 'Gift voucher');
    const base = CyberfunBenefits.amount(total) + (giftRow ? CyberfunBenefits.amount(giftRow[1]) : 0);
    const render = () => {
      section.replaceChildren(title);
      const gift = CyberfunBenefits.benefit();
      const coupon = payment && params.get('account') === 'login' ? Number(section.dataset.discount || 0) : 0;
      const afterGift = Math.max(0, base - (gift?.value || 0));
      const discount = Math.floor(afterGift * coupon);
      const display = [...rows.filter(([label]) => !['Total','Gift voucher','Discount code'].includes(label)),
        ...(gift ? [['Gift voucher','−' + CyberfunBenefits.money(Math.min(base,gift.value))]] : []),
        ...(coupon ? [['Discount code','−' + CyberfunBenefits.money(discount)]] : []),
        ['Total',CyberfunBenefits.money(Math.max(0,afterGift-discount))]];
      display.forEach(([label,value]) => {
        const row = document.createElement('div'); row.className = 'cf-row';
        const name = document.createElement('span'); name.textContent = label;
        const text = document.createElement('strong'); text.textContent = value;
        row.append(name,text); section.append(row);
      });
      section.dataset.rows = JSON.stringify(display);
      const paymentTotal = parent.closest('form')?.querySelector('.cf-simplepay-total');
      if (paymentTotal) paymentTotal.textContent = CyberfunBenefits.money(Math.max(0,afterGift-discount));
      return Math.max(0,afterGift-discount);
    };
    parent.append(section);
    render();
    return {section,render};
  };
  if (!payment) {
    flow.innerHTML = '<div class="cf-options cf-account-options"><section class="cf-option"><h2 id="account-title">Log in</h2><p>Log in to use discount codes.</p><form id="account-form"><label>Email address *<input type="email" autocomplete="email" required></label><label>Password *<input type="password" autocomplete="current-password" required minlength="6"></label><p>If you have no account yet, <a href="#register" id="show-register">Register</a></p><button type="submit">Sign in</button></form></section><section class="cf-option"><h2>Continue as a guest</h2><p>Book without creating an account.</p><button type="button" id="guest-next">Continue as a guest</button></section></div>';
    flow.querySelector('#guest-next').onclick = () => go('03-payment-page.html',{account:'guest'});
    const form = flow.querySelector('form');
    const reveal = register => {flow.querySelector('#account-title').textContent=register?'Register':'Log in';form.querySelector('input[type=password]').autocomplete=register?'new-password':'current-password';form.querySelector('button').textContent=register?'Register & continue':'Sign in';form.querySelector('input').focus();};
    flow.querySelector('#show-register').onclick = event => {event.preventDefault();reveal(true);};
    form.onsubmit = event => {event.preventDefault();if(form.reportValidity())go('03-payment-page.html',{account:'login'});};
    return;
  }
  const form = document.createElement('form');
  form.innerHTML = '<h2>Your details</h2><div class="cf-details"><label>Name / company<input autocomplete="name" required></label><label>Email<input type="email" id="payer-email" autocomplete="email" required></label><label>Email again<input type="email" id="payer-confirm" required></label><label>Phone<input type="tel" autocomplete="tel" required></label><label>Zip code<input autocomplete="postal-code" required></label><label>City<input autocomplete="address-level2" required></label><label>Street, number<input autocomplete="street-address" required></label><label>Comment<textarea></textarea></label></div><label class="cf-consent"><input type="checkbox" id="vat-request"><span>Request VAT invoice</span></label><label id="vat-field" hidden>VAT number<input></label>';
  flow.append(form);
  form.querySelector('#vat-request').onchange = event => {form.querySelector('#vat-field').hidden=!event.target.checked;form.querySelector('#vat-field input').required=event.target.checked;};
  const validateEmail = () => form.querySelector('#payer-confirm').setCustomValidity(form.querySelector('#payer-confirm').value===form.querySelector('#payer-email').value?'':'Email addresses must match.');
  form.querySelector('#payer-confirm').oninput=validateEmail;form.querySelector('#payer-email').oninput=validateEmail;
  const benefits = document.createElement('section'); benefits.innerHTML = '<h2>Do you have a discount code?</h2>';form.append(benefits);
  const loggedIn = params.get('account') === 'login';
  if (loggedIn) benefits.insertAdjacentHTML('beforeend','<label>Discount code<input id="coupon-code" placeholder="Enter discount code"></label><button type="button" id="coupon-apply">Apply code</button><p id="coupon-status" role="status"></p>');
  else {
    const message=document.createElement('p');message.textContent='Log in to use discount codes. ';
    const link=document.createElement('a');link.href=new URL('02-registration-page.html?'+params,location.href).href;link.textContent='Log in';message.append(link);benefits.append(message);
  }
  const recap=addSummary(form);
  if(loggedIn) form.querySelector('#coupon-apply').onclick=()=>{
    const valid=form.querySelector('#coupon-code').value.trim().toUpperCase()==='SAVE10';
    recap.section.dataset.discount=valid?'0.1':'0';
    form.querySelector('#coupon-status').textContent=valid?'Discount applied: 10%.':'Code not recognised.';
    recap.render();
  };
  const pay=document.createElement('section');
  pay.innerHTML='<div class="cf-simplepay-box"><label class="cf-simplepay-choice"><input type="radio" name="payment-provider" value="simplepay" checked><strong>Online Payment with debit card</strong><span class="cf-simplepay-total"></span></label><p>SimplePay - through a secure online payment system. <a href="#simplepay-information" class="cf-simplepay-info">Debit card payment information</a></p><div class="cf-simplepay-logos" role="img" aria-label="SimplePay, Google Pay, Apple Pay, Mastercard, Maestro, Visa and American Express"></div><p id="simplepay-information" hidden>Your payment details are entered on the SimplePay payment page. Available payment methods are shown there.</p></div><label class="cf-consent"><input type="checkbox" required><span>Please read and agree to the General Terms and Conditions. <a href="../../pages/legal/terms-conditions.html">GT&amp;Cs</a> *</span></label><button class="cf-finalize" type="submit">Finalize purchase</button>';
  form.append(pay);
  pay.querySelector('.cf-simplepay-total').textContent = CyberfunBenefits.money(recap.render());
  pay.querySelector('.cf-simplepay-info').onclick = event => {
    event.preventDefault();
    const information = pay.querySelector('#simplepay-information');
    information.hidden = !information.hidden;
  };
  form.onsubmit=event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const panel=document.createElement('section');panel.className='cf-option';panel.tabIndex=-1;
    panel.innerHTML='<h2>SimplePay</h2><p>Payment methods</p><div class="cf-row"><span>Total</span><strong></strong></div><div class="cf-methods"><button type="button">Bank card</button><button type="button">Digital wallet</button><button type="button">Simple wallet</button><button type="button">Bank transfer</button></div><p role="status">Choose a payment method.</p><button type="button" class="cf-back">Back to your order</button>';
    panel.querySelector('strong').textContent=CyberfunBenefits.money(recap.render());
    panel.querySelectorAll('.cf-methods button').forEach(button=>{button.setAttribute('aria-pressed','false');button.onclick=()=>{panel.querySelectorAll('.cf-methods button').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));panel.querySelector('[role=status]').textContent='Selected: '+button.textContent+'. Payment provider connection pending.';};});
    form.hidden=true;flow.append(panel);panel.focus();panel.querySelector('.cf-back').onclick=()=>{panel.remove();form.hidden=false;};
  };
})();
