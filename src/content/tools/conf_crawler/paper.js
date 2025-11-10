const yearInput = UseBootstrapTag(document.getElementById("years"));
const keywordInput = UseBootstrapTag(document.getElementById("keywords"));

let papers = [];
let filteredPapers = [];

const pageSize = 20;
let currentPage = 1;

fetch(
    "https://raw.githubusercontent.com/manh-td/conference-links/refs/heads/main/results.jsonl"
)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.text();
    })
    .then((text) => {
        papers = text
            .trim()
            .split("\n")
            .map((line) => JSON.parse(line));

        filteredPapers = papers;
        updateTable(filteredPapers);

        const pageNumberInput = document.getElementById("page-number-input");
        pageNumberInput.addEventListener("change", () => {
            const pageNumber = parseInt(pageNumberInput.value, 10);
            if (!isNaN(pageNumber)) {
                goToPage(pageNumber);
            } else {
                alert("Please enter a valid page number.");
            }
        });

        const saveFilterButton = document.getElementById("paperFilterButton");
        saveFilterButton.addEventListener("click", saveFilter);
    });

function filterPapers(papers, selectedYears, keywords) {
    return papers.filter((paper) => {
        const yearMatch =
            selectedYears.length === 0 || selectedYears.includes(paper.year);

        const keywordMatch =
            keywords.length === 0 ||
            keywords.some((kw) =>
                (paper.conference + " " + paper.links.join(" "))
                    .toLowerCase()
                    .includes(kw.toLowerCase())
            );

        return yearMatch && keywordMatch;
    });
}

function renderTable(papers) {
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover");

    // Headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Year", "Conference", "Links"].forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const paginatedPapers = paginate(papers, pageSize, currentPage);

    if (paginatedPapers.length === 0) {
        const row = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 3;
        td.textContent = "No results found.";
        td.classList.add("text-center");
        row.appendChild(td);
        tbody.appendChild(row);
    } else {
        paginatedPapers.forEach((paper) => {
            const row = document.createElement("tr");

            const yearCell = document.createElement("td");
            yearCell.textContent = paper.year;
            row.appendChild(yearCell);

            const confCell = document.createElement("td");
            confCell.textContent = paper.conference;
            row.appendChild(confCell);

            const linksCell = document.createElement("td");
            const linkList = paper.links
                .map(
                    (url) =>
                        `<a href="${url}" target="_blank">${url}</a>`
                )
                .join("<br>");
            linksCell.innerHTML = linkList;
            row.appendChild(linksCell);

            tbody.appendChild(row);
        });
    }

    table.appendChild(tbody);

    const tableContainer = document.getElementById("papersTable");
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
}

function paginate(papers, pageSize, pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize;
    return papers.slice(startIndex, startIndex + pageSize);
}

function renderPaginationControls(papers) {
    const paginationContainer = document.getElementById("pagination-controls");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(papers.length / pageSize);
    const numberPages = document.getElementById("total-pages");
    numberPages.innerHTML = "of " + totalPages;

    function createPageItem(label, page, disabled = false, active = false) {
        const listItem = document.createElement("li");
        listItem.className = `page-item${active ? ' active' : ''}${disabled ? ' disabled' : ''}`;

        const link = document.createElement("a");
        link.className = "page-link";
        link.href = "#";
        link.innerHTML = label;
        link.addEventListener("click", (event) => {
            event.preventDefault();
            if (!disabled && page !== currentPage) {
                currentPage = page;
                updateTable(papers);
            }
        });

        listItem.appendChild(link);
        return listItem;
    }

    paginationContainer.appendChild(createPageItem('&laquo;', 1, currentPage === 1));
    paginationContainer.appendChild(createPageItem('&#8249;', currentPage - 1, currentPage === 1));

    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    for (let i = start; i <= end; i++) {
        paginationContainer.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    paginationContainer.appendChild(createPageItem('&#8250;', currentPage + 1, currentPage === totalPages));
    paginationContainer.appendChild(createPageItem('&raquo;', totalPages, currentPage === totalPages));
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(filteredPapers.length / pageSize);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        currentPage = pageNumber;
        updateTable(filteredPapers);
    } else {
        alert(`Please enter a valid page number between 1 and ${totalPages}.`);
    }
}

function updateTable(papers) {
    renderTable(papers);
    renderPaginationControls(papers);
}

function saveFilter() {
    updateTable([]);
    const years = yearInput.getValues();
    const words = keywordInput.getValues();
    filteredPapers = filterPapers(papers, years, words);
    currentPage = 1;
    updateTable(filteredPapers);
}

// Initial render (empty placeholder)
renderTable([]);
