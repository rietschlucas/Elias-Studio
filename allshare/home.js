window.addEventListener('load', function () {
    const timeout = 4000;

    function allImagesLoaded() {
        return [...document.images].every(img => img.complete);
    }

    function waitForAssets(callback, timeout = 4000) {
        let done = false;

        const forceFinish = setTimeout(() => {
            if (!done) {
                done = true;
                callback();
            }
        }, timeout);

        const imagesPromise = new Promise(resolve => {
            const interval = setInterval(() => {
                if (allImagesLoaded()) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });

        const fontsPromise = document.fonts.ready;

        const gsapPromise = new Promise(resolve => {
            if (window.gsap) {
                resolve();
            } else {
                const check = setInterval(() => {
                    if (window.gsap) {
                        clearInterval(check);
                        resolve();
                    }
                }, 100);
            }
        });

        Promise.all([imagesPromise, fontsPromise, gsapPromise]).then(() => {
            if (!done) {
                done = true;
                clearTimeout(forceFinish);
                callback();
            }
        });
    }

    waitForAssets(() => {
        setTimeout(() => {
            document.body.classList.add('loaded');

            setTimeout(() => {
                const animatedEls = Array.from(document.querySelectorAll('[class*="anim-"]'));
                const sortedEls = animatedEls.sort((a, b) => {
                    const getIndex = el => {
                        const cls = [...el.classList].find(c => c.startsWith('anim-'));
                        return parseInt(cls?.split('-')[1]) || 0;
                    };
                    return getIndex(a) - getIndex(b);
                });

                sortedEls.forEach((el, i) => {
                    setTimeout(() => {
                        el.classList.add('animated-in');
                    }, i * 100);
                });

            }, 900);
        }, 600);
    }, timeout);
});

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = document.querySelectorAll('.logos-ctas-wrap .logo-cta-item');

                items.forEach((item, index) => {
                    item.style.opacity = 0;
                    item.style.transform = 'translateY(20px)';
                    item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

                    setTimeout(() => {
                        item.style.opacity = 1;
                        item.style.transform = 'translateY(0)';
                    }, index * 150);
                });

                observer.disconnect(); // Une seule fois
            }
        });
    }, { threshold: 0.2 });

    const target = document.querySelector('.logos-ctas-wrap');
    if (target) {
        observer.observe(target);
    }
});