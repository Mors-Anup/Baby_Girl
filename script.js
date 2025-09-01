class MobileAnniversaryApp {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 5;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initSwipeGestures();
        this.initAudio();
        this.showPage(1);
        this.hideSwipeHint();
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', (e) => {
            this.addTapRipple(e);
            this.nextPage();
        });
        
        document.getElementById('prevBtn').addEventListener('click', (e) => {
            this.addTapRipple(e);
            this.prevPage();
        });
        
        // Navigation dots
        document.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            });
        });
        
        // Audio controls
        document.getElementById('playBtn').addEventListener('click', (e) => {
            this.addTapRipple(e);
            this.toggleAudio();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevPage();
            }
        });
    }
    
    initSwipeGestures() {
        const container = document.getElementById('pagesContainer');
        
        // Touch events
        container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            // Prevent vertical scrolling during horizontal swipe
            if (Math.abs(e.touches[0].clientX - this.touchStartX) > 50) {
                e.preventDefault();
            }
        }, { passive: false });
        
        container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        }, { passive: true });
        
        // Mouse events for desktop testing
        let isMouseDown = false;
        
        container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            this.touchStartX = e.clientX;
        });
        
        container.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                e.preventDefault();
            }
        });
        
        container.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                this.touchEndX = e.clientX;
                this.handleSwipe();
                isMouseDown = false;
            }
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swiped right (go to previous page)
                this.prevPage();
            } else {
                // Swiped left (go to next page)
                this.nextPage();
            }
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages && !this.isTransitioning) {
            this.goToPage(this.currentPage + 1);
        }
    }
    
    prevPage() {
        if (this.currentPage > 1 && !this.isTransitioning) {
            this.goToPage(this.currentPage - 1);
        }
    }
    
    goToPage(pageNum) {
        if (this.isTransitioning || pageNum === this.currentPage) return;
        
        this.isTransitioning = true;
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('show');
        });
        
        // Show new page after short delay
        setTimeout(() => {
            const newPage = document.querySelector(`[data-page="${pageNum}"]`);
            if (newPage) {
                newPage.classList.add('show');
                this.currentPage = pageNum;
                this.updateUI();
                this.triggerPageAnimations(pageNum);
            }
            
            setTimeout(() => {
                this.isTransitioning = false;
            }, 300);
        }, 100);
    }
    
    showPage(pageNum) {
        this.currentPage = pageNum;
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('show');
        });
        
        const currentPageEl = document.querySelector(`[data-page="${pageNum}"]`);
        if (currentPageEl) {
            currentPageEl.classList.add('show');
        }
        
        this.updateUI();
    }
    
    updateUI() {
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progress = (this.currentPage / this.totalPages) * 100;
        progressFill.style.width = `${progress}%`;
        
        // Update page counter
        document.getElementById('currentPage').textContent = this.currentPage;
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = this.currentPage === 1;
        
        // Update navigation dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === this.currentPage);
        });
        
        // Change next button text on last page
        if (this.currentPage === this.totalPages) {
            nextBtn.innerHTML = '<span class="nav-icon">✓</span>';
            nextBtn.style.background = 'rgba(212, 175, 55, 0.2)';
            nextBtn.style.borderColor = '#d4af37';
            nextBtn.style.color = '#d4af37';
        } else {
            nextBtn.innerHTML = '<span class="nav-icon">→</span>';
            nextBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            nextBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            nextBtn.style.color = 'rgba(255, 255, 255, 0.7)';
        }
    }
    
    triggerPageAnimations(pageNum) {
        switch(pageNum) {
            case 2:
                this.animatePhotoPage();
                break;
            case 3:
                this.animateMessageCards();
                break;
            case 4:
                this.animateMemoryItems();
                break;
        }
    }
    
    animatePhotoPage() {
        const photo = document.querySelector('.main-photo');
        const overlay = document.querySelector('.photo-overlay');
        
        setTimeout(() => {
            if (photo) {
                photo.style.transform = 'scale(1.02)';
                photo.style.filter = 'brightness(1.1)';
            }
        }, 400);
        
        setTimeout(() => {
            if (overlay) {
                overlay.style.opacity = '1';
                overlay.style.transform = 'translateX(-50%) translateY(0)';
            }
        }, 600);
    }
    
    animateMessageCards() {
        const cards = document.querySelectorAll('.message-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.opacity = '1';
            }, index * 200);
        });
    }
    
    animateMemoryItems() {
        const items = document.querySelectorAll('.memory-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateX(0)';
                item.style.opacity = '1';
            }, index * 150);
        });
    }
    
    initAudio() {
        this.audio = document.getElementById('audio');
        this.playBtn = document.getElementById('playBtn');
        this.playIcon = document.getElementById('playIcon');
        this.playText = document.getElementById('playText');
        this.audioViz = document.getElementById('audioViz');
    }
    
    toggleAudio() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playIcon.textContent = '▶';
            this.playText.textContent = 'Play Our Song';
            this.playBtn.classList.remove('playing');
            this.audioViz.classList.remove('active');
            this.isPlaying = false;
        } else {
            this.audio.play().then(() => {
                this.playIcon.textContent = '⏸';
                this.playText.textContent = 'Now Playing';
                this.playBtn.classList.add('playing');
                this.audioViz.classList.add('active');
                this.isPlaying = true;
            }).catch(error => {
                // Create a user-friendly alert for mobile
                this.showMobileAlert('Tap to enable audio! 🎵');
            });
        }
    }
    
    addTapRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('div');
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.className = 'tap-ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    showMobileAlert(message) {
        const alert = document.createElement('div');
        alert.textContent = message;
        alert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #d4af37;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 16px;
            z-index: 10000;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 175, 55, 0.3);
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
    
    hideSwipeHint() {
        setTimeout(() => {
            const hint = document.getElementById('swipeHint');
            if (hint) {
                hint.classList.add('hidden');
            }
        }, 5000);
    }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new MobileAnniversaryApp();
    
    // Prevent zoom on double tap
    document.addEventListener('touchend', (e) => {
        const now = new Date().getTime();
        const timeSince = now - (window.lastTap || 0);
        
        if (timeSince < 500 && timeSince > 0) {
            e.preventDefault();
        }
        
        window.lastTap = now;
    });
    
    // Console message
    console.log('💕 Mobile Anniversary Experience Loaded! 💕');
    console.log('Swipe left/right to navigate between pages');
});
