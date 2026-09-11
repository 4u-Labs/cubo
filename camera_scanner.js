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
        this.calibratedCenters = {};
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
        this.updateParityTracker();
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
        this.updateParityTracker();
    }

    cycleCellColor(index) {
        if (index === 4) return;
        const hexList = Object.values(this.CUBE_COLORS).map(c => c.hex);
        const currentIdx = hexList.indexOf(this.currentFacePreviewColors[index]);
        const nextIdx = (currentIdx + 1) % hexList.length;
        this.currentFacePreviewColors[index] = hexList[nextIdx];
        this.renderPreviewGrid();
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
                    const key = hexMap[hex.toLowerCase()];
                    if (key) counts[key]++;
                });
            }
        }
        return counts;
    }

    updateParityTracker() {
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
                statusEl.textContent = '✓ 54/54 Válido!';
                statusEl.classList.add('valid');
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
        this.calibratedCenters = {};
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

        // Desenhar frame do vídeo mantendo a proporção exata (object-fit: cover) sem distorcer
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

        // Geometria da mira 3x3 no centro: QUADRADO PERFEITO COM OS 4 LADOS IGUAIS
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

        // Grade 3x3 estilizada: Quadrado com os 4 lados rigorosamente iguais
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

                const rgb = this.getAverageRGB(sampleCenterX, sampleCenterY, sampleRadius);
                if (row === 1 && col === 1) {
                    this.currentCenterRawRgb = { ...rgb };
                }

                const matchedColor = this.classifyColorHSV(rgb.r, rgb.g, rgb.b);
                detectedColors.push(matchedColor);

                // Mira central colorida
                this.ctx.fillStyle = matchedColor;
                this.ctx.beginPath();
                this.ctx.arc(sampleCenterX, sampleCenterY, sampleRadius, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
            }
        }

        this.ctx.restore();

        // Centro é sempre fixo na cor da face atual
        const currentTargetCenter = this.CUBE_COLORS[step.centerColor].hex;
        detectedColors[4] = currentTargetCenter;

        this.currentFacePreviewColors = detectedColors;
        this.renderPreviewGrid();

        this.animFrameId = requestAnimationFrame(() => this.scanLoop());
    }

    formatSideLabel(label) {
        if (label === 'Amarelo') return 'Aml';
        if (label === 'Branco') return 'Bco';
        if (label === 'Laranja') return 'Lar';
        if (label === 'Vermelho') return 'Ver';
        return label;
    }

    drawOrientationPills(startX, startY, boxSize, step, w, h) {
        if (!this.ctx || !this.canvasOverlay) return;
        
        const fontSize = Math.max(11, Math.min(14, Math.round(boxSize * 0.088)));
        this.ctx.font = `bold ${fontSize}px Inter, -apple-system, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        // Pílula Superior (CIMA) - Cima Verde deixado como está
        const topY = startY / 2;
        this.drawBadge(startX + boxSize / 2, topY, `▲ CIMA: ${step.top.label}`, step.top.hex, fontSize);

        // Pílula Inferior (BAIXO) - Baixo Azul deixado como está
        const botY = (startY + boxSize) + (h - (startY + boxSize)) / 2;
        this.drawBadge(startX + boxSize / 2, botY, `▼ BAIXO: ${step.bottom.label}`, step.bottom.hex, fontSize);

        // Pílula Esquerda (ESQ) - com seta e abreviação ("◀ Aml" / "◀ Bco")
        const leftX = startX / 2;
        const leftText = `◀ ${this.formatSideLabel(step.left.label)}`;
        this.drawBadge(leftX, startY + boxSize / 2, leftText, step.left.hex, fontSize);

        // Pílula Direita (DIR) - com seta e abreviação ("Bco ▶" / "Aml ▶")
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
            const pR = Math.max(2, Math.round(radius * dpr));
            const imgData = this.ctx.getImageData(pX - pR, pY - pR, pR * 2, pR * 2);
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

    calcColorDistance(rgb1, hsv1, rgb2, hsv2) {
        let dh = Math.abs(hsv1.h - hsv2.h);
        if (dh > 180) dh = 360 - dh;
        const normDh = dh / 180;
        const normDs = Math.abs(hsv1.s - hsv2.s);
        const normDv = Math.abs(hsv1.v - hsv2.v);

        const dr = (rgb1.r - rgb2.r) / 255;
        const dg = (rgb1.g - rgb2.g) / 255;
        const db = (rgb1.b - rgb2.b) / 255;
        const rgbDist = Math.sqrt(dr * dr + dg * dg + db * db) / Math.sqrt(3);

        if (hsv1.s < 0.20 && hsv2.s < 0.20) {
            return rgbDist;
        }

        return (normDh * 0.55) + (normDs * 0.20) + (normDv * 0.10) + (rgbDist * 0.15);
    }

    classifyColorHSV(r, g, b) {
        const hsv = this.rgbToHsv(r, g, b);
        const { h, s, v } = hsv;

        // Se houver centros calibrados de faces já capturadas, avalia proximidade adaptativa
        const calKeys = Object.keys(this.calibratedCenters);
        if (calKeys.length >= 2) {
            let bestMatch = null;
            let minDistance = Infinity;

            for (const colorKey of calKeys) {
                const center = this.calibratedCenters[colorKey];
                let dist = this.calcColorDistance({ r, g, b }, hsv, center.rgb, center.hsv);
                if (dist < minDistance) {
                    minDistance = dist;
                    bestMatch = center.hex;
                }
            }

            if (minDistance < 0.28 && bestMatch) {
                return bestMatch;
            }
        }

        // Fallback robusto por faixas HSV
        // Branco (baixa saturação e brilho)
        if (s < 0.22 && v > 0.38) {
            return this.CUBE_COLORS.WHITE.hex;
        }

        // Amarelo
        if (h >= 45 && h <= 72 && s >= 0.25) {
            return this.CUBE_COLORS.YELLOW.hex;
        }

        // Laranja vs Vermelho
        if (h >= 13 && h < 45) {
            return this.CUBE_COLORS.ORANGE.hex;
        }
        if (h >= 340 || h < 13) {
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

        // Calibração Adaptativa do centro sob a luz real da câmera
        if (this.ctx && this.canvasOverlay) {
            const centerRgb = this.currentCenterRawRgb || { r: 255, g: 255, b: 255 };
            const centerHsv = this.rgbToHsv(centerRgb.r, centerRgb.g, centerRgb.b);

            this.calibratedCenters[step.centerColor] = {
                rgb: centerRgb,
                hsv: centerHsv,
                hex: this.CUBE_COLORS[step.centerColor].hex
            };
        }

        this.playBeep();
        this.updateParityTracker();

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

        // Indicador de progresso (pontos)
        if (this.stepperDots) {
            this.stepperDots.innerHTML = '';
            for (let i = 0; i < this.FACE_STEPS.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'stepper-dot' + (i === this.currentStep ? ' active' : (i < this.currentStep ? ' done' : ''));
                this.stepperDots.appendChild(dot);
            }
        }

        const getTextColor = (hex) => {
            if (hex === '#000099') return '#60a5fa'; // Azul claro
            if (hex === '#ffff00') return '#fef08a'; // Amarelo claro
            if (hex === '#009900') return '#4ade80'; // Verde claro
            if (hex === '#cc0000') return '#f87171'; // Vermelho claro
            if (hex === '#ff8000') return '#fb923c'; // Laranja claro
            return '#ffffff';
        };

        // Atualizar bússola visual compacta no HTML
        const dotStyle = (hex) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${hex};border:1px solid rgba(255,255,255,0.7);margin-right:4px;vertical-align:middle;"></span>`;
        const formatCompassName = (name) => {
            if (name === 'Amarelo') return 'Aml';
            if (name === 'Branco') return 'Bco';
            if (name === 'Laranja') return 'Lar';
            if (name === 'Vermelho') return 'Ver';
            return name;
        };
        if (this.compassTop) {
            this.compassTop.innerHTML = `▲ Cima: ${dotStyle(step.top.hex)}<span style="color:${getTextColor(step.top.hex)}">${step.top.name}</span>`;
            this.compassTop.style.borderColor = step.top.hex;
        }
        if (this.compassRight) {
            this.compassRight.innerHTML = `▶ Dir: ${dotStyle(step.right.hex)}<span style="color:${getTextColor(step.right.hex)}">${formatCompassName(step.right.name)}</span>`;
            this.compassRight.style.borderColor = step.right.hex;
        }
        if (this.compassBottom) {
            this.compassBottom.innerHTML = `▼ Baixo: ${dotStyle(step.bottom.hex)}<span style="color:${getTextColor(step.bottom.hex)}">${step.bottom.name}</span>`;
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

        // Atualizar cor inicial do centro no preview
        this.currentFacePreviewColors[4] = this.CUBE_COLORS[step.centerColor].hex;
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
                    const colors = [];

                    for (let r = 0; r < 3; r++) {
                        for (let c = 0; c < 3; c++) {
                            const cx = Math.floor(startX + (c + 0.5) * cellSize);
                            const cy = Math.floor(startY + (r + 0.5) * cellSize);
                            const rgb = this.getAverageRGB(cx, cy, 6);
                            colors.push(this.classifyColorHSV(rgb.r, rgb.g, rgb.b));
                        }
                    }

                    this.ctx.restore();

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
