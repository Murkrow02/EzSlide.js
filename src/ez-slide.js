function EzSlide(options) {
    const {
        containerSelector,
        slideSelector,
        transitionDurationSeconds,
        transitionOffsetSeconds,
        scrollSensitivity
    } = options;

    const container = document.querySelector(containerSelector);
    const slides = container.querySelectorAll(slideSelector);
    let currentSlideIndex = 0;
    let transitioning = false;

    // Apply duration to animation of each slide
    slides.forEach(function (slide) {
        slide.style.transition = "transform " + transitionDurationSeconds + "s ease-in-out"
    });

    // Fired when user scrolls or swipes
    function scrollFired(event) {

        // Prevent any more scrolls
        if (transitioning) {
            return;
        }


        // For desktop
        if (event.type === 'wheel') {

            // How much scrolled (force)
            let delta = event.deltaY;

            // Detect weak scroll
            if (Math.abs(delta) >= scrollSensitivity) {
                animateSlides(delta);
            }

        }

        // For mobile
        else if (event.type === 'touchstart') {

            // Get touch position
            const touchStartY = event.touches[0].clientY;

            // Listen for touchmove and touchend events
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);

            function handleTouchMove(event) {
                const touchMoveY = event.touches[0].clientY;
                let delta = touchMoveY - touchStartY;
                if (!transitioning) {
                    animateSlides(-delta);
                }
            }

            function handleTouchEnd() {
                // Remove touchmove and touchend event listeners
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            }
        }
    }

    // Actually animate the slides
    function animateSlides(delta) {

        // Prevent any more scrolls
        waitForAnimationToEnd();

        // Get direction
        let direction = delta > 0 ? "down" : "up";

        // Animate the slides
        if (direction === "down") {
           nextSlide();
        } else if (direction === "up") {
            previousSlide();
        }
    }

    function nextSlide() {
        if(currentSlideIndex >= slides.length - 1)
            return;

        slides[currentSlideIndex + 1].classList.remove('from-bottom');
        currentSlideIndex++;
    }

    function previousSlide() {
        if(currentSlideIndex <= 0)
            return;

        slides[currentSlideIndex].classList.add('from-bottom');
        currentSlideIndex--;
    }

    function waitForAnimationToEnd() {

        removeListeners();
        transitioning = true;

        setTimeout(() => {
            transitioning = false;
            addListeners();
        }, (transitionDurationSeconds + transitionOffsetSeconds) * 1000);
    }

    function addListeners() {
        // Listen for wheel scroll events or touch events
        document.addEventListener('wheel', scrollFired);
        document.addEventListener('touchstart', scrollFired);
    }

    addListeners();

    function removeListeners() {
        // Stop listening for more scrolls
        document.removeEventListener('wheel', scrollFired);
        document.removeEventListener('touchstart', scrollFired);
    }
}