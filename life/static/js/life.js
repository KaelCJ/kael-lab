(() => {
  const form = document.querySelector('[data-calculator]');
  const inputs = [...form.querySelectorAll('input')];
  const perGram = document.querySelector('#per-gram');
  const perHundred = document.querySelector('#per-hundred');
  const note = document.querySelector('[data-result-note]');
  const format = new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 6 });

  const update = () => {
    const [price, grams, count] = inputs.map(input => input.valueAsNumber);
    const incomplete = inputs.some(input => input.value === '' && !input.validity.badInput);
    const valid = [price, grams, count].every(Number.isFinite) && price >= 0 && grams > 0 && Number.isInteger(count) && count > 0;
    const total = grams * count;
    const unitPrice = price / total;
    const usable = valid && total > 0 && Number.isFinite(total) && Number.isFinite(unitPrice * 100);
    inputs.forEach((input, index) => {
      const invalid = input.validity.badInput || (input.value !== '' && (!Number.isFinite(input.valueAsNumber) || (index === 0 ? price < 0 : index === 1 ? grams <= 0 : count <= 0 || !Number.isInteger(count))));
      input.setAttribute('aria-invalid', String(invalid));
    });
    perGram.value = usable ? format.format(unitPrice) : '—';
    perHundred.value = usable ? format.format(unitPrice * 100) : '—';
    note.textContent = usable ? `共 ${format.format(total)}g · 实付 ${format.format(price)} 元` : incomplete ? '填入价格和规格，自动换算。' : '请填写有效金额、正克数和整数份数。';
    note.toggleAttribute('data-error', !usable && !incomplete);
  };

  form.addEventListener('input', update);
  form.addEventListener('submit', event => event.preventDefault());
  form.hidden = false;
  update();
})();
