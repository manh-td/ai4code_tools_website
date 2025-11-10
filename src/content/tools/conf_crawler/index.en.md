---
title: "Conference & Journal Papers Crawler"
date: 2025-03-02T11:31:51+07:00
author: "Dung Chinh Tran, Duc Manh Tran"
draft: false
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
githubURL: "https://github.com/AI4Code-HUST/conf-crawler"
---

# Conference Links

---

<div>
    <div class="justify-content-end pb-1">
        <button class="btn btn-outline-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#confCrawlerSearch" aria-expanded="false" aria-controls="confCrawlerSearch">
            Filter
        </button>
    </div>
    <div class="collapse pb-1" id="confCrawlerSearch">
        <div class="card card-body">
            {{< tagsInput id="keywords" label="Keywords" >}}
            {{< tagsInput id="years" label="Years" >}}
            <button type="button" class="btn btn-outline-secondary" data-bs-toggle="collapse" data-bs-target="#confCrawlerSearch" aria-expanded="false" aria-controls="confCrawlerSearch" id="paperFilterButton">Save</button>
        </div>
    </div>
    <div id="papersTable" class="pb-1"></div>
    <div class="d-flex flex-row justify-content-center pb-3">
        <nav>
            <ul class="pagination pagination-sm mx-3" id="pagination-controls">
                <!-- Pagination buttons will be dynamically inserted here -->
            </ul>
        </nav>
        <div class="input-group input-group-sm ml-2 pb-3" style="width: 13em;">
            <span class="input-group-text">Page</span>
            <input type="number" class="form-control" id="page-number-input" min="1" placeholder="Page #" value="1">
            <span class="input-group-text" id="total-pages">of X</span>
        </div>
    </div>
    {{< include-js path="paper.js" >}}
</div>