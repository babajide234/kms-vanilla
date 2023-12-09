$(document).ready(function () {
        let currentSlide = 0;
        updateDots(currentSlide)

        function showSlide(index) {
            console.log(index)
            $('.slide').removeClass('hidden').addClass('hidden');
            $('.slide').eq(index).removeClass('hidden');
            updateDots(index);
            animateSlide(index);

        }

        function updateDots(index) {
            $('.dot').removeClass('bg-gray-100 bg-gray-100/40');
            $('.dot').not(':eq(' + index + ')').addClass('bg-gray-100/40');
            $('.dot').eq(index).addClass('bg-gray-100');
        }


        function nextSlide() {
            currentSlide = (currentSlide + 1) % $('.slide').length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + $('.slide').length) % $('.slide').length;
            showSlide(currentSlide);
        }

        function startAutoPlay() {
            return setInterval(function () {
                nextSlide();
            }, 3000); // Change 5000 to the desired interval in milliseconds (e.g., 5000 for 5 seconds)
        }
    
        let autoPlayInterval = startAutoPlay();

        function restartAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = startAutoPlay();
        }

        $('.dot').click(function () {
            const dotIndex = $(this).index();
            showSlide(dotIndex);
        });

        // Handle arrow key navigation
        $(document).keydown(function (e) {
            if (e.keyCode === 37) {
                prevSlide();
                restartAutoPlay();

            } else if (e.keyCode === 39) {
                nextSlide();
                restartAutoPlay();

            }
        });

        // Handle swipe gestures for touch devices
        let startX;
        let endX;
        $('#slider').on('touchstart', function (e) {
            startX = e.touches[0].pageX;
        });

        $('#slider').on('touchmove', function (e) {
            endX = e.touches[0].pageX;
        });

        $('#slider').on('touchend', function () {
            const deltaX = endX - startX;
            if (deltaX > 50) {
                prevSlide();
            } else if (deltaX < -50) {
                nextSlide();
            }
        });

        animateSlide(currentSlide);

        
});
function animateSlide(index) {
    gsap.timeline()
        .from( '.slide', {
            opacity: 0, 
            y:"-100%",
            duration:0.5,
        }).to(
            '.slide',{
                opacity: 1, 
                y:0,
                duration: 0.5
            }
        )
        
}

// .to('.slide', { opacity: 0, duration: 0.5, stagger: 0.1 })
// .from('.slide', { opacity: 0, duration: 0 })  // Initial state before the animation
// .to('.slide', { opacity: 1, duration: 0.5, delay: 0.5 })
// .to('.dot', { background: 'rgba(255, 255, 255, 0.4)', duration: 0.3 })
// .to('.dot:nth-child(' + (index + 1) + ')', { background: '#ffffff', duration: 0.3 });