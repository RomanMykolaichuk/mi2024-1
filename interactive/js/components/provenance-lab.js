const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const cases=config.cases??[];
  let active=0;
  let score=0;
  const solved=new Set();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Порівняйте записи не лише за полями, а й за provenance: джерело, час отримання, канал і контекст.')}</p><div class="provenance-case" data-role="case"></div><div class="provenance-footer"><button type="button" class="btn btn--secondary" data-role="prev">←</button><strong data-role="count"></strong><button type="button" class="btn btn--secondary" data-role="next">→</button><span data-role="score"></span></div>`;
  const panel=element.querySelector('[data-role="case"]');
  const count=element.querySelector('[data-role="count"]');
  const scoreNode=element.querySelector('[data-role="score"]');
  element.querySelector('[data-role="prev"]').addEventListener('click',()=>{active=(active-1+cases.length)%cases.length;render();});
  element.querySelector('[data-role="next"]').addEventListener('click',()=>{active=(active+1)%cases.length;render();});

  function render(){
    const item=cases[active];
    if(!item){panel.innerHTML='';return;}
    count.textContent=`${active+1}/${cases.length}`;
    scoreNode.textContent=`${score}/${cases.length} рішень`;
    panel.innerHTML=`<p class="eyebrow">PROVENANCE REVIEW</p><h3>${esc(item.title)}</h3><p>${esc(item.context??'')}</p><div class="record-grid">${(item.records??[]).map((r,i)=>`<article class="record-card"><strong>${esc(r.label??`Запис ${i+1}`)}</strong><dl>${Object.entries(r.fields??{}).map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></article>`).join('')}</div><div class="collection-options">${(item.options??[]).map((opt,i)=>`<button type="button" class="collection-option" data-option="${i}"><strong>${esc(opt.label)}</strong><small>${esc(opt.description??'')}</small></button>`).join('')}</div><div class="sequence-feedback" data-role="feedback">${esc(item.question??'Яке рішення щодо цих записів є обґрунтованим?')}</div>`;
    panel.querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{
      const opt=item.options?.[Number(btn.dataset.option)];
      panel.querySelectorAll('[data-option]').forEach(x=>x.classList.remove('is-correct','is-wrong'));
      btn.classList.add(opt?.correct?'is-correct':'is-wrong');
      panel.querySelector('[data-role="feedback"]').innerHTML=`<strong>${opt?.correct?'Рішення обґрунтоване.':'Ризик помилкового злиття/розділення.'}</strong> ${esc(opt?.feedback??'')}`;
      if(opt?.correct&&!solved.has(item.id)){solved.add(item.id);score+=1;scoreNode.textContent=`${score}/${cases.length} рішень`;}
    }));
  }
  render();
}
