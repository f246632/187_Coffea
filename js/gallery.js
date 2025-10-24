/* ===================================
   COFFEA BERLIN - GALLERY JAVASCRIPT
   Image Gallery & Lightbox
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // GALLERY CONFIGURATION
    // ===================================
    const galleryImages = [
        {
            src: './images/source/main.jpg',
            alt: 'Coffea café exterior',
            category: 'exterior'
        },
        {
            src: './images/source/image_001.jpg',
            alt: 'Cozy interior atmosphere',
            category: 'interior'
        },
        {
            src: './images/source/image_002.jpg',
            alt: 'Delicious coffee and treats',
            category: 'food'
        },
        {
            src: './images/source/image_003.jpg',
            alt: 'Fresh Vietnamese cuisine',
            category: 'food'
        },
        {
            src: './images/source/image_004.jpg',
            alt: 'Specialty coffee drinks',
            category: 'drinks'
        },
        {
            src: './images/source/image_005.jpg',
            alt: 'Café workspace area',
            category: 'interior'
        },
        {
            src: './images/source/image_006.jpg',
            alt: 'Premium coffee selection',
            category: 'drinks'
        },
        {
            src: './images/source/image_007.jpg',
            alt: 'Cozy seating arrangement',
            category: 'interior'
        },
        {
            src: './images/source/image_008.jpg',
            alt: 'Artisan baked goods',
            category: 'food'
        },
        {
            src: './images/source/image_009.jpg',
            alt: 'Café ambiance',
            category: 'atmosphere'
        },
        {
            src: './images/source/image_010.jpg',
            alt: 'Fresh ingredients',
            category: 'food'
        }
    ];

    // ===================================
    // RENDER GALLERY
    // ===================================
    const galleryGrid = document.getElementById('galleryGrid');

    if (galleryGrid) {
        galleryImages.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-index', index);
            galleryItem.setAttribute('data-category', image.category);

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.loading = 'lazy';

            // Error handling for missing images
            img.onerror = function() {
                this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="18"%3EImage not available%3C/text%3E%3C/svg%3E';
                this.alt = 'Image not available';
            };

            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);

            // Add click event for lightbox
            galleryItem.addEventListener('click', function() {
                openLightbox(index);
            });

            // Add keyboard support
            galleryItem.setAttribute('tabindex', '0');
            galleryItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
    }

    // ===================================
    // LIGHTBOX FUNCTIONALITY
    // ===================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        setTimeout(() => lightboxClose.focus(), 100);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to the gallery item
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems[currentImageIndex]) {
            galleryItems[currentImageIndex].focus();
        }
    }

    function updateLightboxImage() {
        if (galleryImages[currentImageIndex]) {
            lightboxImage.src = galleryImages[currentImageIndex].src;
            lightboxImage.alt = galleryImages[currentImageIndex].alt;

            // Preload next and previous images
            preloadImage(currentImageIndex + 1);
            preloadImage(currentImageIndex - 1);
        }
    }

    function preloadImage(index) {
        if (galleryImages[index]) {
            const img = new Image();
            img.src = galleryImages[index].src;
        }
    }

    function showPreviousImage() {
        currentImageIndex = currentImageIndex > 0
            ? currentImageIndex - 1
            : galleryImages.length - 1;
        updateLightboxImage();
    }

    function showNextImage() {
        currentImageIndex = currentImageIndex < galleryImages.length - 1
            ? currentImageIndex + 1
            : 0;
        updateLightboxImage();
    }

    // Event Listeners
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPreviousImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // Touch/Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > swipeThreshold) {
            if (difference > 0) {
                // Swiped left - show next image
                showNextImage();
            } else {
                // Swiped right - show previous image
                showPreviousImage();
            }
        }
    }

    // ===================================
    // GALLERY ANIMATIONS
    // ===================================
    const galleryObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1)';
                }, index * 50);
                galleryObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        galleryObserver.observe(item);
    });

    // ===================================
    // IMAGE LOADING OPTIMIZATION
    // ===================================
    function optimizeImageLoading() {
        const images = document.querySelectorAll('.gallery-item img');

        images.forEach(img => {
            // Add loading animation
            img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
            img.style.backgroundSize = '200% 100%';
            img.style.animation = 'shimmer 1.5s infinite';

            img.addEventListener('load', function() {
                this.style.animation = 'none';
                this.style.background = 'none';
            });
        });
    }

    optimizeImageLoading();

    // Add shimmer animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // CONSOLE INFO
    // ===================================
    console.log(`%c📸 Gallery loaded with ${galleryImages.length} images`, 'color: #6B4423; font-weight: bold;');
});
