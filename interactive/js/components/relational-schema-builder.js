function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

export function mount(element, config){
  const variants=config.variants??[];
  if(!variants.length)return;
  let current=0, parentPick='', childPick='';

  element.innerHTML=`<div class="variant-tabs">${variants.map((v,i)=>`<button type="button" class="variant-tab ${i===0?'is-active':''}" data-variant="${i}">${esc(v.label)}</button>`).join('')}</div><div data-role="schema"></div>`;
  const host=element.querySelector('[data-role="schema"]');
  const tabs=[...element.querySelectorAll('[data-variant]')];

  function render(){
    const v=variants[current]; parentPick=''; childPick='';
    host.innerHTML=`
      <div class="mission-brief"><p class="eyebrow">SCHEMA MISSION</p><h3>${esc(v.title)}</h3><p>${esc(v.context)}</p></div>
      <div class="relationship-grid">
        ${tableCard('parent',v.parent,'Оберіть PRIMARY KEY')}
        <div class="relationship-arrow" aria-hidden="true">1<br>↕<br>∞</div>
        ${tableCard('child',v.child,'Оберіть FOREIGN KEY')}
      </div>
      <div class="lab-toolbar"><div class="lab-feedback" data-role="feedback" aria-live="polite">Спочатку визначте ключ у довідниковій таблиці та поле зв’язку в основній.</div><div><button class="btn" type="button" data-role="check">Перевірити зв’язок</button> <button class="btn btn--secondary" type="button" data-role="reveal">Показати DDL</button></div></div>
      <pre class="sql-code is-hidden" data-role="ddl"><code>${esc(v.ddl)}</code></pre>`;
    bind();
  }

  function tableCard(role,t,caption){
    return `<article class="relation-table"><p class="eyebrow">${role==='parent'?'PARENT / LOOKUP':'CHILD / FACT'}</p><h4>${esc(t.name)}</h4><p class="microcopy">${caption}</p><div class="column-picks">${t.columns.map(c=>`<button type="button" class="column-pick" data-role-table="${role}" data-column="${esc(c)}">${esc(c)}</button>`).join('')}</div></article>`;
  }

  function bind(){
    const feedback=host.querySelector('[data-role="feedback"]');
    host.querySelectorAll('.column-pick').forEach(btn=>btn.addEventListener('click',()=>{
      const role=btn.dataset.roleTable;
      if(role==='parent')parentPick=btn.dataset.column; else childPick=btn.dataset.column;
      host.querySelectorAll(`[data-role-table="${role}"]`).forEach(b=>b.classList.toggle('is-selected',b===btn));
      feedback.textContent=`Обрано: PK ${parentPick||'—'} · FK ${childPick||'—'}`;
    }));
    host.querySelector('[data-role="check"]').addEventListener('click',()=>{
      const v=variants[current];
      const ok=parentPick===v.parent.pk && childPick===v.child.fk;
      feedback.innerHTML=ok?`<strong>Правильно.</strong> ${esc(v.feedback)}`:`<strong>Ще ні.</strong> Перевірте, яке поле у parent-таблиці однозначно ідентифікує запис і яке поле в child-таблиці посилається на нього.`;
    });
    host.querySelector('[data-role="reveal"]').addEventListener('click',()=>host.querySelector('[data-role="ddl"]').classList.toggle('is-hidden'));
  }

  tabs.forEach(btn=>btn.addEventListener('click',()=>{current=Number(btn.dataset.variant);tabs.forEach(b=>b.classList.toggle('is-active',b===btn));render();}));
  render();
}
