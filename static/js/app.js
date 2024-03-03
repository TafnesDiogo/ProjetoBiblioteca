const form = document.getElementById('cadastrarLivro');
const table = document.getElementById('tableLivros');
const tableBody = table.querySelector('tbody');
var editBtns = table.querySelectorAll('td:last-child span.material-symbols-outlined.edit');
var deleteBtns = table.querySelectorAll('td:last-child span.material-symbols-outlined.delete');
console.log(editBtns)
editBtns.forEach(btn => btn.addEventListener('click', atualizarLivro));
deleteBtns.forEach(btn => btn.addEventListener('click', deletarLivro));

form.addEventListener('submit', cadastrarLivro);

function cadastrarLivro(event) {
    event.preventDefault();

    var formData = new FormData(form);

    var livro = {};
    for (var pair of formData.entries()) {
        livro[pair[0]] = pair[0] != 'ano_publicacao' ? pair[1] : parseInt(pair[1]);
    }

    fetch('http://127.0.0.1:5000/livro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(livro),
    })
    .then(response => response.json())
    .then(data => {
        generateRow(livro);
        generateToast(data.mensagem, 10);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
    
    closeModal();
}

function closeModal() {
    window.requestAnimationFrame(() => {
        const modal = document.querySelector('div#cadastrar-livro.modal.show button.btn-close');
        form.reset();
        modal.click();
    });
}

function reloadBooksList() {
    window.requestAnimationFrame(() => {
        const tbody = table.querySelector('tbody');
        table.removeChild(tbody);
        table.appendChild(document.createElement('tbody'));
        updateBooksList();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateBooksList();
});

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

function createIcon(text) {
    const icon = document.createElement('span');
    icon.classList.add(...['material-symbols-outlined', text, 'user-select-none']);
    icon.textContent = text;
    return icon;
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
    iconData.appendChild(createIcon('edit'));
    iconData.appendChild(createIcon('delete'));
    row.appendChild(iconData);
    tableBody.appendChild(row);
}

function generateToast(message, countdown = null) {
    window.requestAnimationFrame(() => {
        const toast = document.createElement('div');
        const dflex = document.createElement('div');
        const btn = document.createElement('button');
        const toastContainer = document.createElement('div');
        toastContainer.classList.add(...['toast', 'align-items-center', 'text-bg-primary', 'border-0']);
        toastContainer.setAttribute('role', 'alert');
        toastContainer.setAttribute('aria-live', 'assertive');
        toastContainer.setAttribute('aria-atomic', 'true');
        dflex.classList.add('d-flex');
        toast.classList.add('toast-body');
        toast.innerText = message;
        btn.classList.add(...['btn-close', 'btn-close-white', 'me-2', 'm-auto']);
        btn.setAttribute('type', 'button');
        btn.setAttribute('data-bs-dismiss', 'toast');
        btn.setAttribute('aria-label', 'Fechar');

        dflex.appendChild(toast);
        dflex.appendChild(btn);
        toastContainer.appendChild(dflex);
        document.querySelector('body').appendChild(toastContainer);

        if (countdown != null) {
            setTimeout(() => {
                toastContainer.remove();
            }, countdown * 1000);
        }
    });
}

function atualizarLivro(e) {
    console.log('clicado')
    fillForm(e);
}

function deletarLivro(e) {
    const btn = e.target;
    const id = btn.parentElement.parentElement.querySelector('th').innerText;

    fetch('http://127.0.0.1:5000/livro/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
          },
    })
    .then(response => response.json())
    .then(data => {
        tableBody.removeChild(btn.parentElement.parentElement)
        generateToast(data.mensagem, 10);
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function fillForm(e) {
    console.log('preenchendo')
    const btn = e.target;
    const bookInfo = btn.parentElement.parentElement.querySelectorAll('td');
    const id = btn.parentElement.parentElement.querySelector('th').innerText;
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input, i) => {
        const inputName = input.getAttribute('name');
        if (inputName == 'action') {
            input.value = 'edit';
        } else {
            input.value = bookInfo[i];
        }
    });

    var idInput = document.createElement('input');
    idInput.setAttribute('type', 'hidden');
    idInput.value = id;
    form.appendChild(idInput);

    const modalBtn = document.querySelector('main.container > button.btn.btn-primary[data-bs-target=\#cadastrar-livro]')
    console.log(modalBtn);
}