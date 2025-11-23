document.addEventListener('DOMContentLoaded', function(){
  const stack = document.querySelector('.tinder-stack');
  if(!stack) return;

  const baseUrl = 'https://raw.githubusercontent.com/AI4Code-HUST/scholar_alters/master/data';

  async function loadRemotePapers(dateString = null) {
    const dataUrl = dateString ? `${baseUrl}/${dateString}.jsonl` : `${baseUrl}/papers.jsonl`;
    try {
      const res = await fetch(dataUrl);
      if (!res.ok) throw new Error('Network response not ok');
      const text = await res.text();
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const papers = [];
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          const title = obj.title || obj.paper_title || obj.name || obj.title_text || '';
          const first_label = Array.isArray(obj.first_label) ? obj.first_label.join(', ') : (typeof obj.first_label === 'string' ? obj.first_label : '');
          const second_label = Array.isArray(obj.second_label) ? obj.second_label.join(', ') : (typeof obj.second_label === 'string' ? obj.second_label : '');

          let desc = '';
          if (first_label) desc += '<strong>Topics:</strong> ' + first_label;
          if (second_label) desc += (desc ? '<br>' : '') + '<strong>Branches:</strong> ' + second_label;

          const authorsRaw = Array.isArray(obj.authors) ? obj.authors.join(', ') : (obj.authors || obj.author || '');
          const authors = authorsRaw ? '<strong>Related to:</strong> ' + authorsRaw : '';
          const url = obj.url || obj.pdf || obj.pdf_url || obj.arxiv_url || obj.source || obj.link || '';

          papers.push({ title, desc, authors, url });
        } catch (err) {
          // ignore invalid JSON lines
        }
      }
      if (papers.length) return papers;
      return null;
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

  (async function(){
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
    if(!top) return;
    top.classList.add(direction === 'left' ? 'gone-left' : 'gone-right');
    if(url) {
      try { window.open(url, '_blank'); } catch(e) {}
    }
    setTimeout(() => { if (top && top.parentNode) top.remove(); }, 300);
  }

  stack.addEventListener('click', function(e){
    const target = e.target;
    if (target.classList.contains('pass')) {
      const top = getTopCard();
      if(!top) return;
      const card = target.closest('.card');
      if(card !== top) return;
      removeTop('left');
    }
    if (target.classList.contains('interesting')) {
      const top = getTopCard();
      if(!top) return;
      const card = target.closest('.card');
      if(card !== top) return;
      const url = top.dataset.url;
      removeTop('right', url);
    }
  });

  // Wire date picker to reload stack for selected date
  const datePicker = document.getElementById('selectedDate');
  const applyDateFilter = document.getElementById('applyDateFilter');
  if (applyDateFilter && datePicker) {
    applyDateFilter.addEventListener('click', async () => {
      const selectedDate = datePicker.value; // YYYY-MM-DD or empty
      if (selectedDate) {
        // Try remote per-date file
        const remote = await loadRemotePapers(selectedDate);
        if (remote && remote.length) {
          const mapped = remote.map((p) => ({
            title: p.title || 'No title',
            desc: p.desc || p.abstract || '',
            authors: p.authors || '',
            url: p.url || '',
          }));
          renderCards(mapped);
        } else {
          // No data for date: clear to sentinel only
          renderCards([]);
        }
      } else {
        alert('Please select a valid date.');
      }
    });
  }

  // Simple HTML-escape to avoid injection from titles
  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[&<>"']/g, function(m) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m];
    });
  }
});
