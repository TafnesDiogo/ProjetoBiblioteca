import Table from "../tables/Table";

const bookTable = document.getElementById('tableLivros');
const sortBtns = extintoresTable.querySelectorAll('thead th button.sort');

const table = new Table(bookTable);

document.addEventListener("DOMContentLoaded", function() {
    sortBtns.forEach((btn, i) => {
        table.cols[i].registerSortButton(btn);
    });
});
