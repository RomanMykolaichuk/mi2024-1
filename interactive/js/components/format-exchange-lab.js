const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const formats=config.formats??[];
  const cases=config.cases??[];
  let activeFormat=formats[0]?.id;
  const solved=new Set();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Формат даних — це контракт обміну. Порівняйте, що виграємо й втрачаємо з CSV, JSON та XML.')}</p><div class="format-layout"><div><div class="format-tabs" data-role="tabs"></div><article class="format-preview" data-role="preview"></article></div><div><p class="eyebrow">FORMAT DECISIONS</p><div class="format-cases" data-role="cases"></div><div class="decision-progress"><strong data-role="progress">0/${cases.length}</strong><span>сценаріїв</span></div></div></div>`;
  const tabs=element.querySelector('[data-role="tabs"]');
  const preview=element.querySelector('[data-role="preview"]');
  const caseRoot=element.querySelector('[data-role="cases"]');
  const progress=element.querySelector('[data-role="progress"]');

  function renderFormat(){
    tabs.innerHTML=formats.map(f=>`<button type="button" class="format-tab ${f.id===activeFormat?'is-selected':''}" data-format="${esc(f.id)}">${esc(f.label)}</button>`).join('');
    tabs.querySelectorAll('[data-format]').forEach(btn=>btn.addEventListener('click',()=>{activeFormat=btn.dataset.format;renderFormat();}));
    const f=formats.find(x=>x.id===activeFormat)??formats[0];
    preview.innerHTML=`<h3>${esc(f?.label??'')}</h3><p>${esc(f?.description??'')}</p><pre><code>${esc(f?.sample??'')}</code></pre><div class="format-tradeoffs"><div><strong>Сильні сторони</strong><ul>${(f?.strengths??[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><strong>Ризики / обмеження</strong><ul>${(f?.risks??[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
  }
  function renderCases(){
    caseRoot.innerHTML=cases.map(item=>`<article class="format-case"><h3>${esc(item.title)}</h3><p>${esc(item.context??'')}</p><div class="format-choice-row">${(item.options??[]).map((opt,i)=>`<button type="button" class="format-choice" data-case="${esc(item.id)}" data-index="${i}">${esc(opt.label)}</button>`).join('')}</div><div class="sequence-feedback" data-feedback="${esc(item.id)}">${esc(item.prompt??'Оберіть формат.')}</div></article>`).join('');
    caseRoot.querySelectorAll('[data-case]').forEach(btn=>btn.addEventListener('click',()=>{
      const item=cases.find(x=>x.id===btn.dataset.case);const opt=item?.options?.[Number(btn.dataset.index)];
      btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('is-correct','is-wrong'));
      btn.classList.add(opt?.correct?'is-correct':'is-wrong');
      caseRoot.querySelector(`[data-feedback="${CSS.escape(btn.dataset.case)}"]`).innerHTML=`<strong>${opt?.correct?'Так.':'Не найкращий контракт.'}</strong> ${esc(opt?.feedback??'')}`;
      if(opt?.correct){solved.add(item.id);progress.textContent=`${solved.size}/${cases.length}`;}
    }));
  }
  renderFormat();renderCases();
}
