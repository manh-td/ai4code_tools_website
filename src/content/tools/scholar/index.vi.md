---
title: "Scholar Mails Crawler"
date: 2025-03-02T23:41:22+07:00
draft: false
author: "Hoang Long Dang, Duc Manh Tran"
js:
  [
    "https://cdn.jsdelivr.net/npm/use-bootstrap-tag@2.2.2/dist/use-bootstrap-tag.min.js",
    "https://unpkg.com/gridjs/dist/gridjs.umd.js"
  ]
css:
  [
    "https://cdn.jsdelivr.net/npm/use-bootstrap-tag@2.2.2/dist/use-bootstrap-tag.min.css",
    "https://unpkg.com/gridjs/dist/theme/mermaid.min.css"
  ]
githubURL: "https://github.com/AI4Code-HUST/scholar_alters"
---

# Scholar Mails Crawler

Nhấn `Pass` để bỏ qua bài báo này và chuyển sang bài tiếp theo.  
Nhấn `Interesting` *(giữ `Ctrl`/`Command` để vẫn ở lại trang này)* nếu bạn quan tâm và muốn đọc bài báo.

---

<style>
.tinder { max-width: 760px; margin: 1.5rem auto; }
.tinder-stack { position: relative; height: 420px; }
.card { position: absolute; width: 100%; height: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.12); border-radius: 10px; background: #fff; padding: 1rem; box-sizing: border-box; display: flex; gap: 1rem; align-items: stretch; }
.card { transition: transform .28s ease, opacity .28s ease; }
.card img, .thumb { width: 220px; height: 100%; border-radius: 8px; object-fit: cover; flex: 0 0 220px; }
.card .content { flex: 1 1 auto; display:flex; flex-direction:column; }
.card h3 { margin: 0 0 .5rem 0; font-size:1.25rem; }
.card p { margin: 0 0 .75rem 0; color: #444; }
.card .meta { margin-top: auto; color: #777; font-size: .9rem; }
.actions { margin-top: .75rem; display:flex; gap:.5rem; }
.actions button { flex:1; padding:.5rem .6rem; border-radius:6px; border:0; cursor:default; font-weight:600; }
.pass { background:#f5f5f6; color:#333 }
.interesting { background:#0ea5a0; color:#fff }
.gone-left { transform: translateX(-120%) rotate(-10deg) !important; opacity: 0 !important; }
.gone-right { transform: translateX(120%) rotate(10deg) !important; opacity: 0 !important; }
</style>

<div>
    <div class="d-flex justify-content-end pb-1">
        <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="datePickerDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Select Date
            </button>
            <div class="dropdown-menu p-3" aria-labelledby="datePickerDropdown">
                <input type="date" class="form-control mb-2" id="selectedDate">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-secondary" id="applyDateFilter">Apply</button>
                </div>
            </div>
        </div>
    </div>
    <div class="tinder">
      <!-- Empty stack: cards will be injected here by `index.js` -->
      <div class="tinder-stack js-fill-cards"></div>
      {{< include-js path="index.js" >}}
    </div>
</div>