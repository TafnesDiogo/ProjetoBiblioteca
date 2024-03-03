const table = document.getElementById('tableLivros');
const tableBody = table.querySelector('tbody');

function updateBooksList() {
    fetch('http://127.0.0.1:5000/livros')
    .then((response) => response.json())
    .then((data) => {
        data.sort((a, b) => a.id < b.id);

        for (const livro of data) {
            generateRow(livro);
        }
    })
    .catch(console.error);
}

function generateRow(livro) {
    const row = document.createElement('tr');
    const iconData = document.createElement('td');
    const idData = document.createElement('th');
    idData.setAttribute('scope', 'row');
    if (livro.id != null) {
        row.appendChild(idData).textContent = livro.id;
    } else {
        const lastBook = parseInt(tableBody.lastChild.querySelector('th').innerText);
        row.appendChild(idData).textContent = lastBook + 1;
    }
    row.appendChild(document.createElement('td')).textContent = livro.titulo;
    row.appendChild(document.createElement('td')).textContent = livro.autor;
    row.appendChild(document.createElement('td')).textContent = livro.ano_publicacao;
    row.appendChild(document.createElement('td')).textContent = livro.genero;
    row.appendChild(iconData);
    tableBody.appendChild(row);
}

document.addEventListener('DOMContentLoaded', () => {
    updateBooksList();
});