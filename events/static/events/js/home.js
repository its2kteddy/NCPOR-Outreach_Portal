/**
 * NCPS Outreach Portal - Home Page Interactions
 * Advanced hero slider, scroll animations, and dynamic content
 */

(() => {
    'use strict';

    // ================= SCROLL REVEAL ANIMATIONS =================
    const initScrollReveal = () => {
        const revealEls = document.querySelectorAll('.reveal');
        if (!revealEls.length) return;

        const onReveal = (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            }
        };

        const observer = new IntersectionObserver(onReveal, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealEls.forEach(el => observer.observe(el));
    };


    // ================= HERO SLIDESHOW =================
    const initHeroSlider = () => {
        const slides = Array.from(document.querySelectorAll('[data-slide]'));
        const dots = Array.from(document.querySelectorAll('[data-dot]'));
        const prevBtn = document.querySelector('.hero-arrow-prev');
        const nextBtn = document.querySelector('.hero-arrow-next');
        const heroText = document.getElementById('heroText');

        if (slides.length <= 1) return;

        let index = 0;
        let timer = null;
        let isTransitioning = false;

        const updateHeroText = (slideIndex) => {
            const slide = slides[slideIndex];
            if (!slide || !heroText) return;

            const title = slide.dataset.title || '';
            const date = slide.dataset.date || '';
            const location = slide.dataset.location || '';
            const description = slide.dataset.description || '';
            const eventId = slide.dataset.eventId || '';

            // Fade out
            heroText.classList.add('fade-out');

            setTimeout(() => {
                // Update content
                const titleEl = heroText.querySelector('.home-hero-title');
                const metaEls = heroText.querySelectorAll('.meta-pill');
                const descEl = heroText.querySelector('.home-hero-desc');
                const ctaBtn = heroText.querySelector('.btn-primary');

                if (titleEl) titleEl.textContent = title;
                if (metaEls[0]) metaEls[0].querySelector('span:last-child').textContent = date;
                if (metaEls[1]) metaEls[1].querySelector('span:last-child').textContent = location;
                if (descEl) descEl.textContent = description;
                if (ctaBtn && eventId) {
                    ctaBtn.href = `/events/${eventId}/`;
                }

                // Fade in
                heroText.classList.remove('fade-out');
            }, 300);
        };

        const setActive = (nextIndex) => {
            if (isTransitioning) return;
            isTransitioning = true;

            slides[index].classList.remove('is-active');
            dots[index]?.classList.remove('is-active');

            index = nextIndex;

            slides[index].classList.add('is-active');
            dots[index]?.classList.add('is-active');

            updateHeroText(index);

            setTimeout(() => {
                isTransitioning = false;
            }, 600);
        };

        const goToNext = () => {
            setActive((index + 1) % slides.length);
            start();
        };

        const goToPrev = () => {
            setActive((index - 1 + slides.length) % slides.length);
            start();
        };

        const start = () => {
            stop();
            timer = window.setInterval(goToNext, 7000); // 7s auto-rotate
        };

        const stop = () => {
            if (timer) window.clearInterval(timer);
            timer = null;
        };

        // Dot navigation
        dots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                setActive(i);
                start();
            });
        });

        // Arrow navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', goToPrev);
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', goToNext);
        }

        // Pause on visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop();
            else start();
        });

        // Pause on hover (optional)
        const heroContent = document.querySelector('.home-hero-content');
        if (heroContent) {
            heroContent.addEventListener('mouseenter', stop);
            heroContent.addEventListener('mouseleave', start);
        }

        start();
    };


    // ================= STATS COUNTER ANIMATION =================
    const initStatsCounter = () => {
        const statNumbers = document.querySelectorAll('.stat-number[data-count]');
        if (!statNumbers.length) return;

        const animateCount = (el) => {
            const target = parseInt(el.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    el.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCount);
                } else {
                    el.textContent = target + '+';
                }
            };

            updateCount();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    };


    // ================= SMOOTH SCROLL FOR ANCHOR LINKS =================
    const initSmoothScroll = () => {
        const anchors = document.querySelectorAll('a[href^="#"]');
        
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };


    // ================= LAZY LOAD IMAGES =================
    const initLazyLoad = () => {
        const images = document.querySelectorAll('img[loading="lazy"]');
        if (!images.length || !('IntersectionObserver' in window)) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    };


    // ================= CAROUSEL SCROLL INDICATORS =================
    const initCarouselIndicators = () => {
        const carousels = document.querySelectorAll('.home-carousel');
        
        carousels.forEach(carousel => {
            const updateIndicators = () => {
                const scrollLeft = carousel.scrollLeft;
                const scrollWidth = carousel.scrollWidth;
                const clientWidth = carousel.clientWidth;

                if (scrollLeft === 0) {
                    carousel.classList.add('at-start');
                    carousel.classList.remove('at-end');
                } else if (scrollLeft + clientWidth >= scrollWidth - 5) {
                    carousel.classList.add('at-end');
                    carousel.classList.remove('at-start');
                } else {
                    carousel.classList.remove('at-start', 'at-end');
                }
            };

            carousel.addEventListener('scroll', updateIndicators);
            updateIndicators();
        });
    };


    // ================= INITIALIZE ALL =================
    const init = () => {
        initScrollReveal();
        initHeroSlider();
        initStatsCounter();
        initSmoothScroll();
        initLazyLoad();
        initCarouselIndicators();

        console.log('🧊 NCPS Outreach Portal - Home page initialized');
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
