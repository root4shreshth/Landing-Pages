document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const backgroundBlur = document.querySelector('.background-blur');
    const scrollHint = document.querySelector('.scroll-hint');
    const nextBtn = document.querySelector('.next-btn');
    
    let isScrolling = false;
    let currentIndex = 0;
    let autoScrollInterval;
    
    
    setTimeout(() => {
        scrollHint.classList.add('visible');
    }, 2000);
    
   
    function initCarousel() {
        carouselItems.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        
        const activeItem = document.querySelector('.carousel-item.active');
        if (activeItem) {
            const bgImage = activeItem.getAttribute('data-bg');
            backgroundBlur.style.backgroundImage = `url(${bgImage})`;
        }
    }
    
    
    function updateActiveItem() {
        const carouselRect = carousel.getBoundingClientRect();
        const center = carouselRect.left + carouselRect.width / 2;
        
        carouselItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            
            if (Math.abs(itemCenter - center) < itemRect.width / 2) {
                item.classList.add('active');
                currentIndex = index;
                
                
                const bgImage = item.getAttribute('data-bg');
                backgroundBlur.style.backgroundImage = `url(${bgImage})`;
            } else {
                item.classList.remove('active');
            }
        });
    }
    
   
    function scrollToItem(index) {
        if (index >= carouselItems.length) {
            index = 0;
        } else if (index < 0) {
            index = carouselItems.length - 1;
        }
        
        const item = carouselItems[index];
        const itemLeft = item.offsetLeft;
        const itemWidth = item.offsetWidth;
        const carouselWidth = carousel.offsetWidth;
        
        const scrollPosition = itemLeft - (carouselWidth - itemWidth) / 2;
        
        carousel.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        currentIndex = index;
    }
    
    
    carousel.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveItem();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    
  
    nextBtn.addEventListener('click', function() {
        scrollToItem(currentIndex + 1);
    });
    
   
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') {
            scrollToItem(currentIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            scrollToItem(currentIndex - 1);
        }
    });
    
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            
            scrollToItem(currentIndex + 1);
        } else if (touchEndX > touchStartX + 50) {
           
            scrollToItem(currentIndex - 1);
        }
    }
    
    
    function startAutoScroll() {
        autoScrollInterval = setInterval(function() {
            scrollToItem(currentIndex + 1);
        }, 5000);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
   
    carousel.addEventListener('mouseenter', stopAutoScroll);
    carousel.addEventListener('mouseleave', startAutoScroll);
    carousel.addEventListener('touchstart', stopAutoScroll);
    
    
    initCarousel();
    startAutoScroll();
    
  
    document.querySelectorAll('.color').forEach(color => {
        color.addEventListener('click', function() {
            const colorOptions = this.parentElement.querySelectorAll('.color');
            colorOptions.forEach(option => option.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            this.textContent = 'Added!';
            this.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '#333';
            }, 2000);
        });
    });
    
    
    window.addEventListener('resize', function() {
        scrollToItem(currentIndex);
    });
});