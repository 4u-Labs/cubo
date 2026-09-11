/**
 * CuboFácil Vision — Scanner de Cores por Câmera & Foto com Bússola de Orientação Espacial
 * Informa com precisão a cor central e as 4 referências laterais (Cima, Baixo, Esquerda, Direita)
 * para garantir que o cubo nunca seja lido com rotação invertida.
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

        // Ordem e orientações exatas das 6 faces no FlatCube:
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
                instruction: 'Centro BRANCO de frente • CIMA: Verde • DIREITA: Laranja'
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
                instruction: 'Centro AZUL de frente • CIMA: Branco • DIREITA: Laranja'
            },
            {
                faceIndex: 3,
                name: 'Direita (R)',
                centerColor: 'ORANGE',
                title: '3. Face Laranja (Direita / R)',
                top:    { name: 'Verde',    hex: '#009900', label: 'Verde' },
                bottom: { name: 'Azul',     hex: '#000099', label: 'Azul' },
                left:   { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                right:  { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                instruction: 'Centro LARANJA de frente • CIMA: Verde • ESQUERDA: Branco'
            },
            {
                faceIndex: 0,
                name: 'Atrás (B)',
                centerColor: 'GREEN',
                title: '4. Face Verde (Atrás / B)',
                top:    { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                bottom: { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                left:   { name: 'Vermelho', hex: '#cc0000', label: 'Vermelho' },
                right:  { name: 'Laranja',  hex: '#ff8000', label: 'Laranja' },
                instruction: 'Centro VERDE de frente • CIMA: Amarelo • DIREITA: Laranja'
            },
            {
                faceIndex: 1,
                name: 'Esquerda (L)',
                centerColor: 'RED',
                title: '5. Face Vermelha (Esquerda / L)',
                top:    { name: 'Verde',    hex: '#009900', label: 'Verde' },
                bottom: { name: 'Azul',     hex: '#000099', label: 'Azul' },
                left:   { name: 'Amarelo',  hex: '#ffff00', label: 'Amarelo' },
                right:  { name: 'Branco',   hex: '#ffffff', label: 'Branco' },
                instruction: 'Centro VERMELHO de frente • CIMA: Verde • DIREITA: Branco'
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
                instruction: 'Centro AMARELO de frente • CIMA: Azul • DIREITA: Laranja'
            }
        ];

        this.currentStep = 0;
        this.scannedFaces = {};
        this.stream = null;
        this.animFrameId = null;
        this.isScanning = false;

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
            this.btnCapture.addEventListener('click', () => this.captureCurrentFace());
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
    }

    renderStepperDots() {
        if (!this.stepperDots) return;
        this.stepperDots.innerHTML = '';
        this.FACE_STEPS.forEach((step, idx) => {
            const dot = document.createElement('div');
            dot.className = `step-dot ${idx === this.currentStep ? 'active' : ''} ${this.scannedFaces[step.faceIndex] ? 'completed' : ''}`;
            dot.title = step.name;
            dot.style.background = this.scannedFaces[step.faceIndex] ? 'var(--brand-primary, #10b981)' : (idx === this.currentStep ? '#60a5fa' : 'rgba(255,255,255,0.2)');
            this.stepperDots.appendChild(dot);
        });
    }

    renderPreviewGrid() {
        if (!this.previewGrid) return;
        this.previewGrid.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'scanner-preview-cell';
            cell.style.backgroundColor = this.currentFacePreviewColors[i];
            
            if (i === 4) {
                cell.style.border = '2px solid #ffffff';
                cell.title = 'Centro (fixo de referência)';
            } else {
                cell.title = `Clique para alterar a cor (Posição ${i + 1})`;
                cell.addEventListener('click', () => this.cycleCellColor(i));
            }
            
            this.previewGrid.appendChild(cell);
        }
    }

    cycleCellColor(index) {
        if (index === 4) return; // Centro é a referência da face
        const hexList = Object.values(this.CUBE_COLORS).map(c => c.hex);
        const currentIdx = hexList.indexOf(this.currentFacePreviewColors[index]);
        const nextIdx = (currentIdx + 1) % hexList.length;
        this.currentFacePreviewColors[index] = hexList[nextIdx];
        this.renderPreviewGrid();
    }

    async open() {
        if (!this.modal) return;
        this.currentStep = 0;
        this.scannedFaces = {};
        this.modal.classList.add('active');
        this.updateStepUI();
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

        const w = this.canvasOverlay.width = this.video.videoWidth || 480;
        const h = this.canvasOverlay.height = this.video.videoHeight || 480;

        // Desenhar frame do vídeo
        this.ctx.drawImage(this.video, 0, 0, w, h);

        // Geometria da mira 3x3 no centro
        const boxSize = Math.min(w, h) * 0.70;
        const startX = (w - boxSize) / 2;
        const startY = (h - boxSize) / 2;
        const cellSize = boxSize / 3;

        // Overlay escuro fora da área do cubo
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.fillRect(0, 0, w, startY);
        this.ctx.fillRect(0, startY + boxSize, w, h - (startY + boxSize));
        this.ctx.fillRect(0, startY, startX, boxSize);
        this.ctx.fillRect(startX + boxSize, startY, w - (startX + boxSize), boxSize);

        // Grade 3x3 estilizada
        this.ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(startX, startY, boxSize, boxSize);

        // Desenhar rótulos das referências nos 4 cantos da mira
        const step = this.FACE_STEPS[this.currentStep];
        this.drawOrientationPills(startX, startY, boxSize, step);

        const detectedColors = [];

        // Amostrar cada um dos 9 stickers
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cellX = startX + col * cellSize;
                const cellY = startY + row * cellSize;

                // Desenhar borda de cada célula
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
                this.ctx.lineWidth = 1.5;
                this.ctx.strokeRect(cellX, cellY, cellSize, cellSize);

                const sampleCenterX = Math.floor(cellX + cellSize / 2);
                const sampleCenterY = Math.floor(cellY + cellSize / 2);
                const sampleRadius = Math.max(4, Math.floor(cellSize * 0.12));

                const rgb = this.getAverageRGB(sampleCenterX, sampleCenterY, sampleRadius);
                const matchedColor = this.classifyColorHSV(rgb.r, rgb.g, rgb.b);
                detectedColors.push(matchedColor);

                // Mira central colorida
                this.ctx.fillStyle = matchedColor;
                this.ctx.beginPath();
                this.ctx.arc(sampleCenterX, sampleCenterY, sampleRadius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }

        // Centro é sempre fixo na cor da face atual
        const currentTargetCenter = this.CUBE_COLORS[step.centerColor].hex;
        detectedColors[4] = currentTargetCenter;

        this.currentFacePreviewColors = detectedColors;
        this.renderPreviewGrid();

        this.animFrameId = requestAnimationFrame(() => this.scanLoop());
    }

    drawOrientationPills(startX, startY, boxSize, step) {
        if (!this.ctx || !this.canvasOverlay) return;
        this.ctx.save();
        const w = this.canvasOverlay.width;
        const h = this.canvasOverlay.height;
        
        const fontSize = Math.max(13, Math.min(22, Math.round(boxSize * 0.058)));
        this.ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Pílula Superior (CIMA) - centralizada na faixa preta superior
        const topY = Math.max(fontSize * 1.1, startY / 2);
        this.drawBadge(startX + boxSize / 2, topY, `▲ CIMA: ${step.top.label}`, step.top.hex, fontSize);

        // Pílula Inferior (BAIXO) - centralizada na faixa preta inferior
        const botY = Math.min(h - fontSize * 1.1, (startY + boxSize) + (h - (startY + boxSize)) / 2);
        this.drawBadge(startX + boxSize / 2, botY, `▼ BAIXO: ${step.bottom.label}`, step.bottom.hex, fontSize);

        // Pílula Esquerda (ESQ) - centralizada na faixa preta esquerda
        const leftX = Math.max(fontSize * 2.2, startX / 2);
        this.drawBadge(leftX, startY + boxSize / 2, `◀ ${step.left.label}`, step.left.hex, fontSize);

        // Pílula Direita (DIR) - centralizada na faixa preta direita
        const rightX = Math.min(w - fontSize * 2.2, (startX + boxSize) + (w - (startX + boxSize)) / 2);
        this.drawBadge(rightX, startY + boxSize / 2, `${step.right.label} ▶`, step.right.hex, fontSize);

        this.ctx.restore();
    }

    drawBadge(x, y, text, colorHex, fontSize = 13) {
        this.ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
        const textWidth = this.ctx.measureText(text).width;
        const padX = fontSize * 0.6;
        const padY = fontSize * 0.45;
        const badgeW = textWidth + padX * 2;
        const badgeH = fontSize + padY * 2;

        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        this.ctx.strokeStyle = colorHex;
        this.ctx.lineWidth = Math.max(2, fontSize * 0.12);

        this.ctx.beginPath();
        this.ctx.roundRect(x - badgeW / 2, y - badgeH / 2, badgeW, badgeH, 6);
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = (colorHex === '#ffff00' || colorHex === '#ffffff') ? '#ffffff' : colorHex;
        this.ctx.fillText(text, x, y);
    }

    getAverageRGB(cx, cy, radius) {
        let r = 0, g = 0, b = 0, count = 0;
        try {
            const imgData = this.ctx.getImageData(cx - radius, cy - radius, radius * 2, radius * 2);
            const d = imgData.data;
            for (let i = 0; i < d.length; i += 4) {
                r += d[i];
                g += d[i + 1];
                b += d[i + 2];
                count++;
            }
        } catch (e) {
            return { r: 255, g: 255, b: 255 };
        }
        return {
            r: Math.round(r / (count || 1)),
            g: Math.round(g / (count || 1)),
            b: Math.round(b / (count || 1))
        };
    }

    classifyColorHSV(r, g, b) {
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

        // Branco
        if (s < 0.22 && v > 0.40) {
            return this.CUBE_COLORS.WHITE.hex;
        }

        // Amarelo
        if (h >= 45 && h <= 72) {
            return this.CUBE_COLORS.YELLOW.hex;
        }

        // Laranja vs Vermelho
        if (h >= 14 && h < 45) {
            return this.CUBE_COLORS.ORANGE.hex;
        }
        if (h >= 340 || h < 14) {
            return this.CUBE_COLORS.RED.hex;
        }

        // Verde
        if (h >= 73 && h <= 165) {
            return this.CUBE_COLORS.GREEN.hex;
        }

        // Azul
        if (h > 165 && h < 270) {
            return this.CUBE_COLORS.BLUE.hex;
        }

        return this.CUBE_COLORS.WHITE.hex;
    }

    captureCurrentFace() {
        const step = this.FACE_STEPS[this.currentStep];
        this.scannedFaces[step.faceIndex] = [...this.currentFacePreviewColors];

        this.playBeep();

        if (this.currentStep < this.FACE_STEPS.length - 1) {
            this.currentStep++;
            this.updateStepUI();
        } else {
            this.finishScanning();
        }
    }

    nextStep() {
        if (this.currentStep < this.FACE_STEPS.length - 1) {
            this.currentStep++;
            this.updateStepUI();
        }
    }

    prevStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.updateStepUI();
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

        // Atualizar bússola visual no HTML
        const dotStyle = (hex) => `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${hex};border:1px solid rgba(255,255,255,0.7);margin:0 4px;vertical-align:middle;"></span>`;
        if (this.compassTop) {
            this.compassTop.innerHTML = `▲ CIMA: ${dotStyle(step.top.hex)}${step.top.name}`;
            this.compassTop.style.borderColor = step.top.hex;
        }
        if (this.compassBottom) {
            this.compassBottom.innerHTML = `▼ BAIXO: ${dotStyle(step.bottom.hex)}${step.bottom.name}`;
            this.compassBottom.style.borderColor = step.bottom.hex;
        }
        if (this.compassLeft) {
            this.compassLeft.innerHTML = `◀ ESQ: ${dotStyle(step.left.hex)}${step.left.name}`;
            this.compassLeft.style.borderColor = step.left.hex;
        }
        if (this.compassRight) {
            this.compassRight.innerHTML = `DIR: ${dotStyle(step.right.hex)}${step.right.name} ▶`;
            this.compassRight.style.borderColor = step.right.hex;
        }
        if (this.compassCenter) {
            const centerInfo = this.CUBE_COLORS[step.centerColor];
            this.compassCenter.innerHTML = `🎯 CENTRO: ${dotStyle(centerInfo.hex)}<strong>${centerInfo.name.toUpperCase()}</strong>`;
            this.compassCenter.style.borderColor = centerInfo.hex;
            this.compassCenter.style.boxShadow = `0 0 12px ${centerInfo.hex}55`;
        }

        const getTextColor = (hex) => {
            if (hex === '#000099') return '#60a5fa'; // Azul claro para alto contraste
            if (hex === '#ffff00') return '#fef08a'; // Amarelo claro
            if (hex === '#009900') return '#4ade80'; // Verde claro
            if (hex === '#cc0000') return '#f87171'; // Vermelho claro
            if (hex === '#ff8000') return '#fb923c'; // Laranja claro
            return '#ffffff';
        };

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

        if (this.btnNext) {
            this.btnNext.textContent = (this.currentStep === this.FACE_STEPS.length - 1) ? 'Finalizar' : 'Avançar';
        }

        if (this.scannedFaces[step.faceIndex]) {
            this.currentFacePreviewColors = [...this.scannedFaces[step.faceIndex]];
        } else {
            const targetHex = this.CUBE_COLORS[step.centerColor].hex;
            this.currentFacePreviewColors = Array(9).fill(this.CUBE_COLORS.WHITE.hex);
            this.currentFacePreviewColors[4] = targetHex;
        }

        this.renderPreviewGrid();
        this.renderStepperDots();
    }

    handleImageUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                if (this.canvasOverlay && this.ctx) {
                    this.canvasOverlay.width = img.width;
                    this.canvasOverlay.height = img.height;
                    this.ctx.drawImage(img, 0, 0);

                    const boxSize = Math.min(img.width, img.height) * 0.70;
                    const startX = (img.width - boxSize) / 2;
                    const startY = (img.height - boxSize) / 2;
                    const cellSize = boxSize / 3;
                    const colors = [];

                    for (let r = 0; r < 3; r++) {
                        for (let c = 0; c < 3; c++) {
                            const cx = Math.floor(startX + (c + 0.5) * cellSize);
                            const cy = Math.floor(startY + (r + 0.5) * cellSize);
                            const rgb = this.getAverageRGB(cx, cy, 10);
                            colors.push(this.classifyColorHSV(rgb.r, rgb.g, rgb.b));
                        }
                    }

                    const step = this.FACE_STEPS[this.currentStep];
                    colors[4] = this.CUBE_COLORS[step.centerColor].hex;

                    this.currentFacePreviewColors = colors;
                    this.renderPreviewGrid();
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    finishScanning() {
        this.stopCamera();
        this.close();

        if (this.flatCube && this.flatCube.faces) {
            for (let f = 0; f < 6; f++) {
                const faceColors = this.scannedFaces[f];
                if (faceColors && this.flatCube.faces[f]) {
                    for (let s = 0; s < 9; s++) {
                        if (this.flatCube.faces[f].stickers[s]) {
                            this.flatCube.faces[f].stickers[s].setColor(faceColors[s]);
                        }
                    }
                }
            }

            this.flatCube.update();
        }

        if (typeof this.onComplete === 'function') {
            this.onComplete();
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
