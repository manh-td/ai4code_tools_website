document.addEventListener('DOMContentLoaded', function () {
  const stack = document.querySelector('.tinder-stack');
  if (!stack) return;

  const baseUrl = 'https://raw.githubusercontent.com/manh-td/ai-papers-crawler/refs/heads/main/outputs/papers/all_papers.jsonl';

  async function loadRemotePapers() {
    try {
      const res = await fetch(baseUrl);
      if (!res.ok) throw new Error('Network response not ok');

      const text = await res.text();
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      const currentYear = String(new Date().getFullYear());
      const papers = [];

      for (const line of lines) {
        try {
          const obj = JSON.parse(line);

          const title =
            obj.title ||
            obj.paper_title ||
            obj.name ||
            obj.title_text ||
            '';

          const conference = obj.conference || '';

          // ✅ FILTER: only keep papers whose conference contains this year
          if (!conference.includes(currentYear)) continue;

          const authors = conference
            ? ('<strong>Conference</strong>: ' + conference)
            : '';

          const rawUrl =
            obj.url ||
            obj.pdf ||
            obj.pdf_url ||
            obj.arxiv_url ||
            obj.source ||
            obj.link ||
            '';

          const url = rawUrl || (title
            ? 'https://www.google.com/search?q=' + encodeURIComponent(title)
            : '');

          papers.push({
            title,
            desc: '',
            authors,
            url
          });

        } catch (err) {
          // ignore invalid JSON lines
        }
      }

      // ✅ LIMIT TO 20 RANDOM PAPERS
      const MAX_PAPERS = 20;

      if (papers.length > MAX_PAPERS) {
        for (let i = papers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [papers[i], papers[j]] = [papers[j], papers[i]];
        }
        return papers.slice(0, MAX_PAPERS);
      }

      return papers.length ? papers : null;

    } catch (e) {
      return null;
    }
  }

  function createCard(item) {
    const art = document.createElement('article');
    art.className = 'card';
    art.dataset.url = item.url || '';
    art.innerHTML = `
      <div class="content">
        <h3 style="color:#000;font-weight:700">${escapeHtml(item.title)}</h3>
        <p>${item.desc || ''}</p>
        <p class="meta">${item.authors || ''}</p>
        <p class="count" style="text-align:right;color:#666;font-size:0.9rem">${item.idx && item.total ? (item.idx + '/' + item.total) : ''}</p>
        <div class="actions"><button class="pass">Pass</button><button class="interesting">Interesting</button></div>
      </div>
    `;
    return art;
  }

  function renderCards(list) {
    stack.innerHTML = '';
    const noMore = document.createElement('article');
    noMore.className = 'card no-more';
    noMore.dataset.url = '';
    noMore.innerHTML = `
      <div class="content">
        <h3 style="color:#000;font-weight:700">No more for today. Refresh the page to make another pass.</h3>
        <p class="desc"></p>
        <p class="meta"></p>
      </div>
    `;
    stack.appendChild(noMore);
    for (let i = 0; i < list.length; i++) {
      list[i].idx = i + 1;
      list[i].total = list.length;
      stack.appendChild(createCard(list[i]));
    }
  }

  // Minimal examples fallback
  const examples = [
    { title: 'Example Paper A', desc: '<strong>Topics:</strong> NLP<br><strong>Branches:</strong> Transformers', authors: '<strong>Related to:</strong> Alice, Bob', url: '' },
    { title: 'Example Paper B', desc: '<strong>Topics:</strong> CV<br><strong>Branches:</strong> Detection', authors: '<strong>Related to:</strong> Carol', url: '' },
    { title: 'Example Paper C', desc: '<strong>Topics:</strong> RL', authors: '', url: '' },
  ];

  (async function () {
    const remote = await loadRemotePapers();
    if (remote && remote.length) {
      const mapped = remote.map((p) => ({
        title: p.title || 'No title',
        desc: p.desc || p.abstract || '',
        authors: p.authors || '',
        url: p.url || '',
      }));
      renderCards(mapped);
    } else {
      renderCards(examples);
    }
  })();

  function getTopCard() {
    const last = stack.lastElementChild;
    return last && last.classList.contains('card') ? last : null;
  }

  function removeTop(direction, url) {
    const top = getTopCard();
    if (!top) return;
    top.classList.add(direction === 'left' ? 'gone-left' : 'gone-right');
    if (url) {
      try { window.open(url, '_blank'); } catch (e) { }
    }
    setTimeout(() => { if (top && top.parentNode) top.remove(); }, 300);
  }

  stack.addEventListener('click', function (e) {
    const target = e.target;
    if (target.classList.contains('pass')) {
      const top = getTopCard();
      if (!top) return;
      const card = target.closest('.card');
      if (card !== top) return;
      removeTop('left');
    }
    if (target.classList.contains('interesting')) {
      const top = getTopCard();
      if (!top) return;
      const card = target.closest('.card');
      if (card !== top) return;
      const url = top.dataset.url;
      removeTop('right', url);
    }
  });

  // Simple HTML-escape to avoid injection from titles
  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[m];
    });
  }
});
