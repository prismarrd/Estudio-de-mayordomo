// Motor de la Presentación de Estudio Bíblico (Navegación por Flechas de Teclado & Árbol Evolutivo)
(function() {
    let currentSlideIndex = 0;
    let currentSubStep = 1;
    let slides = [];
    let totalSlides = 0;
    let progressFill = null;
    let slideCounter = null;
    let treeContainer = null;
    let treeSvgGroup = null;

    // Elementos del Árbol SVG
    let trunkPaths = [];
    let leafElements = [];
    let fruitElements = [];
    let seedElement = null;
    let seedSproutElement = null;

    // Configuración de Ramas del Árbol (Esqueleto único que crece)
    const BRANCH_DATA = [
        // Main Trunk
        { id: 'trunk-main', d: 'M 250 500 C 248 430, 252 360, 250 280 C 248 210, 252 140, 250 70', startStage: 1.5, endStage: 5.5, maxStroke: 14, minStroke: 4 },
        // Lower Left
        { id: 'branch-l1', d: 'M 249 390 Q 200 365 150 350', startStage: 2.5, endStage: 3.8, maxStroke: 8, minStroke: 2 },
        // Lower Right
        { id: 'branch-r1', d: 'M 251 380 Q 300 355 350 340', startStage: 2.8, endStage: 4.0, maxStroke: 8, minStroke: 2 },
        // Mid Left
        { id: 'branch-l2', d: 'M 249 310 Q 185 285 125 260', startStage: 3.5, endStage: 4.8, maxStroke: 6, minStroke: 1.5 },
        // Mid Right
        { id: 'branch-r2', d: 'M 251 295 Q 315 270 375 245', startStage: 3.8, endStage: 5.0, maxStroke: 6, minStroke: 1.5 },
        // Upper Left
        { id: 'branch-l3', d: 'M 249 220 Q 180 180 120 150', startStage: 4.5, endStage: 5.8, maxStroke: 4.5, minStroke: 1 },
        // Upper Right
        { id: 'branch-r3', d: 'M 251 210 Q 320 170 380 140', startStage: 4.8, endStage: 6.0, maxStroke: 4.5, minStroke: 1 },
        // Top Left
        { id: 'branch-l4', d: 'M 250 140 Q 190 95 140 65', startStage: 5.2, endStage: 6.5, maxStroke: 3.5, minStroke: 1 },
        // Top Right
        { id: 'branch-r4', d: 'M 250 140 Q 310 95 360 65', startStage: 5.5, endStage: 6.8, maxStroke: 3.5, minStroke: 1 },
        // Peak Crown
        { id: 'branch-peak', d: 'M 250 140 Q 250 80 250 35', startStage: 5.8, endStage: 7.0, maxStroke: 3, minStroke: 1 }
    ];

    // Posiciones de Hojas (Asociadas a etapas de crecimiento)
    const LEAF_DATA = generateLeafPositions();

    // Posiciones de Frutos Dorados (MI DINERO en adelante)
    const FRUIT_DATA = [
        { cx: 165, cy: 350, r: 7, startStage: 4.8 },
        { cx: 335, cy: 340, r: 8, startStage: 5.0 },
        { cx: 140, cy: 265, r: 7.5, startStage: 5.2 },
        { cx: 360, cy: 250, r: 8, startStage: 5.4 },
        { cx: 200, cy: 290, r: 7, startStage: 5.5 },
        { cx: 300, cy: 280, r: 7.5, startStage: 5.7 },
        { cx: 135, cy: 155, r: 8, startStage: 5.8 },
        { cx: 365, cy: 145, r: 8.5, startStage: 6.0 },
        { cx: 220, cy: 190, r: 7.5, startStage: 6.1 },
        { cx: 280, cy: 180, r: 8, startStage: 6.2 },
        { cx: 150, cy: 75,  r: 7.5, startStage: 6.3 },
        { cx: 350, cy: 70,  r: 8, startStage: 6.4 },
        { cx: 210, cy: 100, r: 7, startStage: 6.5 },
        { cx: 290, cy: 95,  r: 8, startStage: 6.6 },
        { cx: 250, cy: 45,  r: 8.5, startStage: 6.7 },
        { cx: 180, cy: 345, r: 7.5, startStage: 6.8 },
        { cx: 320, cy: 330, r: 8, startStage: 6.9 },
        { cx: 240, cy: 240, r: 8, startStage: 7.0 }
    ];

    function generateLeafPositions() {
        const leaves = [];
        // Seed Sprout Leaves
        leaves.push({ cx: 244, cy: 468, rx: 6, ry: 10, rot: -30, startStage: 2.0, isGold: false });
        leaves.push({ cx: 256, cy: 468, rx: 6, ry: 10, rot: 30, startStage: 2.0, isGold: false });

        // Branch L1 & R1 Leaves (MI TIEMPO)
        const l1Points = [[210, 375], [180, 360], [150, 350], [135, 345], [160, 365]];
        l1Points.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 8, ry: 14, rot: -40 + i*15, startStage: 2.6 + i*0.2, isGold: i % 3 === 0 });
        });
        const r1Points = [[290, 365], [320, 350], [350, 340], [365, 335], [330, 355]];
        r1Points.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 8, ry: 14, rot: 35 - i*15, startStage: 2.8 + i*0.2, isGold: i % 2 === 0 });
        });

        // Branch L2 & R2 Leaves (MIS TALENTOS)
        const l2Points = [[210, 295], [175, 280], [145, 265], [125, 260], [110, 255], [160, 290], [130, 275]];
        l2Points.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 9, ry: 16, rot: -50 + i*12, startStage: 3.4 + i*0.2, isGold: i % 3 === 0 });
        });
        const r2Points = [[290, 285], [325, 270], [355, 255], [375, 245], [390, 240], [340, 280], [365, 265]];
        r2Points.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 9, ry: 16, rot: 45 - i*12, startStage: 3.6 + i*0.2, isGold: i % 2 === 0 });
        });

        // Branch L3 & R3 Leaves (MI DINERO)
        const l3Points = [[215, 205], [180, 185], [150, 165], [120, 150], [105, 140], [165, 195], [135, 175]];
        l3Points.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 9.5, ry: 17, rot: -45 + i*14, startStage: 4.4 + i*0.2, isGold: true });
        });
        const r3Points = [[285, 195], [320, 175], [350, 155], [380, 140], [395, 130], [335, 185], [365, 165]];
        r3Points.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 9.5, ry: 17, rot: 40 - i*14, startStage: 4.6 + i*0.2, isGold: true });
        });

        // Branch L4, R4 & Peak Crown Leaves (MIS OPORTUNIDADES & FINAL)
        const topPoints = [
            [220, 120, -35], [180, 95, -45], [140, 65, -55], [120, 50, -60],
            [280, 115, 35], [320, 90, 45], [360, 65, 55], [380, 50, 60],
            [235, 75, -20], [250, 45, 0], [265, 75, 20], [250, 30, 0]
        ];
        topPoints.forEach((pt, i) => {
            leaves.push({ cx: pt[0], cy: pt[1], rx: 10, ry: 18, rot: pt[2], startStage: 5.2 + i*0.15, isGold: i % 2 === 0 });
        });

        return leaves;
    }

    function initPresentation() {
        slides = Array.from(document.querySelectorAll('.slide'));
        totalSlides = slides.length;
        progressFill = document.getElementById('progress-fill');
        slideCounter = document.getElementById('slide-counter');
        treeContainer = document.getElementById('tree-bg-container');
        treeSvgGroup = document.getElementById('tree-group');

        // Focus window for keyboard events
        window.focus();
        if (document.body) {
            document.body.setAttribute('tabindex', '0');
            document.body.focus();
        }

        buildTreeSVGStructure();
        updatePresentationState();
        bindNavigationEvents();
    }

    function buildTreeSVGStructure() {
        if (!treeSvgGroup) return;
        treeSvgGroup.innerHTML = '';

        // Defs para gradientes y brillo
        const svg = document.getElementById('tree-svg');
        if (svg) {
            svg.setAttribute('viewBox', '0 0 500 520');
            let defs = svg.querySelector('defs');
            if (!defs) {
                defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                svg.insertBefore(defs, svg.firstChild);
            }
            defs.innerHTML = `
                <radialGradient id="soilGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="#3a2712" stop-opacity="0.95"/>
                    <stop offset="70%" stop-color="#1c1208" stop-opacity="0.85"/>
                    <stop offset="100%" stop-color="#070a12" stop-opacity="0"/>
                </radialGradient>
                <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stop-color="#4a3219"/>
                    <stop offset="50%" stop-color="#8c6536"/>
                    <stop offset="100%" stop-color="#d4af37"/>
                </linearGradient>
                <radialGradient id="leafGrad" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#86efac"/>
                    <stop offset="60%" stop-color="#16a34a"/>
                    <stop offset="100%" stop-color="#064e3b"/>
                </radialGradient>
                <radialGradient id="leafGoldGrad" cx="40%" cy="40%" r="60%">
                    <stop offset="0%" stop-color="#fef08a"/>
                    <stop offset="60%" stop-color="#eab308"/>
                    <stop offset="100%" stop-color="#854d0e"/>
                </radialGradient>
                <radialGradient id="fruitGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="30%" stop-color="#fef08a"/>
                    <stop offset="75%" stop-color="#eab308"/>
                    <stop offset="100%" stop-color="#a16207"/>
                </radialGradient>
                <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur"/>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
            `;
        }

        // 1. Soil Ground Layer
        const groundGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        groundGroup.setAttribute('id', 'layer-ground');
        groundGroup.innerHTML = `
            <ellipse cx="250" cy="495" rx="190" ry="28" fill="url(#soilGrad)"/>
            <circle cx="230" cy="492" r="1.5" fill="#d4af37" opacity="0.6"/>
            <circle cx="270" cy="496" r="2" fill="#d4af37" opacity="0.5"/>
            <circle cx="190" cy="490" r="1.2" fill="#8c6536" opacity="0.7"/>
            <circle cx="310" cy="494" r="1.8" fill="#8c6536" opacity="0.7"/>
        `;
        treeSvgGroup.appendChild(groundGroup);

        // 2. Seed Layer
        const seedGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        seedGroup.setAttribute('id', 'layer-seed');
        
        seedElement = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        seedElement.setAttribute('cx', '250');
        seedElement.setAttribute('cy', '490');
        seedElement.setAttribute('rx', '7');
        seedElement.setAttribute('ry', '5');
        seedElement.setAttribute('fill', '#d4af37');
        seedElement.setAttribute('filter', 'url(#goldGlow)');
        seedElement.setAttribute('class', 'tree-seed');
        seedGroup.appendChild(seedElement);

        seedSproutElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        seedSproutElement.setAttribute('d', 'M 250 488 C 250 482, 251 476, 250 470');
        seedSproutElement.setAttribute('stroke', '#4ade80');
        seedSproutElement.setAttribute('stroke-width', '2.5');
        seedSproutElement.setAttribute('stroke-linecap', 'round');
        seedSproutElement.setAttribute('fill', 'none');
        seedSproutElement.setAttribute('opacity', '0');
        seedGroup.appendChild(seedSproutElement);

        treeSvgGroup.appendChild(seedGroup);

        // 3. Trunk & Branches Layer
        const trunkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        trunkGroup.setAttribute('id', 'layer-trunk');
        trunkPaths = [];

        BRANCH_DATA.forEach(b => {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', b.d);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'url(#trunkGrad)');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('class', 'tree-trunk');
            
            // Calculate total length for dashoffset animation
            trunkGroup.appendChild(path);
            const totalLen = path.getTotalLength ? path.getTotalLength() : 200;
            path.style.strokeDasharray = `${totalLen} ${totalLen}`;
            path.style.strokeDashoffset = totalLen;

            trunkPaths.push({ element: path, data: b, totalLen: totalLen });
        });
        treeSvgGroup.appendChild(trunkGroup);

        // 4. Leaves Layer
        const leavesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        leavesGroup.setAttribute('id', 'layer-leaves');
        leafElements = [];

        LEAF_DATA.forEach(ld => {
            const leaf = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
            leaf.setAttribute('cx', ld.cx);
            leaf.setAttribute('cy', ld.cy);
            leaf.setAttribute('rx', ld.rx);
            leaf.setAttribute('ry', ld.ry);
            leaf.setAttribute('fill', ld.isGold ? 'url(#leafGoldGrad)' : 'url(#leafGrad)');
            leaf.setAttribute('class', 'tree-leaf');
            leaf.style.transformOrigin = `${ld.cx}px ${ld.cy}px`;
            leaf.style.transform = `rotate(${ld.rot}deg) scale(0)`;
            leaf.style.opacity = '0';

            leavesGroup.appendChild(leaf);
            leafElements.push({ element: leaf, data: ld });
        });
        treeSvgGroup.appendChild(leavesGroup);

        // 5. Fruits Layer
        const fruitsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        fruitsGroup.setAttribute('id', 'layer-fruits');
        fruitElements = [];

        FRUIT_DATA.forEach(fd => {
            const fruit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            fruit.setAttribute('cx', fd.cx);
            fruit.setAttribute('cy', fd.cy);
            fruit.setAttribute('r', fd.r);
            fruit.setAttribute('fill', 'url(#fruitGrad)');
            fruit.setAttribute('filter', 'url(#goldGlow)');
            fruit.setAttribute('class', 'tree-fruit');
            fruit.style.transformOrigin = `${fd.cx}px ${fd.cy}px`;
            fruit.style.transform = 'scale(0)';
            fruit.style.opacity = '0';

            fruitsGroup.appendChild(fruit);
            fruitElements.push({ element: fruit, data: fd });
        });
        treeSvgGroup.appendChild(fruitsGroup);
    }

    // Calculador Continuo de Etapa de Crecimiento del Árbol (Slide 1 -> Stage 1.0, Slide 24 -> Stage 8.0)
    function calculateStageProgress(slideIdx) {
        // slideIdx es de 0 a 23 (diapositivas 1 a 24)
        if (slideIdx <= 0) return 1.0;          // Slide 1: Semilla en tierra
        if (slideIdx <= 2) return 1.0 + (slideIdx / 2) * 0.8; // Slide 2-3: Semilla germinando (Stage 1.0 - 1.8)
        if (slideIdx <= 4) return 1.8 + ((slideIdx - 2) / 2) * 0.9; // Slide 4-5: Brote y tallo (Stage 1.8 - 2.7)
        if (slideIdx <= 7) return 2.7 + ((slideIdx - 4) / 3) * 1.1; // Slide 6-8: MI TIEMPO (Stage 2.7 - 3.8)
        if (slideIdx <= 10) return 3.8 + ((slideIdx - 7) / 3) * 1.1; // Slide 9-11: MIS TALENTOS (Stage 3.8 - 4.9)
        if (slideIdx <= 13) return 4.9 + ((slideIdx - 10) / 3) * 1.1; // Slide 12-14: MI DINERO (Stage 4.9 - 6.0)
        if (slideIdx <= 16) return 6.0 + ((slideIdx - 13) / 3) * 1.0; // Slide 15-17: MIS OPORTUNIDADES (Stage 6.0 - 7.0)
        if (slideIdx <= 22) return 7.0 + ((slideIdx - 16) / 6) * 0.8; // Slide 18-23: REFLEXIÓN (Stage 7.0 - 7.8)
        return 8.0; // Slide 24: CIERRE FINAL HERO
    }

    function updateTreeVisual(slideIdx) {
        if (!treeContainer) return;

        const currentStage = calculateStageProgress(slideIdx);

        // Actualizar Contenedor Principal CSS
        if (slideIdx === totalSlides - 1) {
            treeContainer.classList.add('full-hero');
        } else {
            treeContainer.classList.remove('full-hero');
        }

        // 1. Animación Semilla & Brote Inicial
        if (seedElement && seedSproutElement) {
            if (currentStage <= 1.5) {
                seedElement.style.opacity = '1';
                seedElement.style.transform = `scale(${1 + Math.sin(Date.now()/500)*0.05})`;
                seedSproutElement.style.opacity = '0';
            } else if (currentStage <= 2.5) {
                const fade = Math.max(0, 1 - (currentStage - 1.5));
                seedElement.style.opacity = String(fade);
                seedSproutElement.style.opacity = '1';
            } else {
                seedElement.style.opacity = '0';
                seedSproutElement.style.opacity = '0.3';
            }
        }

        // 2. Animación Continua de Tronco y Ramas
        trunkPaths.forEach(item => {
            const { element, data, totalLen } = item;
            if (currentStage < data.startStage) {
                element.style.strokeDashoffset = totalLen;
                element.style.opacity = '0';
            } else {
                const growthFactor = Math.min(1, (currentStage - data.startStage) / (data.endStage - data.startStage));
                const currentOffset = totalLen * (1 - growthFactor);
                const currentStroke = data.minStroke + (data.maxStroke - data.minStroke) * growthFactor;

                element.style.strokeDashoffset = currentOffset;
                element.style.strokeWidth = `${currentStroke}px`;
                element.style.opacity = String(Math.min(1, growthFactor * 1.5));
            }
        });

        // 3. Animación de Hojas que Brotan
        leafElements.forEach(item => {
            const { element, data } = item;
            if (currentStage < data.startStage) {
                element.style.transform = `rotate(${data.rot}deg) scale(0)`;
                element.style.opacity = '0';
            } else {
                const leafGrowth = Math.min(1, (currentStage - data.startStage) / 0.6);
                const scaleVal = leafGrowth * (1 + Math.sin(data.cx)*0.1);
                element.style.transform = `rotate(${data.rot}deg) scale(${scaleVal})`;
                element.style.opacity = String(Math.min(0.92, leafGrowth));
            }
        });

        // 4. Animación de Frutos Dorados (MI DINERO en adelante)
        fruitElements.forEach(item => {
            const { element, data } = item;
            if (currentStage < data.startStage) {
                element.style.transform = 'scale(0)';
                element.style.opacity = '0';
            } else {
                const fruitGrowth = Math.min(1, (currentStage - data.startStage) / 0.5);
                element.style.transform = `scale(${fruitGrowth})`;
                element.style.opacity = String(fruitGrowth);
            }
        });
    }

    function updatePresentationState() {
        if (!slides.length) return;

        slides.forEach((slide, idx) => {
            slide.classList.remove('active', 'prev');
            
            if (idx === currentSlideIndex) {
                slide.classList.add('active');
                
                // Revelar sub-pasos de la diapositiva activa
                const stepItems = slide.querySelectorAll('.step-item');
                stepItems.forEach(item => {
                    const itemStep = parseInt(item.dataset.step || '1');
                    if (itemStep <= currentSubStep) {
                        item.classList.add('revealed');
                    } else {
                        item.classList.remove('revealed');
                    }
                });
            } else if (idx < currentSlideIndex) {
                slide.classList.add('prev');
            }
        });

        // Actualizar Barra de Progreso y Contador
        const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }

        if (slideCounter) {
            const formattedCurrent = String(currentSlideIndex + 1).padStart(2, '0');
            const formattedTotal = String(totalSlides).padStart(2, '0');
            slideCounter.textContent = `${formattedCurrent} / ${formattedTotal}`;
        }

        // Actualizar Árbol Evolutivo Visual
        updateTreeVisual(currentSlideIndex);
    }

    function next() {
        if (!slides.length) return;
        const currentSlide = slides[currentSlideIndex];
        const maxSteps = parseInt(currentSlide.dataset.maxSteps || '1');

        if (currentSubStep < maxSteps) {
            currentSubStep++;
            updatePresentationState();
        } else if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            currentSubStep = 1;
            updatePresentationState();
        }
    }

    function prev() {
        if (!slides.length) return;

        if (currentSubStep > 1) {
            currentSubStep--;
            updatePresentationState();
        } else if (currentSlideIndex > 0) {
            currentSlideIndex--;
            const prevSlide = slides[currentSlideIndex];
            const maxSteps = parseInt(prevSlide.dataset.maxSteps || '1');
            currentSubStep = maxSteps;
            updatePresentationState();
        }
    }

    function goToSlide(index) {
        if (index >= 0 && index < totalSlides) {
            currentSlideIndex = index;
            currentSubStep = 1;
            updatePresentationState();
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Pantalla completa: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    function handleKeyDown(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const key = e.key;

        if (key === 'ArrowRight' || key === 'ArrowDown' || key === ' ' || key === 'Enter' || key === 'PageDown' || key === 'n' || key === 'N') {
            e.preventDefault();
            next();
        } else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 'PageUp' || key === 'Backspace' || key === 'p' || key === 'P') {
            e.preventDefault();
            prev();
        } else if (key === 'f' || key === 'F') {
            e.preventDefault();
            toggleFullscreen();
        } else if (key === 'Home') {
            e.preventDefault();
            goToSlide(0);
        } else if (key === 'End') {
            e.preventDefault();
            goToSlide(totalSlides - 1);
        }
    }

    function bindNavigationEvents() {
        window.addEventListener('keydown', handleKeyDown, true);
        document.addEventListener('keydown', handleKeyDown, true);

        window.addEventListener('click', (e) => {
            const screenWidth = window.innerWidth;
            if (e.clientX > screenWidth * 0.5) {
                next();
            } else {
                prev();
            }
        }, false);

        let touchStartX = 0;
        let touchStartY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);

        window.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;

            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
                if (diffX < 0) {
                    next();
                } else {
                    prev();
                }
            }
        }, false);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPresentation);
    } else {
        initPresentation();
    }
})();

