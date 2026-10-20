(() => {
  const base = new URL('.', document.currentScript.src);
  const activity = 'outputs/activity-detail-wireframes/karaoke-activity-detail-template.html';
  const mainMenu = [
    ['Attractions & Tickets', 'outputs/category-wireframes/attractions-tickets-category-page-v3.html'],
    ['Parties & Packages', 'outputs/parties-events-wireframes/parties-packages-category-page-v3.html'],
    ['Corporates & Groups', 'outputs/group-wireframes/corporates-groups-category-page-v3.html'],
    ['Membership', 'outputs/membership-wireframes/membership-page-v3.html'],
    ['Your Visit', 'pages/plan-your-visit/index.html'],
    ['Loyalty Club', 'outputs/loyalty-club-wireframes/loyalty-club-page-v3.html'],
  ];
  const groups = {
    'Attractions & Tickets': [['Trampoline', activity], ['Pixel', activity], ['Lasertag', activity], ['Darts', activity], ['Karaoke', activity], ['Single Tickets', 'outputs/ticket-product-wireframes/ticket-product-template.html']],
    'Parties & Packages': [['Birthday Parties', 'outputs/parties-events-wireframes/birthday-parties-page.html'], ['Daytime Packages', 'outputs/package-wireframes/package-product-template.html'], ['Nighttime Packages', 'outputs/package-wireframes/nighttime-package-product-v3.html'], ['Adult Parties', 'outputs/parties-events-wireframes/adult-parties-page-v2-concept.html'], ['Event Schedule', 'outputs/event-schedule-wireframes/event-schedule-page.html']],
    'Corporates & Groups': [['School Groups', 'outputs/group-wireframes/school-groups-page.html'], ['Corporate Groups', 'outputs/group-wireframes/corporate-groups-page.html']],
  };
  const aliases = {'Attractions':'Attractions & Tickets','Experiences':'Attractions & Tickets','Tickets & Packages':'Parties & Packages','Parties & Events':'Parties & Packages','Parties':'Parties & Packages','Groups':'Corporates & Groups','Groups & Events':'Corporates & Groups'};
  const style = document.createElement('style');
  style.textContent = `
    nav a[aria-current="page"]{background:#17212d!important;color:#fff!important;border-color:#17212d!important}
    .cf-menu-group{position:relative;min-width:0;display:flex;align-items:center;gap:2px}
    .cf-menu-toggle{border:0;background:transparent;color:inherit;cursor:pointer;flex:0 0 24px;width:24px;height:36px;font:inherit;padding:0}
    .cf-submenu{display:none;position:absolute;top:calc(100% - 1px);left:0;min-width:210px;padding:10px;background:#fff;border:1px solid #c8d4e0;border-radius:6px;box-shadow:0 8px 20px #17212d18;z-index:1000;gap:4px;pointer-events:auto}
    .cf-submenu a{display:block!important;min-height:36px!important;padding:9px 10px!important;color:#17212d!important;background:#fff!important;border:0!important;border-radius:4px!important;font-size:14px!important;line-height:1.4!important;text-align:left!important;white-space:normal!important;text-decoration:none}
    .cf-submenu a:hover,.cf-submenu a:focus-visible{background:#edf2f6!important}
    .cf-menu-group[data-open=true]>.cf-submenu{display:grid}
    .cf-mobile-group{display:grid!important;grid-template-columns:minmax(0,1fr) 36px}
    .cf-mobile-group>.cf-submenu{position:static;grid-column:1/-1;box-shadow:none;min-width:0;margin:4px 0 8px}
    .cf-mobile-group:focus-within>.cf-submenu{display:none}
    .cf-mobile-group[data-open=true]>.cf-submenu{display:grid}
    @media(hover:hover){.cf-mobile-group:hover>.cf-submenu{display:none}.cf-mobile-group[data-open=true]>.cf-submenu{display:grid}}
    header,.wire-nav,.nav,.site-header{position:relative;z-index:100!important;overflow:visible!important}
    nav:not(.cf-submenu){overflow:visible}
    .wire-mobile-menu,.mobile-menu,.mobile-nav{position:relative;z-index:101}
    @media(max-width:900px){.cf-booking-first-mobile{position:static!important;order:0!important;width:100%!important;min-width:0!important;max-width:none!important;box-sizing:border-box}}
    @media(max-width:900px){.cf-hero-media-mobile:not(.media-hero){width:100%!important;max-width:none!important;min-height:0!important;height:auto!important;aspect-ratio:16/9;box-sizing:border-box;border-radius:0;display:grid;place-items:center;background:#dce8f3;color:#687789;font-weight:800}.cf-hero-media-mobile:empty::after{content:"Hero Image/Video"}}
    .cf-ticket-link,.cf-ticket-dock{display:none}
    @media(max-width:900px){
      body.cf-mobile-ticket-flow{padding-bottom:calc(88px + env(safe-area-inset-bottom))}
      .cf-mobile-intro{display:block!important;width:100%;padding:24px 18px!important;margin:0!important;box-sizing:border-box;border-bottom:1px solid #c8d4e0}
      .cf-mobile-intro h1{font-size:32px!important;line-height:1.15!important;margin:0 0 16px!important}
      .cf-mobile-intro p{font-size:16px!important;line-height:1.55!important}
      .cf-mobile-intro .quick-tabs,.cf-mobile-intro .wire-hero-actions,.cf-mobile-intro .actions{display:none!important}
      .cf-ticket-link,.cf-ticket-dock a{display:flex;align-items:center;justify-content:center;min-height:48px;padding:12px 20px;box-sizing:border-box;border:0;border-radius:6px;background:#1684d8;color:white;font:inherit;font-weight:800;text-decoration:none}
      .cf-ticket-link{width:100%;margin-top:18px}
      .cf-ticket-dock{display:block;position:fixed;bottom:0;left:0;right:0;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:#fff;border-top:1px solid #c8d4e0;z-index:200}
      .cf-mobile-empty-hero{display:none!important}
      .cf-booking-first-mobile{scroll-margin-top:16px}
    }
    @media(prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
  `;
  document.head.append(style);
  document.querySelectorAll('nav').forEach(nav => {
    if (nav.closest('footer')) return;
    if (!nav.matches('.nav-links,.wire-links,.desktop-nav,.wire-mobile-menu,.mobile-menu,.mobile-nav')) return;
    const mobile = /mobile/.test(nav.className);
    const linkClass = nav.querySelector('.wire-pill') ? 'wire-pill' : nav.querySelector('.nav-link') ? 'nav-link' : '';
    nav.replaceChildren(...mainMenu.map(([label, target]) => {
      const link = document.createElement('a');
      link.textContent = label;
      link.href = new URL(target, base).href;
      link.className = linkClass;
      if (link.href === window.location.href.split('#')[0]) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
      return link;
    }));
    [...nav.children].forEach(child => {
      const link = child.matches('a') ? child : child.querySelector(':scope > a');
      if (!link) return;
      const label = link.textContent.trim().replace(/\s+/g,' ');
      const items = groups[aliases[label] || label];
      if (!items) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'cf-menu-group' + (mobile ? ' cf-mobile-group' : '');
      child.replaceWith(wrapper);
      wrapper.append(link);
      const toggle = document.createElement('button');
      toggle.type = 'button'; toggle.className = 'cf-menu-toggle';
      toggle.textContent = '\u2304';
      toggle.setAttribute('aria-label', `Show ${label} submenu`);
      toggle.setAttribute('aria-expanded','false');
      const menu = document.createElement('div'); menu.className = 'cf-submenu';
      menu.id = `cf-submenu-${document.querySelectorAll('.cf-menu-group').length}`;
      toggle.setAttribute('aria-controls',menu.id);
      items.forEach(([text, target]) => {const a=document.createElement('a');a.textContent=text;a.href=new URL(target,base).href;menu.append(a);});
      wrapper.append(toggle,menu);
      let closeTimer;
      const close=()=>{wrapper.dataset.open='false';toggle.setAttribute('aria-expanded','false');};
      const open=()=>{clearTimeout(closeTimer);wrapper.dataset.open='true';toggle.setAttribute('aria-expanded','true');};
      if (!mobile) {
        wrapper.addEventListener('mouseenter',open);
        wrapper.addEventListener('mouseleave',()=>{closeTimer=setTimeout(close,350);});
        link.addEventListener('focus',open);
        wrapper.addEventListener('focusout',event=>{if(!wrapper.contains(event.relatedTarget))close();});
      }
      toggle.addEventListener('click',()=>{const open=wrapper.dataset.open!=='true';wrapper.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open));});
      wrapper.addEventListener('keydown',event=>{if(event.key==='Escape'){close();link.focus();}});
      document.addEventListener('click',event=>{if(!wrapper.contains(event.target))close();});
    });
  });
  const booking = document.querySelector('form.checkout')?.closest('aside');
  const header = document.querySelector('header.wire-nav,header.nav,header.site-header');
  if (booking && header && !booking.contains(header)) {
    const originalPosition = document.createComment('Booking desktop position');
    booking.before(originalPosition);
    const contentLayout = booking.parentElement;
    const heroMedia = document.querySelector('.media-hero,.detail-hero > .wire-image,.hero > .wire-image,.category-hero > .wire-image,.selection-copy > .selection-image');
    const heroPosition = document.createComment('Hero media desktop position');
    if (heroMedia) heroMedia.before(heroPosition);
    const heading = document.querySelector('h1');
    const intro = heading?.closest('.detail-hero,.hero-copy,.page-intro,.intro');
    const introPosition = document.createComment('Title desktop position');
    if (intro) intro.before(introPosition);
    const heroContainer = heroMedia?.parentElement;
    if (!booking.id) booking.id = 'booking';
    const ticketLink = document.createElement('a');
    ticketLink.className = 'cf-ticket-link';
    ticketLink.href = '#' + booking.id;
    ticketLink.textContent = booking.id === 'membership-checkout' ? 'Membership' : 'Tickets';
    const dock = document.createElement('div');
    dock.className = 'cf-ticket-dock';
    const dockLink = ticketLink.cloneNode(true);
    dockLink.className = '';
    dock.append(dockLink);
    document.body.append(dock);
    [ticketLink,dockLink].forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      booking.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }));
    const mobileNavigation = [...header.parentElement.children].find(el =>
      el.matches('nav.wire-mobile-menu,nav.mobile-menu,nav.mobile-nav'));
    const mobileLayout = window.matchMedia('(max-width: 900px)');
    const placeBooking = () => {
      if (mobileLayout.matches) {
        const anchor = mobileNavigation || header;
        if (heroMedia) {
          anchor.after(heroMedia);
          heroMedia.classList.add('cf-hero-media-mobile');
        }
        if (intro) {
          (heroMedia || anchor).after(intro);
          intro.classList.add('cf-mobile-intro');
          intro.append(ticketLink);
        }
        contentLayout.after(booking);
        if (heroContainer?.matches('.hero,.category-hero') && !heroContainer.textContent.trim()) heroContainer.classList.add('cf-mobile-empty-hero');
        document.body.classList.add('cf-mobile-ticket-flow');
        booking.classList.add('cf-booking-first-mobile');
      } else {
        originalPosition.after(booking);
        booking.classList.remove('cf-booking-first-mobile');
        document.body.classList.remove('cf-mobile-ticket-flow');
        if (intro) {
          introPosition.after(intro);
          intro.classList.remove('cf-mobile-intro');
          ticketLink.remove();
        }
        heroContainer?.classList.remove('cf-mobile-empty-hero');
        if (heroMedia) {
          heroPosition.after(heroMedia);
          heroMedia.classList.remove('cf-hero-media-mobile');
        }
      }
    };
    mobileLayout.addEventListener('change', placeBooking);
    placeBooking();
  }
})();
