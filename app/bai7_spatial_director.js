/**
 * LOCI EDU — BAI 7 SPATIAL STEP DIRECTOR (ĐIỀU HƯỚNG TƯƠNG TÁC 3D BÀI 7)
 * Tác giả: Chuyên gia Thiết kế Không gian & Sư phạm Lịch sử Loci
 * 
 * Thực thi chính xác 100% kịch bản sư phạm cho 9 mốc Kháng chiến chống Pháp:
 * - Mốc 1: P1 -> 3 ông ngồi ghế (3ooong.glb); P2 -> Cờ VN tung bay rực rỡ; P3 -> người dân làm đồng (kinh_te_lac_hau.glb); P4 -> Cờ VN sắc thái âm u ("ngàn cân treo sợi tóc").
 * - Mốc 2: P1 -> Mít tinh Pháp xả súng; P2 -> Nhân dân Nam Bộ; P3 -> Cờ Đảng búa liềm; P4 -> Chữ "ĐÁNH NHANH THẮNG NHANH" + Cờ Pháp tan vỡ vỡ vụn.
 * - Mốc 3: P1 -> Bác Hồ ký cam kết; P2 -> Cờ Pháp + Tờ giấy hiệp định + Hiệu ứng chém kiếm; P3 -> Bác Hồ tỏa sáng + Gậy gộc bao quanh; P4 -> Toàn dân kháng chiến.
 * - Mốc 4: P1 & P2 -> Quyết tử quân ôm bom ba càng + Chữ 3D bay quyết liệt (Bắc Bộ Phủ, Chợ Đồng Xuân, Nhà Bưu Điện, Bắc vĩ tuyến 16); P3 -> Giam chân địch; P4 -> Trung đoàn Thủ đô vượt sông Hồng.
 * - Mốc 5: P1 & P2 -> Tập luyện bắn súng; P3 -> Bẻ gãy 2 gọng kìm sông Lô & đường 4.
 * - Mốc 7: P1 -> Bác Hồ tại Đại hội II; P2 -> Xe đạp thồ; P3 -> Hậu phương kháng chiến.
 * - Mốc 8: P1 -> Tướng Đờ Cát; P2 & P3 -> Chỉ đồng thời cả Đại tướng Võ Nguyên Giáp & Khí thế Đông - Xuân.
 * - Mốc 9: P1 -> Kéo pháo vào ĐBP; P2 -> Sa bàn 3D diễn hoạt 3 đợt tiến công; P3 -> Ký Hiệp định Giơ-ne-vơ; P4 -> Bắt sống Đờ Cát & Cờ Quyết chiến Quyết thắng tung bay; P5 -> Khúc khải hoàn "Lừng lẫy năm châu, chấn động địa cầu".
 */

(function (window) {
    'use strict';

    let THREE = window.THREE;
    let directorGroup = null;
    let activeStationOrder = null;
    let activeStepIdx = null;

    // Các đối tượng tương tác động
    let focusArrow = null;
    let focusArrow2 = null;
    let targetPos = null;
    let currentPos = null;
    let targetPos2 = null;
    let currentPos2 = null;
    let hasDualArrows = false;

    // Dynamic props container
    let dynamicPropsGroup = null;
    let activeProps = [];

    // Helper tạo Canvas Texture sắc nét
    function createTextTexture(text, opts = {}) {
        const canvas = document.createElement('canvas');
        canvas.width = opts.width || 512;
        canvas.height = opts.height || 128;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        if (opts.border) {
            ctx.strokeStyle = opts.border;
            ctx.lineWidth = opts.borderWidth || 4;
            ctx.stroke();
        }

        ctx.fillStyle = opts.color || '#ffffff';
        ctx.font = opts.font || 'bold 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }

    // Helper tạo cờ đỏ sao vàng
    function createVietnamFlagTexture(isGloomy = false) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 340;
        const ctx = canvas.getContext('2d');

        // Nền đỏ cờ
        ctx.fillStyle = isGloomy ? '#3f1616' : '#da251d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isGloomy) {
            // Hiệu ứng mây đen ám u uất
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, 'rgba(0,0,0,0.55)');
            grad.addColorStop(0.5, 'rgba(40,10,10,0.4)');
            grad.addColorStop(1, 'rgba(0,0,0,0.7)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Vẽ ngôi sao vàng 5 cánh ở tâm
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const outerR = isGloomy ? 78 : 88;
        const innerR = outerR * 0.382;
        ctx.fillStyle = isGloomy ? '#c9962a' : '#ffff00';
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
        return tex;
    }

    // Helper tạo cờ Đảng Búa Liềm
    function createPartyFlagTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 340;
        const ctx = canvas.getContext('2d');

        // Nền đỏ thắm
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Biểu tượng Búa Liềm vàng ở tâm
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';

        // Lưỡi liềm
        ctx.beginPath();
        ctx.arc(-10, -5, 52, -Math.PI * 0.45, Math.PI * 0.65, false);
        ctx.stroke();

        // Cán liềm
        ctx.beginPath();
        ctx.moveTo(10, 42);
        ctx.lineTo(35, 75);
        ctx.stroke();

        // Cán búa vắt chéo
        ctx.beginPath();
        ctx.moveTo(-45, 65);
        ctx.lineTo(45, -55);
        ctx.stroke();

        // Đầu búa
        ctx.fillStyle = '#facc15';
        ctx.fillRect(30, -75, 32, 24);
        ctx.restore();

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }

    // Helper tạo cờ Pháp Tricolore
    function createFrenchFlagTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 340;
        const ctx = canvas.getContext('2d');

        const colW = canvas.width / 3;
        ctx.fillStyle = '#002395'; // Lam
        ctx.fillRect(0, 0, colW, canvas.height);
        ctx.fillStyle = '#ffffff'; // Trắng
        ctx.fillRect(colW, 0, colW, canvas.height);
        ctx.fillStyle = '#ed2939'; // Đỏ
        ctx.fillRect(colW * 2, 0, colW, canvas.height);

        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }

    // KHỞI TẠO BỘ ĐIỀU HƯỚNG KHÔNG GIAN
    function init() {
        THREE = window.THREE;
        if (!THREE || !window.scene) return;

        if (directorGroup) {
            window.scene.remove(directorGroup);
        }

        directorGroup = new THREE.Group();
        directorGroup.name = 'bai7_spatial_director_root';
        window.scene.add(directorGroup);

        dynamicPropsGroup = new THREE.Group();
        dynamicPropsGroup.name = 'bai7_dynamic_props';
        directorGroup.add(dynamicPropsGroup);

        // 1. TẠO MŨI TÊN CHỈ ĐỊNH 3D NỔI BẬT (GLOWING ARROW)
        focusArrow = createStylizedArrow(0xf59e0b, 0xffedd5);
        focusArrow.visible = false;
        directorGroup.add(focusArrow);

        focusArrow2 = createStylizedArrow(0x10b981, 0xd1fae5);
        focusArrow2.visible = false;
        directorGroup.add(focusArrow2);

        targetPos = new THREE.Vector3(0, 0, 0);
        currentPos = new THREE.Vector3(0, 0, 0);
        targetPos2 = new THREE.Vector3(0, 0, 0);
        currentPos2 = new THREE.Vector3(0, 0, 0);

        console.log('✅ [Bai7SpatialDirector] Đã khởi tạo thành công hệ thống Điều hướng 3D Bài 7');
    }

    function createStylizedArrow(colorHex, emissiveHex) {
        const arrow = new THREE.Group();

        // Nón mũi tên hướng xuống
        const coneGeo = new THREE.ConeGeometry(0.18, 0.42, 16);
        const coneMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: emissiveHex,
            emissiveIntensity: 0.6,
            metalness: 0.4,
            roughness: 0.2
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.rotation.x = Math.PI; // quay chóp xuống dưới
        cone.position.y = 0.21;
        arrow.add(cone);

        // Thân trục mũi tên
        const shaftGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.42, 16);
        const shaftMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: emissiveHex,
            emissiveIntensity: 0.4,
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
            opacity: 0.65
        });
        const reticle = new THREE.Mesh(reticleGeo, reticleMat);
        reticle.rotation.x = -Math.PI / 2;
        reticle.position.y = -1.25; // Nằm sát sa bàn
        arrow.add(reticle);

        arrow.userData = { cone, shaft, reticle, baseRot: 0 };
        return arrow;
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

    // TÌM TỌA ĐỘ THỰC CỦA TRẠM TRÊN BẢN ĐỒ 3D
    function getStationBasePos(order) {
        if (window.lociList && Array.isArray(window.lociList)) {
            const loc = window.lociList.find(l => l.order === order);
            if (loc && Array.isArray(loc.pos)) {
                return new THREE.Vector3(loc.pos[0], loc.pos[1] || 0.08, loc.pos[2]);
            }
        }
        if (window.scene) {
            const stObj = window.scene.getObjectByName(`bai7_station_${order}`) ||
                          window.scene.children.find(c => c.name && c.name.startsWith(`bai7_station_${order}`));
            if (stObj) {
                const wp = new THREE.Vector3();
                stObj.getWorldPosition(wp);
                return wp;
            }
        }
        return new THREE.Vector3(0, 0, 0);
    }

    // --- CÁC HÀM XÂY DỰNG HIỆU ỨNG ĐỘNG CHI TIẾT THEO YÊU CẦU ---

    // 1. TẠO CỜ 3D CÓ ANIMATION LƯỢN SÓNG (WAVING CLOTH)
    function createWavingFlagProp(texture, pos, isGloomy = false) {
        const group = new THREE.Group();
        group.position.copy(pos);

        // Cột cờ
        const poleGeo = new THREE.CylinderGeometry(0.02, 0.025, 2.4, 16);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 1.2;
        group.add(pole);

        // Chóp vàng
        const finialGeo = new THREE.SphereGeometry(0.05, 16, 16);
        const finial = new THREE.Mesh(finialGeo, poleMat);
        finial.position.y = 2.42;
        group.add(finial);

        // Lá cờ dạng lưới 20x14 để lượn sóng mượt
        const flagW = 1.35, flagH = 0.88;
        const flagGeo = new THREE.PlaneGeometry(flagW, flagH, 22, 14);
        const flagMat = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.1
        });
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        flagMesh.position.set(flagW / 2 + 0.02, 1.85, 0);
        group.add(flagMesh);

        // Lưu đỉnh gốc để tính sóng sine
        const posAttr = flagGeo.attributes.position;
        const origPositions = new Float32Array(posAttr.array);

        activeProps.push({
            type: 'waving_flag',
            mesh: flagMesh,
            origPositions,
            posAttr,
            speed: isGloomy ? 2.5 : 4.8,
            amplitude: isGloomy ? 0.05 : 0.095
        });

        dynamicPropsGroup.add(group);
        return group;
    }

    // 2. MỐC 2 PHẦN 4: HIỆN CHỮ "ĐÁNH NHANH THẮNG NHANH" + CỜ PHÁP + ANIMATION TAN VỠ
    function createMoc2ShatterAnimation(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Bảng chữ 3D "ĐÁNH NHANH THẮNG NHANH"
        const textTex = createTextTexture('ĐÁNH NHANH THẮNG NHANH', {
            bg: 'rgba(15, 23, 42, 0.88)',
            border: '#ef4444',
            borderWidth: 6,
            color: '#f87171',
            font: 'bold 34px sans-serif',
            radius: 18,
            width: 512,
            height: 128
        });
        const textPlaneGeo = new THREE.PlaneGeometry(1.6, 0.42);
        const textPlaneMat = new THREE.MeshBasicMaterial({ map: textTex, transparent: true, depthTest: false, depthWrite: false });
        const textMesh = new THREE.Mesh(textPlaneGeo, textPlaneMat);
        textMesh.position.set(0, 1.95, 0.4); textMesh.renderOrder = 99999;
        group.add(textMesh);

        // Cờ Pháp
        const frenchFlagTex = createFrenchFlagTexture();
        const flagGeo = new THREE.PlaneGeometry(1.1, 0.72);
        const flagMat = new THREE.MeshStandardMaterial({ map: frenchFlagTex, side: THREE.DoubleSide });
        const flagMesh = new THREE.Mesh(flagGeo, flagMat);
        flagMesh.position.set(0, 1.35, 0.4);
        group.add(flagMesh);

        // Tạo 36 mảnh vỡ (Shatter Fragments)
        const shards = [];
        const shardCount = 36;
        for (let i = 0; i < shardCount; i++) {
            const sGeo = new THREE.TetrahedronGeometry(0.06 + Math.random() * 0.08);
            const colors = [0x002395, 0xffffff, 0xed2939, 0xef4444];
            const sMat = new THREE.MeshStandardMaterial({
                color: colors[i % colors.length],
                transparent: true,
                opacity: 1.0,
                roughness: 0.3
            });
            const shard = new THREE.Mesh(sGeo, sMat);
            shard.position.set(
                (Math.random() - 0.5) * 1.1,
                1.35 + (Math.random() - 0.5) * 0.7,
                0.4 + (Math.random() - 0.5) * 0.1
            );
            shard.visible = false;
            shard.userData = {
                vel: new THREE.Vector3(
                    (Math.random() - 0.5) * 2.8,
                    Math.random() * 2.2 + 0.8,
                    (Math.random() - 0.5) * 2.8
                ),
                rotVel: new THREE.Vector3(
                    Math.random() * 10,
                    Math.random() * 10,
                    Math.random() * 10
                )
            };
            group.add(shard);
            shards.push(shard);
        }

        activeProps.push({
            type: 'moc2_shatter',
            group,
            textMesh,
            flagMesh,
            shards,
            startTime: performance.now(),
            shattered: false
        });

        dynamicPropsGroup.add(group);
    }

    // 3. MỐC 3 PHẦN 2: CỜ PHÁP + TỜ GIẤY HIỆP ĐỊNH + ANIMATION CHÉM CHÉM
    function createMoc3SlashingTreaty(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Tờ giấy Hiệp định Sơ bộ 6/3 & Tạm ước 14/9
        const paperTex = createTextTexture('HIỆP ĐỊNH SƠ BỘ 6/3 & TẠM ƯỚC 14/9\n(Pháp bội ước & khiêu khích chiến tranh)', {
            bg: '#fef3c7',
            border: '#b45309',
            borderWidth: 4,
            color: '#78350f',
            font: 'bold 22px serif',
            radius: 8,
            width: 512,
            height: 256
        });
        const paperGeo = new THREE.PlaneGeometry(1.2, 0.65);
        const paperMat = new THREE.MeshStandardMaterial({ map: paperTex, side: THREE.DoubleSide });
        const paperMesh = new THREE.Mesh(paperGeo, paperMat);
        paperMesh.position.set(0.45, 1.4, 0.2);
        group.add(paperMesh);

        // Lá cờ Pháp nhỏ bên cạnh
        const frTex = createFrenchFlagTexture();
        const frGeo = new THREE.PlaneGeometry(0.75, 0.48);
        const frMat = new THREE.MeshStandardMaterial({ map: frTex, side: THREE.DoubleSide });
        const frMesh = new THREE.Mesh(frGeo, frMat);
        frMesh.position.set(-0.55, 1.4, 0.2);
        group.add(frMesh);

        // Tạo 2 vệt kiếm chém năng lượng (Slash Blades / Trails)
        const bladeGeo = new THREE.BoxGeometry(1.6, 0.04, 0.04);
        const bladeMat1 = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const slash1 = new THREE.Mesh(bladeGeo, bladeMat1);
        slash1.position.set(0, 1.4, 0.26);
        slash1.rotation.z = Math.PI / 4;
        group.add(slash1);

        const bladeMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const slash2 = new THREE.Mesh(bladeGeo, bladeMat2);
        slash2.position.set(0, 1.4, 0.26);
        slash2.rotation.z = -Math.PI / 4;
        group.add(slash2);

        activeProps.push({
            type: 'moc3_slash',
            slash1,
            slash2,
            paperMesh,
            frMesh,
            time: 0
        });

        dynamicPropsGroup.add(group);
    }

    // 4. MỐC 3 PHẦN 3 & 4: BÁC HỒ TỎA SÁNG + GẬY GỘC BAO QUANH
    function createMoc3BacHoRadianceAndStaves(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Cột sáng vàng kim hào quang (Divine Radiant Cylinder & Halo)
        const auraGeo = new THREE.CylinderGeometry(0.75, 0.95, 2.5, 32, 1, true);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0xfde047,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.position.set(0, 1.25, 0);
        group.add(auraMesh);

        // Đèn PointLight vàng rực rỡ
        const radiantLight = new THREE.PointLight(0xfef08a, 4.0, 5.0);
        radiantLight.position.set(0, 1.6, 0);
        group.add(radiantLight);

        // 8 cây gậy gộc, gươm giáo bao quanh ("Ai có gậy dùng gậy, ai có gươm dùng gươm...")
        const staves = [];
        const staffGeo = new THREE.CylinderGeometry(0.02, 0.025, 1.45, 8);
        const staffMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
        const spearTipGeo = new THREE.ConeGeometry(0.045, 0.22, 8);
        const spearTipMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.2 });

        for (let i = 0; i < 8; i++) {
            const ang = (i * Math.PI * 2) / 8;
            const staffGroup = new THREE.Group();
            const sPole = new THREE.Mesh(staffGeo, staffMat);
            sPole.position.y = 0.72;
            staffGroup.add(sPole);

            const tip = new THREE.Mesh(spearTipGeo, spearTipMat);
            tip.position.y = 1.55;
            staffGroup.add(tip);

            staffGroup.position.set(Math.cos(ang) * 1.35, 0.1, Math.sin(ang) * 1.35);
            staffGroup.rotation.z = Math.sin(ang) * 0.18;
            staffGroup.rotation.x = Math.cos(ang) * 0.18;
            group.add(staffGroup);
            staves.push(staffGroup);
        }

        activeProps.push({
            type: 'moc3_radiance',
            auraMesh,
            radiantLight,
            staves,
            time: 0
        });

        dynamicPropsGroup.add(group);
    }

    // 5. MỐC 4 PHẦN 1, 2, 3: CHỮ 3D BAY QUYẾT LIỆT TẠI CÁC ĐỊA DANH LỊCH SỬ
    function createMoc4FlyingCombatLabels(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        const labels = [
            { text: '💥 Bắc Bộ Phủ', offset: [-1.2, 1.85, 0.5], color: '#f87171' },
            { text: '🔥 Chợ Đồng Xuân', offset: [1.2, 1.75, 0.5], color: '#fb923c' },
            { text: '⚡ Nhà Bưu Điện', offset: [0, 2.15, -0.6], color: '#facc15' },
            { text: '⚔️ Các đô thị Bắc vĩ tuyến 16', offset: [0, 2.45, 0.2], color: '#38bdf8' }
        ];

        const labelMeshes = [];
        labels.forEach(lb => {
            const tex = createTextTexture(lb.text, {
                bg: 'rgba(15, 23, 42, 0.85)',
                border: lb.color,
                borderWidth: 5,
                color: '#ffffff',
                font: 'bold 30px sans-serif',
                radius: 16,
                width: 440,
                height: 100
            });
            const pGeo = new THREE.PlaneGeometry(1.15, 0.28);
            const pMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
            const pMesh = new THREE.Mesh(pGeo, pMat);
            pMesh.position.set(lb.offset[0], lb.offset[1], lb.offset[2]); pMesh.renderOrder = 99999;
            pMesh.userData = { origPos: pMesh.position.clone(), speed: 2.0 + Math.random() * 2.0 };
            group.add(pMesh);
            labelMeshes.push(pMesh);
        });

        activeProps.push({
            type: 'moc4_flying_labels',
            labelMeshes,
            time: 0
        });

        dynamicPropsGroup.add(group);
    }

    // 6. MỐC 9 PHẦN 2: SA BÀN CHIẾN THUẬT MINH HỌA 3 ĐỢT TIẾN CÔNG ĐIỆN BIÊN PHỦ
    function createMoc9ThreeWavesTacticalMap(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Sa bàn đĩa tròn căn cứ Mường Thanh (Hologram Tactical Overlay)
        const mapGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.02, 36);
        const mapTex = createTextTexture('SA BÀN CHIẾN DỊCH ĐIỆN BIÊN PHỦ (13/3 – 7/5/1954)', {
            bg: 'rgba(20, 30, 48, 0.92)',
            border: '#ef4444',
            borderWidth: 6,
            color: '#facc15',
            font: 'bold 26px sans-serif',
            width: 512,
            height: 512
        });
        const mapMat = new THREE.MeshBasicMaterial({ map: mapTex, transparent: true, opacity: 0.85 });
        const mapMesh = new THREE.Mesh(mapGeo, mapMat);
        mapMesh.position.set(0, 0.05, 0); mapMesh.rotation.x = -Math.PI / 2; mapMesh.renderOrder = 99999;
        group.add(mapMesh);

        // 3 Mũi tên tiến công đỏ rực đại diện cho 3 đợt:
        // Đợt 1: Đánh Him Lam, Độc Lập, Bản Kéo (Phía Bắc)
        const wave1Arrow = createTacticalArrow(0xef4444, 'ĐỢT 1: Him Lam, Độc Lập (13-17/3)');
        wave1Arrow.position.set(-0.85, 0.65, -0.6);
        wave1Arrow.rotation.y = Math.PI / 4;
        group.add(wave1Arrow);

        // Đợt 2: Siết chặt chiến hào, chiếm đồi A1, C1 (Phía Đông)
        const wave2Arrow = createTacticalArrow(0xf97316, 'ĐỢT 2: Đồi A1, C1, D1, E (30/3-26/4)');
        wave2Arrow.position.set(0.85, 0.70, 0);
        wave2Arrow.rotation.y = -Math.PI / 2;
        group.add(wave2Arrow);

        // Đợt 3: Tổng công kích, tiêu diệt sở chỉ huy Đờ Cát (Trung tâm)
        const wave3Arrow = createTacticalArrow(0xeab308, 'ĐỢT 3: Tổng công kích hầm Đờ Cát (1-7/5)');
        wave3Arrow.position.set(0, 0.75, 0.75);
        wave3Arrow.rotation.y = Math.PI;
        group.add(wave3Arrow);

        activeProps.push({
            type: 'moc9_waves',
            wave1Arrow,
            wave2Arrow,
            wave3Arrow,
            time: 0
        });

        dynamicPropsGroup.add(group);
    }

    function createTacticalArrow(colorHex, labelText) {
        const g = new THREE.Group();
        const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8);
        const shaftMat = new THREE.MeshBasicMaterial({ color: colorHex });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.rotation.z = Math.PI / 2;
        g.add(shaft);

        const headGeo = new THREE.ConeGeometry(0.12, 0.28, 8);
        const head = new THREE.Mesh(headGeo, shaftMat);
        head.rotation.z = -Math.PI / 2;
        head.position.x = 0.42;
        g.add(head);

        const lblTex = createTextTexture(labelText, {
            bg: 'rgba(0,0,0,0.8)',
            border: colorHex,
            borderWidth: 3,
            color: '#fff',
            font: 'bold 22px sans-serif',
            radius: 8,
            width: 380,
            height: 70
        });
        const lblGeo = new THREE.PlaneGeometry(0.7, 0.16);
        const lblMat = new THREE.MeshBasicMaterial({ map: lblTex, transparent: true, depthTest: false, depthWrite: false });
        const lblMesh = new THREE.Mesh(lblGeo, lblMat);
        lblMesh.position.set(0, 0.25, 0); lblMesh.renderOrder = 99999;
        g.add(lblMesh);

        return g;
    }

    // 7. MỐC 9 PHẦN 4: CỜ QUYẾT CHIẾN QUYẾT THẮNG TUNG BAY TRÊN NÓC HẦM + BẮT SỐNG ĐỜ CÁT
    function createMoc9VictoryCelebration(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        // Cờ Quyết chiến Quyết thắng tung bay
        const flagTex = createVietnamFlagTexture(false);
        const flagGroup = createWavingFlagProp(flagTex, new THREE.Vector3(0, 0.08, -0.65), false);

        // Banner vinh quang
        const bannerTex = createTextTexture('CHIỀU 7/5/1954: CỜ CHIẾN THẮNG TRÊN NÓC HẦM ĐỜ CÁT', {
            bg: 'linear-gradient(135deg, #b91c1c, #d97706)',
            border: '#fde047',
            borderWidth: 6,
            color: '#ffffff',
            font: 'bold 28px sans-serif',
            radius: 14,
            width: 512,
            height: 110
        });
        const bannerGeo = new THREE.PlaneGeometry(1.6, 0.38);
        const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTex, transparent: true, depthTest: false, depthWrite: false });
        const bannerMesh = new THREE.Mesh(bannerGeo, bannerMat);
        bannerMesh.position.set(0, 2.1, 0.3); bannerMesh.renderOrder = 99999;
        group.add(bannerMesh);

        dynamicPropsGroup.add(group);
    }

    // 8. MỐC 9 PHẦN 5: KHÚC KHẢI HOÀN "LỪNG LẪY NĂM CHÂU, CHẤN ĐỘNG ĐỊA CẦU"
    function createMoc9TriumphGlory(stBasePos) {
        const group = new THREE.Group();
        group.position.set(stBasePos.x, stBasePos.y, stBasePos.z);

        const triumphTex = createTextTexture('LỪNG LẪY NĂM CHÂU — CHẤN ĐỘNG ĐỊA CẦU\n(Chấm dứt 9 năm kháng chiến chống Pháp 1945 - 1954)', {
            bg: 'rgba(15, 23, 42, 0.92)',
            border: '#f59e0b',
            borderWidth: 6,
            color: '#facc15',
            font: 'bold 26px serif',
            radius: 18,
            width: 512,
            height: 160
        });
        const triumphGeo = new THREE.PlaneGeometry(1.8, 0.56);
        const triumphMat = new THREE.MeshBasicMaterial({ map: triumphTex, transparent: true, depthTest: false, depthWrite: false });
        const triumphMesh = new THREE.Mesh(triumphGeo, triumphMat);
        triumphMesh.position.set(0, 2.3, 0.3); triumphMesh.renderOrder = 99999;
        group.add(triumphMesh);

        // Vòng hào quang vàng kim xoay quanh
        const haloGeo = new THREE.TorusGeometry(1.4, 0.03, 16, 48);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.8 });
        const haloMesh = new THREE.Mesh(haloGeo, haloMat);
        haloMesh.rotation.x = Math.PI / 2;
        haloMesh.position.set(0, 1.2, 0);
        group.add(haloMesh);

        activeProps.push({
            type: 'moc9_triumph',
            haloMesh,
            time: 0
        });

        dynamicPropsGroup.add(group);
    }


    // --- HÀM ĐIỀU PHỐI CHÍNH KHI NGƯỜI DÙNG CHUYỂN BƯỚC / PHẦN ---
    function onStepChange(stationOrder, stepIdx, locus) {
        if (!THREE) init();
        if (!directorGroup) return;

        activeStationOrder = stationOrder;
        activeStepIdx = stepIdx;
        clearDynamicProps();

        const stBase = getStationBasePos(stationOrder);
        hasDualArrows = false;

        console.log(`🧭 [Bai7SpatialDirector] Chuyển mốc ${stationOrder} — Phần ${stepIdx + 1}`);

        // ==========================================
        // MỐC 1: BỐI CẢNH "NGÀN CÂN TREO SỢI TÓC"
        // ==========================================
        if (stationOrder === 1) {
            if (stepIdx === 0) {
                // Phần 1: Mũi tên hướng về 3 ông ngồi ghế (3ooong.glb tại x: -1.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 1.0, stBase.y + 1.5, stBase.z - 0.1);
                currentPos.copy(targetPos);
            } else if (stepIdx === 1) {
                // Phần 2: CHỈ RÕ RÀNG VÀO MODEL "Nhân dân làm chủ.glb" (tại x: 0.0, z: +0.2)
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.65, stBase.z + 0.2);
                currentPos.copy(targetPos);

                // Tạo nhãn nổi bật trực quan để người học nhận biết ngay lập tức
                const lbTex = createTextTexture('🇻🇳 Nhân dân làm chủ', {
                    bg: 'rgba(22, 101, 52, 0.92)',
                    border: '#4ade80',
                    borderWidth: 4,
                    color: '#ffffff',
                    font: 'bold 26px sans-serif',
                    radius: 12,
                    width: 380,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.1, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x, stBase.y + 1.95, stBase.z + 0.2);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);

                // Cờ đỏ sao vàng tung bay rực rỡ phía trên
                const flagTex = createVietnamFlagTexture(false);
                createWavingFlagProp(flagTex, new THREE.Vector3(stBase.x, stBase.y, stBase.z + 0.5), false);
            } else if (stepIdx === 2) {
                // Phần 3: Model người dân làm đồng (kinh_te_lac_hau.glb tại x: +1.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 1.0, stBase.y + 1.5, stBase.z - 0.1);
                currentPos.copy(targetPos);
            } else if (stepIdx === 3) {
                // Phần 4: Cờ Việt Nam với sắc thái âm u ("ngàn cân treo sợi tóc")
                const darkFlagTex = createVietnamFlagTexture(true);
                createWavingFlagProp(darkFlagTex, new THREE.Vector3(stBase.x, stBase.y, stBase.z + 0.4), true);
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 2.5, stBase.z + 0.4);
                currentPos.copy(targetPos);
            }
        }

        // ==========================================
        // MỐC 2: KHÁNG CHIẾN NAM BỘ
        // ==========================================
        else if (stationOrder === 2) {
            if (stepIdx === 0) {
                // Phần 1: Model Pháp xả súng mít tinh Sài Gòn (bên trái x: -1.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 1.0, stBase.y + 1.6, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 1) {
                // Phần 2: Model nhân dân Nam Bộ chiến đấu (ở giữa x: 0.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.6, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 2) {
                // Phần 3: CHỈ TRỰC TIẾP VÀO MODEL "Chi viện cho miền Nam.glb" (bên phải x: +1.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 1.0, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);

                const lbTex = createTextTexture('🚩 Chi viện cho miền Nam — Nam tiến', {
                    bg: 'rgba(185, 28, 28, 0.92)',
                    border: '#f87171',
                    borderWidth: 4,
                    color: '#ffffff',
                    font: 'bold 24px sans-serif',
                    radius: 12,
                    width: 440,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.25, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x + 1.0, stBase.y + 1.95, stBase.z);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);
            } else if (stepIdx === 3) {
                // Phần 4: Hiện chữ "Đánh nhanh thắng nhanh", sau đó là cờ Pháp rồi animation tan vỡ
                createMoc2ShatterAnimation(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 2.4, stBase.z + 0.4);
                currentPos.copy(targetPos);
            }
        }

        // ==========================================
        // MỐC 3: TOÀN QUỐC KHÁNG CHIẾN
        // ==========================================
        else if (stationOrder === 3) {
            if (stepIdx === 0) {
                // Phần 1: Chỉ vào Bác Hồ ký cam kết hòa hoãn (x: -0.85)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.85, stBase.y + 1.7, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 1) {
                // Phần 2: Cờ Pháp + Tờ giấy + Animation chém chém
                createMoc3SlashingTreaty(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.3, stBase.y + 1.9, stBase.z + 0.2);
                currentPos.copy(targetPos);
            } else if (stepIdx === 2 || stepIdx === 3) {
                // Phần 3 & 4: CHỈ VÀO MODEL "Bác Hồ kêu gọi toàn quốc kháng chiến.glb" (x: +0.85)
                createMoc3BacHoRadianceAndStaves(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.85, stBase.y + 1.75, stBase.z);
                currentPos.copy(targetPos);

                const lbTex = createTextTexture('📜 Lời kêu gọi Toàn quốc kháng chiến (19/12/1946)', {
                    bg: 'rgba(30, 58, 138, 0.92)',
                    border: '#60a5fa',
                    borderWidth: 4,
                    color: '#ffffff',
                    font: 'bold 24px sans-serif',
                    radius: 12,
                    width: 500,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.4, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x + 0.85, stBase.y + 2.1, stBase.z);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);
            }
        }

        // ==========================================
        // MỐC 4: CHIẾN ĐẤU CÁC ĐÔ THỊ
        // ==========================================
        else if (stationOrder === 4) {
            if (stepIdx === 0 || stepIdx === 1) {
                // Phần 1 & 2: Chỉ vào Quyết tử quân ôm bom ba càng (x: -1.0) + Chữ 3D bay quyết liệt
                createMoc4FlyingCombatLabels(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x - 1.0, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 2) {
                // Phần 3: CHỈ VÀO MODEL "Giam chân quân Pháp.glb" (ở giữa x: 0.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);

                const lbTex = createTextTexture('🛡️ Giam chân quân Pháp trong thành phố', {
                    bg: 'rgba(15, 23, 42, 0.90)',
                    border: '#facc15',
                    borderWidth: 4,
                    color: '#ffffff',
                    font: 'bold 24px sans-serif',
                    radius: 12,
                    width: 440,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.25, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x, stBase.y + 1.95, stBase.z);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);
            } else if (stepIdx === 3) {
                // Phần 4: CHỈ VÀO MODEL CÒN LẠI KIA (Trung đoàn Thủ Đô vượt sông Hồng an toàn tại x: +1.0)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 1.0, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);

                const lbTex = createTextTexture('🌊 Trung đoàn Thủ Đô vượt sông Hồng an toàn', {
                    bg: 'rgba(12, 74, 110, 0.92)',
                    border: '#38bdf8',
                    borderWidth: 4,
                    color: '#ffffff',
                    font: 'bold 24px sans-serif',
                    radius: 12,
                    width: 460,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.3, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x + 1.0, stBase.y + 1.95, stBase.z);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);
            }
        }

        // ==========================================
        // MỐC 5: CHIẾN DỊCH VIỆT BẮC THU - ĐÔNG 1947
        // ==========================================
        else if (stationOrder === 5) {
            if (stepIdx === 0) {
                // Phần 1: Lực lượng ta sẵn sàng tác chiến (x: -0.90)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.90, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 1) {
                // Phần 2: CHỈ VÀO MODEL CÒN LẠI (Quân dân bẻ gãy gọng kìm tiến công Việt Bắc tại x: +0.90)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.90, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);

                const lbTex = createTextTexture('💥 Bẻ gãy gọng kìm Sông Lô & Đường 4', {
                    bg: 'rgba(120, 53, 15, 0.92)',
                    border: '#f59e0b',
                    borderWidth: 4,
                    color: '#ffffff',
                    font: 'bold 24px sans-serif',
                    radius: 12,
                    width: 440,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.25, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x + 0.90, stBase.y + 1.95, stBase.z);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);
            } else if (stepIdx === 2) {
                // Phần 3: CHỈ ĐỒNG THỜI VÀO CẢ 2 MODEL (Phá sản kế hoạch đánh nhanh thắng nhanh)
                hasDualArrows = true;
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.90, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);

                focusArrow2.visible = true;
                targetPos2.set(stBase.x + 0.90, stBase.y + 1.65, stBase.z);
                currentPos2.copy(targetPos2);

                const lbTex = createTextTexture('🏆 Phá sản hoàn toàn "Đánh nhanh thắng nhanh"', {
                    bg: 'rgba(15, 23, 42, 0.92)',
                    border: '#22c55e',
                    borderWidth: 5,
                    color: '#facc15',
                    font: 'bold 26px sans-serif',
                    radius: 14,
                    width: 500,
                    height: 90
                });
                const lbGeo = new THREE.PlaneGeometry(1.4, 0.26);
                const lbMat = new THREE.MeshBasicMaterial({ map: lbTex, transparent: true, depthTest: false });
                const lbMesh = new THREE.Mesh(lbGeo, lbMat);
                lbMesh.position.set(stBase.x, stBase.y + 2.2, stBase.z);
                dynamicPropsGroup.add(lbMesh);
                activeProps.push(lbMesh);
            }
        }

        // ==========================================
        // MỐC 6: CHIẾN DỊCH BIÊN GIỚI 1950
        // ==========================================
        else if (stationOrder === 6) {
            focusArrow.visible = true;
            targetPos.set(stBase.x, stBase.y + 1.75, stBase.z);
            currentPos.copy(targetPos);
        }

        // ==========================================
        // MỐC 7: BƯỚC PHÁT TRIỂN & HẬU PHƯƠNG
        // ==========================================
        else if (stationOrder === 7) {
            if (stepIdx === 0) {
                // Phần 1: Model Bác Hồ tại Đại hội II (x: -0.90)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 0.90, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 1) {
                // Phần 2: Xe đạp thồ (x: +0.90)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 0.90, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);
            } else {
                // Phần 3: Hậu phương toàn dân
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.65, stBase.z);
                currentPos.copy(targetPos);
            }
        }

        // ==========================================
        // MỐC 8: KẾ HOẠCH NA-VA & ĐÔNG - XUÂN
        // ==========================================
        else if (stationOrder === 8) {
            if (stepIdx === 0) {
                // Phần 1: Tướng Đờ Cát (x: -1.05, z: 0.40)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 1.05, stBase.y + 1.55, stBase.z + 0.40);
                currentPos.copy(targetPos);
            } else {
                // Phần 2 & 3: Chỉ đồng thời cả 2 model còn lại (Đại tướng Võ Nguyên Giáp & Khí thế Đông - Xuân)
                hasDualArrows = true;
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.75, stBase.z - 0.65); // Đại tướng
                currentPos.copy(targetPos);

                focusArrow2.visible = true;
                targetPos2.set(stBase.x + 1.05, stBase.y + 1.55, stBase.z + 0.40); // Khí thế tiến công
                currentPos2.copy(targetPos2);
            }
        }

        // ==========================================
        // MỐC 9: CHIẾN THẮNG ĐIỆN BIÊN PHỦ & HIỆP ĐỊNH GIƠ-NE-VƠ
        // ==========================================
        else if (stationOrder === 9) {
            if (stepIdx === 0) {
                // Phần 1: Kéo pháo vào Điện Biên Phủ (x: -1.05, z: 0.40)
                focusArrow.visible = true;
                targetPos.set(stBase.x - 1.05, stBase.y + 1.55, stBase.z + 0.40);
                currentPos.copy(targetPos);
            } else if (stepIdx === 1) {
                // Phần 2: Sa bàn 3D diễn hoạt 3 đợt tiến công Điện Biên Phủ
                createMoc9ThreeWavesTacticalMap(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 2.1, stBase.z);
                currentPos.copy(targetPos);
            } else if (stepIdx === 2) {
                // Phần 3: Ký Hiệp định Giơ-ne-vơ (x: +1.05, z: 0.40)
                focusArrow.visible = true;
                targetPos.set(stBase.x + 1.05, stBase.y + 1.55, stBase.z + 0.40);
                currentPos.copy(targetPos);
            } else if (stepIdx === 3) {
                // Phần 4: Cờ Quyết chiến Quyết thắng tung bay + Bắt sống Đờ Cát (x: 0, z: -0.65)
                createMoc9VictoryCelebration(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 1.85, stBase.z - 0.65);
                currentPos.copy(targetPos);
            } else if (stepIdx === 4) {
                // Phần 5: Khúc khải hoàn "Lừng lẫy năm châu, chấn động địa cầu"
                createMoc9TriumphGlory(stBase);
                focusArrow.visible = true;
                targetPos.set(stBase.x, stBase.y + 2.5, stBase.z);
                currentPos.copy(targetPos);
            }
        }
    }

    function onStationOpen(stationOrder, locus) {
        onStepChange(stationOrder, 0, locus);
    }

    function onStationClose() {
        clearDynamicProps();
        activeStationOrder = null;
        activeStepIdx = null;
    }

    // --- CẬP NHẬT ANIMATION HÀNG FRAME TRONG VÒNG LẶP RENDER LOOP ---
    function update(delta, time) {
        if (!THREE || !directorGroup) return;

        // 1. Cập nhật vị trí Mũi tên chính (Lerp chuyển động mượt mà)
        if (focusArrow && focusArrow.visible) {
            currentPos.lerp(targetPos, Math.min(delta * 7.0, 1.0));
            focusArrow.position.copy(currentPos);
            focusArrow.position.y += Math.sin(time * 3.5) * 0.08; // Nhấp nhô bay bổng
            if (focusArrow.userData && focusArrow.userData.reticle) {
                focusArrow.userData.reticle.rotation.z += delta * 1.5;
            }
        }

        // 2. Cập nhật Mũi tên phụ (nếu có 2 mục tiêu cùng lúc)
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
                const pos = p.posAttr;
                const orig = p.origPositions;
                const count = pos.count;
                for (let k = 0; k < count; k++) {
                    const ox = orig[k * 3];
                    const oy = orig[k * 3 + 1];
                    const oz = orig[k * 3 + 2];
                    const waveFactor = (ox + 0.65) / 1.35; // gốc cột cờ ít rung, ngọn cờ rung mạnh
                    const z = oz + Math.sin(ox * 5.0 + time * p.speed) * p.amplitude * waveFactor;
                    pos.setZ(k, z);
                }
                pos.needsUpdate = true;
            }

            // Mốc 2: Shatter vụn vỡ
            else if (p.type === 'moc2_shatter') {
                const elapsed = (performance.now() - p.startTime) / 1000;
                if (elapsed > 0.8 && !p.shattered) {
                    p.shattered = true;
                    p.textMesh.visible = false;
                    p.flagMesh.visible = false;
                    p.shards.forEach(s => s.visible = true);
                }
                if (p.shattered) {
                    p.shards.forEach(s => {
                        s.position.addScaledVector(s.userData.vel, delta);
                        s.userData.vel.y -= 3.5 * delta; // Trọng lực
                        s.rotation.x += s.userData.rotVel.x * delta;
                        s.rotation.y += s.userData.rotVel.y * delta;
                        if (s.material.opacity > 0.02) {
                            s.material.opacity -= 0.45 * delta;
                        }
                    });
                }
            }

            // Mốc 3: Chém chém
            else if (p.type === 'moc3_slash') {
                p.time += delta;
                const slashProgress = (Math.sin(p.time * 6.0) + 1) / 2;
                p.slash1.scale.x = 0.4 + slashProgress * 0.8;
                p.slash2.scale.x = 0.4 + (1 - slashProgress) * 0.8;
                p.slash1.rotation.z = Math.PI / 4 + Math.sin(p.time * 10) * 0.05;
                p.slash2.rotation.z = -Math.PI / 4 - Math.cos(p.time * 10) * 0.05;
            }

            // Mốc 3: Bác Hồ tỏa sáng
            else if (p.type === 'moc3_radiance') {
                p.time += delta;
                p.auraMesh.rotation.y += delta * 0.8;
                p.radiantLight.intensity = 3.5 + Math.sin(p.time * 4) * 0.8;
                p.staves.forEach((st, idx) => {
                    st.position.y = 0.1 + Math.sin(p.time * 2.5 + idx) * 0.04;
                });
            }

            // Mốc 4: Chữ 3D bay
            else if (p.type === 'moc4_flying_labels') {
                p.time += delta;
                p.labelMeshes.forEach(lb => {
                    lb.position.y = lb.userData.origPos.y + Math.sin(p.time * lb.userData.speed) * 0.08;
                    lb.rotation.y = Math.sin(p.time * 1.5) * 0.05;
                });
            }

            // Mốc 9: Sa bàn 3 đợt
            else if (p.type === 'moc9_waves') {
                p.time += delta;
                const phase = Math.floor(p.time % 6);
                p.wave1Arrow.visible = (phase < 2 || phase >= 4);
                p.wave2Arrow.visible = (phase >= 2 && phase < 4);
                p.wave3Arrow.visible = (phase >= 4);
                p.wave1Arrow.position.y = 0.65 + Math.sin(p.time * 4) * 0.03;
                p.wave2Arrow.position.y = 0.70 + Math.sin(p.time * 4 + 1) * 0.03;
                p.wave3Arrow.position.y = 0.75 + Math.sin(p.time * 4 + 2) * 0.03;
            }

            // Mốc 9: Khúc khải hoàn
            else if (p.type === 'moc9_triumph') {
                p.time += delta;
                p.haloMesh.rotation.z += delta * 0.6;
                p.haloMesh.scale.setScalar(1.0 + Math.sin(p.time * 2) * 0.05);
            }
        }
    }

    // Xuất khẩu đối tượng ra toàn cục
    window.Bai7SpatialDirector = {
        init,
        onStepChange,
        onStationOpen,
        onStationClose,
        update
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
