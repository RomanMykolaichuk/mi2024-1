(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const esc = input => String(input).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const inform = (id, message, kind = '') => { const el = $(id); el.textContent = message; el.className = `message ${kind}`; };
  const clone = data => JSON.parse(JSON.stringify(data));

  async function copyText(value, button) {
    const old = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const temp = document.createElement('textarea');
        temp.value = value; temp.style.position = 'fixed'; temp.style.opacity = '0';
        document.body.append(temp); temp.select();
        if (!document.execCommand('copy')) throw new Error('Не вдалось скопіювати.');
        temp.remove();
      }
      button.textContent = 'Скопійовано ✓';
    } catch (err) { button.textContent = 'Помилка копіювання'; }
    setTimeout(() => { button.textContent = old; }, 1500);
  }

  function saveBlob(fileName, blob) {
    const url = URL.createObjectURL(blob), anchor = document.createElement('a');
    anchor.href = url; anchor.download = fileName; document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  const demoCases = {
    tasks: {title:'Виконання завдань за добу', subtitle:'Умовні дані · завдання, одиниць', series:['Виконано','Заплановано'], rows:[['Пн',12,15],['Вт',16,18],['Ср',15,17],['Чт',21,22],['Пт',19,21],['Сб',14,16],['Нд',18,19]]},
    equipment: {title:'Розподіл категорій техніки', subtitle:'Умовні дані для навчання · одиниці', series:['Кількість','Попередній період'], rows:[['Автомобілі',24,20],['Бронемашини',12,15],['БпЛА',29,19],['Артилерія',8,7],['РЕБ',6,4]]},
    response: {title:'Час обробки інформаційних повідомлень', subtitle:'Умовні дані · хвилини', series:['До автоматизації','Після автоматизації'], rows:[['Тиждень 1',40,32],['Тиждень 2',37,27],['Тиждень 3',42,23],['Тиждень 4',35,20],['Тиждень 5',33,16],['Тиждень 6',32,14]]},
    resources: {title:'Розподіл умовних ресурсів', subtitle:'Умовні дані · умовні одиниці', series:['План','Факт'], rows:[['Аналітика',34,32],['Зв’язок',22,26],['Підтримка',16,14],['Навчання',18,20],['Резерв',10,8]]}
  };
  const chartAdvice = {
    bar:['Коли потрібне порівняння?', 'Стовпчики добре показують різницю між категоріями. Якщо важливий загальний обсяг декількох складових — спробуйте накопичення (stacked).'],
    line:['Коли потрібна динаміка?', 'Лінійний графік показує зміну значень між послідовними моментами або періодами часу. Порядок категорій має значення.'],
    doughnut:['Коли потрібні частки?', 'Кільцева діаграма демонструє склад одного цілого. Використовуйте одну серію невід’ємних значень і небагато категорій.'],
    pie:['Коли потрібна структура?', 'Секторна діаграма допомагає порівнювати частки цілого; вона НЕ підходить для аналізу динаміки за періодами.'],
    radar:['Коли потрібен профіль?', 'Пелюсткова діаграма зручна для порівняння декількох показників в одній шкалі. Якщо одиниці різні, попередньо нормалізуйте значення.'],
    scatter:['Коли потрібен зв’язок двох показників?', 'Точкова діаграма шукає залежності між X і Y. У цій демонстрації X — порядковий номер категорії, Y — значення. Для дослідження залежності подайте реальні пари X,Y.']
  };
  const chartColors = ['#65c5cc','#d7b46a','#ea9080','#9caaeb','#78c89e','#d7a2ce','#86aad7','#e2c49b'];
  let chartInstance = null;
  let currentChartCode = '';

  function rowsToText(rows) { return rows.map(row => row.join('; ')).join('\n'); }
  function loadChartCase() {
    $('data-editor').value = rowsToText(demoCases[$('case-select').value].rows);
    inform('chart-message','Умовні дані завантажено — можна редагувати.');
    renderChart();
  }
  function parseChartRows() {
    const lines = $('data-editor').value.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
    if (lines.length < 2 || lines.length > 30) throw new Error('Потрібно від 2 до 30 рядків даних.');
    let hasSecond = false;
    const rows = lines.map((line, i) => {
      const fields = line.split(';').map(x => x.trim());
      if (fields.length < 2 || fields.length > 3 || !fields[0]) throw new Error(`Рядок ${i+1}: введіть «категорія; значення 1; [значення 2]».`);
      const value = Number(fields[1].replace(',','.'));
      if (!fields[1] || !Number.isFinite(value)) throw new Error(`Рядок ${i+1}: перше значення має бути числом.`);
      const second = fields.length === 3 && fields[2] !== '' ? Number(fields[2].replace(',','.')) : null;
      if (second !== null && !Number.isFinite(second)) throw new Error(`Рядок ${i+1}: друге значення має бути числом.`);
      if (second !== null) hasSecond = true;
      return [fields[0].slice(0,45),value,second];
    });
    if (hasSecond && rows.some(row => row[2] === null)) throw new Error('Для другої серії потрібне значення в кожному рядку.');
    if (['doughnut','pie','radar'].includes($('chart-type').value) && rows.some(row => row[1] < 0)) throw new Error('Для цього типу графіка не використовуйте від’ємні значення.');
    if (['pie','doughnut'].includes($('chart-type').value) && rows.every(row => row[1] === 0)) throw new Error('Для секторної діаграми потрібно хоча б одне додатне значення.');
    return {rows, hasSecond};
  }
  function buildChartConfig(parsed) {
    const typ = $('chart-type').value, names = demoCases[$('case-select').value].series;
    const first = parsed.rows.map(x=>x[1]);
    const second = parsed.rows.map(x=>x[2]);
    const circular = ['pie','doughnut'].includes(typ);
    const scatter = typ === 'scatter';
    const makeData = data => scatter ? data.map((y,i)=>({x:i+1,y})) : data;
    const d1 = {label:names[0],data:makeData(first),backgroundColor:circular?chartColors.slice(0,first.length):'#65c5cc99',borderColor:circular?'#0e1d30':'#65c5cc',borderWidth:circular?2:2,pointRadius:typ==='scatter'?5:3,pointHoverRadius:6,fill:false,tension:0.25};
    const d2 = {label:names[1],data:makeData(second),backgroundColor:'#d7b46a99',borderColor:'#d7b46a',borderWidth:2,pointRadius:typ==='scatter'?5:3,fill:false,tension:0.25};
    const datasets = [d1]; if (parsed.hasSecond && !circular) datasets.push(d2);
    const options = {
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:$('show-legend').checked,position:'bottom',labels:{color:'#d3e3ed',usePointStyle:true,padding:15}},tooltip:{mode:scatter?'nearest':'index',intersect:false}},
      scales:circular?{}:typ==='radar'?{r:{beginAtZero:$('begin-zero').checked,angleLines:{color:'#34495e'},grid:{color:'#34495e'},pointLabels:{color:'#cadde7',font:{size:11}},ticks:{color:'#d4e6ee',backdropColor:'#152337'}}}:{x:{stacked:typ==='bar' && $('stacked').checked,ticks:{color:'#afc4d0'},grid:{color:'#283c50'}},y:{stacked:typ==='bar' && $('stacked').checked,beginAtZero:$('begin-zero').checked,ticks:{color:'#afc4d0'},grid:{color:'#283c50'}}}
    };
    if (typ==='bar') { d1.borderRadius=5; if (datasets.length===2) d2.borderRadius=5; }
    if (typ==='line') {d1.fill=false; d2.fill=false;}
    const config = {type:typ,data:{labels:parsed.rows.map(row=>row[0]),datasets},options};
    return config;
  }
  function renderChart() {
    const type = $('chart-type').value, ds = demoCases[$('case-select').value];
    $('chart-title').textContent = ds.title;
    $('chart-subtitle').textContent = ds.subtitle;
    $('chart-advice-title').textContent = chartAdvice[type][0];
    $('chart-advice').textContent = chartAdvice[type][1];
    $('stacked').disabled = type !== 'bar';
    $('begin-zero').disabled = ['pie','doughnut'].includes(type);
    try {
      const parsed = parseChartRows();
      const config = buildChartConfig(parsed);
      const codeConfig = clone(config);
      // Demonstrate the actual schema, without appearance-only configuration.
      codeConfig.options = {responsive:true,maintainAspectRatio:false,plugins:{legend:{display:$('show-legend').checked}}};
      if(type==='bar') codeConfig.options.scales = {x:{stacked:$('stacked').checked},y:{beginAtZero:$('begin-zero').checked,stacked:$('stacked').checked}};
      else if(type==='line' || type==='scatter') codeConfig.options.scales = {y:{beginAtZero:$('begin-zero').checked}};
      currentChartCode = `// Chart.js: дані + тип + налаштування\nconst ctx = document.getElementById('lesson-chart');\nnew Chart(ctx, ${JSON.stringify(codeConfig,null,2)});`;
      $('chart-code').textContent = currentChartCode;
      if (!window.Chart) { $('chart-fallback').classList.remove('hidden'); inform('chart-message','Chart.js не завантажено — перевірте підключення до мережі.','error'); return; }
      $('chart-fallback').classList.add('hidden');
      if (chartInstance) chartInstance.destroy();
      chartInstance = new window.Chart($('lesson-chart'),config);
      inform('chart-message',`Побудовано: ${parsed.rows.length} категорій, ${config.data.datasets.length} серій.`, 'ok');
    } catch (error) { inform('chart-message',error.message,'error'); }
  }
  function initCharts() {
    $('case-select').addEventListener('change',loadChartCase);
    $('reset-data').addEventListener('click',loadChartCase);
    $('apply-data').addEventListener('click',renderChart);
    ['chart-type','show-legend','begin-zero','stacked'].forEach(id=>$(id).addEventListener('change',renderChart));
    $('copy-chart-code').addEventListener('click',()=>copyText(currentChartCode,$('copy-chart-code')));
    $('save-chart').addEventListener('click',()=>{
      if (!chartInstance) return inform('chart-message','Спочатку побудуйте діаграму.','error');
      const anchor = document.createElement('a'); anchor.href = chartInstance.toBase64Image(); anchor.download = 'visualization-chart.png'; document.body.append(anchor); anchor.click(); anchor.remove();
    });
    loadChartCase();
  }

  const TEMPLATES = {infantry:'SFGPUCI----D---',armor:'SFGPUCA----D---',artillery:'SFGPUCF----D---',airdef:'SFGPUCD----D---',hq:'SFGPUH-----D---'};
  const TYPES = {infantry:'Піхота',armor:'Бронетанкові',artillery:'Артилерія',airdef:'ППО',hq:'Штаб'};
  const AFFILIATIONS = {F:'свої',H:'противник',N:'нейтральні',U:'невідомі'};
  const ECHELONS = {D:'взвод',E:'рота',F:'батальйон',H:'бригада','-':'без рівня'};
  const STORAGE_KEY = 'miaz_lesson54_points_v1';
  let map = null, placing = false, points = [], markerLayers = [], selectedId = null, mapCreated = false, currentMapCode = '';
  const makeId = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const isSidc = sidc => /^[A-Z0-9\-]{15}$/.test(sidc) || /^\d{20}(\d{10})?$/.test(sidc);
  const toFixed = value => Number(value).toFixed(4);

  function configuredSidc() {
    const unit = $('unit-type').value, affiliation = $('affiliation').value, echelon = $('echelon').value;
    const chars = TEMPLATES[unit].split(''); chars[1] = affiliation; chars[11] = echelon;
    return chars.join('');
  }
  function regenerateSidc() { $('sidc-input').value = configuredSidc(); updateSymbolPreview(); }
  function symbolFor(sidc,size) {
    if (!isSidc(sidc)) throw new Error('SIDC має містити 15 символів або 20/30 цифр.');
    if (!window.ms || !window.ms.Symbol) throw new Error('Бібліотека milsymbol не завантажена.');
    return new window.ms.Symbol(sidc,{size:Number(size),fill:true});
  }
  function updateSymbolPreview() {
    const sidc = $('sidc-input').value.trim().toUpperCase();
    const size = Number($('symbol-size').value);
    $('symbol-size-output').textContent = String(size);
    $('preview-label').textContent = `${TYPES[$('unit-type').value]} · ${AFFILIATIONS[$('affiliation').value]} · ${ECHELONS[$('echelon').value]}`;
    $('preview-code').textContent = sidc;
    currentMapCode = `// Створити знак за SIDC\nconst sidc = '${sidc}';\nconst symbol = new ms.Symbol(sidc, { size: ${size}, fill: true });\n\n// Передати SVG до Leaflet\nconst icon = L.divIcon({\n  className: 'unit-icon',\n  html: symbol.asSVG(),\n  iconAnchor: [symbol.getAnchor().x, symbol.getAnchor().y]\n});\n\nL.marker([49.3500, 31.9000], { icon, draggable: true })\n  .addTo(map); // навчальні координати`;
    $('map-code').textContent = currentMapCode;
    try {
      const symbol = symbolFor(sidc,size);
      $('symbol-preview').innerHTML = symbol.asSVG();
      inform('symbol-message','Знак створено. Перейдіть до його нанесення на карту.','ok');
      return true;
    } catch(err) {
      $('symbol-preview').textContent = 'Попередній перегляд недоступний';
      inform('symbol-message',err.message,'error');
      return false;
    }
  }
  function iconFor(record) {
    const symbol = symbolFor(record.sidc,record.size);
    const anchor = symbol.getAnchor();
    const dims = symbol.getSize();
    return window.L.divIcon({className:'unit-icon',html:symbol.asSVG(),iconSize:[dims.width,dims.height],iconAnchor:[anchor.x,anchor.y],popupAnchor:[0,-Math.round(anchor.y/2)]});
  }
  function popupFor(record) {
    return `<b>${esc(record.name)}</b><div><small>SIDC: ${esc(record.sidc)}</small></div><div><small>${toFixed(record.lat)}, ${toFixed(record.lng)}</small></div><small>Перетягніть знак для зміни координат</small>`;
  }
  function storePoints() { try {localStorage.setItem(STORAGE_KEY,JSON.stringify(points));} catch(err) {inform('symbol-message','Не вдалося зберегти у браузері: ' + err.message,'error');} }
  function renderPointList() {
    const list = $('objects-list'); list.replaceChildren();
    $('count-objects').textContent = String(points.length);
    $('delete-selected').disabled = !selectedId;
    $('update-selected').disabled = !selectedId;
    const chosen = points.find(pt=>pt.id===selectedId);
    $('selection-status').textContent = chosen ? `Вибрано: ${chosen.name}` : 'Нічого не вибрано';
    if (!points.length) {const empty=document.createElement('div');empty.className='empty-list';empty.textContent='Додайте перший знак або завантажте навчальний приклад.';list.append(empty);return;}
    points.forEach(pt=>{
      const button=document.createElement('button'); button.className='object-row'+(pt.id===selectedId?' selected':'');button.type='button';
      let svg='';try{svg=symbolFor(pt.sidc,24).asSVG();}catch(err){svg='<span>?</span>';}
      button.innerHTML=`<span class="object-row-symbol">${svg}</span><span class="object-row-detail"><b>${esc(pt.name)}</b><small>${esc(pt.sidc)}</small></span><span class="object-row-coord">${toFixed(pt.lat)}<br>${toFixed(pt.lng)}</span>`;
      button.addEventListener('click',()=>selectPoint(pt.id,true));list.append(button);
    });
  }
  function renderMapMarkers() {
    if (map) {
      markerLayers.forEach(({layer})=>map.removeLayer(layer));
      markerLayers=[];
      for (const record of points) {
        try {
          const layer=window.L.marker([record.lat,record.lng],{icon:iconFor(record),draggable:true,title:record.name});
          layer.addTo(map).bindPopup(popupFor(record));
          layer.on('click',()=>selectPoint(record.id,false));
          layer.on('dragend',()=>{
            const updated=points.find(x=>x.id===record.id), pos=layer.getLatLng();
            if(updated){updated.lat=pos.lat;updated.lng=pos.lng;storePoints();renderPointList();layer.setPopupContent(popupFor(updated));}
          });
          markerLayers.push({id:record.id,layer});
        } catch(err) { console.warn('Не вдалося показати SIDC',record.sidc,err); }
      }
    }
    renderPointList();
  }
  function selectPoint(id, flyTo=false) {
    const chosen=points.find(p=>p.id===id);if (!chosen) return;
    selectedId=id;
    $('symbol-name').value=chosen.name;
    $('symbol-size').value=chosen.size;
    $('sidc-input').value=chosen.sidc;
    if (/^[A-Z0-9\-]{15}$/.test(chosen.sidc)) {
      const affiliation = chosen.sidc[1]; const echelon=chosen.sidc[11];
      if(AFFILIATIONS[affiliation])$('affiliation').value=affiliation;
      if(ECHELONS[echelon])$('echelon').value=echelon;
      const matched=Object.keys(TEMPLATES).find(type=>TEMPLATES[type].slice(4,11)===chosen.sidc.slice(4,11));
      if(matched)$('unit-type').value=matched;
    }
    updateSymbolPreview();renderPointList();
    if(map){if(flyTo)map.panTo([chosen.lat,chosen.lng]);const layer=markerLayers.find(x=>x.id===id)?.layer;if(layer)layer.openPopup();}
  }
  function setPlacing(value) {
    placing=value;$('place-mode').setAttribute('aria-pressed',String(value));
    $('place-mode').textContent=value?'✓ Режим нанесення увімкнено':'＋ Розмістити знак на карті';
    $('mode-indicator').textContent=value?'Клацніть точку на карті':'Режим перегляду';
    $('mode-indicator').classList.toggle('placing',value);document.querySelector('.map-box').classList.toggle('placing',value);
  }
  function addPoint(lat,lng,fields) {
    const record={id:makeId(),lat:Number(lat),lng:Number(lng),sidc:fields.sidc,name:String(fields.name).slice(0,64),size:Number(fields.size)};
    if(!Number.isFinite(record.lat)||!Number.isFinite(record.lng)||record.lat< -90||record.lat>90||record.lng< -180||record.lng>180)throw new Error('Некоректні координати.');
    if(!isSidc(record.sidc)||!record.name||record.size<12||record.size>100)throw new Error('Некоректні властивості знака.');
    if(points.length>=200)throw new Error('Обмеження: не більше 200 навчальних об’єктів.');
    points.push(record);storePoints();renderMapMarkers();selectPoint(record.id,false);return record;
  }
  function ensureMap() {
    if(mapCreated) {if(map)setTimeout(()=>map.invalidateSize(),80);return;}
    mapCreated=true;
    if(!window.L || !window.ms) {
      $('map-fallback').classList.remove('hidden');
      inform('symbol-message','Немає доступу до Leaflet або milsymbol. Перевірте мережу.','error');return;
    }
    try {
      map=window.L.map('map',{zoomControl:true,scrollWheelZoom:true}).setView([49.4,31.9],7);
      window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'}).addTo(map);
      map.on('mousemove',e=>{$('cursor-coordinates').textContent=`${toFixed(e.latlng.lat)}, ${toFixed(e.latlng.lng)}`;});
      map.on('click',e=>{
        if(!placing)return;
        try {
          const sidc=$('sidc-input').value.trim().toUpperCase();symbolFor(sidc,Number($('symbol-size').value));
          addPoint(e.latlng.lat,e.latlng.lng,{sidc,name:$('symbol-name').value.trim()||'Навчальний об’єкт',size:Number($('symbol-size').value)});
          inform('symbol-message','Знак нанесено. Режим нанесення активний для наступного об’єкта.','ok');
        } catch(err){inform('symbol-message',err.message,'error');}
      });
      renderMapMarkers();setTimeout(()=>map.invalidateSize(),100);
    } catch(err){$('map-fallback').classList.remove('hidden');inform('symbol-message','Помилка карти: '+err.message,'error');}
  }
  function fitMap() {if(!map)return;if(!points.length){map.setView([49.4,31.9],7);return;}map.fitBounds(window.L.latLngBounds(points.map(x=>[x.lat,x.lng])),{padding:[45,45],maxZoom:12});}
  function demoPoints() {
    const examples=[
      {lat:49.35,lng:31.9,sidc:'SFGPUCI----D---',name:'Навчальна група Альфа',size:38},
      {lat:49.28,lng:32.06,sidc:'SHGPUCA----E---',name:'Умовна група Браво',size:38},
      {lat:49.42,lng:32.19,sidc:'SNGPUH-----F---',name:'Умовний пункт Чарлі',size:38}
    ];
    try {examples.forEach(e=>addPoint(e.lat,e.lng,e));fitMap();inform('symbol-message','Додано 3 вигадані навчальні об’єкти.','ok');}
    catch(err){inform('symbol-message',err.message,'error');}
  }
  function exportPoints() {
    const geojson={type:'FeatureCollection',name:'Lesson 5.4 training symbols (synthetic)',features:points.map(x=>({type:'Feature',geometry:{type:'Point',coordinates:[x.lng,x.lat]},properties:{name:x.name,SIDC:x.sidc,size:x.size}}))};
    saveBlob('training_symbols.geojson',new Blob([JSON.stringify(geojson,null,2)],{type:'application/geo+json;charset=utf-8'}));
  }
  function validateFeatures(parsed) {
    if(parsed?.type!=='FeatureCollection'||!Array.isArray(parsed.features))throw new Error('Очікується GeoJSON FeatureCollection.');
    if(parsed.features.length>200)throw new Error('Забагато об’єктів (максимум 200).');
    return parsed.features.map((f,i)=>{
      if(f?.type!=='Feature'||f.geometry?.type!=='Point'||!Array.isArray(f.geometry.coordinates)||f.geometry.coordinates.length<2) throw new Error(`Об’єкт ${i+1}: очікується точкова геометрія Point.`);
      const [lng,lat]=f.geometry.coordinates;
      const sidc=String(f.properties?.SIDC??f.properties?.sidc??'').trim().toUpperCase();
      const name=String(f.properties?.name??`Об’єкт ${i+1}`).trim().slice(0,64);
      const size=Number(f.properties?.size??38);
      if(!Number.isFinite(lat)||!Number.isFinite(lng)||lat< -90||lat>90||lng< -180||lng>180||!isSidc(sidc)||!name||!Number.isFinite(size)||size<12||size>100)throw new Error(`Об’єкт ${i+1}: некоректні координати або властивості.`);
      return {id:makeId(),lat,lng,sidc,name,size};
    });
  }
  async function importPoints(event) {
    const file=event.target.files?.[0];event.target.value='';if(!file)return;
    try {
      if(file.size>1024*1024)throw new Error('Завеликий файл (максимум 1 МБ).');
      const next=validateFeatures(JSON.parse(await file.text()));
      // Check valid milsymbol output for every imported SIDC before replacing any user data.
      next.forEach(item=>symbolFor(item.sidc,item.size));
      if(!confirm(`Замінити поточні ${points.length} об’єктів на ${next.length} з файлу?`))return;
      points=next;selectedId=null;storePoints();renderMapMarkers();fitMap();
      inform('symbol-message',`Імпортовано ${next.length} об’єктів.`, 'ok');
    } catch(err){inform('symbol-message','Імпорт не виконано: '+err.message,'error');}
  }
  function restorePoints() {
    try {
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      if(Array.isArray(saved)&&saved.length<=200){
        points=saved.filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng)&&x.lat>= -90&&x.lat<=90&&x.lng>= -180&&x.lng<=180&&isSidc(x.sidc)&&typeof x.name==='string'&&x.name.length<=64&&Number.isFinite(x.size)&&x.size>=12&&x.size<=100);
      }
    } catch(err){points=[];}
  }
  function initMapControls() {
    restorePoints();
    ['unit-type','affiliation','echelon'].forEach(id=>$(id).addEventListener('change',regenerateSidc));
    $('symbol-size').addEventListener('input',updateSymbolPreview);
    $('sidc-input').addEventListener('input',updateSymbolPreview);
    $('restore-sidc').addEventListener('click',regenerateSidc);
    $('place-mode').addEventListener('click',()=>{if(!map)ensureMap();if(map && updateSymbolPreview())setPlacing(!placing);});
    $('update-selected').addEventListener('click',()=>{
      const record=points.find(x=>x.id===selectedId);if(!record)return;
      try {
        const sidc=$('sidc-input').value.trim().toUpperCase(),name=$('symbol-name').value.trim()||'Навчальний об’єкт',size=Number($('symbol-size').value);
        symbolFor(sidc,size);record.sidc=sidc;record.name=name.slice(0,64);record.size=size;
        storePoints();renderMapMarkers();selectPoint(record.id,false);inform('symbol-message','Зміни збережено.','ok');
      }catch(err){inform('symbol-message',err.message,'error');}
    });
    $('delete-selected').addEventListener('click',()=>{
      if(!selectedId)return;points=points.filter(x=>x.id!==selectedId);selectedId=null;storePoints();renderMapMarkers();
      inform('symbol-message','Вибраний об’єкт видалено.','ok');
    });
    $('clear-all').addEventListener('click',()=>{
      if(!points.length)return;
      if(!confirm(`Видалити усі ${points.length} навчальних об’єктів?`))return;
      points=[];selectedId=null;storePoints();renderMapMarkers();inform('symbol-message','Карту очищено.','ok');
    });
    $('load-demo').addEventListener('click',demoPoints);
    $('fit-map').addEventListener('click',fitMap);
    $('export-geojson').addEventListener('click',exportPoints);
    $('import-geojson').addEventListener('change',importPoints);
    $('copy-map-code').addEventListener('click',()=>copyText(currentMapCode,$('copy-map-code')));
    updateSymbolPreview();renderPointList();
  }

  function switchTab(tab) {
    for(const item of ['charts','map']) {
      const active=item===tab;
      $('tab-'+item).classList.toggle('active',active);
      $('tab-'+item).setAttribute('aria-selected',String(active));
      $('panel-'+item).classList.toggle('hidden',!active);
    }
    if(tab==='map')ensureMap();
    else if(chartInstance)chartInstance.resize();
    if(location.hash!=='#'+tab)history.replaceState(null,'','#'+tab);
  }
  function initTabs() {
    document.querySelectorAll('[data-tab]').forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));
    document.querySelector('.tabs').addEventListener('keydown',event=>{
      if(event.key!=='ArrowRight'&&event.key!=='ArrowLeft')return;
      event.preventDefault();const next=$('tab-charts').getAttribute('aria-selected')==='true'?'map':'charts';switchTab(next);$('tab-'+next).focus();
    });
    switchTab(location.hash==='#map'?'map':'charts');
  }
  document.addEventListener('DOMContentLoaded',()=>{
    initCharts();initMapControls();initTabs();
  });
})();
