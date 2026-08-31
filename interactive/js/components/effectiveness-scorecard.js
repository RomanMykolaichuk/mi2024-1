const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const criteria=(config.criteria??[]).map(item=>({...item,score:Number(item.score??50),weight:Number(item.weight??0)}));
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Змініть оцінки критеріїв і подивіться, як змінюється інтегральна оцінка.')}</p><div class="preset-row" data-role="presets"></div><div class="scorecard-controls" data-role="criteria"></div><div class="score-result" data-role="result"></div>`;
  const criteriaNode=element.querySelector('[data-role="criteria"]');
  const result=element.querySelector('[data-role="result"]');
  const presets=element.querySelector('[data-role="presets"]');
  function renderCriteria(){
    criteriaNode.innerHTML=criteria.map(item=>`<div class="score-criterion"><div class="score-criterion__head"><strong>${esc(item.label)}</strong><span>${Math.round(item.weight*100)}% · <b data-score-label="${esc(item.id)}">${item.score}</b></span></div><p>${esc(item.description??'')}</p><input type="range" min="0" max="100" step="1" value="${item.score}" data-score="${esc(item.id)}" aria-label="${esc(item.label)}"></div>`).join('');
    criteriaNode.querySelectorAll('[data-score]').forEach(input=>input.addEventListener('input',()=>{const item=criteria.find(x=>x.id===input.dataset.score);item.score=Number(input.value);criteriaNode.querySelector(`[data-score-label="${input.dataset.score}"]`).textContent=input.value;updateResult();}));
  }
  function renderPresets(){
    presets.innerHTML=(config.presets??[]).map((p,i)=>`<button class="preset-btn" type="button" data-preset="${i}">${esc(p.label)}</button>`).join('');
    presets.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>{const p=config.presets[Number(btn.dataset.preset)];Object.entries(p.scores??{}).forEach(([id,score])=>{const item=criteria.find(x=>x.id===id);if(item)item.score=Number(score)});renderCriteria();updateResult();}));
  }
  function updateResult(){
    const totalWeight=criteria.reduce((s,x)=>s+x.weight,0)||1;
    const score=Math.round(criteria.reduce((s,x)=>s+x.score*x.weight,0)/totalWeight);
    const threshold=Number(config.threshold??70);
    const weakest=[...criteria].sort((a,b)=>a.score-b.score)[0];
    result.innerHTML=`<strong>${score}/100</strong><span>${score>=threshold?esc(config.passText??'Рішення проходить заданий поріг ефективності.'):esc(config.failText??'Доцільність потребує перегляду або додаткових компенсуючих заходів.')}</span><p>Найслабший критерій: <b>${esc(weakest?.label??'—')}</b> (${weakest?.score??'—'}). ${esc(config.note??'Інтегральний бал є лише моделлю; висновок залежить від коректності критеріїв, ваг і вихідних вимірювань.')}</p>`;
  }
  renderPresets();renderCriteria();updateResult();
}
