const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export function mount(element, config){
  const audiences=config.audiences??[];
  let current=audiences[0]?.id;
  const selections=new Set();
  element.innerHTML=`<p class="component-intro">${esc(config.intro??'Одна й та сама evidence потребує різного рівня деталізації для різних аудиторій.')}</p><div class="audience-tabs" data-role="tabs"></div><div class="audience-lab"><div class="audience-profile" data-role="profile"></div><div class="audience-options" data-role="options"></div></div>`;
  const tabs=element.querySelector('[data-role="tabs"]');
  const profile=element.querySelector('[data-role="profile"]');
  const options=element.querySelector('[data-role="options"]');
  function render(){
    const a=audiences.find(x=>x.id===current)??audiences[0];
    tabs.innerHTML=audiences.map(x=>`<button class="audience-tab ${x.id===current?'is-selected':''}" type="button" data-audience="${esc(x.id)}">${esc(x.label)}</button>`).join('');
    profile.innerHTML=`<p class="eyebrow">${esc(a?.label??'AUDIENCE')}</p><h3>${esc(a?.goal??'')}</h3><div class="viz-facts">${(a?.traits??[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div><p>${esc(a?.description??'')}</p><div class="audience-brief"><strong>${esc(a?.headline??'')}</strong><p>${esc(a?.brief??'')}</p></div>`;
    const available=config.elements??[];
    options.innerHTML=`<p><strong>Які елементи залишити?</strong></p>${available.map(item=>`<button type="button" class="decision-option ${selections.has(item.id)?'is-selected':''}" data-element="${esc(item.id)}">${esc(item.label)}</button>`).join('')}<div class="audience-fit" data-role="fit"></div>`;
    options.querySelectorAll('[data-element]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.element;selections.has(id)?selections.delete(id):selections.add(id);updateFit();}));
    tabs.querySelectorAll('[data-audience]').forEach(btn=>btn.addEventListener('click',()=>{current=btn.dataset.audience;selections.clear();render();}));
    updateFit();
  }
  function updateFit(){
    const a=audiences.find(x=>x.id===current)??{};
    const required=new Set(a.required??[]);
    const avoid=new Set(a.avoid??[]);
    const hits=[...required].filter(x=>selections.has(x)).length;
    const bad=[...avoid].filter(x=>selections.has(x)).length;
    const fit=Math.max(0,Math.min(100,Math.round((required.size?hits/required.size:1)*100-bad*20)));
    const node=options.querySelector('[data-role="fit"]');
    if(node) node.innerHTML=`<strong>${fit}% fit</strong><span>${fit>=85?'Подання відповідає інформаційним потребам цієї аудиторії.':fit>=60?'Майже добре: перевірте зайві деталі та відсутні ключові елементи.':'Подача не відповідає ролі користувача.'}</span>`;
  }
  render();
}
