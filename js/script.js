// ============================================
// CONTROL DE MENU HAMBURGUESA - RESPONSIVE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const listPrincipal = document.querySelector('.list-principal');
    const menuItems = document.querySelectorAll('.list-principal > .list');

    // Crear el botón hamburguesa
    function createHamburgerButton() {
        const nav = document.querySelector('nav');
        
        // Verificar si ya existe
        if (document.getElementById('hamburger-menu')) {
            return;
        }

        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.id = 'hamburger-menu';
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insertar antes del contenedor .Menú (si existe) para no intentar insertar
        // antes de un nodo que no es hijo directo de <nav>.
        const menuContainer = nav.querySelector('.Menú');
        if (menuContainer && menuContainer.parentNode === nav) {
            nav.insertBefore(hamburgerBtn, menuContainer);
        } else {
            nav.appendChild(hamburgerBtn);
        }
    }

    // Mostrar/Ocultar menú
    function toggleMenu() {
        const btn = document.getElementById('hamburger-menu');
        const list = document.querySelector('.list-principal');
        
        if (btn && list) {
            btn.classList.toggle('active');
            list.classList.toggle('active');
        }
    }

    // Cerrar menú al hacer click en un item
    function closeMenuOnItemClick() {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const btn = document.getElementById('hamburger-menu');
                const list = document.querySelector('.list-principal');
                
                if (btn && list) {
                    btn.classList.remove('active');
                    list.classList.remove('active');
                }
            });
        });
    }

    // Manejar cambios de tamaño de ventana
    function handleWindowResize() {
        const btn = document.getElementById('hamburger-menu');
        const list = document.querySelector('.list-principal');

        // Si la pantalla es más grande que 576px (móvil), mostrar menú normalmente
        if (window.innerWidth > 575) {
            // Remover clases de menú móvil
            if (btn) btn.classList.remove('active');
            if (list) list.classList.remove('active');
        }
    }

    // Crear botón hamburguesa en carga
    createHamburgerButton();

    // Agregar evento click al botón hamburguesa
    const hamburgerBtn = document.getElementById('hamburger-menu');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }

    // Cerrar menú al hacer click en items
    closeMenuOnItemClick();

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleWindowResize);
    
    // Llamar al inicio para establecer estado inicial
    handleWindowResize();
});
