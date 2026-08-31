const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const phases=config.phases??[];
  let next=0;
  const chosen=[];
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Побудуйте життєвий цикл ІАЗ у правильній логіці.')}</p><div class="sequence-board"><div class="sequence-pool"><p><strong>Оберіть наступний крок</strong></p><div class="sequence-buttons" data-role="pool"></div><div class="sequence-feedback" data-role="feedback"></div></div><div class="sequence-result"><p class="eyebrow">PROJECT LIFECYCLE</p><div class="sequence-chain" data-role="chain"></div></div></div>`;
  const pool=element.querySelector('[data-role="pool"]');
  const chain=element.querySelector('[data-role="chain"]');
  const feedback=element.querySelector('[data-role="feedback"]');
  function render(){
    pool.innerHTML=(config.poolOrder??phases.map(x=>x.id)).map(id=>{
      const p=phases.find(x=>x.id===id);if(!p)return'';
      return `<button type="button" class="sequence-choice" data-id="${esc(id)}" ${chosen.includes(id)?'disabled':''}>${esc(p.label)}</button>`;
    }).join('');
    chain.innerHTML=chosen.length?chosen.map((id,i)=>{const p=phases.find(x=>x.id===id);return `<div class="sequence-step"><span>${i+1}</span><div><strong>${esc(p.label)}</strong><small>${esc(p.output??p.description??'')}</small></div></div>`}).join(''):`<p class="component-intro">Ланцюг ще не побудовано.</p>`;
    pool.querySelectorAll('[data-id]').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.id)));
  }
  function choose(id){
    const expected=phases[next];
    if(!expected)return;
    if(id!==expected.id){feedback.innerHTML=`<strong>Не поспішайте.</strong> ${esc(expected.hint??'Спочатку завершіть попередній логічний крок.')}`;return;}
    chosen.push(id);next+=1;
    feedback.textContent=next===phases.length?(config.complete??'Життєвий цикл побудовано. Оцінювання результату повертає нас до уточнення проблеми та вимог.'):`Добре. Результат кроку: ${expected.output??''}`;
    render();
  }
  render();
}
