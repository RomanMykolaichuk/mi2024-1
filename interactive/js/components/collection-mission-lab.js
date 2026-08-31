const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const missions=config.missions??[];
  let active=missions[0]?.id;
  let chosen=[];
  const completed=new Set();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Оберіть практичну місію та зберіть відтворюваний workflow збору даних.')}</p><div class="mission-tabs" data-role="tabs"></div><div class="collection-mission" data-role="mission"></div><div class="decision-progress"><strong data-role="progress">0/${missions.length}</strong><span>${esc(config.progressLabel??'місій завершено')}</span></div>`;
  const tabs=element.querySelector('[data-role="tabs"]');
  const panel=element.querySelector('[data-role="mission"]');
  const progress=element.querySelector('[data-role="progress"]');

  function mission(){return missions.find(x=>x.id===active)??missions[0]}
  function render(){
    tabs.innerHTML=missions.map(m=>`<button type="button" class="mission-tab ${m.id===active?'is-selected':''}" data-mission="${esc(m.id)}">${esc(m.label??m.id)}</button>`).join('');
    tabs.querySelectorAll('[data-mission]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.mission;chosen=[];render();}));
    const m=mission();if(!m){panel.innerHTML='';return;}
    const order=m.poolOrder??(m.steps??[]).map(x=>x.id).slice().reverse();
    panel.innerHTML=`<div class="collection-mission__head"><div><p class="eyebrow">${esc(m.goal??'PRACTICAL MISSION')}</p><h3>${esc(m.title)}</h3><p>${esc(m.context??'')}</p></div><div class="mission-output"><span>OUTPUT</span><strong>${esc(m.output??'reproducible dataset')}</strong></div></div>${m.variant?`<div class="analytics-callout"><strong>Особливість варіанта:</strong> ${esc(m.variant)}</div>`:''}<p><strong>Зберіть правильну послідовність</strong></p><div class="sequence-buttons" data-role="pool">${order.map(id=>{const s=m.steps?.find(x=>x.id===id);return s?`<button type="button" class="sequence-choice" data-step="${esc(id)}">${esc(s.label)}</button>`:''}).join('')}</div><div class="sequence-chain" data-role="chain"></div><div class="sequence-feedback" data-role="feedback">${esc(m.prompt??'Почніть із кроку, що визначає джерело та умови збору.')}</div>`;
    const pool=panel.querySelector('[data-role="pool"]');const chain=panel.querySelector('[data-role="chain"]');const feedback=panel.querySelector('[data-role="feedback"]');
    function update(){
      pool.querySelectorAll('[data-step]').forEach(btn=>btn.disabled=chosen.includes(btn.dataset.step));
      chain.innerHTML=chosen.map((id,i)=>{const s=m.steps?.find(x=>x.id===id);return `<div class="sequence-step"><span>${i+1}</span><div><strong>${esc(s?.label??id)}</strong><small>${esc(s?.description??'')}</small></div></div>`}).join('');
    }
    pool.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{
      const expected=m.steps?.[chosen.length];
      if(btn.dataset.step!==expected?.id){feedback.textContent=expected?.hint??`Наступним має бути: ${expected?.label??'інший крок'}.`;return;}
      chosen.push(btn.dataset.step);update();
      if(chosen.length===(m.steps?.length??0)){
        feedback.innerHTML=`<strong>Місію завершено.</strong> ${esc(m.complete??'Є джерело, код/інструмент, контроль якості, результат і evidence для GitHub.')}`;
        completed.add(m.id);progress.textContent=`${completed.size}/${missions.length}`;
      }else{feedback.textContent=`Наступний крок: ${m.steps?.[chosen.length]?.label??''}`;}
    }));
    update();
  }
  render();
}
