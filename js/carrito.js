

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    add(data) {
        const newNode = new Node(data);
        if (!this.head) this.head = newNode;
        else {
            let current = this.head;
            while (current.next) current = current.next;
            current.next = newNode;
        }
        this.size++;
    }

    remove(id) {
        if (!this.head) return;
        if (this.head.data.id == id) {
            this.head = this.head.next;
            this.size--;
            return;
        }
        let current = this.head;
        while (current.next) {
            if (current.next.data.id == id) {
                current.next = current.next.next;
                this.size--;
                return;
            }
            current = current.next;
        }
    }

    clear() {
        this.head = null;
        this.size = 0;
    }

    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.data);
            current = current.next;
        }
        return arr;
    }
}


let cart = new LinkedList();

export function initCarrito() {
    const lista = document.querySelector('#lista-carrito tbody');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const procesarCompraBtn = document.getElementById('procesar-compra');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');

  
    if (openCartBtn) openCartBtn.addEventListener('click', abrirDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', cerrarDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', cerrarDrawer);
    if (vaciarCarritoBtn) vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    if (procesarCompraBtn) procesarCompraBtn.addEventListener('click', abrirCheckout);

    
    window.comprarElemento = comprarElemento;
}

function abrirDrawer() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
}

function cerrarDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}







function comprarElemento(e) {
    if (!e.target.classList.contains('agregar-carrito')) return;
    e.preventDefault();
e.stopPropagation(); 
    const elemento = e.target.closest('.product') || e.target.closest('.card');
    if (!elemento) return;

    leerDatosElemento(elemento);
}






function leerDatosElemento(elemento) {
    const precioEl = elemento.querySelector('.precio') || elemento.querySelector('.price-tag');
    const tituloEl = elemento.querySelector('h3') || elemento.querySelector('h1');

    const info = {
        imagen: elemento.querySelector('img').src,
        titulo: tituloEl ? tituloEl.textContent.trim() : 'Producto',
        precio: precioEl ? precioEl.textContent.trim() : '$0',
        id: Date.now().toString()
    };

    cart.add(info);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.querySelector('#lista-carrito tbody');
    if (!lista) return;

    lista.innerHTML = '';
    cart.toArray().forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.imagen}" width="80"></td>
            <td>${item.titulo}</td>
            <td>${item.precio}</td>
            <td><a href="#" class="borrar" data-id="${item.id}">x</a></td>
        `;
        lista.appendChild(row);
    });

    localStorage.setItem('productosCarrito', JSON.stringify(cart.toArray()));
}

function vaciarCarrito(e) {
    if (e) e.preventDefault();
    cart.clear();
    actualizarCarrito();
}

function abrirCheckout(e) {
    e.preventDefault();
    if (cart.size === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    document.getElementById('checkout-panel').style.display = 'block';
    abrirDrawer();
}

// Cargar carrito guardado
function cargarCarritoLocalStorage() {
    const guardados = localStorage.getItem('productosCarrito');
    if (guardados) {
        JSON.parse(guardados).forEach(item => cart.add(item));
        actualizarCarrito();
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initCarrito();
    cargarCarritoLocalStorage();
});

console.log('✅ Módulo carrito.js cargado');