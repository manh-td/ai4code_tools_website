const yearInput = UseBootstrapTag(document.getElementById("years"));
const keywordInput = UseBootstrapTag(document.getElementById("keywords"));

let papers = [];
let filteredPapers = [];

const pageSize = 20; // Number of papers per page
let currentPage = 1; // Current page number

fetch(
    "https://raw.githubusercontent.com/AI4Code-HUST/conf-crawler/refs/heads/main/outputs/papers.jsonl"
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
        console.log(filteredPapers);
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
    return papers
        .map((paper, index) => {
            // Check if 'paper' is null or undefined
            if (!paper) {
                console.warn(`Paper at index ${index} is ${paper}`);
                return null;
            }

            // Check if 'paper.conference' exists and is a string
            if (typeof paper.conference !== 'string') {
                console.warn(`'conference' property at index ${index} is not a string:`, paper.conference);
                return null;
            }

            // Extract the year from the conference string using a regular expression
            const conferenceMatch = paper.conference.match(/\d{4}/);
            if (!conferenceMatch) {
                console.warn(`No 4-digit year found in 'conference' property at index ${index}:`, paper.conference);
            }
            const conferenceYear = conferenceMatch ? conferenceMatch[0] : null;

            // Check if the paper's conference year matches any of the selected years
            const yearMatch =
                selectedYears.length === 0 ||
                (conferenceYear && selectedYears.includes(conferenceYear));

            // Check if 'paper.paper' exists and is a string
            if (typeof paper.paper !== 'string') {
                console.warn(`'paper' property at index ${index} is not a string:`, paper.paper);
                return null;
            }

            // Find matched keywords in the paper's title
            const matchedKeywords = keywords.filter((keyword) =>
                paper.paper.toLowerCase().includes(keyword.toLowerCase())
            );

            // Check if the paper's title contains any of the keywords
            const keywordMatch = keywords.length === 0 || matchedKeywords.length == keywords.length;

            // Include the paper in the filtered results only if both checks pass
            return yearMatch && keywordMatch
                ? { ...paper, keywords: matchedKeywords.join(", ") }
                : null;
        })
        .filter((paper) => paper !== null); // Remove null values from the array
}


function renderTable(papers) {
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover");

    // Create table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["conference", "paper", "keywords"];
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header.charAt(0).toUpperCase() + header.slice(1);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const paginatedPapers = paginate(papers, pageSize, currentPage);
    paginatedPapers.forEach((paper) => {
        const row = document.createElement("tr");

        const conf = document.createElement("td");
        conf.innerHTML = "<a href='" + paper['conf_url'] + "' target='_blank' >" + paper['conference'] + "</a>";
        row.appendChild(conf);

        const name = document.createElement("td");
        name.innerHTML = "<a href='" + paper['paper_url'] + "' target='_blank' >" + paper['paper'] + "</a>";
        row.appendChild(name);

        const word = document.createElement("td");
        if (paper.keywords && paper.keywords.length > 0) {
            word.textContent = paper.keywords;
        } else {
            word.textContent = "";
        }

        row.appendChild(word);


        tbody.appendChild(row);
    });
    if (papers.length == 0) {
        placeholder = `
            <p class="placeholder-glow">
                <span class="placeholder col-12"></span>
            </p>
        `;

        for (i = 0; i < 5; i++) {
            const row = document.createElement("tr");

            const conf = document.createElement("td");
            conf.innerHTML = placeholder;
            row.appendChild(conf);

            const name = document.createElement("td");
            name.innerHTML = placeholder;
            row.appendChild(name);

            const word = document.createElement("td");
            word.innerHTML = placeholder;
            row.appendChild(word);

            tbody.appendChild(row);
        }
    }
    table.appendChild(tbody);

    // Append the table to the DOM
    const tableContainer = document.getElementById("papersTable");
    tableContainer.innerHTML = ""; // Clear any existing content
    tableContainer.appendChild(table);
}

function paginate(papers, pageSize, pageNumber) {
    const startIndex = (pageNumber - 1) * pageSize;
    return papers.slice(startIndex, startIndex + pageSize);
}

function renderPaginationControls(papers) {
    const paginationContainer = document.getElementById("pagination-controls");
    paginationContainer.innerHTML = ""; // Clear existing controls

    const totalPages = Math.ceil(papers.length / pageSize);

    const numberPages = document.getElementById("total-pages");
    numberPages.innerHTML = "of " + totalPages;

    // Helper function to create page items
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

    // First Page Button
    paginationContainer.appendChild(createPageItem('&laquo;', 1, currentPage === 1));

    // Previous Page Button
    paginationContainer.appendChild(createPageItem('&#8249;', currentPage - 1, currentPage === 1));

    // Page Number Buttons
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    for (let i = start; i <= end; i++) {
        paginationContainer.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    // Next Page Button
    paginationContainer.appendChild(createPageItem('&#8250;', currentPage + 1, currentPage === totalPages));

    // Last Page Button
    paginationContainer.appendChild(createPageItem('&raquo;', totalPages, currentPage === totalPages));
}

function goToPage(pageNumber) {
    const totalPages = Math.ceil(papers.length / pageSize);
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
    updateTable([])
    years = yearInput.getValues();
    words = keywordInput.getValues()
    filteredPapers = filterPapers(papers, years, words);
    console.log(filteredPapers);
    updateTable(filteredPapers);
}

renderTable(papers)
