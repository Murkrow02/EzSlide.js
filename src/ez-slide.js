function EzSlide(options) {
    const {
        containerSelector = '.slides-container',
        slideSelector = '.slide',
        transitionDurationSeconds = 0.5,
        transitionOffsetSeconds = 0.3,
        scrollSensitivity = 8,
        anchorPrefix = 'slide-',
        enableNavigationDots = true,
        navigationDotsPosition = 'right'
    } = options;

    // Additional configuration
    const container = document.querySelector(containerSelector);
    const slides = container.querySelectorAll(slideSelector);
    const transitionStyle = "transform " + transitionDurationSeconds + "s ease-in-out";
    const slideHideClass = 'hide-slide';
    let currentSlideIndex = 0;
    let transitioning = false;

    // Apply config routines
    init();

    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */
    function nextSlide() {
        if (currentSlideIndex >= slides.length - 1)
            return;

        slides[currentSlideIndex + 1].classList.remove(slideHideClass);
        currentSlideIndex++;
        slideChanged();
    }

    function previousSlide() {
        if (currentSlideIndex <= 0)
            return;

        slides[currentSlideIndex].classList.add(slideHideClass);
        currentSlideIndex--;
        slideChanged();
    }

    function goToSlide(slideNumber) {

        let index = slideNumber - 1;

        // Check if index is valid
        if (index < 0 || index >= slides.length)
            return;

        // Go to slide
        if(currentSlideIndex < index)
        {
            for (let i = currentSlideIndex; i < index; i++) {
                nextSlide();
            }
        }
        else if(currentSlideIndex > index)
        {
            for (let i = currentSlideIndex; i > index; i--) {
                previousSlide();
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

    // Called whenever slide changes
    function slideChanged()
    {
        // Set anchor
        window.location.hash = "#" + anchorPrefix + (currentSlideIndex + 1);

        // Update navigation dots
        if(enableNavigationDots)
            setActiveDot(currentSlideIndex);
    }


    /*
    |--------------------------------------------------------------------------
    | Initialization
    |--------------------------------------------------------------------------
    */
    function init()
    {
        // Hide all slides except the first one
        for (let i = 0; i < slides.length; i++) {
            if (i !== currentSlideIndex) {
                slides[i].classList.add('hide-slide');
            }
        }

        enableAnimation();
        addListeners();
        if(enableNavigationDots)
            renderNavigationDots();
    }



    /*
    |--------------------------------------------------------------------------
    | Utilities
    |--------------------------------------------------------------------------
    */
    function waitForAnimationToEnd() {

        removeListeners();
        transitioning = true;

        setTimeout(() => {
            transitioning = false;
            addListeners();
        }, (transitionDurationSeconds + transitionOffsetSeconds) * 1000);
    }

    // Apply duration to animation of each slide
    function enableAnimation() {
        slides.forEach(function (slide) {
            slide.style.transition = transitionStyle;
        });
    }

    // Disable animation of each slide
    function disableAnimation() {
        slides.forEach(function (slide) {
            slide.style.transition = '0s';
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Navigation Dots
    |--------------------------------------------------------------------------
    */
    function setActiveDot(index)
    {
        let dots = document.querySelectorAll('.slide-nav-dots > div');
        dots.forEach((dot, i) => {
            if(i === index)
                dot.classList.add('active-nav-dot');
            else
                dot.classList.remove('active-nav-dot');
        });
    }

    function renderNavigationDots()
    {
        // Create navigation dots
        let navDots = document.createElement('div');
        navDots.classList.add('slide-nav-dots');
        container.appendChild(navDots);

        // Set dots container position
        if(navigationDotsPosition === 'left' || navigationDotsPosition === 'right')
        {
            navDots.style.flexDirection = 'column';
            navDots.style.height = '100%';
            if(navigationDotsPosition === 'left')
                navDots.style.left = '0';
            else if(navigationDotsPosition === 'right')
                navDots.style.right = '0';
        }
        else if(navigationDotsPosition === 'top' || navigationDotsPosition === 'bottom')
        {
            navDots.style.flexDirection = 'row';
            navDots.style.width = '100%';
            if(navigationDotsPosition === 'top')
                navDots.style.top = '0';
            else if(navigationDotsPosition === 'bottom')
                navDots.style.bottom = '0';
        }

        // Create navigation dots
        for (let i = 0; i < slides.length; i++) {
            let dot = document.createElement('div');
            dot.onclick = function() {
                goToSlide(i + 1);
            }
            navDots.appendChild(dot);
        }

        // Set active dot for the first slide
        setActiveDot(0);
    }


    /*
    |--------------------------------------------------------------------------
    | Listeners
    |--------------------------------------------------------------------------
    */
    function addListeners() {
        // Listen for wheel scroll events or touch events
        document.addEventListener('wheel', scrollFired);
        document.addEventListener('touchstart', scrollFired);
    }

    function removeListeners() {
        // Stop listening for more scrolls
        document.removeEventListener('wheel', scrollFired);
        document.removeEventListener('touchstart', scrollFired);
    }


    // Listen for manual hash changes
    window.addEventListener('hashchange', function () {
        const hash = window.location.hash;
        let prefix = "#" + anchorPrefix;
        if (!hash.startsWith(prefix))
            return;

        // Get slide index
        let slideIndex = parseInt(hash.replace(prefix, ''));
        if (isNaN(slideIndex) || slideIndex < 1 || slideIndex > slides.length || slideIndex === currentSlideIndex + 1)
            return;

        // Go to slide
        goToSlide(slideIndex);
    });


    // Fired when user scrolls or swipes
    function scrollFired(event) {

        // Prevent any more scrolls
        if (transitioning)
            return;


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

}