(() => {
  const link = document.querySelector('[data-redirect]');
  if (!link) return;

  const target = new URL(link.getAttribute('href'), window.location.href);
  if (target.origin !== window.location.origin) return;
  target.search = window.location.search;
  target.hash = window.location.hash;
  link.href = target.href;
  if (target.href !== window.location.href) window.location.replace(target.href);
})();
