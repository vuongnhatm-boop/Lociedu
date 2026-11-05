/**
 * LOCI EDU — BAI 6 SPATIAL STEP DIRECTOR (ĐIỀU HƯỚNG TƯƠNG TÁC 3D BÀI 6)
 * Tác giả: Chuyên gia Thiết kế Không gian & Sư phạm Lịch sử Loci
 * 
 * Thực thi chính xác 100% kịch bản sư phạm cho 9 mốc Cách mạng tháng Tám 1945:
 * - Mốc 1: P1 -> Bom nguyên tử rơi; P2 & P3 -> Cờ Liên Xô bay lên hùng tráng + Pháo hoa ăn mừng chiến thắng Mãn Châu & Phát xít Nhật đầu hàng.
 * - Mốc 2: P1 -> Mũi tên chỉ model những người dân khởi nghĩa; P2 -> Mũi tên chỉ nhóm người áo trắng (Ủy ban khởi nghĩa); P3 -> Mũi tên chỉ Lán Nà Nưa.
 * - Mốc 3: P1 -> Mũi tên chỉ Bác đang trò chuyện với người dân; P2 -> Mũi tên chỉ nhóm người đang đứng nghe; P3 -> Mũi tên chỉ Bác Hồ + Ảnh Bác Hồ lịch sử xuất hiện trang nghiêm phía sau.
 * - Mốc 4: Chuyển Cây đa Tân Trào sang đây; P1 -> Mũi tên chỉ Cây đa Tân Trào; P2 & P3 -> Mũi tên chỉ đoàn quân khởi nghĩa (nguoi_dan_khoi_nghia.glb).
 * - Mốc 5: P1 -> Mũi tên chỉ mô hình Nhà hát Lớn; P2 -> 5 mũi tên 3D tỏa ra 5 hướng chiến lược (Bắc Bộ Phủ, Sở Mật Thám, Trại Lính Bảo An, Kho Bạc, Nhà Bưu Điện); P3 -> Chữ 3D "HÀ NỘI" + Pháo hoa rực rỡ chúc mừng + Biển ngày tháng 19/8/1945.
 * - Mốc 6: Nạp 2 mô hình (co_do_hue.glb & gianh_khoi_nghia_cuoi_cung.glb); P1 -> Cố đô Huế (23/8); P2 -> Sài Gòn (25/8); P3 -> Đồng Nai Thượng & Hà Tiên (28/8).
 * - Mốc 7: P1, P2 & P3 -> Mũi tên chỉ mô hình Vua Bảo Đại thoái vị; P3 -> Lá cờ đỏ sao vàng Việt Nam tung bay phấp phới trên Kỳ Đài.
 * - Mốc 8: Mũi tên chỉ Bác Hồ đọc Tuyên ngôn Độc lập + Tự động phát âm thanh lịch sử (cắt 23s đầu) kèm thanh điều khiển Play/Pause/Mute/Volume.
 * - Mốc 9: Sa bàn khúc khải hoàn vinh quang: Đài sen vàng, ngọn đuốc độc lập, cờ Tổ quốc tỏa sáng, các biển mốc ý nghĩa lịch sử & pháo hoa đại thắng.
 */

(function (window) {
    'use strict';

    let THREE = window.THREE;
    let directorGroup = null;
    let activeStationOrder = null;
    let activeStepIdx = null;

    // Các mũi tên chỉ định 3D
    let focusArrow = null;
    let focusArrow2 = null;
    let targetPos = null;
    let currentPos = null;
    let targetPos2 = null;
    let currentPos2 = null;
    let hasDualArrows = false;

    // Nhóm đạo cụ động (props)
    let dynamicPropsGroup = null;
    let activeProps = [];

    // Hệ thống hạt pháo hoa ăn mừng
    let fireworksSystem = null;
    let fireworkParticles = [];

    // Hệ thống phát âm thanh Mốc 8 (Tuyên ngôn Độc lập)
    let audioPlayer = null;
    let audioControlUI = null;
    let isAudioPlaying = false;
    let isAudioMuted = false;
    let currentAudioVolume = 0.85;

    // Cache kết cấu Canvas Texture
    const textureCache = new Map();

    // Helper tạo Canvas Texture sắc nét
    function createTextTexture(text, opts = {}) {
        const cacheKey = text + JSON.stringify(opts);
        if (textureCache.has(cacheKey)) {
            return textureCache.get(cacheKey);
        }

        const canvas = document.createElement('canvas');
        canvas.width = opts.width || 512;
        canvas.height = opts.height || 128;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Nền bo góc
        if (opts.bg) {
            ctx.fillStyle = opts.bg;
            if (opts.radius) {
                const r = opts.radius, w = canvas.width, h = canvas.height;
                ctx.beginPath();
                ctx.moveTo(r, 0); ctx.lineTo(w - r, 0); ctx.quadraticCurveTo(w, 0, w, r);
                ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
                ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
                ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Viền
        if (opts.border) {
            ctx.strokeStyle = opts.border;
            ctx.lineWidth = opts.borderWidth || 4;
            if (opts.radius) {
                const r = opts.radius, w = canvas.width, h = canvas.height;
                ctx.beginPath();
                ctx.moveTo(r, 0); ctx.lineTo(w - r, 0); ctx.quadraticCurveTo(w, 0, w, r);
                ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
                ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
                ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.closePath();
                ctx.stroke();
            } else {
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Chữ
        ctx.fillStyle = opts.color || '#ffffff';
        ctx.font = opts.font || 'bold 36px "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = String(text).split('\n');
        if (lines.length === 1) {
            ctx.fillText(lines[0], canvas.width / 2, canvas.height / 2);
        } else {
            const lineH = opts.lineHeight || 42;
            const startY = (canvas.height / 2) - ((lines.length - 1) * lineH) / 2;
            lines.forEach((line, i) => {
                ctx.fillText(line, canvas.width / 2, startY + i * lineH);
            });
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        textureCache.set(cacheKey, tex);
        return tex;
    }

    // Helper tạo cờ đỏ sao vàng Việt Nam
    function createVietnamFlagTexture() {
        const cacheKey = '__VN_FLAG__';
        if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 340;
        const ctx = canvas.getContext('2d');

        // Nền đỏ thắm tươi
        ctx.fillStyle = '#da251d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Ngôi sao vàng năm cánh chính tâm
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const outerR = 90;
        const innerR = outerR * 0.382;
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const rot = (Math.PI / 2) * 3;
            const x1 = cx + Math.cos(rot + (i * 2 * Math.PI) / 5) * outerR;
            const y1 = cy + Math.sin(rot + (i * 2 * Math.PI) / 5) * outerR;
            ctx.lineTo(x1, y1);
            const x2 = cx + Math.cos(rot + ((i + 0.5) * 2 * Math.PI) / 5) * innerR;
            const y2 = cy + Math.sin(rot + ((i + 0.5) * 2 * Math.PI) / 5) * innerR;
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        textureCache.set(cacheKey, tex);
        return tex;
    }

    // Helper tạo cờ Liên Xô (Hồng quân Liên Xô 1945)
    function createSovietFlagTexture() {
        const cacheKey = '__USSR_FLAG__';
        if (textureCache.has(cacheKey)) return textureCache.get(cacheKey);

        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 340;
        const ctx = canvas.getContext('2d');

        // Nền đỏ cờ Liên Xô
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Biểu tượng Búa Liềm vàng & Ngôi sao viền vàng ở góc trái phía trên
        const ox = 90;
        const oy = 90;

        // Ngôi sao nhỏ viền vàng ở trên búa liềm
        ctx.save();
        ctx.translate(ox, oy - 48);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const rot = (Math.PI / 2) * 3;
            const rOut = 20, rIn = 8;
            const x1 = Math.cos(rot + (i * 2 * Math.PI) / 5) * rOut;
            const y1 = Math.sin(rot + (i * 2 * Math.PI) / 5) * rOut;
            ctx.lineTo(x1, y1);
            const x2 = Math.cos(rot + ((i + 0.5) * 2 * Math.PI) / 5) * rIn;
            const y2 = Math.sin(rot + ((i + 0.5) * 2 * Math.PI) / 5) * rIn;
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Búa Liềm vàng
        ctx.save();
        ctx.translate(ox, oy);
        ctx.strokeStyle = '#ffd700';
        ctx.fillStyle = '#ffd700';
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';

        // Lưỡi liềm cong
        ctx.beginPath();
        ctx.arc(0, 0, 36, -Math.PI * 0.45, Math.PI * 0.65, false);
        ctx.stroke();

        // Cán liềm
        ctx.beginPath();
        ctx.moveTo(14, 28);
        ctx.lineTo(26, 48);
        ctx.stroke();

        // Cán búa chéo
        ctx.beginPath();
        ctx.moveTo(-32, 42);
        ctx.lineTo(34, -36);
        ctx.stroke();

        // Đầu búa
        ctx.fillRect(24, -48, 22, 16);
        ctx.restore();

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        textureCache.set(cacheKey, tex);
        return tex;
    }

    // KHỞI TẠO BỘ ĐIỀU HƯỚNG KHÔNG GIAN BÀI 6
    function init() {
        THREE = window.THREE;
        if (!THREE || !window.scene) return;

        if (directorGroup) {
            window.scene.remove(directorGroup);
        }

        directorGroup = new THREE.Group();
        directorGroup.name = 'bai6_spatial_director_root';
        window.scene.add(directorGroup);

        dynamicPropsGroup = new THREE.Group();
        dynamicPropsGroup.name = 'bai6_dynamic_props';
        directorGroup.add(dynamicPropsGroup);

        // 1. Tạo mũi tên chỉ định chính (Vàng kim rực rỡ)
        focusArrow = createStylizedArrow(0xf59e0b, 0xffedd5);
        focusArrow.visible = false;
        directorGroup.add(focusArrow);

        // 2. Tạo mũi tên chỉ định phụ (Xanh lục / Đỏ)
        focusArrow2 = createStylizedArrow(0x10b981, 0xd1fae5);
        focusArrow2.visible = false;
        directorGroup.add(focusArrow2);

        targetPos = new THREE.Vector3(0, 0, 0);
        currentPos = new THREE.Vector3(0, 0, 0);
        targetPos2 = new THREE.Vector3(0, 0, 0);
        currentPos2 = new THREE.Vector3(0, 0, 0);

        // Khởi tạo hệ thống Pháo hoa hạt nhẹ 60fps
        initFireworksSystem();

        // Khởi tạo thanh Audio UI cho Trạm 8
        initAudioControlUI();

        console.log('✅ [Bai6SpatialDirector] Khởi tạo thành công Hệ thống Điều hướng Không gian 3D Bài 6 (CM Tháng Tám 1945)');
    }

    function createStylizedArrow(colorHex, emissiveHex) {
        const arrow = new THREE.Group();

        // Nón mũi tên chỉ xuống
        const coneGeo = new THREE.ConeGeometry(0.18, 0.42, 16);
        const coneMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: emissiveHex,
            emissiveIntensity: 0.65,
            metalness: 0.4,
            roughness: 0.2
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.rotation.x = Math.PI; // hướng chóp xuống
        cone.position.y = 0.21;
        arrow.add(cone);

        // Thân trụ mũi tên
        const shaftGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.42, 16);
        const shaftMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: emissiveHex,
            emissiveIntensity: 0.45,
            metalness: 0.5,
            roughness: 0.3
        });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.position.y = 0.52;
        arrow.add(shaft);

        // Vòng sáng tròn tỏa quang dưới chân (Target Reticle)
        const reticleGeo = new THREE.RingGeometry(0.48, 0.55, 32);
        const reticleMat = new THREE.MeshBasicMaterial({
            color: colorHex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75
        });
        const reticle = new THREE.Mesh(reticleGeo, reticleMat);
        reticle.rotation.x = -Math.PI / 2;
        reticle.position.y = -1.25; // Nằm sát mặt sa bàn
        arrow.add(reticle);

        arrow.userData = { cone, shaft, reticle };
        return arrow;
    }

    // TÌM TỌA ĐỘ THỰC CỦA TRẠM TRÊN BẢN ĐỒ 3D
    function getStationBasePos(order) {
        if (window.lociList && Array.isArray(window.lociList)) {
            const loc = window.lociList.find(l => l.order === order);
            if (loc && Array.isArray(loc.pos)) {
                return new THREE.Vector3(loc.pos[0], loc.pos[1] || 0.08, loc.pos[2]);
            }
        }
        if (window.scene) {
            const stObj = window.scene.getObjectByName(`true_loci_station_${order}`);
            if (stObj) {
                const wp = new THREE.Vector3();
                stObj.getWorldPosition(wp);
                return wp;
            }
        }
        // Fallback tọa độ chuẩn của Triển lãm Nâu Bài 6
        const defaultPositions = {
            1: new THREE.Vector3(-6.6, 0.08, -1.6),
            2: new THREE.Vector3(-3.8, 0.08, -2.5),
            3: new THREE.Vector3(-0.6, 0.08, -2.7),
            4: new THREE.Vector3(2.6, 0.08, -2.5),
            5: new THREE.Vector3(6.2, 0.08, -1.6),
            6: new THREE.Vector3(6.2, 0.08, 1.6),
            7: new THREE.Vector3(2.4, 0.08, 2.6),
            8: new THREE.Vector3(-1.6, 0.08, 2.6),
            9: new THREE.Vector3(-6.2, 0.08, 1.2)
        };
        return defaultPositions[order] || new THREE.Vector3(0, 0, 0);
    }

    // XÓA HẾT CÁC ĐẠO CỤ ĐỘNG CỦA MỐC TRƯỚC
    function clearDynamicProps() {
        if (!dynamicPropsGroup) return;
        while (dynamicPropsGroup.children.length > 0) {
            const obj = dynamicPropsGroup.children[0];
            dynamicPropsGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }
        activeProps = [];
        hasDualArrows = false;
        if (focusArrow) focusArrow.visible = false;
        if (focusArrow2) focusArrow2.visible = false;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // HỆ THỐNG PHÁO HOA ĂN MỪNG CHIẾN THẮNG (FIREWORKS PARTICLES)
    // ──────────────────────────────────────────────────────────────────────────
    function initFireworksSystem() {
        fireworkParticles = [];
    }

    function triggerFireworkExplosion(centerPos, colorHex = 0xf59e0b, count = 48) {
        if (!THREE || !dynamicPropsGroup) return;

        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const velocities = [];

        for (let i = 0; i < count; i++) {
            positions[i * 3] = centerPos.x;
            positions[i * 3 + 1] = centerPos.y;
            positions[i * 3 + 2] = centerPos.z;

            // Vận tốc hình cầu nổ tung
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const speed = 1.4 + Math.random() * 2.8;

            velocities.push(new THREE.Vector3(
                Math.sin(phi) * Math.cos(theta) * speed,
                Math.sin(phi) * Math.sin(theta) * speed + 0.6,
                Math.cos(phi) * speed
            ));
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({
            color: colorHex,
            size: 0.065,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending
        });

        const pSystem = new THREE.Points(pGeo, pMat);
        dynamicPropsGroup.add(pSystem);

        activeProps.push({
            type: 'firework_burst',
            mesh: pSystem,
            velocities,
            positions,
            life: 1.6,
            maxLife: 1.6
        });
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CÁC HÀM TẠO ĐẠO CỤ ĐỘNG CHO TỪNG MỐC
    // ──────────────────────────────────────────────────────────────────────────

    // 1. TẠO CỜ 3D CÓ ANIMATION LƯỢN SÓNG (WAVING CLOTH) & CỘT CỜ BAY LÊN
    function createWavingFlagProp(texture, pos, opts = {}) {
        const group = new THREE.Group();
        group.position.copy(pos);

        // Cột cờ
        const poleH = opts.poleHeight || 2.4;
        const poleGeo = new THREE.CylinderGeometry(0.02, 0.025, poleH, 16);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = poleH / 2;
        group.add(pole);

        // Đỉnh chóp vàng
        const finial = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), poleMat);
        finial.position.y = poleH + 0.02;
        group.add(finial);

        // Lá cờ dạng lưới để lượn sóng mềm mại
        const flagW = opts.flagWidth || 1.35;
        const flagH = opts.flagHeight || 0.88;
        const flagGeo = new THREE.PlaneGeometry(flagW, flagH, 22, 14);
        const flagMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.45,
            metalness: 0.15
        });
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        flagMesh.position.set(flagW / 2 + 0.02, poleH - flagH / 2 - 0.05, 0);
        group.add(flagMesh);

        // Lưu đỉnh gốc để tính sóng sine
        const posAttr = flagGeo.attributes.position;
        const origPositions = new Float32Array(posAttr.array);

        // Nếu có hiệu ứng cờ bay vút lên từ dưới lên
        if (opts.riseUp) {
            group.position.y -= 2.2;
            group.userData.targetY = pos.y;
            group.userData.isRising = true;
        }

        activeProps.push({
            type: 'waving_flag',
            group,
            mesh: flagMesh,
            origPositions,
            posAttr,
            speed: opts.speed || 4.8,
            amplitude: opts.amplitude || 0.09
        });

        dynamicPropsGroup.add(group);
        return group;
    }

    // 2. TẠO BIỂN CHỮ 3D NỔI BẬT NẰM TRÊN SA BÀN (FLOATING 3D BADGE)
    function createFloatingBadge(text, pos, opts = {}) {
        const tex = createTextTexture(text, {
            bg: opts.bg || 'rgba(15, 23, 42, 0.92)',
            border: opts.border || '#f59e0b',
            borderWidth: opts.borderWidth || 5,
            color: opts.color || '#ffffff',
            font: opts.font || 'bold 28px "Outfit", sans-serif',
            radius: opts.radius || 14,
            width: opts.width || 512,
            height: opts.height || 100
        });

        const w = opts.planeW || 1.6;
        const h = opts.planeH || 0.35;
        const geo = new THREE.PlaneGeometry(w, h);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, depthTest: false, depthWrite: false });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        mesh.renderOrder = 99999;

        // Cập nhật hướng mặt về phía camera trong vòng lặp render
        activeProps.push({
            type: 'billboard_badge',
            mesh,
            baseY: pos.y
        });

        dynamicPropsGroup.add(mesh);
        return mesh;
    }

    // 3. MỐC 3 PHẦN 3: ẢNH BÁC HỒ LỊCH SỬ XUẤT HIỆN TRANG NGHIÊM PHÍA SAU
    function createBacHoHistoricPortrait(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x - 0.15, stBasePos.y + 1.85, stBasePos.z - 0.70);

        // Khung ảnh gỗ mạ vàng kim trang nghiêm
        const frameGeo = new THREE.BoxGeometry(1.22, 1.48, 0.06);
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0xd97706,
            metalness: 0.85,
            roughness: 0.25,
            emissive: 0x92400e,
            emissiveIntensity: 0.3
        });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        group.add(frameMesh);

        // Tấm ảnh chân dung Bác Hồ (Nạp từ assets/images/bai6/tram3_bac_ho_tan_trao.jpg)
        const photoGeo = new THREE.PlaneGeometry(1.10, 1.36);
        const texLoader = new THREE.TextureLoader();

        // Đường dẫn ảnh tư liệu Bác Hồ tại Tân Trào
        const pName = (typeof window !== 'undefined' && window.location) ? window.location.pathname : '';
        const prefix = pName.includes('/app/') ? '../' : './';
        const photoPath = prefix + 'assets/images/bai6/tram3_bac_ho_tan_trao.jpg';

        texLoader.load(photoPath, (photoTex) => {
            const photoMat = new THREE.MeshBasicMaterial({ map: photoTex });
            const photoMesh = new THREE.Mesh(photoGeo, photoMat);
            photoMesh.position.z = 0.035;
            group.add(photoMesh);
        }, undefined, () => {
            // Fallback vẽ chân dung nghệ thuật Bác Hồ nếu không nạp được ảnh
            const canvas = document.createElement('canvas');
            canvas.width = 400; canvas.height = 500;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 400, 500);
            ctx.fillStyle = '#fde047'; ctx.font = 'bold 32px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('CHỦ TỊCH', 200, 210);
            ctx.fillText('HỒ CHÍ MINH', 200, 260);
            ctx.font = '22px sans-serif'; ctx.fillStyle = '#94a3b8';
            ctx.fillText('(Tân Trào 1945)', 200, 310);
            const fbTex = new THREE.CanvasTexture(canvas);
            const photoMesh = new THREE.Mesh(photoGeo, new THREE.MeshBasicMaterial({ map: fbTex }));
            photoMesh.position.z = 0.035;
            group.add(photoMesh);
        });

        // Vòng hào quang vàng kim tỏa sáng phía sau chân dung Bác
        const haloGeo = new THREE.RingGeometry(0.85, 1.15, 48);
        const haloMat = new THREE.MeshBasicMaterial({
            color: 0xfbbf24,
            transparent: true,
            opacity: 0.75,
            side: THREE.DoubleSide
        });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.position.z = -0.04;
        group.add(haloMesh);

        // Animation xuất hiện phóng to mềm mại (Scale-in)
        group.scale.set(0.01, 0.01, 0.01);
        group.userData = { targetScale: 1.0, currentScale: 0.01 };

        activeProps.push({
            type: 'portrait_fade_in',
            group,
            haloMesh
        });

        dynamicPropsGroup.add(group);
    }

    // 4. MỐC 5 PHẦN 2: 5 MŨI TÊN 3D TỎA RA 5 HƯỚNG CHỈ VÀO CÁC CƠ QUAN ĐẦU NÃO
    function createMoc5FiveAttackArrows(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        const targets = [
            { name: 'Bắc Bộ Phủ', offset: new THREE.Vector3(0, 0.25, -1.65), color: 0xef4444 },
            { name: 'Sở Mật Thám', offset: new THREE.Vector3(-1.45, 0.25, -0.95), color: 0xf59e0b },
            { name: 'Trại Lính Bảo An', offset: new THREE.Vector3(-1.35, 0.25, 1.15), color: 0x10b981 },
            { name: 'Kho Bạc', offset: new THREE.Vector3(1.35, 0.25, 1.15), color: 0x06b6d4 },
            { name: 'Nhà Bưu Điện', offset: new THREE.Vector3(1.45, 0.25, -0.95), color: 0xa855f7 }
        ];

        targets.forEach((t) => {
            const arrowGroup = new THREE.Group();

            // Tính toán hướng mũi tên từ tâm Nhà hát Lớn ra mục tiêu
            const dir = t.offset.clone().normalize();
            const length = t.offset.length();

            // Thân mũi tên nằm sát đất
            const shaftGeo = new THREE.CylinderGeometry(0.035, 0.035, length * 0.75, 12);
            const shaftMat = new THREE.MeshStandardMaterial({
                color: t.color,
                emissive: t.color,
                emissiveIntensity: 0.7,
                roughness: 0.3
            });
            const shaft = new THREE.Mesh(shaftGeo, shaftMat);
            shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            shaft.position.copy(dir.clone().multiplyScalar(length * 0.38));
            arrowGroup.add(shaft);

            // Đầu nón nhọn mũi tên
            const coneGeo = new THREE.ConeGeometry(0.12, 0.32, 16);
            const coneMat = new THREE.MeshStandardMaterial({
                color: t.color,
                emissive: t.color,
                emissiveIntensity: 0.9,
                roughness: 0.2
            });
            const cone = new THREE.Mesh(coneGeo, coneMat);
            cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
            cone.position.copy(dir.clone().multiplyScalar(length * 0.85));
            arrowGroup.add(cone);

            // Biển tên mục tiêu 3D bay trên đầu mũi tên
            const badgeTex = createTextTexture(t.name, {
                bg: 'rgba(15, 23, 42, 0.92)',
                border: '#' + t.color.toString(16).padStart(6, '0'),
                borderWidth: 4,
                color: '#ffffff',
                font: 'bold 26px sans-serif',
                radius: 10,
                width: 256,
                height: 72
            });
            const badge = new THREE.Mesh(
                new THREE.PlaneGeometry(0.75, 0.22),
                new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true, side: THREE.DoubleSide, depthTest: false, depthWrite: false })
            );
            badge.position.set(t.offset.x, t.offset.y + 0.45, t.offset.z);
            arrowGroup.add(badge);

            group.add(arrowGroup);
        });

        activeProps.push({
            type: 'pulse_arrows',
            group,
            time: 0
        });

        dynamicPropsGroup.add(group);
    }

    // 5. MỐC 5 PHẦN 3: CHỮ "HÀ NỘI" NỔI BẬT + BIỂN NGÀY THÁNG + PHÁO HOA ĂN MỪNG
    function createMoc5HanoiVictoryCelebration(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Biển chữ 3D khổng lồ "HÀ NỘI" vàng kim & đỏ cách mạng
        const hanoiTex = createTextTexture('HÀ NỘI KHỞI NGHĨA TOÀN THẮNG', {
            bg: 'linear-gradient(135deg, #b91c1c, #991b1b)',
            border: '#fbbf24',
            borderWidth: 6,
            color: '#fef08a',
            font: 'bold 36px "Outfit", serif',
            radius: 16,
            width: 512,
            height: 120
        });
        const hanoiBadge = new THREE.Mesh(
            new THREE.PlaneGeometry(2.1, 0.52),
            new THREE.MeshBasicMaterial({ map: hanoiTex, transparent: true, side: THREE.DoubleSide })
        );
        // Đặt biển chữ bay cao hẳn lên trên nóc Nhà Hát Lớn (y: 2.85) với depthTest: false và renderOrder: 99999 để không bao giờ bị mô hình 3D che
        hanoiBadge.position.set(0, 2.85, 0.20);
        hanoiBadge.renderOrder = 99999;
        hanoiBadge.material.depthTest = false;
        hanoiBadge.material.depthWrite = false;
        group.add(hanoiBadge);

        // Biển ngày tháng bên cạnh: "19/8/1945"
        const dateTex = createTextTexture('19/8/1945', {
            bg: 'rgba(245, 158, 11, 0.95)',
            border: '#ffffff',
            borderWidth: 4,
            color: '#0f172a',
            font: '900 36px sans-serif',
            radius: 12,
            width: 256,
            height: 90
        });
        const dateBadge = new THREE.Mesh(
            new THREE.PlaneGeometry(0.85, 0.32),
            new THREE.MeshBasicMaterial({ map: dateTex, transparent: true, side: THREE.DoubleSide, depthTest: false, depthWrite: false })
        );
        dateBadge.position.set(1.45, 2.85, 0.20);
        dateBadge.renderOrder = 99999;
        group.add(dateBadge);

        // Cho cả biển chữ và ngày tháng xoay mặt theo camera (Billboard) để nhìn từ góc nào cũng rõ
        activeProps.push({ type: 'billboard_badge', mesh: hanoiBadge, baseY: stBasePos.y + 2.85 });
        activeProps.push({ type: 'billboard_badge', mesh: dateBadge, baseY: stBasePos.y + 2.85 });

        // Vòng hào quang ánh sáng xoay quanh
        const auraGeo = new THREE.TorusGeometry(1.5, 0.025, 16, 48);
        const auraMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.rotation.x = Math.PI / 2;
        auraMesh.position.set(0, 1.2, 0.15);
        group.add(auraMesh);

        // Kích hoạt pháo hoa bùng nổ liên tục
        activeProps.push({
            type: 'continuous_fireworks',
            centerPos: new THREE.Vector3(stBasePos.x, stBasePos.y + 2.5, stBasePos.z),
            timer: 0,
            interval: 0.55
        });

        dynamicPropsGroup.add(group);
    }

    // 6. MỐC 8: TÍCH HỢP BẢNG ĐIỀU KHIỂN ÂM THANH "TUYÊN NGÔN ĐỘC LẬP" (CẮT 23S ĐẦU)
    function initAudioControlUI() {
        let el = document.getElementById('loci-station8-audio-controller');
        if (el) return;

        el = document.createElement('div');
        el.id = 'loci-station8-audio-controller';
        el.style.cssText = `
            display: none;
            position: fixed;
            bottom: 24px;
            right: 28px;
            z-index: 999999;
            background: rgba(15, 23, 42, 0.94);
            border: 1.5px solid rgba(245, 158, 11, 0.7);
            border-radius: 18px;
            padding: 12px 18px;
            box-shadow: 0 12px 36px rgba(0,0,0,0.65), 0 0 20px rgba(245, 158, 11, 0.25);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            font-family: 'Outfit', -apple-system, sans-serif;
            color: #ffffff;
            width: 330px;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        `;

        el.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px; animation: pulse 1.5s infinite;"></span>
                    <div>
                        <div style="font-size:12.5px; font-weight:800; color:#fbbf24; line-height:1.2;">TUYÊN NGÔN ĐỘC LẬP</div>
                        <div style="font-size:10.5px; color:#cbd5e1;">Chủ tịch Hồ Chí Minh (2/9/1945)</div>
                    </div>
                </div>
                <button id="st8-audio-close-btn" style="background:transparent; border:none; color:#94a3b8; font-size:16px; cursor:pointer; padding:2px 6px;">✕</button>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:8px;">
                <button id="st8-audio-play-toggle" style="background:linear-gradient(135deg, #f59e0b, #d97706); color:#0f172a; border:none; border-radius:99px; width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; cursor:pointer; box-shadow:0 4px 12px rgba(245, 158, 11, 0.4); flex-shrink:0;">
                    ▶
                </button>
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-bottom:4px;">
                        <span id="st8-audio-current-time">00:00</span>
                        <span id="st8-audio-duration">06:59</span>
                    </div>
                    <div style="position:relative; width:100%; height:5px; background:rgba(255,255,255,0.15); border-radius:3px; cursor:pointer;" id="st8-progress-bar-bg">
                        <div id="st8-progress-bar" style="position:absolute; left:0; top:0; height:100%; width:0%; background:#fbbf24; border-radius:3px; transition:width 0.1s linear;"></div>
                    </div>
                </div>
                <button id="st8-audio-mute-toggle" style="background:rgba(255,255,255,0.08); color:#f8fafc; border:1px solid rgba(255,255,255,0.15); border-radius:50%; width:34px; height:34px; display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; flex-shrink:0;">
                    🔊
                </button>
            </div>
            <div style="font-size:10px; color:#10b981; margin-top:6px; text-align:center; display:flex; align-items:center; justify-content:center; gap:4px;">
                <span></span> Đã cắt bỏ 23s đầu theo đúng lời Bác: "Hỡi đồng bào cả nước..."
            </div>
        `;

        document.body.appendChild(el);
        audioControlUI = el;

        // Gắn sự kiện giao diện
        const playBtn = document.getElementById('st8-audio-play-toggle');
        const muteBtn = document.getElementById('st8-audio-mute-toggle');
        const closeBtn = document.getElementById('st8-audio-close-btn');
        const progressBg = document.getElementById('st8-progress-bar-bg');

        if (playBtn) playBtn.onclick = toggleAudioPlayback;
        if (muteBtn) muteBtn.onclick = toggleAudioMute;
        if (closeBtn) closeBtn.onclick = () => {
            if (audioPlayer) audioPlayer.pause();
            if (audioControlUI) audioControlUI.style.display = 'none';
        };
        if (progressBg) progressBg.onclick = (e) => {
            if (!audioPlayer || !audioPlayer.duration) return;
            const rect = progressBg.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = clickPos * audioPlayer.duration;
        };
    }

    function ensureAudioPlayer() {
        if (!audioPlayer) {
            audioPlayer = new Audio();
            const pName = (typeof window !== 'undefined' && window.location) ? window.location.pathname : '';
            const prefix = pName.includes('/app/') ? '../' : './';
            audioPlayer.src = prefix + 'assets/audio/tuyen_ngon_doc_lap_1945.mp3';
            audioPlayer.volume = currentAudioVolume;

            audioPlayer.ontimeupdate = () => {
                const cur = audioPlayer.currentTime;
                const dur = audioPlayer.duration || 419;
                const curSpan = document.getElementById('st8-audio-current-time');
                const durSpan = document.getElementById('st8-audio-duration');
                const progBar = document.getElementById('st8-progress-bar');

                if (curSpan) curSpan.textContent = formatTime(cur);
                if (durSpan && isFinite(dur)) durSpan.textContent = formatTime(dur);
                if (progBar && dur > 0) progBar.style.width = (cur / dur * 100) + '%';
            };

            audioPlayer.onended = () => {
                isAudioPlaying = false;
                const playBtn = document.getElementById('st8-audio-play-toggle');
                if (playBtn) playBtn.textContent = '▶';
            };
        }
        return audioPlayer;
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    function toggleAudioPlayback() {
        const player = ensureAudioPlayer();
        const playBtn = document.getElementById('st8-audio-play-toggle');
        if (player.paused) {
            player.play().then(() => {
                isAudioPlaying = true;
                if (playBtn) playBtn.textContent = '⏸';
            }).catch(e => {
                console.warn('[Bai6Director] Cần tương tác người dùng để phát âm thanh:', e);
            });
        } else {
            player.pause();
            isAudioPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
        }
    }

    function toggleAudioMute() {
        const player = ensureAudioPlayer();
        const muteBtn = document.getElementById('st8-audio-mute-toggle');
        isAudioMuted = !isAudioMuted;
        player.muted = isAudioMuted;
        if (muteBtn) muteBtn.textContent = isAudioMuted ? '🔇' : '🔊';
    }

    function startStation8Audio() {
        if (!audioControlUI) initAudioControlUI();
        if (audioControlUI) audioControlUI.style.display = 'block';

        const player = ensureAudioPlayer();
        const playBtn = document.getElementById('st8-audio-play-toggle');

        player.play().then(() => {
            isAudioPlaying = true;
            if (playBtn) playBtn.textContent = '⏸';
        }).catch(err => {
            console.log('[Bai6Director] Chờ tương tác người dùng để phát bài phát biểu:', err);
            isAudioPlaying = false;
            if (playBtn) playBtn.textContent = '▶';
        });
    }

    function stopStation8Audio() {
        if (audioPlayer) {
            audioPlayer.pause();
            isAudioPlaying = false;
        }
        if (audioControlUI) {
            audioControlUI.style.display = 'none';
        }
    }

    // 7. MỐC 9: BỤC KHẢI HOÀN TOÀN THẮNG & Ý NGHĨA LỊCH SỬ VĨ ĐẠI
    function createMoc9VictoryMonument(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Lá cờ Tổ quốc Việt Nam tung bay trên đỉnh đài chiến thắng
        const flagTex = createVietnamFlagTexture();
        createWavingFlagProp(flagTex, new THREE.Vector3(stBasePos.x, stBasePos.y + 0.1, stBasePos.z), {
            poleHeight: 2.6,
            flagWidth: 1.45,
            flagHeight: 0.95
        });

        // Vòng nguyệt quế vàng rực rỡ tỏa quang
        const laurelGeo = new THREE.TorusGeometry(1.35, 0.035, 16, 48);
        const laurelMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
        const laurelMesh = new THREE.Mesh(laurelGeo, laurelMat);
        laurelMesh.rotation.x = Math.PI / 2;
        laurelMesh.position.set(0, 1.4, 0);
        group.add(laurelMesh);

        // Biển chữ Tổng kết Ý nghĩa Lịch sử Vĩ đại
        const triumphTex = createTextTexture('CÁCH MẠNG THÁNG TÁM 1945 TOÀN THẮNG\nKhai sinh Nước Việt Nam Dân chủ Cộng hòa!', {
            bg: 'linear-gradient(135deg, rgba(185, 28, 28, 0.95), rgba(15, 23, 42, 0.95))',
            border: '#fde047',
            borderWidth: 6,
            color: '#facc15',
            font: 'bold 26px "Outfit", serif',
            radius: 16,
            width: 512,
            height: 140
        });
        const triumphBadge = new THREE.Mesh(
            new THREE.PlaneGeometry(2.0, 0.55),
            new THREE.MeshBasicMaterial({ map: triumphTex, transparent: true, side: THREE.DoubleSide })
        );
        triumphBadge.position.set(0, 2.3, 0);
        group.add(triumphBadge);

        // Kích hoạt pháo hoa ăn mừng toàn quốc
        activeProps.push({
            type: 'continuous_fireworks',
            centerPos: new THREE.Vector3(stBasePos.x, stBasePos.y + 2.6, stBasePos.z),
            timer: 0,
            interval: 0.45
        });

        dynamicPropsGroup.add(group);
    }

    // ──────────────────────────────────────────────────────────────────────────
    // HÀM ĐIỀU PHỐI CHÍNH KHI NGƯỜI DÙNG CHUYỂN BƯỚC / PHẦN (ON STEP CHANGE)
    // ──────────────────────────────────────────────────────────────────────────
    function onStepChange(stationOrder, stepIdx, locus) {
        if (!THREE) init();
        if (!directorGroup) return;

        activeStationOrder = stationOrder;
        activeStepIdx = stepIdx;
        clearDynamicProps();

        // Nếu rời khỏi Trạm 8 thì dừng phát âm thanh
        if (stationOrder !== 8) {
            stopStation8Audio();
        }

        const stBase = getStationBasePos(stationOrder);
        hasDualArrows = false;

        console.log(`[Bai6SpatialDirector] Điều phối Mốc ${stationOrder} — Phần ${stepIdx + 1}`);

        // ==========================================
        // MỐC 1: BÃO LỬA THẾ GIỚI — THỜI CƠ NGÀN NĂM CÓ MỘT
        // ==========================================
        if (stationOrder === 1) {
            if (stepIdx === 0) {
                // Phần 1: Mỹ ném 2 quả bom nguyên tử -> Mũi tên chỉ vào bục bom nguyên tử
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.45, stBase.z + 0.15);
                currentPos.copy(targetPos);

                createFloatingBadge('6/8 & 9/8: Hai quả bom nguyên tử giáng xuống Hi-rô-si-ma & Na-ga-xa-ki',
                    new THREE.Vector3(stBase.x, stBase.y + 2.05, stBase.z + 0.15),
                    { border: '#ef4444' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: Hồng quân Liên Xô tấn công Mãn Châu -> CỜ LIÊN XÔ BAY LÊN + PHÁO HOA ĂN MỪNG
                const ussrTex = createSovietFlagTexture();
                createWavingFlagProp(ussrTex, new THREE.Vector3(stBase.x - 0.75, stBase.y + 0.1, stBase.z - 0.4), {
                    riseUp: true,
                    poleHeight: 2.5
                });

                // Bắn pháo hoa rực rỡ chúc mừng đòn sấm sét của Liên Xô
                triggerFireworkExplosion(new THREE.Vector3(stBase.x - 0.75, stBase.y + 2.6, stBase.z - 0.4), 0xef4444, 45);
                triggerFireworkExplosion(new THREE.Vector3(stBase.x + 0.75, stBase.y + 2.4, stBase.z - 0.2), 0xf59e0b, 45);

                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.65, stBase.y + 1.45, stBase.z - 0.35);
                currentPos.copy(targetPos);

                createFloatingBadge('9/8: Quân đội Xô viết đè bẹp 1 triệu quân Quan Đông của Nhật!',
                    new THREE.Vector3(stBase.x, stBase.y + 2.2, stBase.z),
                    { border: '#dc2626', bg: 'rgba(153, 27, 27, 0.92)' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Nhật đầu hàng 15/8 -> Mũi tên chỉ vào cờ trắng đầu hàng & lính Nhật
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.45, stBase.y + 1.35, stBase.z + 0.15);
                currentPos.copy(targetPos);

                // Giữ cờ Liên Xô tung bay uy nghi
                const ussrTex = createSovietFlagTexture();
                createWavingFlagProp(ussrTex, new THREE.Vector3(stBase.x - 0.75, stBase.y + 0.1, stBase.z - 0.4));

                createFloatingBadge('15/8: Nhật Hoàng tuyên bố đầu hàng — Thời cơ ngàn năm có một xuất hiện!',
                    new THREE.Vector3(stBase.x, stBase.y + 2.05, stBase.z),
                    { border: '#f59e0b', color: '#fef08a' }
                );
            }
        }

        // ==========================================
        // MỐC 2: LÁN NÀ NƯA — CAO TRÀO KHÁNG NHẬT & QUÂN LỆNH SỐ 1
        // ==========================================
        else if (stationOrder === 2) {
            if (stepIdx === 0) {
                // Phần 1: Chỉ vào model NHỮNG NGƯỜI DÂN KHỞI NGHĨA (phong_trao_khang_nhat_opt.glb tại x: -1.25)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 1.25, stBase.y + 1.45, stBase.z + 0.32);
                currentPos.copy(targetPos);

                createFloatingBadge('Cao trào Kháng Nhật cứu nước & Phá kho thóc Nhật cứu đói',
                    new THREE.Vector3(stBase.x - 1.25, stBase.y + 2.0, stBase.z + 0.32),
                    { border: '#10b981' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: Chỉ vào NHÓM NGƯỜI ÁO TRẮNG (uy_ban_quan_lenh_1_opt.glb tại x: +1.25)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 1.25, stBase.y + 1.45, stBase.z + 0.32);
                currentPos.copy(targetPos);

                createFloatingBadge('Ủy ban Khởi nghĩa Toàn quốc & Quân lệnh số 1 (Đêm 13/8)',
                    new THREE.Vector3(stBase.x + 1.25, stBase.y + 2.0, stBase.z + 0.32),
                    { border: '#f59e0b' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Chỉ vào CÁI CÒN LẠI (Lán Nà Nưa tại x: 0, z: -0.45)
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.45, stBase.z - 0.45);
                currentPos.copy(targetPos);

                createFloatingBadge('Lán Nà Nưa: "Dù phải đốt cháy cả dãy Trường Sơn cũng phải giành độc lập!"',
                    new THREE.Vector3(stBase.x, stBase.y + 2.05, stBase.z - 0.45),
                    { border: '#ef4444', font: 'bold 24px sans-serif' }
                );
            }
        }

        // ==========================================
        // MỐC 3: ĐÌNH TÂN TRÀO — ĐẠI HỘI QUỐC DÂN & BÁC HỒ
        // ==========================================
        else if (stationOrder === 3) {
            if (stepIdx === 0) {
                // Phần 1: Chỉ vào BÁC ĐANG TRÒ CHUYỆN VỚI NGƯỜI DÂN (tại vị trí Bác Hồ & người dân: x: 0.20, z: 0.15)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.20, stBase.y + 1.45, stBase.z + 0.15);
                currentPos.copy(targetPos);

                createFloatingBadge('Bác Hồ trò chuyện thân mật cùng các đại biểu & nhân dân',
                    new THREE.Vector3(stBase.x + 0.20, stBase.y + 2.05, stBase.z + 0.15),
                    { border: '#f59e0b' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: Chỉ vào NHÓM NGƯỜI ĐANG ĐỨNG (nguoi_dan.glb tại x: 0.55, z: 0.40)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.55, stBase.y + 1.45, stBase.z + 0.40);
                currentPos.copy(targetPos);

                createFloatingBadge('Các đại biểu Quốc dân Đại hội Tân Trào thông qua 10 Chính sách Việt Minh',
                    new THREE.Vector3(stBase.x + 0.55, stBase.y + 2.05, stBase.z + 0.40),
                    { border: '#10b981', font: 'bold 25px sans-serif' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Chỉ ra BÁC HỒ + ẢNH BÁC XUẤT HIỆN PHÍA SAU
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.15, stBase.y + 1.45, stBase.z - 0.05);
                currentPos.copy(targetPos);

                // Hiện chân dung Bác Hồ lịch sử trang nghiêm phía sau
                createBacHoHistoricPortrait(stBase);

                createFloatingBadge('Cử ra Ủy ban Dân tộc Giải phóng — CHỦ TỊCH HỒ CHÍ MINH',
                    new THREE.Vector3(stBase.x - 0.15, stBase.y + 2.65, stBase.z - 0.05),
                    { border: '#ffd700', bg: 'rgba(217, 119, 6, 0.95)' }
                );
            }
        }

        // ==========================================
        // MỐC 4: CÂY ĐA TÂN TRÀO — XUẤT QUÂN GIẢI PHÓNG THÁI NGUYÊN
        // ==========================================
        else if (stationOrder === 4) {
            if (stepIdx === 0) {
                // Phần 1: Chuyển cây đa Tân Trào từ mốc 3 sang để chỉ nó ở phần 1
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.70, stBase.y + 1.75, stBase.z - 0.25);
                currentPos.copy(targetPos);

                createFloatingBadge('Dưới bóng Cây Đa Tân Trào: Đ/c Võ Nguyên Giáp đọc Quân lệnh số 1 xuất quân',
                    new THREE.Vector3(stBase.x - 0.70, stBase.y + 2.45, stBase.z - 0.25),
                    { border: '#10b981', font: 'bold 24px sans-serif' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: Chỉ vào model kia (đoàn quân khởi nghĩa nguoi_dan_khoi_nghia.glb tại x: +0.35)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.35, stBase.y + 1.55, stBase.z + 0.10);
                currentPos.copy(targetPos);

                createFloatingBadge('4 Tỉnh giành chính quyền sớm nhất (18/8): Bắc Giang • Hải Dương • Hà Tĩnh • Quảng Nam',
                    new THREE.Vector3(stBase.x + 0.35, stBase.y + 2.15, stBase.z + 0.10),
                    { border: '#ef4444', font: 'bold 24px sans-serif' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Tiếp tục chỉ vào model đoàn quân khởi nghĩa tiến về Thái Nguyên & Hà Nội
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.35, stBase.y + 1.55, stBase.z + 0.10);
                currentPos.copy(targetPos);

                createFloatingBadge('Đội Giải phóng quân tiến về giải phóng thị xã Thái Nguyên — Mở đường về Hà Nội!',
                    new THREE.Vector3(stBase.x + 0.35, stBase.y + 2.15, stBase.z + 0.10),
                    { border: '#f59e0b', font: 'bold 24px sans-serif' }
                );
            }
        }

        // ==========================================
        // MỐC 5: NHÀ HÁT LỚN HÀ NỘI — KHỞI NGHĨA THỦ ĐÔ (19/8)
        // ==========================================
        else if (stationOrder === 5) {
            if (stepIdx === 0) {
                // Phần 1: Chỉ vào model NHÀ HÁT LỚN HÀ NỘI
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.65, stBase.z + 0.15);
                currentPos.copy(targetPos);

                createFloatingBadge('Quảng trường Nhà hát Lớn: Biển người mít tinh rầm rộ sáng 19/8/1945',
                    new THREE.Vector3(stBase.x, stBase.y + 2.3, stBase.z + 0.15),
                    { border: '#ef4444' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: CÁC MŨI TÊN CHỈA RA NHIỀU HƯỚNG VÀ CHỈ VÀO 5 CƠ QUAN ĐẦU NÃO:
                // Bắc Bộ Phủ, Sở Mật Thám, Trại Lính Bảo An, Kho Bạc, Nhà Bưu Điện
                createMoc5FiveAttackArrows(stBase);

                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.85, stBase.z + 0.15);
                currentPos.copy(targetPos);

                createFloatingBadge('Quần chúng chia thành các cánh quân đánh chiếm 5 cơ quan đầu não phát xít',
                    new THREE.Vector3(stBase.x, stBase.y + 2.5, stBase.z + 0.15),
                    { border: '#f59e0b', font: 'bold 24px sans-serif' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Chữ "HÀ NỘI" + PHÁO HOA CHÚC MỪNG + NGÀY THÁNG BÊN CẠNH
                createMoc5HanoiVictoryCelebration(stBase);

                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.85, stBase.z + 0.15);
                currentPos.copy(targetPos);
            }
        }

        // ==========================================
        // MỐC 6: CỐ ĐÔ HUẾ & SÀI GÒN QUẬT KHỞI (23/8 & 25/8)
        // ==========================================
        else if (stationOrder === 6) {
            if (stepIdx === 0) {
                // Phần 1: Khởi nghĩa ở HUẾ (23/8) -> Chỉ vào mô hình Cố đô Huế (co_do_hue.glb tại x: -0.70)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.70, stBase.y + 1.45, stBase.z);
                currentPos.copy(targetPos);

                createFloatingBadge('23/8/1945: Quần chúng đánh chiếm các công sở, khởi nghĩa thắng lợi ở HUẾ',
                    new THREE.Vector3(stBase.x - 0.70, stBase.y + 2.1, stBase.z),
                    { border: '#f59e0b' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: Khởi nghĩa ở SÀI GÒN (25/8) -> Chỉ vào mô hình Dành khởi nghĩa cuối cùng (x: +0.70)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.70, stBase.y + 1.45, stBase.z);
                currentPos.copy(targetPos);

                createFloatingBadge('25/8/1945: Hơn 1 triệu đồng bào biểu tình thị uy, thắng lợi rực rỡ ở SÀI GÒN',
                    new THREE.Vector3(stBase.x + 0.70, stBase.y + 2.1, stBase.z),
                    { border: '#10b981' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Đồng Nai Thượng & Hà Tiên (28/8) -> Tổng khởi nghĩa thắng lợi hoàn toàn
                hasDualArrows = true;
                focusArrow.visible = true;
                focusArrow2.visible = true;
                targetPos.set(stBase.x - 0.70, stBase.y + 1.45, stBase.z);
                targetPos2.set(stBase.x + 0.70, stBase.y + 1.45, stBase.z);
                currentPos.copy(targetPos);
                currentPos2.copy(targetPos2);

                createFloatingBadge('28/8/1945: ĐỒNG NAI THƯỢNG & HÀ TIÊN giành chính quyền — Toàn quốc toàn thắng!',
                    new THREE.Vector3(stBase.x, stBase.y + 2.25, stBase.z),
                    { border: '#ffd700', bg: 'rgba(217, 119, 6, 0.95)' }
                );
            }
        }

        // ==========================================
        // MỐC 7: CỬA NGỌ MÔN HUẾ — VUA BẢO ĐẠI THOÁI VỊ (30/8)
        // ==========================================
        else if (stationOrder === 7) {
            if (stepIdx === 0) {
                // Phần 1: Chiều 30/8 trước Cửa Ngọ Môn
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.55, stBase.z - 0.15);
                currentPos.copy(targetPos);

                createFloatingBadge('Chiều 30/8/1945: Hàng vạn quần chúng dự lễ thoái vị trước Cửa Ngọ Môn (Huế)',
                    new THREE.Vector3(stBase.x, stBase.y + 2.2, stBase.z - 0.15),
                    { border: '#d97706' }
                );
            } else if (stepIdx === 1) {
                // Phần 2: Chỉ vào model Vua Bảo Đại trao ấn kiếm thoái vị
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.55, stBase.z - 0.15);
                currentPos.copy(targetPos);

                createFloatingBadge('Vua Bảo Đại đọc Chiếu thoái vị, trao Quốc ấn vàng & Bảo kiếm ngọc cho Chính phủ',
                    new THREE.Vector3(stBase.x, stBase.y + 2.2, stBase.z - 0.15),
                    { border: '#ef4444' }
                );
            } else if (stepIdx === 2) {
                // Phần 3: Tiếp tục chỉ vào model + LÁ CỜ VIỆT NAM TUNG BAY PHẤP PHỚI
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.55, stBase.z - 0.15);
                currentPos.copy(targetPos);

                // Cờ đỏ sao vàng tung bay rực rỡ trên Kỳ Đài Huế
                const flagTex = createVietnamFlagTexture();
                createWavingFlagProp(flagTex, new THREE.Vector3(stBase.x + 0.85, stBase.y + 0.1, stBase.z - 0.35), {
                    riseUp: true,
                    poleHeight: 2.6
                });

                createFloatingBadge('Cờ đỏ sao vàng tung bay trên đỉnh Kỳ Đài — Xóa bỏ chế độ phong kiến hơn 1.000 năm!',
                    new THREE.Vector3(stBase.x, stBase.y + 2.3, stBase.z - 0.15),
                    { border: '#ffd700', bg: 'rgba(185, 28, 28, 0.95)' }
                );
            }
        }

        // ==========================================
        // MỐC 8: QUẢNG TRƯỜNG BA ĐÌNH — TUYÊN NGÔN ĐỘC LẬP (2/9)
        // ==========================================
        else if (stationOrder === 8) {
            // Mũi tên chỉ vào Bác Hồ đọc Tuyên ngôn Độc lập
            focusArrow.visible = true;
            targetPos.set(stBase.x, stBase.y + 1.65, stBase.z - 0.15);
            currentPos.copy(targetPos);

            // Bật bộ phát âm thanh đã cắt 23s đầu
            startStation8Audio();

            createFloatingBadge('2/9/1945: Bác Hồ đọc "TUYÊN NGÔN ĐỘC LẬP" tại Quảng trường Ba Đình',
                new THREE.Vector3(stBase.x, stBase.y + 2.35, stBase.z - 0.15),
                { border: '#ffd700', bg: 'rgba(217, 119, 6, 0.95)' }
            );
        }

        // ==========================================
        // MỐC 9: BỤC TỔNG KẾT — KHÚC KHẢI HOÀN TOÀN THẮNG & Ý NGHĨA
        // ==========================================
        else if (stationOrder === 9) {
            // Sa bàn chiến thắng vĩ đại: Đài sen vàng, Cờ Tổ quốc tung bay, Pháo hoa đại thắng
            createMoc9VictoryMonument(stBase);

            focusArrow.visible = true;
            targetPos.set(stBase.x, stBase.y + 1.75, stBase.z);
            currentPos.copy(targetPos);

            if (stepIdx === 0) {
                createFloatingBadge('NGUYÊN NHÂN THẮNG LỢI: Sự lãnh đạo của Đảng & Truyền thống yêu nước vĩ đại',
                    new THREE.Vector3(stBase.x, stBase.y + 1.9, stBase.z + 0.65),
                    { border: '#f59e0b', font: 'bold 24px sans-serif' }
                );
            } else if (stepIdx === 1) {
                createFloatingBadge('Ý NGHĨA LỊCH SỬ: Đập tan xiềng xích thực dân & phong kiến — Khai sinh Nước VNDCCH!',
                    new THREE.Vector3(stBase.x, stBase.y + 1.9, stBase.z + 0.65),
                    { border: '#ef4444', font: 'bold 24px sans-serif' }
                );
            } else if (stepIdx === 2) {
                createFloatingBadge('3 BÀI HỌC KINH NGHIỆM: Sự lãnh đạo của Đảng • Liên minh công nông • Nắm chắc thời cơ',
                    new THREE.Vector3(stBase.x, stBase.y + 1.9, stBase.z + 0.65),
                    { border: '#10b981', font: 'bold 24px sans-serif' }
                );
            }
        }
    }

    function onStationOpen(stationOrder, locus) {
        onStepChange(stationOrder, 0, locus);
    }

    function onStationClose() {
        clearDynamicProps();
        stopStation8Audio();
        activeStationOrder = null;
        activeStepIdx = null;
    }

    // ──────────────────────────────────────────────────────────────────────────
    // CẬP NHẬT ANIMATION HÀNG FRAME TRONG VÒNG LẶP RENDER LOOP (60 FPS)
    // ──────────────────────────────────────────────────────────────────────────
    function update(delta, time) {
        if (!THREE || !directorGroup) return;

        // 1. Cập nhật vị trí Mũi tên chính (Lerp chuyển động mượt mà)
        if (focusArrow && focusArrow.visible) {
            currentPos.lerp(targetPos, Math.min(delta * 7.0, 1.0));
            focusArrow.position.copy(currentPos);
            focusArrow.position.y += Math.sin(time * 3.5) * 0.08;
            if (focusArrow.userData && focusArrow.userData.reticle) {
                focusArrow.userData.reticle.rotation.z += delta * 1.5;
            }
        }

        // 2. Cập nhật Mũi tên phụ (nếu có 2 mục tiêu)
        if (hasDualArrows && focusArrow2 && focusArrow2.visible) {
            currentPos2.lerp(targetPos2, Math.min(delta * 7.0, 1.0));
            focusArrow2.position.copy(currentPos2);
            focusArrow2.position.y += Math.cos(time * 3.5) * 0.08;
            if (focusArrow2.userData && focusArrow2.userData.reticle) {
                focusArrow2.userData.reticle.rotation.z -= delta * 1.5;
            }
        }

        // 3. Cập nhật các đạo cụ động
        for (let i = 0; i < activeProps.length; i++) {
            const p = activeProps[i];

            // Lá cờ lượn sóng
            if (p.type === 'waving_flag') {
                // Hiệu ứng cờ bay vút lên từ dưới sàn
                if (p.group && p.group.userData && p.group.userData.isRising) {
                    p.group.position.y += (p.group.userData.targetY - p.group.position.y) * Math.min(delta * 3.5, 1.0);
                    if (Math.abs(p.group.userData.targetY - p.group.position.y) < 0.02) {
                        p.group.position.y = p.group.userData.targetY;
                        p.group.userData.isRising = false;
                    }
                }

                // Sóng cờ uốn lượn mềm mại
                const pos = p.posAttr;
                const orig = p.origPositions;
                const count = pos.count;
                for (let k = 0; k < count; k++) {
                    const ox = orig[k * 3];
                    const oz = orig[k * 3 + 2];
                    const waveFactor = (ox + 0.65) / 1.35;
                    const z = oz + Math.sin(ox * 5.0 + time * p.speed) * p.amplitude * waveFactor;
                    pos.setZ(k, z);
                }
                pos.needsUpdate = true;
            }

            // Chân dung Bác Hồ phóng to mềm mại
            else if (p.type === 'portrait_fade_in') {
                if (p.group && p.group.userData.currentScale < p.group.userData.targetScale) {
                    p.group.userData.currentScale += (p.group.userData.targetScale - p.group.userData.currentScale) * Math.min(delta * 4.0, 1.0);
                    const s = p.group.userData.currentScale;
                    p.group.scale.set(s, s, s);
                }
                if (p.haloMesh) {
                    p.haloMesh.rotation.z += delta * 0.8;
                }
            }

            // 5 Mũi tên tiến công Mốc 5 đập nhịp năng lượng
            else if (p.type === 'pulse_arrows') {
                p.time += delta;
                const scaleVal = 1.0 + Math.sin(p.time * 4.5) * 0.05;
                p.group.scale.set(scaleVal, 1.0, scaleVal);
            }

            // Bắn pháo hoa liên tục (Mốc 5 & Mốc 9)
            else if (p.type === 'continuous_fireworks') {
                p.timer += delta;
                if (p.timer >= p.interval) {
                    p.timer = 0;
                    const offsetX = (Math.random() - 0.5) * 1.8;
                    const offsetZ = (Math.random() - 0.5) * 1.8;
                    const burstPos = p.centerPos.clone().add(new THREE.Vector3(offsetX, Math.random() * 0.8, offsetZ));
                    const colors = [0xf59e0b, 0xef4444, 0x10b981, 0xffd700, 0x38bdf8];
                    const col = colors[Math.floor(Math.random() * colors.length)];
                    triggerFireworkExplosion(burstPos, col, 36);
                }
            }

            // Từng vụ nổ pháo hoa hạt
            else if (p.type === 'firework_burst') {
                p.life -= delta;
                const posArr = p.positions;
                const vels = p.velocities;
                const count = vels.length;

                for (let k = 0; k < count; k++) {
                    const v = vels[k];
                    posArr[k * 3] += v.x * delta;
                    posArr[k * 3 + 1] += v.y * delta;
                    posArr[k * 3 + 2] += v.z * delta;
                    v.y -= 2.2 * delta; // Trọng lực
                }

                p.mesh.geometry.attributes.position.needsUpdate = true;
                if (p.mesh.material) {
                    p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
                }

                if (p.life <= 0) {
                    if (dynamicPropsGroup) dynamicPropsGroup.remove(p.mesh);
                    if (p.mesh.geometry) p.mesh.geometry.dispose();
                    if (p.mesh.material) p.mesh.material.dispose();
                    activeProps.splice(i, 1);
                    i--;
                }
            }

            // Biển chữ xoay mặt về phía camera (Billboard)
            else if (p.type === 'billboard_badge') {
                if (window.camera) {
                    p.mesh.quaternion.copy(window.camera.quaternion);
                    p.mesh.position.y = p.baseY + Math.sin(time * 2.8) * 0.035;
                }
            }
        }
    }

    // Xuất khẩu đối tượng ra toàn cục
    window.Bai6SpatialDirector = {
        init,
        onStepChange,
        onStationOpen,
        onStationClose,
        update,
        toggleAudio: toggleAudioPlayback,
        toggleMute: toggleAudioMute
    };

    // Tự động khởi tạo khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 500);
        });
    } else {
        setTimeout(init, 500);
    }

})(window);
