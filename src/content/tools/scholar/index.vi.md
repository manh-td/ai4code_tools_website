---
title: "Scholar Mails Crawler"
date: 2025-03-02T23:41:22+07:00
draft: false
author: "Đặng Hoàng Long, Trần Đức Mạnh"
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

Được thiết kế để tự động thu thập các bài báo học thuật từ Google Scholar thông qua email. Bằng cách phân tích các email cảnh báo, dự án này thu thập siêu dữ liệu như tiêu đề bài báo và liên kết của chúng để giúp các nhà nghiên cứu cập nhật các ấn phẩm mới nhất trong lĩnh vực của họ.

---

<div>
    <div class="d-flex justify-content-end pb-1">
        <div class="dropdown">
            <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="datePickerDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Chọn ngày
            </button>
            <div class="dropdown-menu p-3" aria-labelledby="datePickerDropdown">
                <input type="date" class="form-control mb-2" id="selectedDate">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-outline-secondary" id="applyDateFilter">Tìm kiếm</button>
                </div>
            </div>
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
            <span class="input-group-text">Trang</span>
            <input type="number" class="form-control" id="page-number-input" min="1" placeholder="Page #" value="1">
            <span class="input-group-text" id="total-pages">of X</span>
        </div>
    </div>
    {{< include-js path="scholar.js" >}}
</div>