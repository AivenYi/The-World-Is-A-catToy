document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.banner-wrapper');
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.banner-btn.prev');
    const nextBtn = document.querySelector('.banner-btn.next');
    let currentSlide = 0;
    let autoPlayTimer;
    let isAnimating = false;

    // 初始化第一张幻灯片
    slides[currentSlide].classList.add('active');

    // 更新轮播图位置和动画
    function updateSlide(direction = 'next') {
        if (isAnimating) return;
        isAnimating = true;

        // 移除当前幻灯片的active类
        slides[currentSlide].classList.remove('active');

        // 更新轮播图位置
        wrapper.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        
        // 更新圆点状态
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });

        // 添加新幻灯片的active类并触发动画
        requestAnimationFrame(() => {
            slides[currentSlide].classList.add('active');
            setTimeout(() => {
                isAnimating = false;
            }, 500); // 与CSS过渡时间匹配
        });
    }

    // 下一张
    function nextSlide() {
        if (isAnimating) return;
        currentSlide = (currentSlide + 1) % 3;
        updateSlide('next');
    }

    // 上一张
    function prevSlide() {
        if (isAnimating) return;
        currentSlide = (currentSlide - 1 + 3) % 3;
        updateSlide('prev');
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        if (isAnimating || currentSlide === index) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = index;
        updateSlide();
    }

    // 点击圆点切换
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
    });

    // 点击按钮切换
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    // 添加键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });

    // 自动播放
    function startAutoPlay() {
        autoPlayTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }

    // 使用Intersection Observer优化性能
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoPlay();
            } else {
                clearInterval(autoPlayTimer);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(wrapper);

    // 鼠标悬停时暂停自动播放
    const bannerContainer = document.querySelector('.banner-container');
    bannerContainer.addEventListener('mouseenter', () => {
        clearInterval(autoPlayTimer);
    });

    bannerContainer.addEventListener('mouseleave', () => {
        startAutoPlay();
    });

    // 添加触摸支持
    let touchStartX = 0;
    let touchEndX = 0;

    bannerContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoPlayTimer);
    }, { passive: true });

    bannerContainer.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    bannerContainer.addEventListener('touchend', () => {
        const touchDiff = touchStartX - touchEndX;
        if (Math.abs(touchDiff) > 50) { // 最小滑动距离
            if (touchDiff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoPlay();
    });

    // 开始自动播放
    startAutoPlay();
});
