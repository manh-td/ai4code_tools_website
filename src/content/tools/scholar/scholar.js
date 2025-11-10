let papers = [];
let filteredPapers = [];

const pageSize = 20; // Number of papers per page
let currentPage = 1; // Current page number

const defaultURL = "https://raw.githubusercontent.com/AI4Code-HUST/scholar_alters/master/data/papers.jsonl";

function fetchData(url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Data not found");
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
        })
        .catch(() => {
            papers = [];
            filteredPapers = [];
            updateTable(filteredPapers); // Display nothing if data is not found
        });
}

// Load default data
fetchData(defaultURL);

// Event listener for the date picker
const datePicker = document.getElementById("selectedDate");
const applyDateFilter = document.getElementById("applyDateFilter");

applyDateFilter.addEventListener("click", () => {
    const selectedDate = datePicker.value; // Get the selected date
    if (selectedDate) {
        const formattedDate = selectedDate; // Format: YYYY-MM-DD
        const dateURL = `https://raw.githubusercontent.com/AI4Code-HUST/scholar_alters/master/data/${formattedDate}.jsonl`;
        fetchData(dateURL); // Fetch data for the selected date
    } else {
        alert("Please select a valid date.");
    }
});

function renderTable(papers) {
    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover");

    // Create table headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Topic", "Branch", "Paper", "Related to"];
    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");
    const paginatedPapers = paginate(papers, pageSize, currentPage);
    paginatedPapers.forEach((paper) => {
        const row = document.createElement("tr");

        const topicCell = document.createElement("td");
        topicCell.textContent = paper.first_label ? paper.first_label.join(", ") : "";
        row.appendChild(topicCell);

        const branchCell = document.createElement("td");
        branchCell.textContent = paper.second_label ? paper.second_label.join(", ") : "";
        row.appendChild(branchCell);

        const paperCell = document.createElement("td");
        paperCell.innerHTML = `<a href="${paper.link}" target="_blank">${paper.title}</a>`;
        row.appendChild(paperCell);

        const authorCell = document.createElement("td");
        authorCell.textContent = paper.author ? paper.author.join(", ") : "";
        row.appendChild(authorCell);

        tbody.appendChild(row);
    });

    if (papers.length === 0) {
        const placeholderRow = document.createElement("tr");
        const placeholderCell = document.createElement("td");
        placeholderCell.colSpan = 4;
        placeholderCell.textContent = "No data available for the selected date.";
        placeholderCell.classList.add("text-center");
        placeholderRow.appendChild(placeholderCell);
        tbody.appendChild(placeholderRow);
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
        listItem.className = `page-item${active ? " active" : ""}${disabled ? " disabled" : ""}`;

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
    paginationContainer.appendChild(createPageItem("&laquo;", 1, currentPage === 1));

    // Previous Page Button
    paginationContainer.appendChild(createPageItem("&#8249;", currentPage - 1, currentPage === 1));

    // Page Number Buttons
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 1, totalPages);
    for (let i = start; i <= end; i++) {
        paginationContainer.appendChild(createPageItem(i, i, false, i === currentPage));
    }

    // Next Page Button
    paginationContainer.appendChild(createPageItem("&#8250;", currentPage + 1, currentPage === totalPages));

    // Last Page Button
    paginationContainer.appendChild(createPageItem("&raquo;", totalPages, currentPage === totalPages));
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

renderTable(papers);