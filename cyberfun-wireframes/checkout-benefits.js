(() => {
  const money = value => new Intl.NumberFormat('de-DE').format(value) + ' Ft';
  const amount = value => Number(String(value).replace(/[^0-9]/g, '')) || 0;
  const benefit = () => {
    try { return JSON.parse(sessionStorage.getItem('cyberfun-gift') || 'null'); } catch { return null; }
  };
  const mount = (before, refresh) => {
    const field = document.createElement('div');
    field.className = 'field gift-voucher-field';
    field.innerHTML = '<label for="gift-voucher">Gift voucher</label><div style="display:flex;gap:8px"><input id="gift-voucher" autocomplete="off" placeholder="Enter gift voucher code"><button type="button">Apply</button></div><p role="status" style="font-size:12px"></p>';
    before.before(field);
    const input = field.querySelector('input'), button = field.querySelector('button'), status = field.querySelector('p');
    button.style.cssText = 'background:#000;color:#fff;border:1px solid #000;border-radius:6px;padding:10px 16px;min-height:44px;font:inherit;cursor:pointer';
    const update = () => {
      const gift = benefit();
      input.value = gift?.code || '';
      button.textContent = gift ? 'Remove' : 'Apply';
      status.textContent = gift ? 'Gift voucher applied: ' + money(gift.value) : '';
    };
    button.addEventListener('click', () => {
      if (benefit()) sessionStorage.removeItem('cyberfun-gift');
      else if (input.value.trim().toUpperCase() === 'GIFT5000') sessionStorage.setItem('cyberfun-gift', JSON.stringify({code:'GIFT5000', value:5000}));
      else { status.textContent = 'Voucher not recognised. Please check the code.'; return; }
      update(); refresh();
    });
    update();
  };
  window.CyberfunBenefits = {money, amount, benefit, mount};
  const init = () => {
    const form = document.querySelector('form.checkout');
    if (!form || typeof updateSummary !== 'function') return;
    const summary = form.querySelector('.summary');
    if (!summary) return;
    const line = document.createElement('div');
    line.className = 'summary-row hidden';
    line.innerHTML = '<span>Gift voucher</span><strong></strong>';
    summary.querySelector('.summary-row.total').before(line);
    const original = updateSummary;
    updateSummary = function(...args) {
      original(...args);
      const gift = form.classList.contains('voucher-purchase') ? null : benefit(), total = form.querySelector('#summary-total'), base = amount(total.textContent);
      line.classList.toggle('hidden', !gift);
      line.querySelector('strong').textContent = gift ? '−' + money(Math.min(base, gift.value)) : '';
      if (gift) total.textContent = money(Math.max(0, base - gift.value));
    };
    mount(summary, () => updateSummary());
    updateSummary();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
