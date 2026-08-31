const esc = v => String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element, config) {
  const cases = config.cases ?? [];
  const answers = new Map();
  element.innerHTML = `<p class="component-intro">${esc(config.intro ?? 'Оберіть візуальне кодування під аналітичне питання, а не під звичний тип діаграми.')}</p><div class="viz-case-list" data-role="cases"></div><div class="decision-progress"><strong data-role="score">0/${cases.length}</strong><span data-role="message">Пройдіть усі кейси.</span></div>`;
  const root = element.querySelector('[data-role="cases"]');
  const score = element.querySelector('[data-role="score"]');
  const message = element.querySelector('[data-role="message"]');

  function render() {
    root.innerHTML = cases.map((item,index) => {
      const selected = answers.get(item.id);
      const chosen = item.options?.[selected];
      return `<article class="viz-case">
        <div class="viz-case__head"><span>${index+1}</span><div><p class="eyebrow">${esc(item.goal ?? 'VISUAL TASK')}</p><h3>${esc(item.title)}</h3></div></div>
        <p>${esc(item.context)}</p>
        <div class="viz-facts">${(item.facts??[]).map(f=>`<span>${esc(f)}</span>`).join('')}</div>
        <div class="viz-options">${(item.options??[]).map((o,i)=>`<button type="button" class="decision-option ${selected===i?'is-selected':''}" data-case="${esc(item.id)}" data-option="${i}">${esc(o.label)}</button>`).join('')}</div>
        ${chosen ? `<div class="decision-feedback ${chosen.correct?'is-good':'is-risk'}"><strong>${chosen.correct?'Влучне кодування':'Є кращий варіант'}</strong><p>${esc(chosen.feedback)}</p></div>` : ''}
        ${item.rule ? `<p class="microcopy"><strong>Правило:</strong> ${esc(item.rule)}</p>`:''}
      </article>`;
    }).join('');
    root.querySelectorAll('[data-case]').forEach(btn=>btn.addEventListener('click',()=>{answers.set(btn.dataset.case,Number(btn.dataset.option));render();}));
    const correct=[...answers].filter(([id,i])=>cases.find(c=>c.id===id)?.options?.[i]?.correct).length;
    score.textContent=`${answers.size}/${cases.length}`;
    message.textContent=answers.size===cases.length?`${correct} із ${cases.length} рішень оптимальні. ${esc(config.complete ?? 'Поясніть, яку аналітичну операцію підтримує кожна візуалізація.')}`:`Розглянуто ${answers.size} із ${cases.length} кейсів.`;
  }
  render();
}
