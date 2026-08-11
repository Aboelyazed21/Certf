document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Dark / Light Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const userTheme = localStorage.getItem('theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', userTheme);

    themeToggle.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 2. Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.cert-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const filter = e.target.getAttribute('data-filter');

            cards.forEach(card => {
                const provider = card.getAttribute('data-provider');
                if (filter === 'all' || provider === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Sorting Logic (Newest / Oldest)
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.getElementById('certificatesGrid');

    sortSelect.addEventListener('change', () => {
        const cardsArray = Array.from(cards);
        
        cardsArray.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            
            return sortSelect.value === 'newest' ? dateB - dateA : dateA - dateB;
        });

        cardsArray.forEach(card => grid.appendChild(card));
    });

    // 4. Grid vs List View Toggle
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');

    gridViewBtn.addEventListener('click', () => {
        grid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        grid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    // 5. Modal Popup View
    const modal = document.getElementById('certModal');
    const modalBody = document.getElementById('modalBody');
    const closeBtn = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.cert-card');
            const imgSrc = card.querySelector('img').src;
            const title = card.querySelector('.card-title').innerText;
            const provider = card.querySelector('.card-provider').innerText;
            const date = card.querySelector('.card-date').innerText;
            const desc = card.querySelector('.card-desc') ? card.querySelector('.card-desc').innerText : "شهادة معتمدة تعكس إتقان المهارات التقنية.";

            modalBody.innerHTML = `
                <img src="${imgSrc}" alt="${title}">
                <h2>${title}</h2>
                <div class="modal-info">
                    <span><strong>Provider:</strong> ${provider}</span>
                    <span><strong>Date:</strong> ${date}</span>
                </div>
                <p class="modal-desc">${desc}</p>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape") closeModal();
    });

    // 6. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
