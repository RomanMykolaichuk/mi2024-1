/*
  DATA/VIS LAB — educational, static military-analytics-style visualization.
  No frameworks, remote resources, geospatial coordinates or real operational data.
  JavaScript supplies interactivity; HTML and CSS draw the visual components.
*/
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const nf = new Intl.NumberFormat('uk-UA');
  const scenarioData = {
    logistics: {
      title: 'Забезпечення',
      kpis: [
        { name: 'Виконання плану', value: '84%', change: '+5,2%', note: 'до минулого періоду', color: 'var(--green)', mark: '◫' },
        { name: 'Достовірність даних', value: '92%', change: '+1,8%', note: 'після перевірки', color: 'var(--blue)', mark: '✓' },
        { name: 'Сигнали уваги', value: '03', change: '−2', note: 'від попереднього огляду', color: 'var(--gold)', mark: '◇' },
        { name: 'Обробка запису', value: '18 хв', change: '−4 хв', note: 'середній показник', color: 'var(--green)', mark: '◷' }
      ],
      trend: [53, 61, 58, 65, 66, 72, 70, 68, 73, 79, 74, 86, 81, 84],
      distribution: [624, 375, 249],
      categories: ['Постачання', 'Облік', 'Контроль'],
      heat: [1, 2, 1, 3, 2, 0, 0, 2, 4, 3, 1, 0, 1, 3, 4, 2, 0, 1, 0, 1, 2, 1, 3, 0],
      events: [
        ['09:15', 'Підготовлено зведення', 'Показники обліку оновлено', false],
        ['08:48', 'Надійшов новий запис', 'Умовний сектор C2', false],
        ['08:35', 'Позначено відхилення', 'Потребує додаткової перевірки', true],
        ['08:10', 'Завершено верифікацію', 'Контроль повноти атрибутів', false]
      ]
    },
    communications: {
      title: "Зв'язок",
      kpis: [
        { name: 'Виконання плану', value: '91%', change: '+2,4%', note: 'до минулого періоду', color: 'var(--green)', mark: '◫' },
        { name: 'Достовірність даних', value: '96%', change: '+1,1%', note: 'після перевірки', color: 'var(--blue)', mark: '✓' },
        { name: 'Сигнали уваги', value: '02', change: '−1', note: 'від попереднього огляду', color: 'var(--gold)', mark: '◇' },
        { name: 'Обробка запису', value: '12 хв', change: '−3 хв', note: 'середній показник', color: 'var(--green)', mark: '◷' }
      ],
      trend: [69, 74, 71, 78, 84, 77, 80, 83, 88, 86, 91, 89, 94, 91],
      distribution: [720, 300, 180],
      categories: ['Моніторинг', 'Перевірки', 'Звернення'],
      heat: [0, 1, 2, 1, 3, 2, 1, 2, 3, 4, 2, 0, 1, 3, 2, 1, 1, 0, 0, 2, 1, 3, 2, 0],
      events: [
        ['09:18', 'Звіт доступності оновлено', 'Агреговані показники стану', false],
        ['08:55', 'Результат тесту отримано', 'Вибірка навчальних даних', false],
        ['08:31', 'Потрібна перевірка запису', 'Виявлено пропущене поле', true],
        ['08:02', 'Синхронізацію завершено', 'Демонстраційний журнал подій', false]
      ]
    },
    information: {
      title: 'Інформаційні потоки',
      kpis: [
        { name: 'Виконання плану', value: '77%', change: '+6,8%', note: 'до минулого періоду', color: 'var(--green)', mark: '◫' },
        { name: 'Достовірність даних', value: '89%', change: '+3,0%', note: 'після перевірки', color: 'var(--blue)', mark: '✓' },
        { name: 'Сигнали уваги', value: '05', change: '+1', note: 'від попереднього огляду', color: 'var(--red)', mark: '◇' },
        { name: 'Обробка запису', value: '24 хв', change: '−2 хв', note: 'середній показник', color: 'var(--green)', mark: '◷' }
      ],
      trend: [42, 51, 49, 57, 54, 61, 65, 61, 69, 67, 72, 70, 79, 77],
      distribution: [460, 355, 285],
      categories: ['Повідомлення', 'Зведення', 'Запити'],
      heat: [1, 2, 4, 3, 1, 0, 1, 3, 4, 2, 1, 2, 2, 4, 3, 2, 0, 1, 0, 1, 3, 4, 2, 1],
      events: [
        ['09:20', 'Зведений індекс оновлено', 'Актуалізовано умовні метрики', false],
        ['08:52', 'Нову групу записів додано', 'Перевірено структуру полів', false],
        ['08:26', 'Виявлено дублікати', 'Потрібне ручне уточнення', true],
        ['08:06', 'Підсумок сформовано', 'Результати навчального сценарію', false]
      ]
    }
  };

  // A synthetic, deliberately innocuous training register.
  const records = [
    { code: 'TRN-008', time: '2026-10-22 09:10', category: 'Облік ресурсів', sector: 'A2', completeness: 96, status: 'ok' },
    { code: 'TRN-007', time: '2026-10-22 08:45', category: 'Потік даних', sector: 'B3', completeness: 68, status: 'work' },
    { code: 'TRN-006', time: '2026-10-22 08:25', category: 'Документообіг', sector: 'C2', completeness: 42, status: 'risk' },
    { code: 'TRN-005', time: '2026-10-22 08:02', category: 'Облік ресурсів', sector: 'A1', completeness: 100, status: 'ok' },
    { code: 'TRN-004', time: '2026-10-21 17:30', category: 'Моніторинг', sector: 'D5', completeness: 88, status: 'ok' },
    { code: 'TRN-003', time: '2026-10-21 16:10', category: 'Потік даних', sector: 'B4', completeness: 73, status: 'work' },
    { code: 'TRN-002', time: '2026-10-21 14:15', category: 'Документообіг', sector: 'C3', completeness: 56, status: 'risk' },
    { code: 'TRN-001', time: '2026-10-21 13:40', category: 'Моніторинг', sector: 'D1', completeness: 99, status: 'ok' }
  ];
  const statusMeta = {
    ok: ['Завершено', 'ok'], work: ['У роботі', 'work'], risk: ['Увага', 'risk']
  };

  let currentScenario = 'logistics';
  let currentPeriod = 7;
  let toastTimeout;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('is-visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('is-visible'), 2400);
  }
  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement('textarea');
        ta.value = value; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
        document.body.append(ta); ta.select();
        if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
        ta.remove();
      }
      toast('Код скопійовано');
    } catch {
      toast('Не вдалося скопіювати. Виділіть текст вручну.');
    }
  }

  function renderKPIs(config) {
    $('#kpi-grid').replaceChildren(...config.kpis.map(item => {
      const card = document.createElement('article');
      card.className = 'kpi-card';
      card.style.setProperty('--kpi-color', item.color);
      card.innerHTML = `<div class="kpi-caption"><span>${item.name}</span><span class="kpi-mark" aria-hidden="true">${item.mark}</span></div><strong>${item.value}</strong><div class="kpi-foot"><b>${item.change}</b> ${item.note}</div>`;
      return card;
    }));
  }
  function renderTrend(config) {
    const values = config.trend.slice(-currentPeriod);
    const container = $('#trend-plot');
    container.style.setProperty('--bar-count', values.length);
    const fragment = document.createDocumentFragment();
    values.forEach((value, i) => {
      const day = config.trend.length - values.length + i + 1;
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'bar-day';
      el.style.setProperty('--value', `${value}%`);
      el.dataset.label = String(day).padStart(2, '0');
      el.setAttribute('aria-label', `Доба ${day}, виконання ${value}%`);
      el.innerHTML = `<span class="bar-num" aria-hidden="true">${value}%</span><span class="bar-fill" aria-hidden="true"></span>`;
      el.addEventListener('click', () => {
        $$('.bar-day', container).forEach(x => x.classList.remove('is-selected'));
        el.classList.add('is-selected');
        $('#trend-highlight').textContent = `Доба ${day}: ${value}%`;
      });
      fragment.append(el);
    });
    container.replaceChildren(fragment);
    $('#trend-highlight').textContent = `Останні ${currentPeriod} умовних діб`;
  }
  function renderDonut(config) {
    const data = config.distribution;
    const total = data.reduce((a,b) => a+b, 0);
    const percentages = data.map(x => 100*x/total);
    const a = percentages[0]; const b = a + percentages[1];
    const colors = ['#a8c88d','#e3bd72','#76bcd1'];
    const donut = $('#donut-chart');
    donut.style.background = `conic-gradient(${colors[0]} 0% ${a}%, ${colors[1]} ${a}% ${b}%, ${colors[2]} ${b}% 100%)`;
    donut.setAttribute('aria-label', config.categories.map((label,i) => `${label}: ${Math.round(percentages[i])}%`).join('; '));
    $('#donut-total').textContent = nf.format(total);
    $('#donut-legend').replaceChildren(...config.categories.map((label,i) => {
      const div = document.createElement('div');
      div.className = 'donut-legend-item';
      div.innerHTML = `<i style="background:${colors[i]}"></i><span>${label}</span><strong>${Math.round(percentages[i])}%</strong>`;
      return div;
    }));
  }
  function renderSectors(config) {
    const letters = ['A','B','C','D'];
    const root = $('#dashboard-heatmap');
    const fragment = document.createDocumentFragment();
    config.heat.forEach((level,i) => {
      const name = `${letters[Math.floor(i/6)]}${i%6+1}`;
      const cell = document.createElement('button');
      cell.type='button'; cell.className = `sector-cell heat-${level}`;
      cell.textContent = name;
      cell.setAttribute('aria-label', `Умовний сектор ${name}, рівень інтенсивності ${level} з 4`);
      cell.title = `Умовний сектор ${name} · рівень ${level}/4`;
      cell.addEventListener('click', () => {
        $$('.sector-cell', root).forEach(x => x.classList.remove('is-selected'));
        cell.classList.add('is-selected');
        $('#sector-detail').textContent = `Сектор ${name}: рівень інформаційного навантаження ${level} із 4. Сектори умовні, не географічні.`;
      });
      fragment.append(cell);
    });
    root.replaceChildren(fragment);
    $('#sector-detail').textContent = 'Оберіть сектор для перегляду показника інформаційного навантаження.';
  }
  function renderTimeline(config) {
    $('#event-timeline').replaceChildren(...config.events.map(([time,label,note,warn]) => {
      const li = document.createElement('li');
      li.innerHTML = `<time>${time}</time><span aria-hidden="true" class="event-dot ${warn?'warn':''}"></span><div><strong>${label}</strong><small>${note}</small></div>`;
      return li;
    }));
  }
  function renderDashboard() {
    const config = scenarioData[currentScenario];
    renderKPIs(config); renderTrend(config); renderDonut(config);
    renderSectors(config); renderTimeline(config);
  }
  $('#scenario-select').addEventListener('change', e => { currentScenario = e.target.value; renderDashboard(); });
  $('#period-select').addEventListener('change', e => { currentPeriod = Number(e.target.value); renderDashboard(); });
  renderDashboard();

  // HTML tables: accessible native markup, search, filters, sorting and CSV.
  let sortColumn = 'time'; let sortDirection = -1;
  function getVisibleRows() {
    const needle = $('#table-search').value.trim().toLocaleLowerCase('uk-UA');
    const status = $('#table-status').value;
    return records.filter(row => {
      const match = `${row.code} ${row.time} ${row.category} ${row.sector}`.toLocaleLowerCase('uk-UA').includes(needle);
      return match && (status === 'all' || row.status === status);
    }).sort((a,b) => {
      const va=a[sortColumn], vb=b[sortColumn];
      return (typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb),'uk-UA'))*sortDirection;
    });
  }
  function renderTable() {
    const rows=getVisibleRows();
    const tbody=$('#reports-body');
    if (!rows.length) {
      const tr=document.createElement('tr');
      tr.innerHTML='<td class="table-empty" colspan="6">Немає записів за вибраними умовами.</td>';
      tbody.replaceChildren(tr);
    } else {
      tbody.replaceChildren(...rows.map(row => {
        const tr=document.createElement('tr');
        const [statusText, statusClass]=statusMeta[row.status];
        tr.innerHTML=`<td class="table-code">${row.code}</td><td>${row.time}</td><td>${row.category}</td><td>${row.sector}</td><td><div class="table-meter"><span role="img" aria-label="Повнота: ${row.completeness}%"><i style="width:${row.completeness}%"></i></span><b>${row.completeness}%</b></div></td><td><span class="status-pill ${statusClass}">${statusText}</span></td>`;
        return tr;
      }));
    }
    $('#table-count').textContent=`Відображено ${rows.length} із ${records.length} записів`;
  }
  $('#table-search').addEventListener('input', renderTable);
  $('#table-status').addEventListener('change', renderTable);
  $$('[data-sort]').forEach(button => button.addEventListener('click', () => {
    const col=button.dataset.sort;
    sortDirection = col === sortColumn ? -sortDirection : 1;
    sortColumn = col;
    $$('[data-sort]').forEach(x => { x.removeAttribute('aria-sort'); x.textContent=`${({code:'Код',time:'Дата',category:'Категорія',completeness:'Повнота'})[x.dataset.sort]} ↕`; });
    button.textContent += sortDirection===1?' ↑':' ↓';
    button.setAttribute('aria-sort',sortDirection===1?'ascending':'descending');
    renderTable();
  }));
  $('#csv-export').addEventListener('click', () => {
    const heads=['Код','Дата','Категорія','Сектор','Повнота (%)','Статус'];
    const csv=[heads,...getVisibleRows().map(x => [x.code,x.time,x.category,x.sector,x.completeness,statusMeta[x.status][0]])]
      .map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(';')).join('\r\n');
    const blob = new Blob(['\uFEFF',csv], {type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download='demo_reports.csv';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url),1500);
    toast('CSV експортовано з урахуванням фільтрів');
  });
  renderTable();

  // One HTML structure, two different CSS layout methods.
  $$('[data-layout]').forEach(button => button.addEventListener('click', () => {
    const mode=button.dataset.layout;
    const demo=$('#layout-demo');
    demo.classList.toggle('is-grid',mode==='grid');
    demo.classList.toggle('is-flex',mode==='flex');
    $$('[data-layout]').forEach(b => { const current=b===button; b.classList.toggle('is-current',current); b.setAttribute('aria-pressed',String(current)); });
    if (mode==='grid') {
      $('#layout-css-code').textContent='.dashboard {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 16px;\n}';
      $('#layout-advice').innerHTML='<strong>Grid — двовимірна система.</strong><p>Зручний для карток KPI, панелей аналітики та симетричних розкладок. Властивість <code>gap</code> задає проміжки між елементами.</p>';
    } else {
      $('#layout-css-code').textContent='.toolbar {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  gap: 16px;\n}\n.toolbar > * { flex: 1; }';
      $('#layout-advice').innerHTML='<strong>Flexbox — одновимірна система.</strong><p>Усі елементи стають в один ряд (за потреби — з переносом). Корисно для панелі фільтрів, кнопок та заголовків.</p>';
    }
  }));

  // Live CSS custom properties. Do not evaluate user-supplied CSS or HTML.
  const labDefaults={gap:16,radius:14,cols:2,height:80,accent:'#a8c88d'};
  const labValues={...labDefaults};
  const labPreview=$('#lab-preview');
  function updateLab() {
    labPreview.style.setProperty('--demo-gap',`${labValues.gap}px`);
    labPreview.style.setProperty('--demo-radius',`${labValues.radius}px`);
    labPreview.style.setProperty('--demo-cols',labValues.cols);
    labPreview.style.setProperty('--demo-scale',String(labValues.height/100));
    labPreview.style.setProperty('--demo-accent',labValues.accent);
    $('#gap-out').textContent=`${labValues.gap} px`;
    $('#radius-out').textContent=`${labValues.radius} px`;
    $('#cols-out').textContent=String(labValues.cols);
    $('#height-out').textContent=`${labValues.height}%`;
    $('#lab-css-output').textContent=`.preview {\n  display: grid;\n  grid-template-columns: repeat(${labValues.cols}, 1fr);\n  gap: ${labValues.gap}px;\n  border-radius: ${labValues.radius}px;\n  --height-factor: ${(labValues.height/100).toFixed(2)};\n  --accent: ${labValues.accent};\n}\n.bar { height: calc(var(--value) * var(--height-factor)); }`;
    $$('.swatch').forEach(b => {const selected=b.dataset.accent===labValues.accent;b.classList.toggle('is-current',selected);b.setAttribute('aria-pressed',String(selected));});
  }
  for (const key of ['gap','radius','cols','height']) {
    $(`#lab-${key}`).addEventListener('input',e => {labValues[key]=Number(e.target.value);updateLab();});
  }
  $$('.swatch').forEach(button => button.addEventListener('click',() => {labValues.accent=button.dataset.accent;updateLab();}));
  $('#lab-reset').addEventListener('click',() => {
    Object.assign(labValues,labDefaults);
    for(const key of ['gap','radius','cols','height']) $(`#lab-${key}`).value=labValues[key];
    updateLab(); toast('Параметри повернено до початкових');
  });
  $('#copy-lab').addEventListener('click',() => copyText($('#lab-css-output').textContent));
  updateLab();

  // Responsive device emulator uses actual CSS container queries.
  function updateDeviceWidth() { $('#device-width').textContent=`${Math.round($('#device-canvas').getBoundingClientRect().width)} px`; }
  $$('[data-device]').forEach(button => button.addEventListener('click',() => {
    const canvas=$('#device-canvas');
    canvas.className=`device-canvas ${button.dataset.device}`;
    $$('[data-device]').forEach(b => {const on=b===button;b.classList.toggle('is-current',on);b.setAttribute('aria-pressed',String(on));});
    requestAnimationFrame(updateDeviceWidth);
  }));
  window.addEventListener('resize',updateDeviceWidth);
  updateDeviceWidth();

  // Shared utility actions.
  $$('[data-copy]').forEach(button => button.addEventListener('click', () => {
    const element=document.getElementById(button.dataset.copy);
    if(element) copyText(element.textContent.trim());
  }));
  $('#copy-checklist').addEventListener('click',() => copyText('Практичне завдання: мінідашборд.\n1. Замініть навчальні дані в app.js.\n2. Налаштуйте кольори й сітку в styles.css.\n3. Додайте HTML-компонент.\n4. Перевірте мобільну версію та клавіатуру.'));
  $('#print-button').addEventListener('click',() => window.print());
  const themeToggle=$('#theme-toggle');
  themeToggle.addEventListener('click',() => {
    const light=document.body.dataset.theme!=='light';
    document.body.dataset.theme=light?'light':'dark';
    $('#theme-icon').textContent=light?'☾':'☼';
    themeToggle.setAttribute('aria-label',light?'Увімкнути темну тему':'Увімкнути світлу тему');
  });

  // Sidebar, scrollspy and progress tracking.
  const navToggle=$('#menu-toggle');
  const navScrim=$('#nav-scrim');
  function closeNav() {document.body.classList.remove('nav-open'); navToggle.setAttribute('aria-expanded','false'); navScrim.hidden=true;}
  navToggle.addEventListener('click',() => {
    const opened=!document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open',opened);
    navToggle.setAttribute('aria-expanded',String(opened));
    navScrim.hidden=!opened;
  });
  navScrim.addEventListener('click',closeNav);
  document.addEventListener('keydown', e => {if(e.key==='Escape')closeNav();});
  const links=$$('.nav-link');
  links.forEach(link => link.addEventListener('click',closeNav));
  const sections=$$('.section-anchor');
  const visited=new Set(['home']);
  function activate(id) {
    links.forEach(link => {const active=link.getAttribute('href')===`#${id}`;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    visited.add(id);
    $('#progress-count').textContent=`${visited.size}/${sections.length}`;
    $('#progress-fill').style.width=`${100*visited.size/sections.length}%`;
  }
  activate('home');
  if('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries => {
      entries.forEach(entry => {if(entry.isIntersecting) activate(entry.target.id);});
    }, {rootMargin:'-10% 0px -65% 0px',threshold:0});
    sections.forEach(section => observer.observe(section));
  } else {
    links.forEach(link=>link.addEventListener('click',()=>activate(link.hash.slice(1))));
  }
})();
