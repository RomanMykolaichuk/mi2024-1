const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const variants=config.variants??[];
  let current=variants[0]?.id;
  let operation='GET';
  let selected=[];
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Оберіть варіант системи й простежте запит від інтерфейсу до бази даних і назад.')}</p><div class="integration-tabs" data-role="variants"></div><div class="integration-layout"><div class="integration-profile" data-role="profile"></div><div class="integration-mission"><div class="operation-tabs" data-role="operations"></div><p><strong>Зберіть маршрут операції</strong></p><div class="sequence-buttons" data-role="pool"></div><div class="sequence-chain" data-role="chain"></div><div class="sequence-feedback" data-role="feedback"></div></div></div>`;
  const variantsNode=element.querySelector('[data-role="variants"]');
  const profile=element.querySelector('[data-role="profile"]');
  const operations=element.querySelector('[data-role="operations"]');
  const pool=element.querySelector('[data-role="pool"]');
  const chain=element.querySelector('[data-role="chain"]');
  const feedback=element.querySelector('[data-role="feedback"]');

  function activeVariant(){return variants.find(v=>v.id===current)??variants[0]}
  function operationMap(){return {...(config.defaultOperations??{}),...(activeVariant()?.operations??{})}}
  function activeFlow(){return operationMap()?.[operation]??[]}
  function render(){
    variantsNode.innerHTML=variants.map(v=>`<button type="button" class="integration-tab ${v.id===current?'is-selected':''}" data-variant="${esc(v.id)}">${esc(v.label)}</button>`).join('');
    variantsNode.querySelectorAll('[data-variant]').forEach(btn=>btn.addEventListener('click',()=>{current=btn.dataset.variant;operation='GET';selected=[];render();}));
    const v=activeVariant();
    profile.innerHTML=`<p class="eyebrow">SYSTEM VARIANT</p><h3>${esc(v?.label??'')}</h3><p>${esc(v?.description??'')}</p><code>${esc(v?.table??'')}</code><div class="viz-facts">${(v?.fields??[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><p><strong>API</strong></p>${(v?.endpoints??[]).map(x=>`<code>${esc(x)}</code>`).join('')}`;
    const available=operationMap();
    operations.innerHTML=['GET','POST','DELETE'].filter(op=>available?.[op]).map(op=>`<button type="button" class="operation-tab ${op===operation?'is-selected':''}" data-operation="${op}">${op}</button>`).join('');
    operations.querySelectorAll('[data-operation]').forEach(btn=>btn.addEventListener('click',()=>{operation=btn.dataset.operation;selected=[];render();}));
    renderMission();
  }
  function renderMission(){
    const flow=activeFlow();
    const poolOrder=activeVariant()?.poolOrder?.[operation]??config.poolOrder?.[operation]??flow.map(x=>x.id).slice().reverse();
    pool.innerHTML=poolOrder.map(id=>{const s=flow.find(x=>x.id===id);return s?`<button type="button" class="sequence-choice" data-step="${esc(id)}" ${selected.includes(id)?'disabled':''}>${esc(s.label)}</button>`:''}).join('');
    chain.innerHTML=selected.map((id,i)=>{const s=flow.find(x=>x.id===id);return `<div class="sequence-step"><span>${i+1}</span><div><strong>${esc(s.label)}</strong><small>${esc(s.description??'')}</small></div></div>`}).join('');
    pool.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{
      const expected=flow[selected.length];
      if(btn.dataset.step!==expected?.id){feedback.textContent=expected?.hint??'Перевірте, який шар має виконати наступну дію.';return;}
      selected.push(btn.dataset.step);
      feedback.textContent=selected.length===flow.length?(activeVariant()?.complete?.[operation]??config.complete?.[operation]??'Маршрут завершено: дані пройшли через чіткі контракти між UI, API і БД.'):`Наступний крок: ${flow[selected.length]?.label??''}`;
      renderMission();
    }));
  }
  render();
}
