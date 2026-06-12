
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

document.addEventListener('DOMContentLoaded', () => {
    const views = {
        home: document.getElementById('home'),
        dashboard: document.getElementById('dashboard')
    };

    function showView(hash) {
        Object.values(views).forEach(view => view?.classList.remove('active'));

        if (hash === '#dashboard') {
            views.dashboard.classList.add('active');
            setTimeout(() => {
                if (typeof cargarProductos === 'function') cargarProductos();
            }, 100);
        } else {
            views.home.classList.add('active');
        }
    }

    window.addEventListener('hashchange', () => showView(window.location.hash));
    showView(window.location.hash || '#home');

    // Carrusel (mantenido)
    const slides = document.querySelectorAll('.carrusel-item');
    let currentIndex = 0;
    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }
    if (slides.length > 0) setInterval(nextSlide, 4000);

    console.log('✅ SPA + Factory Pattern listo');
});  