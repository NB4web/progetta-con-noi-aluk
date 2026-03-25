document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    /* ======= HERO ANIMATION ======= */
    const heroTl = gsap.timeline({ delay: .3 });
    heroTl.to('[data-gsap="hero"] .hero-line', { y: 0, opacity: 1, duration: 1, stagger: .12, ease: 'power3.out' })
        .to('[data-gsap="hero-sub"]', { y: 0, opacity: 1, duration: .8, stagger: .1, ease: 'power3.out' }, '-=.6');

    /* ======= FADE IN ON SCROLL ======= */
    document.querySelectorAll('[data-gsap="fade"]').forEach(el => {
        gsap.to(el, { y: 0, opacity: 1, duration: .9, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } });
    });

    /* ======= SPLIT ANIMATIONS ======= */
    document.querySelectorAll('[data-gsap="split"]').forEach(el => {
        const left = el.querySelector('.split-left'), right = el.querySelector('.split-right');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' } });
        if (left) tl.to(left, { x: 0, opacity: 1, duration: .9, ease: 'power2.out' }, 0);
        if (right) tl.to(right, { x: 0, opacity: 1, duration: .9, ease: 'power2.out' }, .15);
    });

    /* ======= HORIZONTAL SCROLL PRODUCTS ======= */
    const hTrack = document.querySelector('.hscroll-track'), hWrap = document.querySelector('.hscroll-wrap');
    if (hTrack && hWrap) {
        const getScrollAmount = () => -(hTrack.scrollWidth - hWrap.offsetWidth);
        gsap.to(hTrack, { x: getScrollAmount, ease: 'none', scrollTrigger: { trigger: '#prodotti', start: 'top top', end: () => `+=${Math.abs(getScrollAmount())}`, pin: true, scrub: 1, invalidateOnRefresh: true, } });
    }

    /* ======= STACKED ACCORDION TEXT (VANTAGGI) ======= */
    const stackedTitles = document.querySelectorAll('.stacked-title');
    const stackedDescs = document.querySelectorAll('.stacked-desc');

    if (stackedTitles.length) {
        function calculateStickyTops() {
            // Start sticking below the navbar (approx 80-100px)
            let currentOffset = window.innerWidth > 900 ? 100 : 80;
            
            stackedTitles.forEach(title => {
                title.style.top = currentOffset + 'px';
                currentOffset += title.offsetHeight;
            });
        }

        // Calculate initially and on resize
        calculateStickyTops();
        window.addEventListener('resize', calculateStickyTops);

        // Dim titles when they hit their sticky 'top' limit and become stacked
        stackedTitles.forEach((title) => {
            ScrollTrigger.create({
                trigger: title,
                // Triggers exactly when the title's top hits its sticky offset
                start: () => `top ${title.style.top}`,
                // Stays dimmed until the whole section ends
                endTrigger: '.stacked-container',
                end: 'bottom top',
                toggleClass: { targets: title, className: "is-stacked" }
            });
        });
    }

    /* ======= NAVBAR SCROLL ======= */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 60); });



    /* ======= FAQ ACCORDION ======= */
    document.querySelectorAll('.acc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const body = btn.nextElementSibling;
            document.querySelectorAll('.acc-btn').forEach(other => {
                if (other !== btn && other.classList.contains('active')) {
                    other.classList.remove('active'); other.nextElementSibling.style.maxHeight = null;
                }
            });
            btn.classList.toggle('active');
            body.style.maxHeight = btn.classList.contains('active') ? body.scrollHeight + 'px' : null;
        });
    });

    /* ======= SHOWCASE SLIDER ======= */
    const showcaseTrack = document.getElementById('showcaseTrack');
    const prevBtn = document.getElementById('showcasePrev');
    const nextBtn = document.getElementById('showcaseNext');

    if (showcaseTrack && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slides = showcaseTrack.querySelectorAll('.showcase-slide');
        const totalSlides = slides.length;

        function getSlideWidth() {
            if (slides.length === 0) return 0;
            const slideRect = slides[0].getBoundingClientRect();
            const gap = 24; // 1.5rem
            return slideRect.width + gap;
        }

        function getMaxIndex() {
            const containerWidth = showcaseTrack.parentElement.offsetWidth;
            const totalWidth = getSlideWidth() * totalSlides - 24;
            const maxScroll = totalWidth - containerWidth;
            return Math.ceil(maxScroll / getSlideWidth());
        }

        function updateSlider() {
            const offset = currentIndex * getSlideWidth();
            showcaseTrack.style.transform = `translateX(-${offset}px)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= getMaxIndex();
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) { currentIndex--; updateSlider(); }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < getMaxIndex()) { currentIndex++; updateSlider(); }
        });

        window.addEventListener('resize', () => { currentIndex = 0; updateSlider(); });
        updateSlider();
    }

    /* ======= ROLE SELECTOR → HIDDEN FIELD ======= */
    const roleRadios = document.querySelectorAll('input[name="ruolo"]');
    const hiddenRuolo = document.getElementById('hiddenRuolo');
    if (roleRadios.length && hiddenRuolo) {
        roleRadios.forEach(radio => {
            radio.addEventListener('change', () => { hiddenRuolo.value = radio.value; });
        });
    }

    /* ======= TEXTAREA CHAR COUNT ======= */
    const ta = document.getElementById('progetto'), cc = document.querySelector('.char-count');
    if (ta && cc) {
        ta.addEventListener('input', () => { cc.textContent = `${ta.value.length}/800`; });
    }
});

/* ======= FIX SCROLLTRIGGER OFFSETS ON IMAGE LOAD ======= */
window.addEventListener('load', () => {
    setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
    }, 100);
});
