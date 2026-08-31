function esc(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function norm(v){return String(v).replace(/\s+/g,' ').trim().toUpperCase();}
function resultTable(m){return `<div class="table-scroll"><table class="data-table"><thead><tr>${m.columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${m.rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}

export function mount(element,config){
  const missions=config.missions??[]; if(!missions.length)return;
  let current=0; const solved=new Set();
  element.innerHTML=`<div class="mission-layout"><aside class="mission-list">${missions.map((m,i)=>`<button type="button" class="mission-nav ${i===0?'is-active':''}" data-mission="${i}"><span>${i+1}</span>${esc(m.concept)}</button>`).join('')}</aside><div class="mission-workbench" data-role="workbench"></div></div>`;
  const wb=element.querySelector('[data-role="workbench"]'), nav=[...element.querySelectorAll('[data-mission]')];

  function render(){
    const m=missions[current];
    wb.innerHTML=`<div class="sql-heading"><div><p class="eyebrow">MISSION ${current+1} / ${missions.length} · ${esc(m.concept)}</p><h3>${esc(m.title)}</h3><p class="microcopy">${esc(m.task)}</p></div><span class="mission-score">${solved.size}/${missions.length}</span></div>
      <textarea class="sql-editor" data-role="editor" spellcheck="false" aria-label="SQL editor">${esc(m.starter??'')}</textarea>
      <div class="mission-actions"><button class="btn" type="button" data-role="check">Перевірити SQL</button><button class="btn btn--secondary" type="button" data-role="hint">Підказка</button><button class="btn btn--secondary" type="button" data-role="solution">Рішення</button></div>
      <div class="mission-feedback" data-role="feedback" aria-live="polite"></div><div class="sql-result" data-role="result"></div>`;
    nav.forEach((b,i)=>{b.classList.toggle('is-active',i===current);b.classList.toggle('is-solved',solved.has(i));});
    const editor=wb.querySelector('[data-role="editor"]'), feedback=wb.querySelector('[data-role="feedback"]'), result=wb.querySelector('[data-role="result"]');
    wb.querySelector('[data-role="check"]').addEventListener('click',()=>{
      const sql=norm(editor.value); const missing=(m.required??[]).filter(token=>!sql.includes(norm(token)));
      if(missing.length){feedback.innerHTML=`<strong>Запит ще не виконує місію.</strong> Перевірте: ${missing.map(esc).join(', ')}.`; result.innerHTML=''; return;}
      solved.add(current); nav[current].classList.add('is-solved');
      feedback.innerHTML=`<strong>Місію виконано.</strong> ${esc(m.feedback)}`;
      result.innerHTML=`<p class="eyebrow">SYNTHETIC RESULT SET</p>${resultTable(m)}<div class="analytics-callout"><strong>Аналітичний сенс:</strong> ${esc(m.insight)}</div>`;
      wb.querySelector('.mission-score').textContent=`${solved.size}/${missions.length}`;
    });
    wb.querySelector('[data-role="hint"]').addEventListener('click',()=>{feedback.innerHTML=`<strong>Підказка:</strong> ${esc(m.hint)}`;});
    wb.querySelector('[data-role="solution"]').addEventListener('click',()=>{editor.value=m.solution;feedback.textContent='Рішення підставлено. Натисніть «Перевірити SQL» і розберіть результат.';});
  }
  nav.forEach((b,i)=>b.addEventListener('click',()=>{current=i;render();})); render();
}
