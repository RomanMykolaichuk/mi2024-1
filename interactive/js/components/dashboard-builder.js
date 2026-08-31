const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element, config){
  const widgets=config.widgets??[];
  const required=new Set(config.required??[]);
  const selected=new Set(config.initial??[]);
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Зберіть мінімальний dashboard під конкретне аналітичне питання.')}</p><div class="dashboard-builder"><div class="dashboard-builder__catalog" data-role="catalog"></div><div class="dashboard-builder__preview"><p class="eyebrow">LIVE DASHBOARD</p><div class="dashboard-preview" data-role="preview"></div><div class="dashboard-builder__score" data-role="score"></div></div></div>`;
  const catalog=element.querySelector('[data-role="catalog"]');
  const preview=element.querySelector('[data-role="preview"]');
  const score=element.querySelector('[data-role="score"]');

  function render(){
    catalog.innerHTML=widgets.map(w=>`<button type="button" class="widget-choice ${selected.has(w.id)?'is-selected':''}" data-widget="${esc(w.id)}"><span class="widget-choice__type">${esc(w.type??'widget')}</span><strong>${esc(w.label)}</strong><small>${esc(w.purpose??'')}</small></button>`).join('');
    preview.innerHTML=selected.size?[...selected].map(id=>{const w=widgets.find(x=>x.id===id);return `<article class="dashboard-widget dashboard-widget--${esc(w?.type??'card')}"><p class="eyebrow">${esc(w?.type??'widget')}</p><h3>${esc(w?.label??id)}</h3><p>${esc(w?.preview??w?.purpose??'')}</p></article>`;}).join(''):`<p class="dashboard-empty">Додайте елементи з каталогу.</p>`;
    const hits=[...required].filter(id=>selected.has(id)).length;
    const extras=[...selected].filter(id=>!required.has(id)).length;
    const quality=Math.max(0,Math.min(100,Math.round((required.size?hits/required.size:1)*90-extras*8+10)));
    score.innerHTML=`<strong>${quality}%</strong><span>fit до аналітичної задачі · ${hits}/${required.size} ключових елементів</span><p>${quality>=90?esc(config.success??'Dashboard містить достатній набір evidence без зайвого перевантаження.'):quality>=65?'Напрям правильний, але перевірте, чи всі ключові питання покриті.':'Dashboard або неповний, або перевантажений другорядними елементами.'}</p>`;
    catalog.querySelectorAll('[data-widget]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.widget;selected.has(id)?selected.delete(id):selected.add(id);render();}));
  }
  render();
}
