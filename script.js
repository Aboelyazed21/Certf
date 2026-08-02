document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Clean Loading Screen
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            startTypingEffect();
            initScrollReveal();
            runCounters();
        }, 500);
    }, 1200);

    // 2. Typing Effect
    const subtitleText = "A curated collection of my professional certifications, showcasing a relentless pursuit of knowledge in Computer Science, UI/UX, and AI.";
    const typeTarget = document.getElementById('typewriter-text');
    let charIndex = 0;
    function startTypingEffect() {
        if (charIndex < subtitleText.length) {
            typeTarget.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingEffect, 20);
        }
    }

    // 3. Scroll Progress & Scroll To Action
    document.getElementById('exploreBtn').addEventListener('click', () => {
        document.getElementById('portfolio').scrollIntoView({behavior: 'smooth'});
    });

    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (winScroll / height) * 100 + "%";
        
        if (winScroll > 600) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    });
    
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // 4. Scroll Reveal
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        
        reveals.forEach(reveal => observer.observe(reveal));
    }

    // 5. Animated Counters
    let countersRun = false;
    function runCounters() {
        if(countersRun) return;
        document.querySelectorAll('.counter').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const speed = 150;
            const updateCount = () => {
                const count = +counter.innerText;
                const inc = target / speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target + (target > 50 ? '+' : '');
                }
            };
            updateCount();
        });
        countersRun = true;
    }

    // 6. Dynamic Search & Filtering
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.cert-card');

    function filterCards() {
        const query = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        cards.forEach(card => {
            const title = card.querySelector('.card-title').innerText.toLowerCase();
            const providerText = card.querySelector('.card-provider').innerText.toLowerCase();
            const tags = card.querySelector('.card-tags').innerText.toLowerCase();
            const filterAttr = card.getAttribute('data-provider');
            
            const matchesSearch = title.includes(query) || providerText.includes(query) || tags.includes(query);
            const matchesFilter = activeFilter === 'all' || filterAttr.includes(activeFilter);

            if(matchesSearch && matchesFilter) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1) translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                setTimeout(() => {
                    if(card.style.opacity === '0') card.style.display = 'none';
                }, 300);
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterCards();
        });
    });
    searchInput.addEventListener('input', filterCards);

    // 7. Clean Modal
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
            const desc = card.querySelector('.card-desc').innerText;
            const tagsHtml = card.querySelector('.card-tags').innerHTML;

            modalBody.innerHTML = `
                <img src="${imgSrc}" alt="${title}">
                <h2>${title}</h2>
                <div class="modal-info">
                    <span><strong>Provider:</strong> ${provider}</span>
                    <span><strong>Date:</strong> ${date}</span>
                </div>
                <p class="modal-desc">${desc}</p>
                <div class="card-tags" style="margin-bottom: 0;">
                    ${tagsHtml}
                </div>
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
        if(e.key === "Escape" && modal.classList.contains('active')) closeModal();
    });
});
