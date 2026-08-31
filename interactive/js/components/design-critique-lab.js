const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','>':'&gt;','"':'&quot;'}[c]));

export function mount(element, config){
  const fixes=config.fixes??[];
  const applied=new Set();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Покращуйте візуальний дизайн по одному рішенню та спостерігайте, як змінюється читабельність.')}</p><div class="critique-lab"><div class="critique-preview" data-role="preview"></div><div class="critique-controls" data-role="controls"></div></div>`;
  const preview=element.querySelector('[data-role="preview"]');
  const controls=element.querySelector('[data-role="controls"]');
  function render(){
    const base=config.baseScore??42;
    const gain=[...applied].reduce((s,id)=>s+(fixes.find(f=>f.id===id)?.gain??0),0);
    const score=Math.min(100,base+gain);
    preview.innerHTML=`<p class="eyebrow">DESIGN READABILITY</p><strong class="critique-score">${score}%</strong><div class="critique-board ${score>=80?'is-clean':''}"><div class="critique-kpi">${esc(config.preview?.kpi??'72%')}</div><div><h3>${esc(config.preview?.title??'Оперативний огляд')}</h3><p>${esc(config.preview?.text??'Ключовий показник, тенденція та контекст мають читатися за кілька секунд.')}</p></div><div class="critique-bars"><span style="width:${Math.max(25,score-15)}%"></span><span style="width:${Math.max(20,score-30)}%"></span><span style="width:${Math.max(18,score-45)}%"></span></div></div><p class="microcopy">${score>=85?esc(config.success??'Ієрархія, контраст і щільність вже підтримують швидке сприйняття.'):'Знайдіть рішення, що зменшують когнітивне навантаження без втрати evidence.'}</p>`;
    controls.innerHTML=fixes.map(f=>`<button type="button" class="design-fix ${applied.has(f.id)?'is-selected':''}" data-fix="${esc(f.id)}"><strong>${esc(f.label)}</strong><small>${esc(f.effect)}</small></button>`).join('');
    controls.querySelectorAll('[data-fix]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.fix;applied.has(id)?applied.delete(id):applied.add(id);render();}));
  }
  render();
}
