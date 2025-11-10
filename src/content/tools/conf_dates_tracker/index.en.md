---
title: "Conference Dates Tracker"
date: 2025-03-02T12:49:16+07:00
author: "Trung Phong Au, Duc Manh Tran"
draft: false
githubURL: "https://github.com/AI4Code-HUST/conference-date-tracker"
---

# Conference Dates Tracker 

A tool that scrapes conference events from [conf.researchr.org](https://conf.researchr.org), filters them based on the user's needs, and daily updates user Google Calendar via GitHub Actions and emails.

---


<div>
    <div class="filter-container">
        <div class="mb-3">
            <label for="conferenceDropdown" class="form-label">Conference</label>
            <select id="conferenceDropdown" class="form-select">
                <option value="">Select Conference</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="trackDropdown" class="form-label">Track</label>
            <select id="trackDropdown" class="form-select">
                <option value="">Select Track</option>
            </select>
        </div>
        <button id="applyFilterButton" class="btn btn-primary">Apply Filter</button>
    </div>
    <div id="conferenceEventDateTable" class="pb-1"></div>
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
    {{< include-js path="event_dates.js" >}}
</div>
