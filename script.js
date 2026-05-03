// 1. Custom Cursor
const cursor = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Hover effects for cursor
const interactiveElements = document.querySelectorAll('a, button, .product-card, input, select, textarea');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover-active');
    });
});

// 2. Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 3. GSAP Animations Registration
gsap.registerPlugin(ScrollTrigger);

// Hero Animation
const heroTimeline = gsap.timeline();
heroTimeline.to('.hero-title', { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: "power3.out" })
            .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.7")
            .to('.hero-buttons', { opacity: 1, y: 0, duration: 1, ease: "power3.out" }, "-=0.7");

// Scroll Animations for sections
gsap.utils.toArray('.section-header, .product-card, .feature-box, .contact-info, .contact-form').forEach(el => {
    gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        {
            opacity: 1, 
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        }
    );
});

// 4. Animated Counters
const stats = document.querySelectorAll('.stat-number');
stats.forEach(stat => {
    ScrollTrigger.create({
        trigger: ".stats-container",
        start: "top 80%",
        onEnter: () => {
            const target = parseFloat(stat.getAttribute('data-target'));
            const isFloat = !Number.isInteger(target);
            
            gsap.to(stat, {
                innerText: target,
                duration: 2,
                snap: { innerText: isFloat ? 0.1 : 1 },
                ease: "power2.out",
                onUpdate: function() {
                    if (isFloat) {
                        stat.innerText = parseFloat(this.targets()[0].innerText).toFixed(1);
                    } else {
                        stat.innerText = Math.round(this.targets()[0].innerText);
                    }
                }
            });
        },
        once: true
    });
});

// 5. Form Submission Mock
document.getElementById('orderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    btn.style.opacity = '0.8';
    
    // Simulate network request
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Order Received!';
        btn.style.background = '#28a745';
        e.target.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = '';
            btn.style.opacity = '1';
        }, 3000);
    }, 1500);
});

// 6. Three.js Background Particles (Hero)
function initHeroParticles() {
    const container = document.getElementById('hero-canvas-container');
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles Setup
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x4F8EF7,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add some larger gold particles
    const goldGeo = new THREE.BufferGeometry();
    const goldCount = 100;
    const goldArray = new Float32Array(goldCount * 3);
    for(let i = 0; i < goldCount * 3; i++) {
        goldArray[i] = (Math.random() - 0.5) * 80;
    }
    goldGeo.setAttribute('position', new THREE.BufferAttribute(goldArray, 3));
    const goldMat = new THREE.PointsMaterial({
        size: 0.3,
        color: 0xC9A84C,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const goldMesh = new THREE.Points(goldGeo, goldMat);
    scene.add(goldMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Slow rotation
        particlesMesh.rotation.y = elapsedTime * 0.05;
        goldMesh.rotation.y = elapsedTime * -0.03;
        
        // Gentle float
        particlesMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;
        goldMesh.position.y = Math.cos(elapsedTime * 0.4) * 2;

        // Subtle parallax from mouse
        camera.position.x += ((mouseX - window.innerWidth / 2) * 0.005 - camera.position.x) * 0.05;
        camera.position.y += (-(mouseY - window.innerHeight / 2) * 0.005 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 7. Three.js Interactive Showcase (3D Glasses abstraction)
function initShowcase3D() {
    const container = document.getElementById('interactive-glasses-canvas');
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x4F8EF7, 2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const goldLight = new THREE.DirectionalLight(0xC9A84C, 1.5);
    goldLight.position.set(-5, -5, 5);
    scene.add(goldLight);

    // Group to hold the glasses parts
    const glassesGroup = new THREE.Group();
    
    // Materials
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111,
        metalness: 0.8,
        roughness: 0.2
    });
    
    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        metalness: 0.9,
        roughness: 0.1,
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.8,
        reflectivity: 1
    });

    // Create a stylized geometric representation of glasses since we don't have a model
    // Left Lens
    const lensGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const leftLens = new THREE.Mesh(lensGeom, lensMaterial);
    leftLens.rotation.x = Math.PI / 2;
    leftLens.position.set(-1.8, 0, 0);
    
    // Left Frame Rim
    const rimGeom = new THREE.TorusGeometry(1.6, 0.1, 16, 50);
    const leftRim = new THREE.Mesh(rimGeom, frameMaterial);
    leftRim.position.set(-1.8, 0, 0);

    // Right Lens
    const rightLens = new THREE.Mesh(lensGeom, lensMaterial);
    rightLens.rotation.x = Math.PI / 2;
    rightLens.position.set(1.8, 0, 0);

    // Right Frame Rim
    const rightRim = new THREE.Mesh(rimGeom, frameMaterial);
    rightRim.position.set(1.8, 0, 0);

    // Bridge
    const bridgeGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
    const bridge = new THREE.Mesh(bridgeGeom, frameMaterial);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.5, 0);

    // Temples (arms)
    const templeGeom = new THREE.BoxGeometry(0.1, 0.2, 4);
    const leftTemple = new THREE.Mesh(templeGeom, frameMaterial);
    leftTemple.position.set(-3.4, 0, -2);
    
    const rightTemple = new THREE.Mesh(templeGeom, frameMaterial);
    rightTemple.position.set(3.4, 0, -2);

    // Assemble glasses
    glassesGroup.add(leftLens);
    glassesGroup.add(leftRim);
    glassesGroup.add(rightLens);
    glassesGroup.add(rightRim);
    glassesGroup.add(bridge);
    glassesGroup.add(leftTemple);
    glassesGroup.add(rightTemple);

    scene.add(glassesGroup);

    // Mouse Interaction for 3D showcase
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        mouseX = (x / width) * 2 - 1;
        mouseY = -(y / height) * 2 + 1;
    });

    // Auto rotate when not hovering
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Smoothly interpolate rotation to target
        glassesGroup.rotation.y += (targetX - glassesGroup.rotation.y) * 0.1;
        glassesGroup.rotation.x += (targetY - glassesGroup.rotation.x) * 0.1;
        
        // Add a gentle continuous float
        time += 0.01;
        glassesGroup.position.y = Math.sin(time) * 0.3;

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
}

// Initialize 3D elements after DOM loads
window.addEventListener('load', () => {
    initHeroParticles();
    initShowcase3D();
});
