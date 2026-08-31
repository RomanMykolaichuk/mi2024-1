# Theme 5 Interactive Track

## Scope

Theme 5 is implemented as an eight-lesson interactive track focused on **visual analytical communication** rather than decorative chart production.

Core learning chain:

`analytical question → visual encoding → design hierarchy → coordinated views → interpretation → audience-specific brief`

Every web lesson targets approximately **30–45 minutes of active work** and uses only synthetic/safe examples in the browser layer.

## Audited source structure

| Lesson | Primary source | Verified title / note |
|---|---|---|
| 5.1 | `Theme5/aLection51/content51.ipynb` | **Методологічні основи візуалізації даних** |
| 5.2 | `Theme5/GroupLesson52/content.ipynb` | **Огляд інструментів візуалізації даних на основі HTML + CSS** |
| 5.3 | `Theme5/Practice53/2025/task.ipynb` | **Практичне використання інструментів візуалізації даних**; source contains 10 practice variants |
| 5.4 | `Theme5/GroupLesson54/content.ipynb` | **Підбір візуальних елементів для візуалізації даних** |
| 5.5 | `Theme5/Practice55/start`, `Theme5/Practice55/pr35` | No separate lesson plan/title found. Interactive title **Практичне створення дашборду військового аналітика** is explicitly `source-derived` from the dashboard artifacts. |
| 5.6 | `Theme5/aLection56/content.ipynb` | **Основи графічного дизайну та його використання для візуалізації даних** |
| 5.7 | `Theme5/GroupLesson57/content.ipynb` | **Застосування принципів графічного дизайну для візуалізації даних** |
| 5.8 | `Theme5/Practice58/content.ipynb` | **Розробка та демонстрація візуалізацій для різних аудиторій в межах виконання індивідуальних (групових) проектів** |

The original notebooks, HTML/CSS/JS examples, PDFs and other source materials are preserved unchanged.

## Page architecture

All Theme 5 lessons share one shell:

```text
interactive/lessons/theme5.html?lesson=t5-lN
```

`interactive/js/theme5-page.js` loads:

```text
interactive/data/lessons/t5-lN.json
```

and renders:

```text
Theme navigation
→ hero / learning outcomes / timebox
→ analytical scenario
→ analytics pipeline
→ reusable interactive labs
→ WHY IT MATTERS FOR THE ANALYST
→ self-check / reflection
→ repository source materials
```

This avoids eight copies of nearly identical HTML and keeps the lesson-specific content in JSON.

## Track logic

### 5.1 — visualization methodology

Focus: visualization as a method for encoding evidence.

Interactive sequence:

`Visual Encoding Lab → Design Critique → Evidence → Brief`

### 5.2 — HTML + CSS dashboard structure

Focus: semantic HTML, CSS Grid/Flexbox, responsive layout and information hierarchy.

Interactive sequence:

`Dashboard Builder → Layout Critique → Reading-order Brief`

### 5.3 — practical visualization missions

The ten variants in the source task are represented as browser missions:

1. tactical event map;
2. attack dynamics / time series;
3. force structure;
4. readiness profile;
5. network graph;
6. correlation heatmap;
7. operational dashboard;
8. distribution / UAV effectiveness;
9. logistics route;
10. forecast scenarios and uncertainty.

Interactive sequence:

`10 Visualization Missions → Encoding Check → Analytical Conclusion`

### 5.4 — selecting visual elements

Focus: matching visual forms to `task + data type + audience` and understanding perceptual trade-offs.

### 5.5 — integrated dashboard practice

The source artifacts contain KPI/cards, charts, a table and a Leaflet map. The web lesson treats them as coordinated analytical views rather than independent widgets.

The title is intentionally marked `source-derived` because no separate source lesson title was found.

### 5.6 — graphic design foundations

Focus:

- composition and balance;
- contrast and hierarchy;
- semantic color;
- typography;
- whitespace;
- truthful scales;
- responsive layout.

### 5.7 — applying design principles

Focus: structured group redesign and critique.

Design review is evaluated through user-task performance, not subjective taste alone.

### 5.8 — audience adaptation

Focus: one evidence base, different information densities for:

- technical expert;
- commander/manager;
- broad/public audience.

Key rule:

> Adapt complexity, not truth.

Scale, provenance and critical uncertainty must not change between audience modes.

## Reusable components added for Theme 5

- `visual-encoding-lab`
- `dashboard-builder`
- `design-critique-lab`
- `audience-adaptation-lab`
- `visualization-mission-lab`
- `insight-brief-lab`

Existing components reused:

- `lesson-roadmap`
- `analytics-pipeline`
- `decision-tradeoff`
- `knowledge-check`

## Cross-cutting analytical principle

A visualization is not complete when the chart renders. The learner should be able to move through:

```text
VISUAL PATTERN
      ↓
SOURCE / QUALITY CHECK
      ↓
INTERPRETATION
      ↓
IMPLICATION
      ↓
RECOMMENDATION / NEXT ANALYTICAL STEP
```

The interactive layer therefore repeatedly asks not only **“what do you see?”** but also **“what does the evidence justify?”** and **“what remains uncertain?”**.

## Definition of Done for a Theme 5 lesson

A lesson is considered implemented when:

- its title is audited against source materials or explicitly marked `source-derived`;
- the active timebox is 30–45 minutes;
- it contains at least five meaningful active blocks;
- at least one user decision changes feedback/state;
- the visualization is tied to an analytical question;
- misleading visual choices and uncertainty are addressed where relevant;
- the learner ends with interpretation or brief, not only a rendered chart;
- local source links resolve;
- JavaScript and JSON pass CI.

## Known source-quality note

Several original Theme 5 materials were designed as 90-minute classroom plans and contain older standalone HTML/Chart.js/Leaflet examples. The interactive layer does **not** delete or silently rewrite those materials. It extracts their pedagogical intent and rebuilds it as a shorter active learning route using the shared pure-JS engine.
