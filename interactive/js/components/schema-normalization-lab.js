function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function table(columns, rows){return `<div class="table-scroll"><table class="data-table"><thead><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
export function mount(element, config){
  let normalized=false;
  element.innerHTML=`<div data-role="schema-view"></div><div class="lab-toolbar"><div class="lab-feedback" data-role="schema-feedback" aria-live="polite"></div><div><button class="btn" type="button" data-role="toggle">Нормалізувати схему</button> <button class="btn btn--secondary" type="button" data-role="reset">Скинути</button></div></div>`;
  const view=element.querySelector('[data-role="schema-view"]'), feedback=element.querySelector('[data-role="schema-feedback"]'), toggle=element.querySelector('[data-role="toggle"]');
  function render(){
    if(!normalized){ const f=config.flat; view.innerHTML=`<div class="schema-header"><div><p class="eyebrow">ДО НОРМАЛІЗАЦІЇ</p><h3>Одна плоска таблиця</h3></div><span class="schema-badge schema-badge--warn">Повторення довідникових значень</span></div>${table(f.columns,f.rows)}<div class="issue-grid">${f.issues.map(v=>`<div class="issue-card">${esc(v)}</div>`).join('')}</div>${metrics(config.metrics.flat)}`; toggle.textContent='Нормалізувати схему';
    } else { const n=config.normalized; view.innerHTML=`<div class="schema-header"><div><p class="eyebrow">ПІСЛЯ НОРМАЛІЗАЦІЇ</p><h3>Дві пов’язані таблиці</h3></div><span class="schema-badge">PK → FK забезпечує зв’язок</span></div><div class="schema-tables">${n.tables.map(t=>`<article class="schema-table-card"><h4>${esc(t.name)}</h4><p class="microcopy">${t.fk?`FK: ${esc(t.fk)}`:`PK: ${esc(t.pk)}`}</p>${table(t.columns,t.rows)}</article>`).join('')}</div><div class="issue-grid issue-grid--good">${n.benefits.map(v=>`<div class="issue-card">${esc(v)}</div>`).join('')}</div><div class="analytics-callout"><strong>Trade-off:</strong> ${esc(n.tradeoff)}</div>${metrics(config.metrics.normalized)}`; toggle.textContent='Показати плоску таблицю'; }
  }
  function metrics(m){return `<div class="schema-metrics"><div><span>${m.duplication}%</span> дублювання</div><div><span>${m.integrity}%</span> цілісність</div><div><span>${m.reporting}%</span> готовність до звітності</div><div><span>${m.joins}</span> JOIN для повної назви типу</div></div>`;}
  toggle.addEventListener('click',()=>{normalized=!normalized; feedback.textContent=normalized?'Довідник винесено окремо: дублювання зменшилось, правила цілісності стали явними.':'Повернулися до плоскої структури, щоб порівняти компроміс.'; render();});
  element.querySelector('[data-role="reset"]').addEventListener('click',()=>{normalized=false;feedback.textContent='';render();});
  render();
}
