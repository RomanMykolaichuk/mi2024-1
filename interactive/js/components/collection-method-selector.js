const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const cases=config.cases??[];
  let active=cases[0]?.id;
  const solved=new Set();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Оберіть канал збору відповідно до аналітичної задачі, структури даних і вимог до provenance.')}</p><div class="collection-tabs" data-role="tabs"></div><div data-role="case"></div><div class="decision-progress"><strong data-role="progress">0/${cases.length}</strong><span>${esc(config.progressLabel??'сценаріїв обґрунтовано')}</span></div>`;
  const tabs=element.querySelector('[data-role="tabs"]');
  const panel=element.querySelector('[data-role="case"]');
  const progress=element.querySelector('[data-role="progress"]');

  function render(){
    tabs.innerHTML=cases.map(item=>`<button type="button" class="collection-tab ${item.id===active?'is-selected':''}" data-case="${esc(item.id)}">${esc(item.label??item.id)}</button>`).join('');
    tabs.querySelectorAll('[data-case]').forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.case;render();}));
    const item=cases.find(x=>x.id===active)??cases[0];
    if(!item){panel.innerHTML='';return;}
    panel.innerHTML=`<article class="collection-case"><p class="eyebrow">${esc(item.goal??'COLLECTION DECISION')}</p><h3>${esc(item.title)}</h3><p>${esc(item.context??'')}</p><div class="viz-facts">${(item.facts??[]).map(f=>`<span>${esc(f)}</span>`).join('')}</div><div class="collection-options">${(item.options??[]).map((opt,i)=>`<button type="button" class="collection-option" data-option="${i}"><strong>${esc(opt.label)}</strong><small>${esc(opt.description??'')}</small></button>`).join('')}</div><div class="sequence-feedback" data-role="feedback">${esc(item.prompt??'Який спосіб збору найкраще відповідає цій задачі?')}</div></article>`;
    panel.querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{
      const opt=item.options?.[Number(btn.dataset.option)];
      panel.querySelectorAll('[data-option]').forEach(x=>x.classList.remove('is-correct','is-wrong'));
      btn.classList.add(opt?.correct?'is-correct':'is-wrong');
      panel.querySelector('[data-role="feedback"]').innerHTML=`<strong>${opt?.correct?'Влучний вибір.':'Перегляньте критерії.'}</strong> ${esc(opt?.feedback??'')}${opt?.correct&&item.rule?`<br><span>${esc(item.rule)}</span>`:''}`;
      if(opt?.correct){solved.add(item.id);progress.textContent=`${solved.size}/${cases.length}`;}
    }));
  }
  render();
}
