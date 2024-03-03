const form = document.querySelector('.form-signin form');

form.addEventListener('submit', cadastrarUsuario);

function cadastrarUsuario(event) {
    event.preventDefault();

    var formData = new FormData(form);

    var usuario = {};
    for (var pair of formData.entries()) {
        usuario[pair[0]] = pair[1];
    }
    console.log(JSON.stringify(usuario));

    fetch('http://127.0.0.1:5000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(usuario),
    })
    .then(response => response.json())
    .then(data => {
        generateToast(data)
        window.setTimeout(() => {
            window.location.href = "/login";
        }, 7000)
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

function generateToast(message) {
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
        document.querySelector('body main').appendChild(toastContainer);
        console.log(toastContainer);
    });
}