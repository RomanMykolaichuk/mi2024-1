export function mount(element, config) {
  const questions = config.questions ?? [];

  element.innerHTML = `
    <form data-role="quiz-form">
      ${questions.map((question, index) => `
        <div class="quiz-question">
          <fieldset>
            <legend>${index + 1}. ${question.prompt}</legend>
            ${question.options.map((option, optionIndex) => `
              <label class="quiz-option">
                <input type="radio" name="q${index}" value="${optionIndex}">
                <span>${option}</span>
              </label>
            `).join('')}
          </fieldset>
        </div>
      `).join('')}
      <button class="btn" type="submit">Перевірити</button>
      <div class="quiz-result" data-role="quiz-result" aria-live="polite"></div>
    </form>
  `;

  const form = element.querySelector('[data-role="quiz-form"]');
  const result = element.querySelector('[data-role="quiz-result"]');

  form.addEventListener('submit', event => {
    event.preventDefault();

    let correct = 0;
    let answered = 0;

    questions.forEach((question, index) => {
      const selected = form.querySelector(`input[name="q${index}"]:checked`);
      if (!selected) return;
      answered += 1;
      if (Number(selected.value) === question.answer) correct += 1;
    });

    if (answered < questions.length) {
      result.textContent = `Дайте відповідь на всі питання (${answered}/${questions.length}).`;
      return;
    }

    result.innerHTML = `<strong>${correct}/${questions.length}</strong> правильних відповідей. ${config.feedback?.[String(correct)] ?? config.defaultFeedback ?? ''}`;
  });
}
