document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger);

    let previousSlide = null;

    function hideSlideContent(slide) {
        const h3 = slide.querySelector(".h3-citation");
        const name = slide.querySelector(".orange");
        const job = slide.querySelector(".sol-slide-paragraph");
        const counter = slide.querySelector(".w20");

        [h3, name, job, counter].forEach(el => {
            if (el) {
                gsap.to(el, {
                    opacity: 0,
                    y: -20,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
    }

    function showSlideContent(slide) {
        const h3 = slide.querySelector(".h3-citation");
        const name = slide.querySelector(".orange");
        const job = slide.querySelector(".sol-slide-paragraph");
        const counter = slide.querySelector(".w20");

        [h3, name, job, counter].forEach(el => {
            if (el) {
                gsap.set(el, { opacity: 0, y: 20 }); // Start from below
            }
        });

        const tl = gsap.timeline();
        if (h3) tl.to(h3, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0);
        if (name) tl.to(name, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.1);
        if (job) tl.to(job, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.2);
        if (counter) tl.to(counter, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.3);
    }

    function checkSlideChange() {
        const current = document.querySelector(".sol-slider .w-slide:not([aria-hidden='true'])");

        if (current && current !== previousSlide) {
            if (previousSlide) hideSlideContent(previousSlide);
            showSlideContent(current);
            previousSlide = current;
        }
    }

    // Démarrage
    const first = document.querySelector(".sol-slider .w-slide:not([aria-hidden='true'])");
    if (first) {
        previousSlide = first;
        showSlideContent(first);
    }

    setInterval(checkSlideChange, 300);
});