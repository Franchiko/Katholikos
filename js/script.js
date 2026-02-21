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

    /* ============================================
       Generar stream-style cards dinámicamente
       ============================================ */
    let reviewsData = {};

    // Cargar reseñas desde JSON externo
    fetch('./data/reviews.json')
        .then(response => response.json())
        .then(data => {
            reviewsData = data.reviews || {};
            generateStreamCards();
        })
        .catch(error => {
            console.warn('No se pudieron cargar las reseñas:', error);
            generateStreamCards();
        });

    function generateStreamCards() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            const titleEl = card.querySelector('.title-movie');
            const iframe = card.querySelector('iframe');
            if (!titleEl || !iframe) return;

            // Crear contenedores
            const streamCard = document.createElement('div');
            streamCard.className = 'stream-card';

            const streamVideo = document.createElement('div');
            streamVideo.className = 'stream-video';

            // Clonar iframe para usar dentro del layout (no mover original to keep fallback)
            const iframeClone = iframe.cloneNode(true);
            // Remove width/height attributes to let CSS control size
            iframeClone.removeAttribute('width');
            iframeClone.removeAttribute('height');
            streamVideo.appendChild(iframeClone);

            const streamInfo = document.createElement('div');
            streamInfo.className = 'stream-info';

            // Título (mantener solo título dentro de la card)
            const h2 = document.createElement('h2');
            h2.className = 'title-movie';
            h2.textContent = titleEl.textContent.trim();

            // Reseña: cargar desde datos externos
            const p = document.createElement('p');
            p.className = 'review';
            const key = titleEl.textContent.trim();
            p.textContent = reviewsData[key] || 'Breve reseña disponible próximamente.';

            const playBtn = document.createElement('button');
            playBtn.className = 'play-btn';
            playBtn.textContent = 'Play';

            // Extraer src original para abrir en modal (asegurarse de incluir autoplay)
            const src = iframe.getAttribute('src') || iframeClone.getAttribute('src');
            playBtn.dataset.src = src;

            streamInfo.appendChild(h2);
            streamInfo.appendChild(p);
            streamInfo.appendChild(playBtn);

            streamCard.appendChild(streamVideo);
            streamCard.appendChild(streamInfo);

            // Reemplazar contenido de .card por streamCard (solo título dentro card solicitado)
            card.innerHTML = '';
            card.appendChild(streamCard);
        });

        // Añadir modal al documento
        createVideoModal();

        // Delegación de eventos para botones Play
        document.body.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('play-btn')) {
                const src = e.target.dataset.src || '';
                openVideoModal(src);
            }
            if (e.target && e.target.classList.contains('modal-close')) {
                closeVideoModal();
            }
            if (e.target && e.target.classList.contains('video-modal-overlay')) {
                closeVideoModal();
            }
        });
    }

    function createVideoModal() {
        if (document.querySelector('.video-modal-overlay')) return;
        const overlay = document.createElement('div');
        overlay.className = 'video-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'video-modal';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.textContent = 'Cerrar';

        modal.appendChild(closeBtn);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    }

    function openVideoModal(src) {
        const overlay = document.querySelector('.video-modal-overlay');
        const modal = overlay.querySelector('.video-modal');
        // Remove old iframe
        const oldIframe = modal.querySelector('iframe');
        if (oldIframe) oldIframe.remove();

        // Ensure autoplay param
        let url = src || '';
        if (url.indexOf('autoplay=1') === -1) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1&controls=1&rel=0&modestbranding=1';
        }

        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', url);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');

        modal.appendChild(iframe);
        overlay.classList.add('active');
    }

    function closeVideoModal() {
        const overlay = document.querySelector('.video-modal-overlay');
        if (!overlay) return;
        const modal = overlay.querySelector('.video-modal');
        const iframe = modal.querySelector('iframe');
        if (iframe) iframe.remove();
        overlay.classList.remove('active');
    }

    // Ejecutar transformación
    generateStreamCards();

    // --------------------------------------------
    // Ocultar títulos de YouTube y añadir máscara
    // --------------------------------------------
    function injectYtpHideStyles() {
        if (document.getElementById('ytp-hide-styles')) return;
        const style = document.createElement('style');
        style.id = 'ytp-hide-styles';
        style.textContent = '\n            .ytp-title-text{ display: none !important; }\n            .ytp-title-mask{ position: absolute; top: 0; left: 0; right: 0; height: 58px; background: rgba(0,0,0,1); pointer-events: none; z-index: 9999; border-top-left-radius: 6px; border-top-right-radius: 6px; }\n        ';
        document.head.appendChild(style);
    }

    function addMaskForIframe(iframe) {
        if (!iframe || !(iframe instanceof HTMLIFrameElement)) return;
        const container = iframe.closest('.stream-video') || iframe.parentElement;
        if (!container) return;
        // make sure container is positioned so absolute mask can align
        const pos = getComputedStyle(container).position;
        if (pos === 'static' || !pos) container.style.position = 'relative';
        if (container.querySelector('.ytp-title-mask')) return;
        const mask = document.createElement('div');
        mask.className = 'ytp-title-mask';
        container.appendChild(mask);
    }

    function addMaskForModal() {
        const modal = document.querySelector('.video-modal');
        if (!modal) return;
        const pos = getComputedStyle(modal).position;
        if (pos === 'static' || !pos) modal.style.position = 'relative';
        if (modal.querySelector('.ytp-title-mask')) return;
        const mask = document.createElement('div');
        mask.className = 'ytp-title-mask';
        modal.appendChild(mask);
    }

    function setupYtpMasks() {
        injectYtpHideStyles();
        // Add masks to existing iframes
        document.querySelectorAll('iframe').forEach(ifr => addMaskForIframe(ifr));
        addMaskForModal();

        // Observe for dynamically added iframes
        const observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                m.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'IFRAME') addMaskForIframe(node);
                    else if (node.querySelectorAll) {
                        node.querySelectorAll('iframe').forEach(ifr => addMaskForIframe(ifr));
                    }
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Inicializar
    setupYtpMasks();
});
