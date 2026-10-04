/**
 * CuboFácil Vision — Scanner de Cores por Câmera & Foto
 * Sistema Inteligente com Detecção Espectral Robusta de Cores,
 * Validação de Centro em Tempo Real e Orientação Natural
 * 
 * 4U-Labs • https://4u.ia.br/app/cubo/
 */

class CuboCameraScanner {
    constructor(flatCubeInstance, onCompleteCallback) {
        this.flatCube = flatCubeInstance;
        this.onComplete = onCompleteCallback;
        
        // Cores oficiais do CuboFácil (iguais ao flat.js)
        this.CUBE_COLORS = {
            WHITE:  { name: 'Branco',   hex: '#ffffff', textColor: '#111' },
            YELLOW: { name: 'Amarelo',  hex: '#ffff00', textColor: '#111' },
            GREEN:  { name: 'Verde',    hex: '#009900', textColor: '#fff' },
            BLUE:   { name: 'Azul',     hex: '#000099', textColor: '#fff' },
            RED:    { name: 'Vermelho', hex: '#cc0000', textColor: '#fff' },
            ORANGE: { name: 'Laranja',  hex: '#ff8000', textColor: '#111' }
        };

        // Ordem e orientações das 6 faces:
        // Regra Intuitiva Natural: O usuário mantém a face BRANCA virada para CIMA (Teto)
        // nas 4 faces laterais (Frente, Direita, Atrás, Esquerda), apenas girando o cubo horizontalmente!
        // A matriz 'transform' converte o grid 3x3 da câmera para as coordenadas do FlatCube.
        this.FACE_STEPS = [
            {
                faceIndex: 2,
                name: 'Topo (U)',
                centerColor: 'WHITE',
                title: '1. Face Branca (Topo / U)',
                top:    { name: 'Verde',    hex: '#009900', label: 'Verde' },
                bottom: { name: 'Azul',     hex: '#000099', label: 'Azul' },
                left:   { name: 'Vermelho', hex: '#cc0000', label: 'Vermelho' },
                right:  { name: 'Laranja',  hex: '#ff8000', label: 'Laranja' },
                instruction: 'Aponte o centro BRANCO de frente • TETO: Verde • DIREITA: Laranja',
                transform: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                faceIndex: 4,
                name: 'Frente (F)',
                centerColor: 'BLUE',
                title: '2. Face Azul (Frente / F)',
                top:    { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                bottom: { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                left:   { name: 'Vermelho', hex: '#cc0000', label: 'Vermelho' },
                right:  { name: 'Laranja',  hex: '#ff8000', label: 'Laranja' },
                instruction: 'Aponte o centro AZUL de frente • TETO: Branco • DIREITA: Laranja',
                transform: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                faceIndex: 3,
                name: 'Direita (R)',
                centerColor: 'ORANGE',
                title: '3. Face Laranja (Direita / R)',
                top:    { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                bottom: { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                left:   { name: 'Azul',     hex: '#000099', label: 'Azul' },
                right:  { name: 'Verde',    hex: '#009900', label: 'Verde' },
                instruction: 'Gire à direita: centro LARANJA • TETO: Branco • DIREITA: Verde',
                transform: [2, 5, 8, 1, 4, 7, 0, 3, 6]
            },
            {
                faceIndex: 0,
                name: 'Atrás (B)',
                centerColor: 'GREEN',
                title: '4. Face Verde (Atrás / B)',
                top:    { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                bottom: { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                left:   { name: 'Laranja',  hex: '#ff8000', label: 'Laranja' },
                right:  { name: 'Vermelho', hex: '#cc0000', label: 'Vermelho' },
                instruction: 'Gire à direita: centro VERDE • TETO: Branco • DIREITA: Vermelho',
                transform: [8, 7, 6, 5, 4, 3, 2, 1, 0]
            },
            {
                faceIndex: 1,
                name: 'Esquerda (L)',
                centerColor: 'RED',
                title: '5. Face Vermelha (Esquerda / L)',
                top:    { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                bottom: { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                left:   { name: 'Verde',    hex: '#009900', label: 'Verde' },
                right:  { name: 'Azul',     hex: '#000099', label: 'Azul' },
                instruction: 'Gire à direita: centro VERMELHO • TETO: Branco • DIREITA: Azul',
                transform: [6, 3, 0, 7, 4, 1, 8, 5, 2]
            },
            {
                faceIndex: 5,
                name: 'Base (D)',
                centerColor: 'YELLOW',
                title: '6. Face Amarela (Base / D)',
                top:    { name: 'Azul',     hex: '#000099', label: 'Azul' },
                bottom: { name: 'Verde',    hex: '#009900', label: 'Verde' },
                left:   { name: 'Vermelho', hex: '#cc0000', label: 'Vermelho' },
                right:  { name: 'Laranja',  hex: '#ff8000', label: 'Laranja' },
                instruction: 'Gire à direita de volta para a face AZUL e incline para cima: AMARELO de frente • TETO: Azul • DIREITA: Laranja',
                transform: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            }
        ];

        this.currentStep = 0;
        this.scannedFaces = {};
        this.stream = null;
        this.animFrameId = null;
        this.isScanning = false;
        this.isPausedForReview = false; // Quando capturado, pausa atualização em tempo real para permitir revisão

        this.currentFacePreviewColors = Array(9).fill(this.CUBE_COLORS.WHITE.hex);

        this.initDOM();
    }

    initDOM() {
        this.modal = document.getElementById('cameraScannerModal');
        this.video = document.getElementById('scannerVideo');
        this.canvasOverlay = document.getElementById('scannerCanvasOverlay');
        this.ctx = this.canvasOverlay ? this.canvasOverlay.getContext('2d', { willReadFrequently: true }) : null;
        this.stepTitle = document.getElementById('scannerStepTitle');
        this.stepTip = document.getElementById('scannerStepTip');
        this.previewGrid = document.getElementById('scannerPreviewGrid');
        this.btnCapture = document.getElementById('scannerBtnCapture');
        this.btnNext = document.getElementById('scannerBtnNext');
        this.btnPrev = document.getElementById('scannerBtnPrev');
        this.btnClose = document.getElementById('scannerBtnClose');
        this.fileInput = document.getElementById('scannerFileInput');
        this.btnUploadFallback = document.getElementById('scannerBtnUpload');
        this.stepperDots = document.getElementById('scannerStepperDots');
        this.centerStatusEl = document.getElementById('scannerCenterStatus');

        // Bússola de Referências
        this.compassTop = document.getElementById('compassTop');
        this.compassBottom = document.getElementById('compassBottom');
        this.compassLeft = document.getElementById('compassLeft');
        this.compassRight = document.getElementById('compassRight');
        this.compassCenter = document.getElementById('compassCenter');
        this.guideFrontText = document.getElementById('guideFrontText');
        this.guideTopText = document.getElementById('guideTopText');

        if (this.btnClose) {
            this.btnClose.addEventListener('click', () => this.close());
        }
        if (this.btnCapture) {
            this.btnCapture.addEventListener('click', () => this.handleCaptureButtonClick());
        }
        if (this.btnNext) {
            this.btnNext.addEventListener('click', () => this.nextStep());
        }
        if (this.btnPrev) {
            this.btnPrev.addEventListener('click', () => this.prevStep());
        }
        if (this.btnUploadFallback && this.fileInput) {
            this.btnUploadFallback.addEventListener('click', () => this.fileInput.click());
            this.fileInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        this.renderPreviewGrid();
        this.renderStepperDots();
        this.updateParityTracker();
    }

    renderStepperDots() {
        if (!this.stepperDots) return;
        this.stepperDots.innerHTML = '';
        this.FACE_STEPS.forEach((step, idx) => {
            const dot = document.createElement('div');
            const isCompleted = !!this.scannedFaces[step.faceIndex];
            const isActive = (idx === this.currentStep);
            dot.className = `step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
            dot.title = step.name;
            dot.style.background = isCompleted ? 'var(--brand-primary, #10b981)' : (isActive ? '#60a5fa' : 'rgba(255,255,255,0.2)');
            this.stepperDots.appendChild(dot);
        });
    }

    renderPreviewGrid() {
        if (!this.previewGrid) return;
        this.previewGrid.innerHTML = '';
        const abbrevMap = {
            'Branco': { label: 'B', text: '#111' },
            'Amarelo': { label: 'A', text: '#111' },
            'Verde': { label: 'Vd', text: '#fff' },
            'Azul': { label: 'Az', text: '#fff' },
            'Vermelho': { label: 'Vm', text: '#fff' },
            'Laranja': { label: 'Lar', text: '#111' }
        };

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'scanner-preview-cell';
            const colorHex = this.currentFacePreviewColors[i] || this.CUBE_COLORS.WHITE.hex;
            cell.style.backgroundColor = colorHex;
            
            const colorName = this.getColorNameByHex(colorHex);
            const abbr = abbrevMap[colorName] || { label: '', text: '#fff' };
            cell.innerHTML = `<span style="font-size:10px;font-weight:900;color:${abbr.text};line-height:26px;display:block;text-align:center;user-select:none;">${abbr.label}</span>`;

            if (i === 4) {
                cell.style.border = '2px solid #ffffff';
                cell.style.boxShadow = '0 0 6px rgba(255,255,255,0.8)';
                cell.title = `Centro: ${colorName} (Clique para ajustar)`;
            } else {
                cell.title = `Posição ${i + 1}: ${colorName} (Clique para alterar)`;
            }
            
            // Todas as células, inclusive o centro, podem ser corrigidas manualmente
            cell.addEventListener('click', () => this.cycleCellColor(i));
            
            this.previewGrid.appendChild(cell);
        }
        this.updateParityTracker();
    }

    cycleCellColor(index) {
        const hexList = Object.values(this.CUBE_COLORS).map(c => c.hex);
        const currentHex = this.currentFacePreviewColors[index];
        const currentIdx = hexList.indexOf(currentHex);
        const nextIdx = (currentIdx + 1) % hexList.length;
        this.currentFacePreviewColors[index] = hexList[nextIdx];
        
        // Pausar atualização live para preservar a edição manual do usuário
        this.isPausedForReview = true;
        const step = this.FACE_STEPS[this.currentStep];
        this.scannedFaces[step.faceIndex] = [...this.currentFacePreviewColors];
        
        this.renderPreviewGrid();
        this.updateParityTracker();
        this.updateStepUI();
    }

    getColorNameByHex(hex) {
        for (const key of Object.keys(this.CUBE_COLORS)) {
            if (this.CUBE_COLORS[key].hex.toLowerCase() === (hex || '').toLowerCase()) {
                return this.CUBE_COLORS[key].name;
            }
        }
        return 'Indefinido';
    }

    getParityCounts() {
        const counts = { WHITE: 0, YELLOW: 0, GREEN: 0, BLUE: 0, RED: 0, ORANGE: 0 };
        const hexMap = {
            '#ffffff': 'WHITE',
            '#ffff00': 'YELLOW',
            '#009900': 'GREEN',
            '#000099': 'BLUE',
            '#cc0000': 'RED',
            '#ff8000': 'ORANGE'
        };

        const currentFaceIdx = (this.FACE_STEPS && this.FACE_STEPS[this.currentStep]) ? this.FACE_STEPS[this.currentStep].faceIndex : -1;

        for (let f = 0; f < 6; f++) {
            const colors = (f === currentFaceIdx) 
                ? this.currentFacePreviewColors 
                : this.scannedFaces[f];
            if (colors && colors.length === 9) {
                colors.forEach(hex => {
                    const key = hexMap[(hex || '').toLowerCase()];
                    if (key) counts[key]++;
                });
            }
        }
        return counts;
    }

    checkTemporarySolvability() {
        if (!this.flatCube || !this.flatCube.cube) return { valid: false, reason: 'Não inicializado' };
        const currentFaceIdx = (this.FACE_STEPS && this.FACE_STEPS[this.currentStep]) ? this.FACE_STEPS[this.currentStep].faceIndex : -1;
        for (let i = 0; i < this.FACE_STEPS.length; i++) {
            const step = this.FACE_STEPS[i];
            const camColors = (step.faceIndex === currentFaceIdx) ? this.currentFacePreviewColors : this.scannedFaces[step.faceIndex];
            if (camColors && this.flatCube.faces[step.faceIndex]) {
                const transform = step.transform || [0, 1, 2, 3, 4, 5, 6, 7, 8];
                for (let s = 0; s < 9; s++) {
                    const camIdx = transform[s];
                    const colorHex = camColors[camIdx];
                    if (this.flatCube.faces[step.faceIndex].stickers[s]) {
                        this.flatCube.faces[step.faceIndex].stickers[s].setColor(colorHex);
                    }
                }
            }
        }
        this.flatCube.cube.updateColors();
        return this.flatCube.cube.validateState ? this.flatCube.cube.validateState() : { valid: true };
    }

    updateParityTracker() {
        if (!document.getElementById('scannerParityStatus') && !document.getElementById('scannerParityBar')) return;
        const counts = this.getParityCounts();
        let totalCount = 0;
        let isAllNine = true;

        const colorKeys = ['WHITE', 'YELLOW', 'GREEN', 'BLUE', 'RED', 'ORANGE'];
        colorKeys.forEach(k => {
            const cnt = counts[k] || 0;
            totalCount += cnt;
            if (cnt !== 9) isAllNine = false;

            const countEl = document.getElementById(`parityCount-${k}`);
            const pillEl = document.getElementById(`parityPill-${k}`);
            if (countEl) {
                countEl.textContent = `${cnt}/9`;
            }
            if (pillEl) {
                pillEl.classList.remove('complete', 'overflow');
                if (cnt === 9) pillEl.classList.add('complete');
                else if (cnt > 9) pillEl.classList.add('overflow');
            }
        });

        const statusEl = document.getElementById('scannerParityStatus');
        if (statusEl) {
            statusEl.classList.remove('valid', 'warning');
            if (totalCount === 54 && isAllNine) {
                const solCheck = this.checkTemporarySolvability();
                if (solCheck.valid) {
                    statusEl.textContent = '✓ 54/54 Válido & Solucionável!';
                    statusEl.classList.add('valid');
                } else {
                    statusEl.textContent = '⚠️ ' + (solCheck.reason || 'Desalinhado');
                    statusEl.classList.add('warning');
                }
            } else if (totalCount === 54 && !isAllNine) {
                statusEl.textContent = '⚠️ Desbalanceado';
                statusEl.classList.add('warning');
            } else {
                statusEl.textContent = `${totalCount}/54 lidas`;
            }
        }
    }

    async open() {
        if (!this.modal) return;
        this.currentStep = 0;
        this.scannedFaces = {};
        this.isPausedForReview = false;
        this.modal.classList.add('active');
        this.updateStepUI();
        this.updateParityTracker();
        await this.startCamera();
    }

    close() {
        this.stopCamera();
        if (this.modal) this.modal.classList.remove('active');
    }

    async startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 640 },
                    height: { ideal: 640 }
                },
                audio: false
            };
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (this.video) {
                this.video.srcObject = this.stream;
                await this.video.play();
                this.isScanning = true;
                this.scanLoop();
            }
        } catch (err) {
            console.warn('Câmera indisponível ou permissão negada. Ativando modo foto.', err);
            const statusEl = document.getElementById('scannerCameraStatus');
            if (statusEl) {
                statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Câmera bloqueada ou sem suporte. Use o botão <strong>Carregar Foto</strong> abaixo.';
                statusEl.style.display = 'block';
            }
        }
    }

    stopCamera() {
        this.isScanning = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.video) {
            this.video.srcObject = null;
        }
    }

    scanLoop() {
        if (!this.isScanning || !this.video || !this.canvasOverlay || !this.ctx) return;

        // Se o usuário capturou a face ou está revisando, mantemos a imagem congelada
        if (this.isPausedForReview) {
            this.animFrameId = requestAnimationFrame(() => this.scanLoop());
            return;
        }

        // Dimensões CSS reais de exibição do elemento no DOM
        const displayW = this.canvasOverlay.clientWidth || 290;
        const displayH = this.canvasOverlay.clientHeight || 205;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.dpr = dpr;

        const targetW = Math.round(displayW * dpr);
        const targetH = Math.round(displayH * dpr);

        if (this.canvasOverlay.width !== targetW || this.canvasOverlay.height !== targetH) {
            this.canvasOverlay.width = targetW;
            this.canvasOverlay.height = targetH;
        }

        this.ctx.save();
        this.ctx.scale(dpr, dpr);

        // Desenhar frame do vídeo mantendo a proporção exata (object-fit: cover)
        const vW = this.video.videoWidth || 640;
        const vH = this.video.videoHeight || 480;
        const vRatio = vW / vH;
        const cRatio = displayW / displayH;

        let dw, dh, dx, dy;
        if (vRatio > cRatio) {
            dh = displayH;
            dw = displayH * vRatio;
            dx = (displayW - dw) / 2;
            dy = 0;
        } else {
            dw = displayW;
            dh = displayW / vRatio;
            dx = 0;
            dy = (displayH - dh) / 2;
        }

        this.ctx.drawImage(this.video, dx, dy, dw, dh);

        // Geometria da mira 3x3 no centro: QUADRADO PERFEITO
        const boxSize = Math.round(Math.min(displayW, displayH) * 0.64);
        const startX = Math.round((displayW - boxSize) / 2);
        const startY = Math.round((displayH - boxSize) / 2);
        const cellSize = boxSize / 3;

        // Overlay escuro fora da área do cubo
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
        this.ctx.fillRect(0, 0, displayW, startY);
        this.ctx.fillRect(0, startY + boxSize, displayW, displayH - (startY + boxSize));
        this.ctx.fillRect(0, startY, startX, boxSize);
        this.ctx.fillRect(startX + boxSize, startY, displayW - (startX + boxSize), boxSize);

        // Grade 3x3 estilizada
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeRect(startX, startY, boxSize, boxSize);

        // Linhas internas da grade
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let i = 1; i < 3; i++) {
            this.ctx.moveTo(startX + i * cellSize, startY);
            this.ctx.lineTo(startX + i * cellSize, startY + boxSize);
            this.ctx.moveTo(startX, startY + i * cellSize);
            this.ctx.lineTo(startX + boxSize, startY + i * cellSize);
        }
        this.ctx.stroke();

        // Desenhar rótulos das referências nos 4 cantos da mira
        const step = this.FACE_STEPS[this.currentStep];
        this.drawOrientationPills(startX, startY, boxSize, step, displayW, displayH);

        const detectedColors = [];

        // Amostrar cada um dos 9 stickers
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellX = startX + col * cellSize;
                const cellY = startY + row * cellSize;

                const sampleCenterX = Math.floor(cellX + cellSize / 2);
                const sampleCenterY = Math.floor(cellY + cellSize / 2);
                const sampleRadius = Math.max(3, Math.floor(cellSize * 0.12));

                const isCenter = (row === 1 && col === 1);
                const rgb = this.getAverageRGB(sampleCenterX, sampleCenterY, sampleRadius);
                const matchedColor = this.classifyColor(rgb.r, rgb.g, rgb.b, isCenter ? step.centerColor : null);
                detectedColors.push(matchedColor);

                // Mira colorida no centro do sticker
                this.ctx.fillStyle = matchedColor;
                this.ctx.beginPath();
                this.ctx.arc(sampleCenterX, sampleCenterY, sampleRadius, 0, Math.PI * 2);
                this.ctx.fill();

                // Destaca o centro com anel de confirmação ou alerta
                if (isCenter) {
                    const expectedHex = this.CUBE_COLORS[step.centerColor].hex;
                    const centerMatches = (matchedColor.toLowerCase() === expectedHex.toLowerCase());

                    this.ctx.strokeStyle = centerMatches ? '#10b981' : '#ef4444';
                    this.ctx.lineWidth = 2.5;
                    this.ctx.stroke();

                    // Anel externo pulsante no centro
                    this.ctx.beginPath();
                    this.ctx.arc(sampleCenterX, sampleCenterY, sampleRadius + 4, 0, Math.PI * 2);
                    this.ctx.strokeStyle = centerMatches ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.85)';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                } else {
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.stroke();
                }
            }
        }

        this.ctx.restore();

        // Validação em Tempo Real do Centro
        const expectedCenterHex = this.CUBE_COLORS[step.centerColor].hex;
        const detectedCenterHex = detectedColors[4];
        const isCenterMatch = (detectedCenterHex.toLowerCase() === expectedCenterHex.toLowerCase());
        this.updateCenterStatusBadge(isCenterMatch, detectedCenterHex, step);

        // Atualizar preview com as cores detectadas ao vivo
        this.currentFacePreviewColors = detectedColors;
        this.renderPreviewGrid();

        this.animFrameId = requestAnimationFrame(() => this.scanLoop());
    }

    updateCenterStatusBadge(isMatch, detectedHex, step) {
        if (!this.centerStatusEl) return;
        const expectedName = this.CUBE_COLORS[step.centerColor].name;
        const detectedName = this.getColorNameByHex(detectedHex);

        this.centerStatusEl.style.display = 'flex';
        if (isMatch) {
            this.centerStatusEl.className = 'scanner-center-badge match';
            this.centerStatusEl.innerHTML = `<i class="fas fa-check-circle"></i> Centro Correto: <strong>${expectedName.toUpperCase()}</strong>`;
        } else {
            this.centerStatusEl.className = 'scanner-center-badge mismatch';
            this.centerStatusEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Atenção: Centro detectado é <strong>${detectedName.toUpperCase()}</strong>! Aponte a Face <strong>${expectedName.toUpperCase()}</strong>`;
        }
    }

    formatSideLabel(label) {
        if (label === 'Amarelo') return 'Aml';
        if (label === 'Branco') return 'Bco';
        if (label === 'Laranja') return 'Lar';
        if (label === 'Vermelho') return 'Verm';
        if (label === 'Verde') return 'Vde';
        if (label === 'Azul') return 'Azu';
        return label;
    }

    drawOrientationPills(startX, startY, boxSize, step, w, h) {
        if (!this.ctx || !this.canvasOverlay) return;
        
        const fontSize = Math.max(11, Math.min(14, Math.round(boxSize * 0.088)));
        this.ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Pílula Superior (CIMA)
        const topY = startY / 2;
        this.drawBadge(startX + boxSize / 2, topY, `▲ CIMA: ${step.top.label}`, step.top.hex, fontSize);

        // Pílula Inferior (BAIXO)
        const botY = (startY + boxSize) + (h - (startY + boxSize)) / 2;
        this.drawBadge(startX + boxSize / 2, botY, `▼ BAIXO: ${step.bottom.label}`, step.bottom.hex, fontSize);

        // Pílula Esquerda (ESQ)
        const leftX = startX / 2;
        const leftText = `◀ ${this.formatSideLabel(step.left.label)}`;
        this.drawBadge(leftX, startY + boxSize / 2, leftText, step.left.hex, fontSize);

        // Pílula Direita (DIR)
        const rightX = (startX + boxSize) + (w - (startX + boxSize)) / 2;
        const rightText = `${this.formatSideLabel(step.right.label)} ▶`;
        this.drawBadge(rightX, startY + boxSize / 2, rightText, step.right.hex, fontSize);
    }

    drawBadge(x, y, text, colorHex, fontSize = 12) {
        this.ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
        const textWidth = this.ctx.measureText(text).width;
        const padX = fontSize * 0.45;
        const padY = fontSize * 0.32;
        const badgeW = textWidth + padX * 2;
        const badgeH = fontSize + padY * 2;

        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
        this.ctx.strokeStyle = colorHex;
        this.ctx.lineWidth = Math.max(1.8, fontSize * 0.12);

        this.ctx.beginPath();
        this.ctx.roundRect(x - badgeW / 2, y - badgeH / 2, badgeW, badgeH, 6);
        this.ctx.fill();
        this.ctx.stroke();

        let textColor = '#ffffff';
        if (colorHex === '#000099') textColor = '#60a5fa';
        else if (colorHex === '#ffff00') textColor = '#fef08a';
        else if (colorHex === '#009900') textColor = '#4ade80';
        else if (colorHex === '#cc0000') textColor = '#f87171';
        else if (colorHex === '#ff8000') textColor = '#fb923c';

        this.ctx.fillStyle = textColor;
        this.ctx.fillText(text, x, y);
    }

    getAverageRGB(cx, cy, radius) {
        let r = 0, g = 0, b = 0, count = 0;
        try {
            const dpr = this.dpr || 1;
            const pX = Math.round(cx * dpr);
            const pY = Math.round(cy * dpr);
            const pR = Math.max(3, Math.round(radius * dpr));
            const imgData = this.ctx.getImageData(pX - pR, pY - pR, pR * 2, pR * 2);
            const d = imgData.data;
            const r2 = pR * pR;

            // Amostragem circular com exclusão de reflexos especulares extremos (glare do plástico)
            for (let dy = -pR; dy < pR; dy++) {
                for (let dx = -pR; dx < pR; dx++) {
                    if (dx * dx + dy * dy <= r2) {
                        const idx = ((dy + pR) * (pR * 2) + (dx + pR)) * 4;
                        const pr = d[idx];
                        const pg = d[idx + 1];
                        const pb = d[idx + 2];

                        // Se for brilho puro de reflexo de lâmpada no plástico lustroso, ignora
                        if (pr > 248 && pg > 248 && pb > 248) {
                            continue;
                        }

                        r += pr;
                        g += pg;
                        b += pb;
                        count++;
                    }
                }
            }
        } catch (e) {
            return { r: 255, g: 255, b: 255 };
        }
        return {
            r: count ? Math.round(r / count) : 255,
            g: count ? Math.round(g / count) : 255,
            b: count ? Math.round(b / count) : 255
        };
    }

    rgbToHsv(r, g, b) {
        const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const delta = max - min;

        let h = 0;
        if (delta !== 0) {
            if (max === rNorm) {
                h = ((gNorm - bNorm) / delta) % 6;
            } else if (max === gNorm) {
                h = (bNorm - rNorm) / delta + 2;
            } else {
                h = (rNorm - gNorm) / delta + 4;
            }
            h = Math.round(h * 60);
            if (h < 0) h += 360;
        }

        const s = max === 0 ? 0 : delta / max;
        const v = max;
        return { h, s, v };
    }

    /**
     * Classificador Espectral Inteligente de Cores do Cubo
     * Combina Espaço HSV com Dominância Direta de Canais RGB e Dispersão Cromática.
     * Imune à iluminação ambiente, sombras, saturação de câmera de smartphone e reflexos.
     */
    classifyColor(r, g, b, expectedCenter = null) {
        const { h, s, v } = this.rgbToHsv(r, g, b);

        const maxCh = Math.max(r, g, b);
        const minCh = Math.min(r, g, b);
        const spread = maxCh - minCh;

        // 1. BRANCO: baixa saturação OU dispersão mínima entre canais com alto brilho
        if ((s < 0.22 && v > 0.35) || (spread < 48 && v > 0.40)) {
            return this.CUBE_COLORS.WHITE.hex;
        }

        // 2. VERDE vs AZUL (Diferenciação absoluta por dominância de canais e Matiz)
        // No cubo verde (inclusive fluorescentes/stickerless), o canal Verde domina expressivamente o Azul:
        if ((h >= 75 && h <= 168) || (g > b * 1.08 && g > r && h >= 70 && h <= 172)) {
            return this.CUBE_COLORS.GREEN.hex;
        }

        // No cubo azul, o canal Azul domina estritamente o Verde e o Vermelho:
        if ((h > 168 && h <= 265) || (b > g && b > r && h > 165)) {
            return this.CUBE_COLORS.BLUE.hex;
        }

        // 3. AMARELO: Ambos os canais R e G são muito altos, canal B é baixo
        const gRatio = g / Math.max(1, r);
        if ((h >= 40 && h <= 75 && s >= 0.25) || (r > 140 && g > 130 && b < 125 && gRatio >= 0.70)) {
            return this.CUBE_COLORS.YELLOW.hex;
        }

        // 4. DIFERENCIAÇÃO ROBUSTA ENTRE VERMELHO E LARANJA
        // Em ambos os plásticos, R é o canal dominante (r > g e r > b).
        // Diferenças físicas e ópticas fundamentais:
        // - No Vermelho (carmesim/carmim/rubi): o pigmento absorve o verde intensamente.
        //   O canal Azul é praticamente igual ou até maior que o canal Verde (g - b <= 4).
        //   O matiz fica encostado em 0° ou no espectro magenta (h <= 4° ou h >= 340°).
        // - No Laranja: o pigmento reflete luz amarela/laranja (vermelho + verde), absorvendo o azul.
        //   Portanto, o canal Verde supera o canal Azul substancialmente (g - b >= 8 e g > b),
        //   com matiz positivo quente (5° <= h < 45°).
        const gMinusB = g - b;

        // Se for o centro esperado desta etapa, reforça a estabilidade contra ruídos de borda
        if (expectedCenter === 'ORANGE' && (h >= 5 && h < 50) && gMinusB >= 6) {
            return this.CUBE_COLORS.ORANGE.hex;
        }
        if (expectedCenter === 'RED' && (h <= 8 || h >= 335) && (gMinusB <= 15 || gRatio <= 0.35)) {
            return this.CUBE_COLORS.RED.hex;
        }

        // Regra de Vermelho estrito: se Azul >= Verde ou matiz em 0°/magenta
        if (gMinusB <= 4 || h <= 4 || h >= 340) {
            return this.CUBE_COLORS.RED.hex;
        }

        // Regra de Laranja (cobre iluminação padrão, sombras e plásticos profundos/escurecidos):
        // Cobre laranjas com gRatio a partir de 0.18 quando gMinusB >= 8,
        // ou laranjas onde o canal Verde é bem superior ao Azul (g > b * 1.35)
        if ((h >= 5 && h < 45) && (gMinusB >= 8)) {
            if (gRatio >= 0.18 || gMinusB >= 18 || (g > b * 1.35)) {
                return this.CUBE_COLORS.ORANGE.hex;
            }
        }

        // Laranja sob iluminação brilhante / quente
        if (gMinusB >= 14 && (g > b * 1.25) && (h < 50)) {
            return this.CUBE_COLORS.ORANGE.hex;
        }

        // Fallback seguro: Vermelho
        return this.CUBE_COLORS.RED.hex;
    }

    handleCaptureButtonClick() {
        if (this.isPausedForReview) {
            // Se já estava pausado para revisão, o botão atua como "Refazer Leitura"
            this.refazerLeitura();
        } else {
            // Caso contrário, captura a face atual
            this.captureCurrentFace();
        }
    }

    captureCurrentFace() {
        const step = this.FACE_STEPS[this.currentStep];
        const centerExpectedHex = this.CUBE_COLORS[step.centerColor].hex;
        const centerDetectedHex = this.currentFacePreviewColors[4];

        // Se o centro detectado não coincidir com a face esperada, avisa o usuário!
        if (centerDetectedHex.toLowerCase() !== centerExpectedHex.toLowerCase()) {
            const detectedName = this.getColorNameByHex(centerDetectedHex);
            const expectedName = this.CUBE_COLORS[step.centerColor].name;
            const confirmCapture = confirm(
                `⚠️ ATENÇÃO: Centro Detectado Incorreto!\n\n` +
                `O centro apontado para a câmera parece ser ${detectedName.toUpperCase()}, mas esta etapa pede a Face ${expectedName.toUpperCase()}!\n\n` +
                `Deseja capturar esta face mesmo assim? (Clique em 'Cancelar' para apontar a face correta)`
            );
            if (!confirmCapture) {
                return;
            }
        }

        // Salvar a face capturada
        this.scannedFaces[step.faceIndex] = [...this.currentFacePreviewColors];
        this.isPausedForReview = true;

        this.playBeep();
        this.updateStepUI();
        this.renderPreviewGrid();
        this.updateParityTracker();
    }

    refazerLeitura() {
        const step = this.FACE_STEPS[this.currentStep];
        delete this.scannedFaces[step.faceIndex];
        this.isPausedForReview = false;
        this.updateStepUI();
        this.renderPreviewGrid();
        this.updateParityTracker();
    }

    nextStep() {
        const step = this.FACE_STEPS[this.currentStep];
        
        // Garante que a face atual esteja gravada
        this.scannedFaces[step.faceIndex] = [...this.currentFacePreviewColors];

        if (this.currentStep < this.FACE_STEPS.length - 1) {
            this.currentStep++;
            const nextStep = this.FACE_STEPS[this.currentStep];
            
            // Se a próxima face já foi lida anteriormente, exibe em modo revisão; senão, câmera ao vivo
            this.isPausedForReview = !!this.scannedFaces[nextStep.faceIndex];
            
            this.updateStepUI();
            this.renderPreviewGrid();
            this.updateParityTracker();
        } else {
            this.finishScanning();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            const prevStep = this.FACE_STEPS[this.currentStep];
            
            this.isPausedForReview = true;
            if (this.scannedFaces[prevStep.faceIndex]) {
                this.currentFacePreviewColors = [...this.scannedFaces[prevStep.faceIndex]];
            }
            
            this.updateStepUI();
            this.renderPreviewGrid();
            this.updateParityTracker();
        }
    }

    updateStepUI() {
        const step = this.FACE_STEPS[this.currentStep];
        if (this.stepTitle) {
            this.stepTitle.textContent = step.title;
        }
        if (this.stepTip) {
            this.stepTip.innerHTML = `<strong>Orientação Obrigatória:</strong><br>${step.instruction}`;
        }

        // Indicador de progresso (pontos)
        this.renderStepperDots();

        const getTextColor = (hex) => {
            if (hex === '#000099') return '#60a5fa'; // Azul claro
            if (hex === '#ffff00') return '#fef08a'; // Amarelo claro
            if (hex === '#009900') return '#4ade80'; // Verde claro
            if (hex === '#cc0000') return '#f87171'; // Vermelho claro
            if (hex === '#ff8000') return '#fb923c'; // Laranja claro
            return '#ffffff';
        };

        const dotStyle = (hex) => `<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${hex};border:1px solid rgba(255,255,255,0.7);margin-right:3px;vertical-align:middle;flex-shrink:0;"></span>`;
        const formatCompassName = (name) => {
            if (name === 'Amarelo') return 'Aml';
            if (name === 'Branco') return 'Bco';
            if (name === 'Laranja') return 'Lar';
            if (name === 'Vermelho') return 'Ver';
            if (name === 'Verde') return 'Vde';
            if (name === 'Azul') return 'Azu';
            return name;
        };

        if (this.compassTop) {
            this.compassTop.innerHTML = `▲ Cima: ${dotStyle(step.top.hex)}<span style="color:${getTextColor(step.top.hex)}">${formatCompassName(step.top.name)}</span>`;
            this.compassTop.style.borderColor = step.top.hex;
        }
        if (this.compassRight) {
            this.compassRight.innerHTML = `▶ Dir: ${dotStyle(step.right.hex)}<span style="color:${getTextColor(step.right.hex)}">${formatCompassName(step.right.name)}</span>`;
            this.compassRight.style.borderColor = step.right.hex;
        }
        if (this.compassBottom) {
            this.compassBottom.innerHTML = `▼ Baixo: ${dotStyle(step.bottom.hex)}<span style="color:${getTextColor(step.bottom.hex)}">${formatCompassName(step.bottom.name)}</span>`;
            this.compassBottom.style.borderColor = step.bottom.hex;
        }
        if (this.compassLeft) {
            this.compassLeft.innerHTML = `◀ Esq: ${dotStyle(step.left.hex)}<span style="color:${getTextColor(step.left.hex)}">${formatCompassName(step.left.name)}</span>`;
            this.compassLeft.style.borderColor = step.left.hex;
        }
        if (this.compassCenter) {
            const centerInfo = this.CUBE_COLORS[step.centerColor];
            this.compassCenter.innerHTML = `🎯 Centro: ${dotStyle(centerInfo.hex)}<span style="color:${getTextColor(centerInfo.hex)}">${centerInfo.name}</span>`;
            this.compassCenter.style.borderColor = centerInfo.hex;
        }

        if (this.guideFrontText) {
            const centerInfo = this.CUBE_COLORS[step.centerColor];
            this.guideFrontText.textContent = centerInfo.name.toUpperCase();
            this.guideFrontText.style.color = getTextColor(centerInfo.hex);
        }
        if (this.guideTopText) {
            this.guideTopText.textContent = step.top.name.toUpperCase();
            this.guideTopText.style.color = getTextColor(step.top.hex);
        }

        if (this.btnPrev) {
            this.btnPrev.disabled = (this.currentStep === 0);
        }

        // Ajuste dos botões de ação conforme estado (Live vs Revisão)
        const isLastStep = (this.currentStep === this.FACE_STEPS.length - 1);
        if (this.isPausedForReview) {
            if (this.btnCapture) {
                this.btnCapture.innerHTML = '<i class="fas fa-redo"></i> Refazer Leitura';
                this.btnCapture.className = 'scanner-btn secondary';
            }
            if (this.btnNext) {
                this.btnNext.innerHTML = isLastStep ? '<i class="fas fa-check"></i> Finalizar Cubo' : '<i class="fas fa-arrow-right"></i> Próxima Face';
                this.btnNext.className = 'scanner-btn capture';
            }
        } else {
            if (this.btnCapture) {
                this.btnCapture.innerHTML = '<i class="fas fa-camera"></i> Capturar Face';
                this.btnCapture.className = 'scanner-btn capture';
            }
            if (this.btnNext) {
                this.btnNext.innerHTML = isLastStep ? 'Finalizar' : 'Avançar';
                this.btnNext.className = 'scanner-btn secondary';
            }
        }

        // Se a face atual já tiver leitura gravada, carrega suas cores
        if (this.scannedFaces[step.faceIndex]) {
            this.currentFacePreviewColors = [...this.scannedFaces[step.faceIndex]];
        } else if (!this.isScanning) {
            const targetHex = this.CUBE_COLORS[step.centerColor].hex;
            this.currentFacePreviewColors = Array(9).fill(this.CUBE_COLORS.WHITE.hex);
            this.currentFacePreviewColors[4] = targetHex;
        }

        this.renderPreviewGrid();
    }

    handleImageUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                if (this.canvasOverlay && this.ctx) {
                    this.isPausedForReview = true;
                    const displayW = this.canvasOverlay.clientWidth || 290;
                    const displayH = this.canvasOverlay.clientHeight || 205;
                    const dpr = this.dpr || 1;
                    this.canvasOverlay.width = Math.round(displayW * dpr);
                    this.canvasOverlay.height = Math.round(displayH * dpr);
                    this.ctx.save();
                    this.ctx.scale(dpr, dpr);

                    const imgRatio = img.width / img.height;
                    const cRatio = displayW / displayH;
                    let dw, dh, dx, dy;
                    if (imgRatio > cRatio) {
                        dh = displayH;
                        dw = displayH * imgRatio;
                        dx = (displayW - dw) / 2;
                        dy = 0;
                    } else {
                        dw = displayW;
                        dh = displayW / imgRatio;
                        dx = 0;
                        dy = (displayH - dh) / 2;
                    }
                    this.ctx.drawImage(img, dx, dy, dw, dh);

                    const boxSize = Math.round(Math.min(displayW, displayH) * 0.64);
                    const startX = Math.round((displayW - boxSize) / 2);
                    const startY = Math.round((displayH - boxSize) / 2);
                    const cellSize = boxSize / 3;
                    const step = this.FACE_STEPS[this.currentStep];
                    const colors = [];

                    for (let r = 0; r < 3; r++) {
                        for (let c = 0; c < 3; c++) {
                            const cx = Math.floor(startX + (c + 0.5) * cellSize);
                            const cy = Math.floor(startY + (r + 0.5) * cellSize);
                            const rgb = this.getAverageRGB(cx, cy, Math.max(3, Math.floor(cellSize * 0.12)));
                            const isCenter = (r === 1 && c === 1);
                            colors.push(this.classifyColor(rgb.r, rgb.g, rgb.b, isCenter ? step.centerColor : null));
                        }
                    }

                    this.ctx.restore();

                    this.scannedFaces[step.faceIndex] = [...colors];
                    this.currentFacePreviewColors = [...colors];
                    this.renderPreviewGrid();
                    this.updateParityTracker();
                    this.updateStepUI();
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    finishScanning() {
        // Mapear todas as 6 faces lidas para o FlatCube e Cubo 3D aplicando as transformações de rotação
        if (this.flatCube && this.flatCube.faces) {
            for (let i = 0; i < this.FACE_STEPS.length; i++) {
                const step = this.FACE_STEPS[i];
                const camColors = this.scannedFaces[step.faceIndex];
                if (camColors && this.flatCube.faces[step.faceIndex]) {
                    const transform = step.transform || [0, 1, 2, 3, 4, 5, 6, 7, 8];
                    for (let s = 0; s < 9; s++) {
                        const camIdx = transform[s];
                        const colorHex = camColors[camIdx];
                        if (this.flatCube.faces[step.faceIndex].stickers[s]) {
                            this.flatCube.faces[step.faceIndex].stickers[s].setColor(colorHex);
                        }
                    }
                }
            }

            this.flatCube.update();
        }

        const cubeInstance = (this.flatCube && this.flatCube.cube) ? this.flatCube.cube : null;
        const validation = (cubeInstance && cubeInstance.validateState) ? cubeInstance.validateState() : { valid: true };

        if (!validation.valid) {
            const confirmLeave = confirm(
                `⚠️ Atenção: Detectamos inconsistências nas cores lidas:\n\n` +
                `${validation.reason}\n${validation.details ? validation.details + '\n\n' : '\n'}` +
                `Deseja finalizar assim mesmo para corrigir no modelo planificado?\n\n` +
                `• Clique em 'OK' para ir ao modelo planificado e ajustar os adesivos com cliques.\n` +
                `• Clique em 'Cancelar' para revisar e ajustar as faces aqui no scanner.`
            );
            if (!confirmLeave) {
                return;
            }
        } else {
            if (window.showCubeToast) {
                window.showCubeToast('Cubo lido com sucesso! Abrindo Passo a Passo...', 'success');
            }
        }

        this.stopCamera();
        this.close();

        if (typeof this.onComplete === 'function') {
            this.onComplete(validation.valid, validation);
        }
    }

    playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        } catch (e) {}
    }
}

window.CuboCameraScanner = CuboCameraScanner;
