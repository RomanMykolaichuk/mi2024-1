const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element, config){
  const missions=config.missions??[];
  let current=missions[0]?.id;
  let selected=null;
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Оберіть практичну місію, визначте візуальний метод і сформулюйте, яке evidence має бути отримане.')}</p><div class="mission-tabs" data-role="tabs"></div><div class="mission-panel" data-role="panel"></div>`;
  const tabs=element.querySelector('[data-role="tabs"]');
  const panel=element.querySelector('[data-role="panel"]');
  function render(){
    const m=missions.find(x=>x.id===current)??missions[0];
    tabs.innerHTML=missions.map((x,i)=>`<button type="button" class="mission-tab ${x.id===current?'is-selected':''}" data-mission="${esc(x.id)}">${i+1}</button>`).join('');
    panel.innerHTML=`<p class="eyebrow">${esc(m?.category??'PRACTICE')}</p><h3>${esc(m?.title??'')}</h3><p>${esc(m?.task??'')}</p><div class="viz-facts">${(m?.data??[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><p><strong>Оберіть основний visual:</strong></p><div class="viz-options">${(m?.options??[]).map((o,i)=>`<button type="button" class="decision-option ${selected===i?'is-selected':''}" data-option="${i}">${esc(o.label)}</button>`).join('')}</div>${selected!==null?feedback(m,selected):''}`;
    tabs.querySelectorAll('[data-mission]').forEach(btn=>btn.addEventListener('click',()=>{current=btn.dataset.mission;selected=null;render();}));
    panel.querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{selected=Number(btn.dataset.option);render();}));
  }
  function feedback(m,i){const o=m?.options?.[i];return `<div class="decision-feedback ${o?.correct?'is-good':'is-risk'}"><strong>${o?.correct?'Доцільний вибір':'Слабке узгодження із задачею'}</strong><p>${esc(o?.feedback??'')}</p></div><div class="analytics-callout"><strong>Очікуване evidence:</strong> ${esc(m?.evidence??'')}<br><strong>Аналітичний висновок:</strong> ${esc(m?.insight??'')}</div>`;}
  render();
}
