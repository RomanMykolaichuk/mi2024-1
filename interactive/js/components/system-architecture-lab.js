const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element,config){
  const layers=config.layers??[];
  const state={};
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Розподіліть відповідальність між шарами системи та перевірте контракти між ними.')}</p><div class="architecture-grid" data-role="layers"></div><div class="architecture-status" data-role="status"></div>`;
  const node=element.querySelector('[data-role="layers"]');
  const status=element.querySelector('[data-role="status"]');
  node.innerHTML=layers.map(layer=>`<div class="architecture-layer"><p class="eyebrow">${esc(layer.label)}</p><h3>${esc(layer.title)}</h3><p>${esc(layer.description??'')}</p>${(layer.options??[]).map((o,i)=>`<button type="button" class="architecture-option" data-layer="${esc(layer.id)}" data-option="${i}"><strong>${esc(o.label)}</strong><br><small>${esc(o.description??'')}</small></button>`).join('')}</div>`).join('');
  node.querySelectorAll('[data-layer]').forEach(btn=>btn.addEventListener('click',()=>{
    state[btn.dataset.layer]=Number(btn.dataset.option);
    node.querySelectorAll(`[data-layer="${btn.dataset.layer}"]`).forEach(x=>x.classList.toggle('is-selected',x===btn));
    update();
  }));
  function update(){
    let answered=0,correct=0;
    layers.forEach(layer=>{
      if(state[layer.id]===undefined)return;
      answered+=1;
      if(state[layer.id]===Number(layer.answer??0))correct+=1;
    });
    if(answered<layers.length){status.innerHTML=`Налаштовано <strong>${answered}/${layers.length}</strong> шарів. Завершіть усі рішення, щоб перевірити архітектуру.`;return;}
    const contractOk=(config.contracts??[]).every(c=>c.valid!==false);
    status.innerHTML=`<strong>${correct}/${layers.length}</strong> архітектурних рішень коректні. ${correct===layers.length&&contractOk?esc(config.success??'Відповідальність розділена: UI не звертається до БД напряму, API задає контракт, а БД забезпечує збереження стану.'):esc(config.retry??'Перевірте межі відповідальності шарів і напрямок обміну даними.')}${config.flow?`<div class="integration-flow">${config.flow.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}`;
  }
  update();
}
