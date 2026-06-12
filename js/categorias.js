class ProductFactory {
    static createProduct(prod) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="image-container">
                <div class="price-tag">${prod.precio}</div>
                <img src="${prod.imagen}" alt="${prod.titulo}" class="product-img">
                <div class="delivery-banner">${prod.delivery}</div>
            </div>
            <div class="info-section">
                <div class="header-row">
                    <h1>${prod.titulo}</h1>
                    <a href="#" class="agregar-carrito order-link" data-id="${prod.id}">Order Now 🛒</a>
                </div>
                <div class="tags-container">
                    ${prod.tags ? prod.tags.map(tag => `<div class="tag">${tag}</div>`).join('') : ''}
                </div>
            </div>
        `;
        return card;
    }
}


class Node { constructor(data){this.data=data;this.next=null;} }
class LinkedList {
    constructor(){this.head=null;this.size=0;}
    add(data){const n=new Node(data);if(!this.head)this.head=n;else{let c=this.head;while(c.next)c=c.next;c.next=n;}this.size++;}
    remove(id){if(!this.head)return;if(this.head.data.id==id){this.head=this.head.next;this.size--;return;}let c=this.head;while(c.next){if(c.next.data.id==id){c.next=c.next.next;this.size--;return;}c=c.next;}}
    clear(){this.head=null;this.size=0;}
    toArray(){const arr=[];let c=this.head;while(c){arr.push(c.data);c=c.next;}return arr;}
}

let cart = new LinkedList();


function comprarElemento(e) {
    if (!e.target.classList.contains('agregar-carrito')) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    const elemento = e.target.closest('.card') || e.target.closest('.product');
    if (!elemento) return;

    const precioEl = elemento.querySelector('.price-tag') || elemento.querySelector('.precio');
    const tituloEl = elemento.querySelector('h1') || elemento.querySelector('h3');
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
        row.innerHTML = `<td><img src="${item.imagen}" width="80"></td><td>${item.titulo}</td><td>${item.precio}</td><td><a href="#" class="borrar" data-id="${item.id}">×</a></td>`;
        lista.appendChild(row);
    });
    localStorage.setItem('productosCarrito', JSON.stringify(cart.toArray()));
}

function vaciarCarrito(e) { if(e)e.preventDefault(); cart.clear(); actualizarCarrito(); }
function abrirCheckout(e) { e.preventDefault(); if(cart.size===0)return alert('Carrito vacío'); document.getElementById('checkout-panel').style.display='block'; abrirDrawer(); }

function eliminarElemento(e) {
    if(!e.target.classList.contains('borrar')) return;
    e.preventDefault();
    cart.remove(e.target.getAttribute('data-id'));
    actualizarCarrito();
}

function abrirDrawer() {
    document.getElementById('cart-drawer').classList.add('open');
    document.getElementById('cart-overlay').classList.add('active');
}

function cerrarDrawer() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('active');
}

async function cargarProductos() {
    try {
        const respuesta = await fetch('../data/data.json');
        const productos = await respuesta.json();
        const contenedor = document.getElementById('contenedor-productos');
        if (!contenedor) return;

        contenedor.innerHTML = '';

        productos.forEach(prod => {
            contenedor.appendChild(ProductFactory.createProduct(prod));
        });

        contenedor.querySelectorAll('.agregar-carrito').forEach(btn => {
            btn.addEventListener('click', comprarElemento);
        });

        activarBuscadorLineal();
        activarOrdenamientoBurbuja();
        cargarBusquedaGuardada();

        console.log('✅ Productos cargados');
    } catch (error) {
        console.error('Error:', error);
    }
}

function activarBuscadorLineal() {
    const inputBusqueda = document.getElementById('input-busqueda');
    if (!inputBusqueda) return;

    inputBusqueda.addEventListener('input', (e) => {
        const textoUsuario = e.target.value.toLowerCase();
        localStorage.setItem('ultimaBusqueda', textoUsuario);

        const tarjetas = document.querySelectorAll('#contenedor-productos .card');
        tarjetas.forEach(tarjeta => {
            const tituloPostre = tarjeta.querySelector('h1').textContent.toLowerCase();
            tarjeta.style.display = tituloPostre.includes(textoUsuario) ? "" : "none";
        });
    });
}

function activarOrdenamientoBurbuja() {
    const selectOrden = document.getElementById('select-orden');
    if (!selectOrden) return;

    selectOrden.addEventListener('change', (e) => {
        if (e.target.value !== 'precio-asc') return;

        const contenedor = document.getElementById('contenedor-productos');
        let tarjetas = Array.from(document.querySelectorAll('#contenedor-productos .card'));

        for (let i = 0; i < tarjetas.length; i++) {
            for (let j = 0; j < tarjetas.length - 1 - i; j++) {
                const precioActual = parseFloat(tarjetas[j].querySelector('.price-tag').textContent.replace('$', '').replace('.', '')) || 0;
                const precioSiguiente = parseFloat(tarjetas[j + 1].querySelector('.price-tag').textContent.replace('$', '').replace('.', '')) || 0;

                if (precioActual > precioSiguiente) {
                    [tarjetas[j], tarjetas[j + 1]] = [tarjetas[j + 1], tarjetas[j]];
                }
            }
        }
        tarjetas.forEach(tarjeta => contenedor.appendChild(tarjeta));
    });
}

function cargarBusquedaGuardada() {
    const inputBusqueda = document.getElementById('input-busqueda');
    const busquedaGuardada = localStorage.getItem('ultimaBusqueda');
    if (!busquedaGuardada || !inputBusqueda) return;

    inputBusqueda.value = busquedaGuardada;

    const tarjetas = document.querySelectorAll('#contenedor-productos .card');
    tarjetas.forEach(tarjeta => {
        const tituloPostre = tarjeta.querySelector('h1').textContent.toLowerCase();
        tarjeta.style.display = tituloPostre.includes(busquedaGuardada) ? "" : "none";
    });
}




document.addEventListener('DOMContentLoaded', () => {
    
    document.addEventListener('click', comprarElemento);
    document.addEventListener('click', eliminarElemento);

    // Botones del carrito
    document.getElementById('open-cart')?.addEventListener('click', abrirDrawer);
    document.getElementById('close-cart')?.addEventListener('click', cerrarDrawer);
    document.getElementById('cart-overlay')?.addEventListener('click', cerrarDrawer);
    document.getElementById('vaciar-carrito')?.addEventListener('click', vaciarCarrito);
    document.getElementById('procesar-compra')?.addEventListener('click', abrirCheckout);

   

    
    const saved = localStorage.getItem('productosCarrito');
    if (saved) {
        JSON.parse(saved).forEach(item => cart.add(item));
        actualizarCarrito();
    }

    console.log('✅ Todo funcional - Carrito + Productos');
});

console.log('✅ categorias.js definitiva lista');