// Native anchors work independently; the selected link follows the reading position.
(() => {
  const links = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
  const header = document.querySelector('.site-header');
  if (!sections.length || !header) return;

  let selected = '';
  let scheduled = false;
  const activate = id => {
    if (selected === id) return;
    selected = id;
    links.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const activateTarget = () => {
    const target = document.querySelector(':target');
    const section = target && sections.find(entry => entry.contains(target));
    if (section) activate(section.id);
  };
  const update = () => {
    scheduled = false;
    const threshold = header.getBoundingClientRect().bottom + 60;
    let current = sections[0].id;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section.id;
      else break;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      const target = sections.find(section => `#${section.id}` === location.hash);
      current = target && target.getBoundingClientRect().top > threshold
        ? target.id
        : sections[sections.length - 1].id;
    }
    activate(current);
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', activateTarget);
  window.addEventListener('load', activateTarget);
  activateTarget();
})();

const rainAnimation = document.querySelector('.rain-animation');
if (rainAnimation) {
  const link = rainAnimation.querySelector('a');
  const image = rainAnimation.querySelector('img');
  const button = rainAnimation.querySelector('button');
  const poster = image.src;
  const setPlaying = playing => {
    image.src = playing ? link.href : poster;
    button.textContent = playing ? 'Stop' : 'Play';
    button.setAttribute('aria-label', playing ? 'Stop flood animation' : 'Play flood animation');
  };
  const autoplay = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoplay.disconnect();
      setPlaying(true);
    }
  }, { threshold: 0.35 });
  button.hidden = false;
  button.addEventListener('click', () => {
    autoplay.disconnect();
    setPlaying(image.src !== link.href);
  });
  autoplay.observe(rainAnimation);
}

const honorsFilter = document.querySelector('.honors-filter');
if (honorsFilter) {
  const buttons = honorsFilter.querySelectorAll('button');
  const heading = document.getElementById('honors-title');
  const entries = document.querySelectorAll('#honors-list [data-honors-only]');
  function showHonors(view) {
    heading.textContent = view === 'selected' ? 'Selected Honors' : 'Honors and Awards';
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.honorsView === view));
    }
    for (const entry of entries) entry.hidden = entry.dataset.honorsOnly !== view;
  }

  for (const button of buttons) button.addEventListener('click', () => showHonors(button.dataset.honorsView));
  showHonors('selected');
  honorsFilter.hidden = false;
}
