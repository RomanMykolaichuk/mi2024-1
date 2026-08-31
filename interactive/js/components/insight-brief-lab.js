const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element, config){
  const stages=config.stages??[];
  const answers=new Map();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Перетворіть візуальне спостереження на короткий аналітичний brief: факт → інтерпретація → значення → дія.')}</p><div class="brief-chain" data-role="chain"></div><div class="brief-output" data-role="output"></div>`;
  const chain=element.querySelector('[data-role="chain"]');
  const output=element.querySelector('[data-role="output"]');
  function render(){
    chain.innerHTML=stages.map((s,index)=>{const selected=answers.get(s.id);return `<article class="brief-stage"><span class="brief-stage__index">${index+1}</span><div><p class="eyebrow">${esc(s.label)}</p><h3>${esc(s.question)}</h3><div class="brief-options">${(s.options??[]).map((o,i)=>`<button type="button" class="decision-option ${selected===i?'is-selected':''}" data-stage="${esc(s.id)}" data-option="${i}">${esc(o.text)}</button>`).join('')}</div>${selected!==undefined?`<p class="microcopy">${esc(s.options?.[selected]?.feedback??'')}</p>`:''}</div></article>`;}).join('');
    chain.querySelectorAll('[data-stage]').forEach(btn=>btn.addEventListener('click',()=>{answers.set(btn.dataset.stage,Number(btn.dataset.option));render();}));
    const complete=stages.every(s=>answers.has(s.id));
    if(complete){const chosen=stages.map(s=>s.options?.[answers.get(s.id)]?.text).filter(Boolean);const correct=stages.filter(s=>s.options?.[answers.get(s.id)]?.correct).length;output.innerHTML=`<p class="eyebrow">ANALYTICAL BRIEF</p><ol>${chosen.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><strong>${correct}/${stages.length} логічно узгоджених кроків</strong><p>${esc(config.complete??'Візуалізація набуває цінності лише тоді, коли evidence переходить у перевірюваний висновок і зрозумілу implication.')}</p>`;} else output.innerHTML=`<p class="microcopy">Завершіть усі ${stages.length} кроки, щоб побачити brief.</p>`;
  }
  render();
}
