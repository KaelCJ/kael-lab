const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../static/js/redirect.js'), 'utf8');

function redirect(from, target) {
  const current = new URL(from);
  const replacements = [];
  const link = target === null ? null : { getAttribute: () => target, href: target };
  vm.runInNewContext(source, {
    URL,
    document: { querySelector: () => link },
    window: { location: {
      href: current.href, origin: current.origin, search: current.search, hash: current.hash,
      replace: url => replacements.push(url)
    } }
  });
  return { replacements, link };
}

test('root entry keeps the query and fragment', () => {
  const result = redirect('https://example.test/?campaign=work#ecosystem', 'work/index.html');
  assert.deepEqual(result.replacements, ['https://example.test/work/index.html?campaign=work#ecosystem']);
  assert.equal(result.link.href, result.replacements[0]);
});

test('root entry keeps the query and fragment under a project prefix', () => {
  const result = redirect('https://example.test/lab/index.html?topic=nest#guide', 'work/index.html');
  assert.deepEqual(result.replacements, ['https://example.test/lab/work/index.html?topic=nest#guide']);
});

test('directory-index requests keep the project prefix', () => {
  const result = redirect('https://example.test/lab/?view=briefing', 'work/index.html');
  assert.deepEqual(result.replacements, ['https://example.test/lab/work/index.html?view=briefing']);
});

test('query parameters cannot select an external redirect target', () => {
  const result = redirect('https://example.test/index.html?next=https%3A%2F%2Fother.test#hello', 'work/index.html');
  assert.equal(new URL(result.replacements[0]).origin, 'https://example.test');
  assert.equal(new URL(result.replacements[0]).searchParams.get('next'), 'https://other.test');
});

test('cross-origin destinations are rejected', () => {
  assert.deepEqual(redirect('https://example.test/', 'https://other.test/').replacements, []);
});

test('missing link and self redirects do not navigate', () => {
  assert.deepEqual(redirect('https://example.test/', null).replacements, []);
  assert.deepEqual(redirect('https://example.test/index.html', 'index.html').replacements, []);
});
