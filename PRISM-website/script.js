document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const cursor = document.querySelector('.custom-cursor');
    const roadFill = document.querySelector('.road-progress-fill');

    // Mouse tracking variables (percentage for background)
    let mouseXPercent = 50;
    let mouseYPercent = 50;
    let currentXPercent = 50;
    let currentYPercent = 50;

    // Raw pixel coordinates for cursor
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Smoothing factor (lerp)
    const smoothness = 0.05;

    document.addEventListener('mousemove', (e) => {
        // Percentage for background
        mouseXPercent = (e.clientX / window.innerWidth) * 100;
        mouseYPercent = (e.clientY / window.innerHeight) * 100;

        // Pixels for cursor
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Ensure cursor is visible
        if (cursor) cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        if (cursor) cursor.style.opacity = '0';
    });

    // Animation loop for smooth movement
    function animate() {
        // Interpolate background position
        currentXPercent += (mouseXPercent - currentXPercent) * smoothness;
        currentYPercent += (mouseYPercent - currentYPercent) * smoothness;

        // Interpolate cursor position (slightly faster for responsiveness)
        currentX += (mouseX - currentX) * 0.2;
        currentY += (mouseY - currentY) * 0.2;

        // Calculate tilt/rotation based on mouse distance from center
        const tiltX = (currentYPercent - 50) * 0.144;
        const tiltY = (currentXPercent - 50) * 0.144;
        const rotate = (currentXPercent - 50) * 0.288;

        // Update CSS variables for background
        root.style.setProperty('--mouse-x', `${currentXPercent}%`);
        root.style.setProperty('--mouse-y', `${currentYPercent}%`);
        root.style.setProperty('--beam-tilt', `${tiltX}deg`);
        root.style.setProperty('--beam-rotate', `${rotate}deg`);

        // Update pixel-based cursor position
        if (cursor) {
            cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Scroll progress for road repair
    window.addEventListener('scroll', () => {
        if (!roadFill) return;
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            roadFill.style.width = scrolled + "%";
        }
    });

    // Optional: Add some interactive feel to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            root.style.setProperty('--prism-opacity', '0.8');
            root.style.setProperty('--transition-speed', '0.3s');
        });
        btn.addEventListener('mouseleave', () => {
            root.style.setProperty('--prism-opacity', '0.6');
            root.style.setProperty('--transition-speed', '0.1s');
        });
    });
});
