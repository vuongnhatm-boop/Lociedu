/**
 * Mobile Touch Controls Helper for Sử Việt Kỳ Games
 * Auto-detects touch screens and overlays a Virtual Joystick / action buttons.
 * Simulates standard keyboard events (keydown/keyup) for smooth gameplay.
 */
(function () {
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 1024;
    const isTouchDevice = isTouch && (isMobileUA || isSmallScreen);
    if (!isTouchDevice) return; // Do nothing if on Desktop

    // Detect page type with decodeURIComponent to handle Vietnamese diacritics
    const pathname = decodeURIComponent(window.location.pathname).toLowerCase();
    const isMucTieuTriThuc = pathname.includes('mục tiêu tri thức') || pathname.includes('muc_tieu_tri_thuc');
    const isTruongSon = pathname.includes('trường sơn') || pathname.includes('truong_son');
    const isMeCung = pathname.includes('me cung') || pathname.includes('mê cung');
    const isPiano = pathname.includes('piano');

    // Create style block
    const style = document.createElement('style');
    style.innerHTML = `
        .mobile-controller-layer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            height: 180px;
            z-index: 999999;
            pointer-events: none;
            user-select: none;
            -webkit-user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-family: sans-serif;
        }

        /* Joystick styles */
        .joystick-container {
            width: 130px;
            height: 130px;
            background: rgba(93, 64, 55, 0.5);
            border: 3px solid #ffd54f;
            border-radius: 50%;
            position: relative;
            pointer-events: auto;
            touch-action: none;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);
            margin-bottom: 10px;
        }

        .joystick-knob {
            width: 50px;
            height: 50px;
            background: radial-gradient(circle at 30% 30%, #ffd54f, #ffb300);
            border: 2px solid #fff;
            border-radius: 50%;
            position: absolute;
            box-shadow: 0 4px 8px rgba(0,0,0,0.6);
            transition: transform 0.05s ease-out;
            pointer-events: none;
        }

        /* Action buttons container */
        .actions-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: flex-end;
            pointer-events: auto;
            margin-bottom: 10px;
        }

        .action-btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, #d32f2f, #b71c1c);
            border: 2px solid #ffc107;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border-radius: 30px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            touch-action: none;
        }

        .action-btn:active {
            transform: scale(0.92);
            filter: brightness(1.2);
        }

        .btn-zoom {
            background: linear-gradient(135deg, #f57c00, #e65100);
            padding: 10px 20px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

    // Create wrapper layer
    const layer = document.createElement('div');
    layer.className = 'mobile-controller-layer';

    // 1. Create Joystick controls (Left side) - if not piano game
    if (!isPiano) {
        const joystick = createJoystick();
        layer.appendChild(joystick);
    }

    // 2. Create action buttons (Right side)
    const actions = document.createElement('div');
    actions.className = 'actions-container';

    if (isMucTieuTriThuc) {
        // Zoom and Shoot buttons
        const btnZoom = document.createElement('div');
        btnZoom.className = 'action-btn btn-zoom';
        btnZoom.innerHTML = '🔍 Ống ngắm';
        bindKeys(btnZoom, [
            { key: 'x', code: 'KeyX', keyCode: 88 }
        ]);

        const btnShoot = document.createElement('div');
        btnShoot.className = 'action-btn';
        btnShoot.innerHTML = '💥 Bắn';
        bindKeys(btnShoot, [
            { key: ' ', code: 'Space', keyCode: 32 }
        ]);

        actions.appendChild(btnZoom);
        actions.appendChild(btnShoot);
        layer.appendChild(actions);
    } else if (!isPiano && !isTruongSon && !isMeCung) {
        // Standard Action button (Space/Enter) - omitted for Truong Son and Me Cung as requested
        const btnAction = document.createElement('div');
        btnAction.className = 'action-btn';
        btnAction.innerHTML = '⚡ Hành động / OK';
        bindKeys(btnAction, [
            { key: ' ', code: 'Space', keyCode: 32 },
            { key: 'Enter', code: 'Enter', keyCode: 13 }
        ]);
        actions.appendChild(btnAction);
        layer.appendChild(actions);
    }

    if (actions.children.length > 0) {
        document.body.appendChild(layer);
        layer.appendChild(actions);
    } else {
        document.body.appendChild(layer);
    }

    // Function to dispatch simulated keyboard events
    function dispatchKey(type, keyObj) {
        const ev = new KeyboardEvent(type, {
            key: keyObj.key,
            code: keyObj.code,
            keyCode: keyObj.keyCode,
            which: keyObj.keyCode,
            bubbles: true,
            cancelable: true
        });
        window.dispatchEvent(ev);
        document.dispatchEvent(ev);
    }

    // Bind touchstart/touchend to simulated keys
    function bindKeys(element, keyObjects) {
        element.addEventListener('touchstart', function (e) {
            e.preventDefault();
            keyObjects.forEach(k => dispatchKey('keydown', k));
        }, { passive: false });

        element.addEventListener('touchend', function (e) {
            e.preventDefault();
            keyObjects.forEach(k => dispatchKey('keyup', k));
        }, { passive: false });
        
        // Add mouse support for easy PC emulator testing
        element.addEventListener('mousedown', function (e) {
            e.preventDefault();
            keyObjects.forEach(k => dispatchKey('keydown', k));
        });
        element.addEventListener('mouseup', function (e) {
            e.preventDefault();
            keyObjects.forEach(k => dispatchKey('keyup', k));
        });
    }

    // Create Virtual Joystick
    function createJoystick() {
        const container = document.createElement('div');
        container.className = 'joystick-container';

        const knob = document.createElement('div');
        knob.className = 'joystick-knob';
        container.appendChild(knob);

        // State for active keys simulated by the joystick
        let activeKeys = {
            ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
            w: false, s: false, a: false, d: false
        };

        const keyMapping = {
            up: [
                { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
                { key: 'w', code: 'KeyW', keyCode: 87 }
            ],
            down: [
                { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
                { key: 's', code: 'KeyS', keyCode: 83 }
            ],
            left: [
                { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
                { key: 'a', code: 'KeyA', keyCode: 65 }
            ],
            right: [
                { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
                { key: 'd', code: 'KeyD', keyCode: 68 }
            ]
        };

        function setKeyState(dir, state) {
            keyMapping[dir].forEach(k => {
                if (state && !activeKeys[k.key]) {
                    activeKeys[k.key] = true;
                    dispatchKey('keydown', k);
                } else if (!state && activeKeys[k.key]) {
                    activeKeys[k.key] = false;
                    dispatchKey('keyup', k);
                }
            });
        }

        function releaseAllKeys() {
            Object.keys(keyMapping).forEach(dir => {
                setKeyState(dir, false);
            });
        }

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        const maxRadius = 40; // max pixels the knob can move from center

        function handleStart(clientX, clientY) {
            isDragging = true;
            const rect = container.getBoundingClientRect();
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
            handleMove(clientX, clientY);
        }

        function handleMove(clientX, clientY) {
            if (!isDragging) return;

            let dx = clientX - startX;
            let dy = clientY - startY;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > maxRadius) {
                dx = (dx / distance) * maxRadius;
                dy = (dy / distance) * maxRadius;
                distance = maxRadius;
            }

            knob.style.transform = `translate(${dx}px, ${dy}px)`;

            const threshold = 12;
            if (distance < threshold) {
                releaseAllKeys();
                return;
            }

            const nx = dx / distance;
            const ny = dy / distance;
            const dirThreshold = 0.38; // Allows diagonal movements

            setKeyState('up', ny < -dirThreshold);
            setKeyState('down', ny > dirThreshold);
            setKeyState('left', nx < -dirThreshold);
            setKeyState('right', nx > dirThreshold);
        }

        function handleEnd() {
            if (!isDragging) return;
            isDragging = false;
            knob.style.transform = 'translate(0px, 0px)';
            releaseAllKeys();
        }

        // Touch events
        container.addEventListener('touchstart', function (e) {
            e.preventDefault();
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        }, { passive: false });

        container.addEventListener('touchmove', function (e) {
            e.preventDefault();
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }, { passive: false });

        container.addEventListener('touchend', function (e) {
            e.preventDefault();
            handleEnd();
        }, { passive: false });

        container.addEventListener('touchcancel', function (e) {
            e.preventDefault();
            handleEnd();
        }, { passive: false });

        // Mouse events (for testing on desktop)
        container.addEventListener('mousedown', function (e) {
            e.preventDefault();
            handleStart(e.clientX, e.clientY);

            function onMouseMove(moveEvent) {
                handleMove(moveEvent.clientX, moveEvent.clientY);
            }

            function onMouseUp() {
                handleEnd();
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        return container;
    }
})();
