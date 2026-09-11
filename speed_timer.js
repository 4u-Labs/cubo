/**
 * CuboFácil SpeedTimer — Cronômetro Profissional WCA de Speedcubing
 * Suporte a Stackmat (segurar para armar), Scramble oficial WCA,
 * Inspeção de 15s e Estatísticas (Single, Ao5, Ao12) salvas no LocalStorage.
 */

class CuboSpeedTimer {
    constructor(cubeInstance) {
        this.cube = cubeInstance;
        this.STORAGE_KEY = 'cubofacil_solves_v1';
        this.solves = this.loadSolves();

        // Estados: 'idle', 'holding', 'ready', 'inspecting', 'running', 'stopped'
        this.state = 'idle';
        this.startTime = 0;
        this.elapsedTime = 0;
        this.animFrameId = null;
        this.holdTimeout = null;
        this.inspectionTimer = null;
        this.inspectionRemaining = 15;
        this.useInspection = false;

        this.currentScramble = this.generateScramble();

        this.initDOM();
    }

    loadSolves() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    saveSolves() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.solves));
        } catch (e) {}
    }

    initDOM() {
        this.modal = document.getElementById('speedTimerModal');
        this.display = document.getElementById('timerDisplay');
        this.scrambleText = document.getElementById('timerScrambleText');
        this.statusBadge = document.getElementById('timerStatusBadge');
        this.inspectionToggle = document.getElementById('timerInspectionToggle');
        this.btnNewScramble = document.getElementById('timerBtnNewScramble');
        this.btnApplyScramble = document.getElementById('timerBtnApplyScramble');
        this.btnClose = document.getElementById('timerBtnClose');
        this.btnClearHistory = document.getElementById('timerBtnClearHistory');

        // Stats elements
        this.statBest = document.getElementById('timerStatBest');
        this.statAo5 = document.getElementById('timerStatAo5');
        this.statAo12 = document.getElementById('timerStatAo12');
        this.statCount = document.getElementById('timerStatCount');
        this.historyList = document.getElementById('timerHistoryList');

        this.touchArea = document.getElementById('timerTouchArea');

        if (this.btnClose) {
            this.btnClose.addEventListener('click', () => this.close());
        }

        if (this.btnNewScramble) {
            this.btnNewScramble.addEventListener('click', () => {
                this.currentScramble = this.generateScramble();
                this.renderScramble();
            });
        }

        if (this.btnApplyScramble) {
            this.btnApplyScramble.addEventListener('click', () => this.applyScrambleTo3DCube());
        }

        if (this.btnClearHistory) {
            this.btnClearHistory.addEventListener('click', () => {
                if (confirm('Deseja realmente limpar todo o histórico de tempos?')) {
                    this.solves = [];
                    this.saveSolves();
                    this.updateStatsUI();
                }
            });
        }

        if (this.inspectionToggle) {
            this.inspectionToggle.addEventListener('change', (e) => {
                this.useInspection = e.target.checked;
            });
        }

        this.setupKeyboardEvents();
        this.setupTouchEvents();
        this.renderScramble();
        this.updateStatsUI();
    }

    open() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        this.state = 'idle';
        this.display.textContent = '0.000';
        this.setStatus('Pressione e segure ESPAÇO (ou toque) para armar', 'idle');
        this.currentScramble = this.generateScramble();
        this.renderScramble();
        this.updateStatsUI();
    }

    close() {
        if (this.state === 'running' || this.state === 'inspecting') {
            this.stopTimer();
        }
        if (this.modal) this.modal.classList.remove('active');
    }

    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            if (!this.modal || !this.modal.classList.contains('active')) return;

            // Barra de espaço aciona o timer
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.state === 'idle' || this.state === 'stopped') {
                    this.onPressStart();
                } else if (this.state === 'inspecting') {
                    this.onPressStart();
                } else if (this.state === 'running') {
                    this.stopTimer();
                }
            } else if (e.code === 'Escape') {
                this.close();
            } else if (this.state === 'running') {
                // Qualquer tecla para o cronômetro
                this.stopTimer();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (!this.modal || !this.modal.classList.contains('active')) return;
            if (e.code === 'Space') {
                e.preventDefault();
                this.onPressEnd();
            }
        });
    }

    setupTouchEvents() {
        if (!this.touchArea) return;

        const startHandler = (e) => {
            e.preventDefault();
            if (this.state === 'idle' || this.state === 'stopped' || this.state === 'inspecting') {
                this.onPressStart();
            } else if (this.state === 'running') {
                this.stopTimer();
            }
        };

        const endHandler = (e) => {
            e.preventDefault();
            this.onPressEnd();
        };

        this.touchArea.addEventListener('touchstart', startHandler, { passive: false });
        this.touchArea.addEventListener('touchend', endHandler, { passive: false });
        this.touchArea.addEventListener('mousedown', startHandler);
        this.touchArea.addEventListener('mouseup', endHandler);
    }

    onPressStart() {
        if (this.state === 'running') {
            this.stopTimer();
            return;
        }

        if (this.state === 'idle' || this.state === 'stopped') {
            if (this.useInspection) {
                this.startInspection();
                return;
            }
        }

        // Armar Stackmat
        this.state = 'holding';
        this.display.classList.add('holding');
        this.display.classList.remove('ready');
        this.setStatus('Aguarde... Armando cronômetro', 'holding');

        this.holdTimeout = setTimeout(() => {
            if (this.state === 'holding') {
                this.state = 'ready';
                this.display.classList.remove('holding');
                this.display.classList.add('ready');
                this.display.textContent = '0.000';
                this.setStatus('PRONTO! Solte para iniciar!', 'ready');
                this.playTone(880, 0.08); // Lá (A5)
            }
        }, 320);
    }

    onPressEnd() {
        if (this.holdTimeout) {
            clearTimeout(this.holdTimeout);
            this.holdTimeout = null;
        }

        if (this.state === 'ready') {
            this.startTimer();
        } else if (this.state === 'holding') {
            // Soltou antes de ficar verde
            this.state = 'idle';
            this.display.classList.remove('holding', 'ready');
            this.setStatus('Pressione e segure por 0.3s até ficar verde', 'idle');
        }
    }

    startInspection() {
        this.state = 'inspecting';
        this.inspectionRemaining = 15;
        this.display.textContent = '15';
        this.display.classList.add('inspecting');
        this.setStatus('INSPEÇÃO: Planeje sua solução (15s)', 'inspecting');

        if (this.inspectionTimer) clearInterval(this.inspectionTimer);
        this.inspectionTimer = setInterval(() => {
            this.inspectionRemaining--;
            if (this.inspectionRemaining > 0) {
                this.display.textContent = this.inspectionRemaining.toString();
                if (this.inspectionRemaining === 8) {
                    this.playTone(440, 0.2); // Alerta 8s
                } else if (this.inspectionRemaining === 3) {
                    this.playTone(550, 0.2); // Alerta 12s
                }
            } else {
                clearInterval(this.inspectionTimer);
                this.inspectionTimer = null;
                this.display.textContent = '+2';
                this.setStatus('Tempo de inspeção esgotado! (+2s de penalidade)', 'warning');
            }
        }, 1000);
    }

    startTimer() {
        if (this.inspectionTimer) {
            clearInterval(this.inspectionTimer);
            this.inspectionTimer = null;
        }

        this.state = 'running';
        this.startTime = performance.now();
        this.display.classList.remove('holding', 'ready', 'inspecting');
        this.display.classList.add('running');
        this.setStatus('CRONOMETRANDO... Toque ou tecle para parar', 'running');

        const updateLoop = () => {
            if (this.state !== 'running') return;
            this.elapsedTime = performance.now() - this.startTime;
            this.display.textContent = this.formatTime(this.elapsedTime);
            this.animFrameId = requestAnimationFrame(updateLoop);
        };
        this.animFrameId = requestAnimationFrame(updateLoop);
    }

    stopTimer() {
        if (this.state !== 'running') return;

        this.state = 'stopped';
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }

        this.elapsedTime = performance.now() - this.startTime;
        this.display.textContent = this.formatTime(this.elapsedTime);
        this.display.classList.remove('running');
        this.setStatus('Solução Concluída!', 'stopped');
        this.playTone(1046.5, 0.15); // C6 - som de finalização

        // Registrar no histórico
        const record = {
            id: Date.now(),
            timeMs: Math.round(this.elapsedTime),
            timeStr: this.formatTime(this.elapsedTime),
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            scramble: this.currentScramble
        };
        this.solves.unshift(record);
        this.saveSolves();
        this.updateStatsUI();

        // Gerar próximo scramble automaticamente
        setTimeout(() => {
            this.currentScramble = this.generateScramble();
            this.renderScramble();
        }, 600);
    }

    setStatus(text, type) {
        if (!this.statusBadge) return;
        this.statusBadge.textContent = text;
        this.statusBadge.className = `timer-status-badge status-${type}`;
    }

    generateScramble() {
        const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
        const modifiers = ['', "'", '2'];
        const length = 21;
        const scramble = [];

        let lastAxis = -1;
        let secondLastAxis = -1;

        for (let i = 0; i < length; i++) {
            let axis;
            do {
                axis = Math.floor(Math.random() * 3); // 0: U/D, 1: L/R, 2: F/B
            } while (axis === lastAxis || (axis === secondLastAxis && lastAxis !== -1));

            const faceIdx = axis * 2 + Math.floor(Math.random() * 2);
            const move = moves[faceIdx];
            const mod = modifiers[Math.floor(Math.random() * modifiers.length)];

            scramble.push(move + mod);
            secondLastAxis = lastAxis;
            lastAxis = axis;
        }

        return scramble.join(' ');
    }

    renderScramble() {
        if (this.scrambleText) {
            this.scrambleText.textContent = this.currentScramble;
        }
    }

    applyScrambleTo3DCube() {
        if (!this.cube) return;
        const moves = this.currentScramble.split(' ');
        this.close();

        // Aplica os movimentos em sequência no cubo 3D
        let idx = 0;
        const stepInterval = setInterval(() => {
            if (idx >= moves.length) {
                clearInterval(stepInterval);
                return;
            }
            const move = moves[idx++];
            this.cube.makeMove(move);
        }, 120);
    }

    formatTime(ms) {
        if (isNaN(ms) || ms < 0) return '0.000';
        const totalSeconds = ms / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes > 0) {
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds.toFixed(2)}`;
        } else {
            return seconds.toFixed(3);
        }
    }

    updateStatsUI() {
        const times = this.solves.map(s => s.timeMs);

        // Contagem
        if (this.statCount) this.statCount.textContent = times.length;

        // Melhor Tempo (Single)
        const best = times.length > 0 ? Math.min(...times) : null;
        if (this.statBest) {
            this.statBest.textContent = best ? this.formatTime(best) : '--';
        }

        // Média de 5 (Ao5)
        const ao5 = this.calculateAverage(times.slice(0, 5), 5);
        if (this.statAo5) {
            this.statAo5.textContent = ao5 ? this.formatTime(ao5) : '--';
        }

        // Média de 12 (Ao12)
        const ao12 = this.calculateAverage(times.slice(0, 12), 12);
        if (this.statAo12) {
            this.statAo12.textContent = ao12 ? this.formatTime(ao12) : '--';
        }

        // Lista de Histórico
        if (this.historyList) {
            this.historyList.innerHTML = '';
            if (this.solves.length === 0) {
                this.historyList.innerHTML = '<div style="color:var(--text-muted); font-size:0.85rem; padding:10px 0; text-align:center;">Nenhum tempo gravado ainda.</div>';
                return;
            }

            this.solves.slice(0, 20).forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'history-item-row';
                row.innerHTML = `
                    <span class="solve-index">#${this.solves.length - index}</span>
                    <strong class="solve-time">${item.timeStr}</strong>
                    <span class="solve-date">${item.date}</span>
                    <button class="solve-del-btn" title="Excluir tempo">&times;</button>
                `;
                row.querySelector('.solve-del-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.solves = this.solves.filter(s => s.id !== item.id);
                    this.saveSolves();
                    this.updateStatsUI();
                });
                this.historyList.appendChild(row);
            });
        }
    }

    calculateAverage(list, size) {
        if (!list || list.length < size) return null;
        // Ordena para remover o melhor e o pior (Regra WCA)
        const sorted = [...list].sort((a, b) => a - b);
        sorted.shift(); // remove menor
        sorted.pop();   // remove maior
        const sum = sorted.reduce((acc, val) => acc + val, 0);
        return Math.round(sum / sorted.length);
    }

    playTone(freq, duration) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {}
    }
}

window.CuboSpeedTimer = CuboSpeedTimer;
