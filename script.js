document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Smooth Cursor
    const dot = document.querySelector('.cursor-dot');
    const outline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 300, fill: "forwards" });
    });

    const interactives = document.querySelectorAll('button, a, input, .cert-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => { 
            outline.style.transform = 'translate(-50%, -50%) scale(1.5)'; 
            outline.style.borderColor = 'rgba(34, 211, 238, 0.5)';
            outline.style.backgroundColor = 'rgba(34, 211, 238, 0.1)'; 
        });
        el.addEventListener('mouseleave', () => { 
            outline.style.transform = 'translate(-50%, -50%) scale(1)'; 
            outline.style.borderColor = 'var(--secondary)';
            outline.style.backgroundColor = 'transparent'; 
        });
    });

    // 2. Premium Loading Screen
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.visibility = 'hidden';
            startTypingEffect();
            initScrollReveal();
            runCounters();
        }, 800);
    }, 1500);

    // 3. Typing Effect
    const subtitleText = "A curated collection of my professional certifications, showcasing a relentless pursuit of knowledge in Computer Science, UI/UX, and AI.";
    const typeTarget = document.getElementById('typewriter-text');
    let charIndex = 0;
    function startTypingEffect() {
        if (charIndex < subtitleText.length) {
            typeTarget.textContent += subtitleText.charAt(charIndex);
            charIndex++;
            setTimeout(startTypingEffect, 25);
        }
    }

    // 4. Mouse Spotlight Effect for Cards (The Awwwards Touch)
    document.getElementById('certificatesGrid').onmousemove = e => {
        for(const card of document.getElementsByClassName('cert-card')) {
            const rect = card.getBoundingClientRect(),
                  x = e.clientX - rect.left,
                  y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    };

    // 5. Scroll Progress & Scroll To Action
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

    // 6. Advanced Scroll Reveal
    function initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Reveal only once for performance
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
        
        reveals.forEach(reveal => observer.observe(reveal));
    }

    // 7. Animated Counters
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

    // 8. Dynamic Search & Filtering with Animations
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
                card.style.transform = 'scale(0.95) translateY(20px)';
                setTimeout(() => {
                    if(card.style.opacity === '0') card.style.display = 'none';
                }, 400); // Wait for transition
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

    // 9. Fullscreen Elegant Modal
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
                    <span><strong style="color:#fff;">Provider:</strong> ${provider}</span>
                    <span><strong style="color:#fff;">Date:</strong> ${date}</span>
                </div>
                <p class="modal-desc">${desc}</p>
                <div class="card-tags" style="margin-bottom: 0;">
                    ${tagsHtml}
                </div>
            `;
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
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