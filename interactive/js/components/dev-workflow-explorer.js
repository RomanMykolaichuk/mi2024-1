const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const steps=config.steps??[];
  const selected=[];
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Зберіть безпечний і відтворюваний workflow роботи над засобом ІАЗ.')}</p><div class="workflow-layout"><div class="workflow-panel"><p><strong>Git / development flow</strong></p><div class="workflow-pool" data-role="pool"></div><div class="sequence-chain" data-role="chain"></div><div class="sequence-feedback" data-role="feedback"></div></div><div class="workflow-panel"><p><strong>Developer environment checklist</strong></p><div class="env-checklist" data-role="checklist"></div><div class="architecture-status" data-role="status"></div></div></div>`;
  const pool=element.querySelector('[data-role="pool"]');
  const chain=element.querySelector('[data-role="chain"]');
  const feedback=element.querySelector('[data-role="feedback"]');
  const checklist=element.querySelector('[data-role="checklist"]');
  const status=element.querySelector('[data-role="status"]');
  function renderFlow(){
    pool.innerHTML=(config.poolOrder??steps.map(x=>x.id)).map(id=>{const s=steps.find(x=>x.id===id);return s?`<button type="button" class="workflow-choice" data-step="${esc(id)}" ${selected.includes(id)?'disabled':''}>${esc(s.label)}</button>`:''}).join('');
    chain.innerHTML=selected.map((id,i)=>{const s=steps.find(x=>x.id===id);return `<div class="sequence-step"><span>${i+1}</span><div><strong>${esc(s.label)}</strong><small>${esc(s.description??'')}</small></div></div>`}).join('');
    pool.querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>{const expected=steps[selected.length];if(btn.dataset.step!==expected?.id){feedback.textContent=expected?.hint??'Цей крок ще зарано виконувати.';return;}selected.push(btn.dataset.step);feedback.textContent=selected.length===steps.length?(config.complete??'Workflow завершено: зміни відстежуються, перевіряються і можуть бути відтворені.'):`Наступний крок: ${steps[selected.length]?.label??''}`;renderFlow();}));
  }
  const checks=config.checklist??[];
  checklist.innerHTML=checks.map((item,i)=>`<label><input type="checkbox" data-check="${i}"><span><strong>${esc(item.label)}</strong><br><small>${esc(item.description??'')}</small></span></label>`).join('');
  checklist.addEventListener('change',()=>{const done=checklist.querySelectorAll('input:checked').length;status.innerHTML=`<strong>${done}/${checks.length}</strong> елементів середовища готові. ${done===checks.length?esc(config.readyText??'Середовище придатне до роботи над проєктом.'):esc(config.pendingText??'Незаповнені пункти можуть знизити відтворюваність або безпеку роботи.')}`;});
  renderFlow();checklist.dispatchEvent(new Event('change'));
}
