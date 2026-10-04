/**
 * CuboFácil 4U — Sistema Internacional de Idiomas (i18n)
 * Suporte completo a Português (pt) e Inglês (en).
 * Detecção automática pelo navegador (se diferente de 'pt', abre em inglês),
 * persistência em localStorage e botões de alternância manual [ PT ] [ EN ].
 */

(function () {
    const CUBE_I18N = {
        pt: {
            // Cabeçalho e Geral
            app_title: "CuboFácil 4U",
            app_subtitle: "Solucionador 3D Inteligente, Scanner por Câmera & Timer WCA",
            app_badge: "Speedcubing Suite",
            btn_scan_camera: "Escanear Câmera",
            btn_scan_camera_title: "Escanear as faces com a Câmera",
            btn_timer_wca: "Timer WCA",
            btn_timer_wca_title: "Cronômetro de Speedcubing",
            btn_help: "Ajuda",
            btn_help_title: "Instruções de Uso",
            btn_collapse: "Recolher",
            btn_collapse_title: "Recolher Cabeçalho",
            btn_expand: "Expandir",
            btn_expand_title: "Expandir Cabeçalho",
            collapse_handle_title: "Toque para recolher ou expandir",
            lang_switch_title: "Mudar Idioma / Switch Language",
            canvas_help_title: "Ajuda",

            // Controles do Cubo
            btn_solve: "Resolver",
            btn_step_by_step: "Passo a Passo",
            btn_scramble: "Embaralhar",
            btn_reset: "Reiniciar",

            // Player Passo a Passo
            player_title: "Passo a Passo",
            player_close: "Fechar",
            player_close_title: "Fechar passo a passo",
            player_step_counter: "Passo {step} de {total} ({pct}%)",
            player_completed_badge: "100% Concluído",
            player_completed_title: "Cubo Resolvido!",
            player_completed_desc: "Parabéns! Todos os passos da solução foram concluídos com sucesso.",
            player_btn_finish: "Concluir",
            player_btn_prev: "Voltar",
            player_btn_next: "Avançar",
            player_btn_last: "Finalizar",
            player_btn_auto: "Auto (1.5s)",
            player_btn_pause: "Pausar",

            // Faces e Rotações no Player
            face_prefix: "Face ",
            face_U_name: "CIMA / TOPO",
            face_U_color: "Branca",
            face_D_name: "BASE / BAIXO",
            face_D_color: "Amarela",
            face_F_name: "FRENTE",
            face_F_color: "Azul",
            face_B_name: "ATRÁS",
            face_B_color: "Verde",
            face_L_name: "ESQUERDA",
            face_L_color: "Vermelha",
            face_R_name: "DIREITA",
            face_R_color: "Laranja",

            rot_180_title: "Giro 180° (Meia Volta)",
            rot_180_inst: "Olhe para a face <strong>{face}</strong> e dê <strong>meia volta 🔄 (180°)</strong> em qualquer direção.",
            rot_ccw_title: "Anti-Horário ↺ (90°)",
            rot_ccw_inst: "Olhe para a face <strong>{face}</strong> e gire <strong>ANTI-HORÁRIO ↺</strong> (para a esquerda).",
            rot_cw_title: "Horário ↻ (90°)",
            rot_cw_inst: "Olhe para a face <strong>{face}</strong> e gire <strong>HORÁRIO ↻</strong> (para a direita, como o relógio).",

            // Cores
            color_white: "Branco",
            color_yellow: "Amarelo",
            color_green: "Verde",
            color_blue: "Azul",
            color_red: "Vermelho",
            color_orange: "Laranja",

            color_white_abbr: "Bco",
            color_yellow_abbr: "Aml",
            color_green_abbr: "Vde",
            color_blue_abbr: "Azu",
            color_red_abbr: "Ver",
            color_orange_abbr: "Lar",

            // Scanner por Câmera
            scanner_title: "Scanner Óptico de Cores",
            scanner_badge_main_face: "FACE PRINCIPAL",
            scanner_badge_camera_front: "CÂMERA (SUA FRENTE)",
            scanner_compass_top: "▲ Cima:",
            scanner_compass_right: "▶ Dir:",
            scanner_compass_bottom: "▼ Baixo:",
            scanner_compass_left: "◀ Esq:",
            scanner_compass_center: "🎯 Centro:",

            scanner_step_1_title: "1. Face Branca (Topo / U)",
            scanner_step_1_inst: "Aponte o centro BRANCO de frente • TETO: Verde • DIREITA: Laranja",
            scanner_step_2_title: "2. Face Azul (Frente / F)",
            scanner_step_2_inst: "Aponte o centro AZUL de frente • TETO: Branco • DIREITA: Laranja",
            scanner_step_3_title: "3. Face Laranja (Direita / R)",
            scanner_step_3_inst: "Gire à direita: centro LARANJA • TETO: Branco • DIREITA: Verde",
            scanner_step_4_title: "4. Face Verde (Atrás / B)",
            scanner_step_4_inst: "Gire à direita: centro VERDE • TETO: Branco • DIREITA: Vermelho",
            scanner_step_5_title: "5. Face Vermelha (Esquerda / L)",
            scanner_step_5_inst: "Gire à direita: centro VERMELHO • TETO: Branco • DIREITA: Azul",
            scanner_step_6_title: "6. Face Amarela (Base / D)",
            scanner_step_6_inst: "Gire à direita de volta para a face AZUL e incline para cima: AMARELO de frente • TETO: Azul • DIREITA: Laranja",

            scanner_center_correct: "Centro Correto: <strong>{color}</strong>",
            scanner_center_mismatch: "Atenção: Centro é <strong>{detected}</strong>! Aponte <strong>{expected}</strong>",
            scanner_btn_prev: "Anterior",
            scanner_btn_capture: "Capturar Face",
            scanner_btn_recapture: "Refazer Leitura",
            scanner_btn_next: "Avançar",
            scanner_btn_next_face: "Próxima Face",
            scanner_btn_finish: "Finalizar",
            scanner_btn_finish_cube: "Finalizar Cubo",
            scanner_btn_upload: "Carregar Foto",
            scanner_action_tip: "Aponte a face e clique em <strong>Capturar Face</strong> para avançar.",

            scanner_warn_wrong_center: "⚠️ ATENÇÃO: Centro Detectado Incorreto!\n\nO centro apontado para a câmera parece ser {detected}, mas esta etapa pede a Face {expected}!\n\nDeseja capturar esta face mesmo assim? (Clique em 'Cancelar' para apontar a face correta)",
            scanner_warn_inconsistency: "⚠️ Atenção: Detectamos inconsistências nas cores lidas:\n\n{reason}\n{details}\nDeseja finalizar assim mesmo para corrigir no modelo planificado?\n\n• Clique em 'OK' para ir ao modelo planificado e ajustar os adesivos com cliques.\n• Clique em 'Cancelar' para revisar e ajustar as faces aqui no scanner.",
            scanner_toast_success: "Cubo lido com sucesso! Abrindo Passo a Passo...",

            // Speedcubing Timer WCA
            timer_title: "Speedcubing Timer WCA",
            timer_inspection: "Inspeção (15s)",
            timer_btn_new_scramble: "Novo Scramble",
            timer_btn_apply_3d: "Aplicar no Cubo 3D",
            timer_status_idle: "Pressione e segure ESPAÇO (ou toque) para armar",
            timer_status_holding: "Aguarde... Armando cronômetro",
            timer_status_ready: "PRONTO! Solte para iniciar!",
            timer_status_hold_hint: "Pressione e segure por 0.3s até ficar verde",
            timer_status_inspecting: "INSPEÇÃO: Planeje sua solução (15s)",
            timer_status_penalty: "Tempo de inspeção esgotado! (+2s de penalidade)",
            timer_status_running: "CRONOMETRANDO... Toque ou tecle para parar",
            timer_status_completed: "Solução Concluída!",

            timer_stat_best: "Melhor (Single)",
            timer_stat_ao5: "Média de 5 (Ao5)",
            timer_stat_ao12: "Média de 12 (Ao12)",
            timer_stat_solves: "Soluções",
            timer_history_title: "Histórico Recente",
            timer_history_clear: "Limpar",
            timer_history_empty: "Nenhum tempo gravado ainda.",
            timer_delete_time_title: "Excluir tempo",
            timer_confirm_clear: "Deseja realmente limpar todo o histórico de tempos?",

            // Modal Ajuda (Como Usar)
            help_title: "Como Usar o CuboFácil 4U",
            help_li_1_strong: "Escanear com Câmera:",
            help_li_1_text: "Clique em \"Escanear Câmera\" para ler as 6 faces do seu cubo real automaticamente sem precisar pintar na tela!",
            help_li_2_strong: "Mapeamento 2D Manual:",
            help_li_2_text: "Use a cruz planificada à direita para ajustar qualquer adesivo manualmente com a paleta de cores.",
            help_li_3_strong: "Resolver e Passo a Passo:",
            help_li_3_text: "Clique em \"Resolver\" para ver a solução instantânea ou \"Passo a Passo\" para acompanhar cada movimento no cubo 3D.",
            help_li_4_strong: "Timer WCA:",
            help_li_4_text: "Clique em \"Timer WCA\" para cronometrar seus tempos de speedcubing com regras da World Cube Association e Scramble oficial.",
            help_li_5_strong: "Giro Interativo:",
            help_li_5_text: "Você pode rotacionar a visão do cubo 3D clicando e arrastando com o mouse ou dedo.",

            // Modais de Alerta e Validação
            alert_title_default: "Aviso",
            alert_btn_ok: "Entendido",
            alert_btn_fix_flat: "Ajustar no Modelo Planificado",
            alert_btn_rescan: "Escanear com a Câmera",

            alert_already_solved_title: "Cubo Já Resolvido!",
            alert_already_solved_msg: "Todas as faces do cubo já estão 100% montadas com as cores certas.",
            alert_already_solved_step_msg: "O cubo já está completamente montado. Embaralhe o cubo para ver os passos da solução!",

            val_cant_solve_title: "Não foi possível resolver o cubo",
            val_cant_step_title: "Não foi possível iniciar o Passo a Passo",
            val_rotating_reason: "O cubo ainda está girando.",
            val_rotating_details: "Aguarde a animação terminar para validar ou resolver.",
            val_unbalanced_reason: "A contagem de cores está desbalanceada.",
            val_unbalanced_details: "Cada uma das 6 cores precisa ter exatamente 9 adesivos:\n{errors}",
            val_invalid_state: "Estado inválido",
            val_incompatible_pieces: "Peças ou cores incompatíveis",
            val_incompatible_details: "Uma ou mais peças têm combinação fisicamente impossível de cores (ex: adesivos de lados opostos na mesma peça ou cubos repetidos). Verifique se algum adesivo foi lido errado no modelo planificado.",
            val_flipped_edges: "Orientação invertida em aresta (meio)",
            val_flipped_edges_details: "Uma das peças de meio do cubo está virada ao contrário (orientação invertida).",
            val_twisted_corners: "Orientação invertida em canto (quina)",
            val_twisted_corners_details: "Um dos cantos do cubo está girado em seu próprio eixo (torção de canto).",
            val_parity_error: "Erro de paridade de posição",
            val_parity_error_details: "Duas peças estão trocadas de lugar (situação impossível em cubo 3x3x3 sem desmontar).",

            // Rodapé
            footer_privacy: "Privacidade",
            footer_terms: "Termos de Uso",
            footer_support: "Suporte",
            footer_copy: "© 2026 4U.IA.BR Labs • Desenvolvido por Fabiano Braga • Todos os direitos reservados"
        },

        en: {
            // Header and General
            app_title: "CuboFácil 4U",
            app_subtitle: "Smart 3D Solver, Camera Scanner & WCA Timer",
            app_badge: "Speedcubing Suite",
            btn_scan_camera: "Camera Scanner",
            btn_scan_camera_title: "Scan cube faces with Camera",
            btn_timer_wca: "WCA Timer",
            btn_timer_wca_title: "Speedcubing Timer",
            btn_help: "Help",
            btn_help_title: "How to Use",
            btn_collapse: "Collapse",
            btn_collapse_title: "Collapse Header",
            btn_expand: "Expand",
            btn_expand_title: "Expand Header",
            collapse_handle_title: "Tap to collapse or expand",
            lang_switch_title: "Switch Language / Mudar Idioma",
            canvas_help_title: "Help",

            // Cube Controls
            btn_solve: "Solve",
            btn_step_by_step: "Step by Step",
            btn_scramble: "Scramble",
            btn_reset: "Reset",

            // Step Player
            player_title: "Step by Step",
            player_close: "Close",
            player_close_title: "Close step by step",
            player_step_counter: "Step {step} of {total} ({pct}%)",
            player_completed_badge: "100% Completed",
            player_completed_title: "Cube Solved!",
            player_completed_desc: "Congratulations! All solution steps were completed successfully.",
            player_btn_finish: "Done",
            player_btn_prev: "Back",
            player_btn_next: "Next",
            player_btn_last: "Finish",
            player_btn_auto: "Auto (1.5s)",
            player_btn_pause: "Pause",

            // Faces and Rotations in Player
            face_prefix: "Face ",
            face_U_name: "UP / TOP",
            face_U_color: "White",
            face_D_name: "DOWN / BOTTOM",
            face_D_color: "Yellow",
            face_F_name: "FRONT",
            face_F_color: "Blue",
            face_B_name: "BACK",
            face_B_color: "Green",
            face_L_name: "LEFT",
            face_L_color: "Red",
            face_R_name: "RIGHT",
            face_R_color: "Orange",

            rot_180_title: "180° Turn (Half Turn)",
            rot_180_inst: "Look at the <strong>{face}</strong> face and turn <strong>half turn 🔄 (180°)</strong> in any direction.",
            rot_ccw_title: "Counter-Clockwise ↺ (90°)",
            rot_ccw_inst: "Look at the <strong>{face}</strong> face and turn <strong>COUNTER-CLOCKWISE ↺</strong> (to the left).",
            rot_cw_title: "Clockwise ↻ (90°)",
            rot_cw_inst: "Look at the <strong>{face}</strong> face and turn <strong>CLOCKWISE ↻</strong> (to the right, clockwise).",

            // Colors
            color_white: "White",
            color_yellow: "Yellow",
            color_green: "Green",
            color_blue: "Blue",
            color_red: "Red",
            color_orange: "Orange",

            color_white_abbr: "Whi",
            color_yellow_abbr: "Yel",
            color_green_abbr: "Gre",
            color_blue_abbr: "Blu",
            color_red_abbr: "Red",
            color_orange_abbr: "Ora",

            // Camera Scanner
            scanner_title: "Optical Color Scanner",
            scanner_badge_main_face: "MAIN FACE",
            scanner_badge_camera_front: "CAMERA (FACING YOU)",
            scanner_compass_top: "▲ Top:",
            scanner_compass_right: "▶ Right:",
            scanner_compass_bottom: "▼ Bottom:",
            scanner_compass_left: "◀ Left:",
            scanner_compass_center: "🎯 Center:",

            scanner_step_1_title: "1. White Face (Up / U)",
            scanner_step_1_inst: "Face the WHITE center to camera • TOP: Green • RIGHT: Orange",
            scanner_step_2_title: "2. Blue Face (Front / F)",
            scanner_step_2_inst: "Face the BLUE center to camera • TOP: White • RIGHT: Orange",
            scanner_step_3_title: "3. Orange Face (Right / R)",
            scanner_step_3_inst: "Rotate right: ORANGE center • TOP: White • RIGHT: Green",
            scanner_step_4_title: "4. Green Face (Back / B)",
            scanner_step_4_inst: "Rotate right: GREEN center • TOP: White • RIGHT: Red",
            scanner_step_5_title: "5. Red Face (Left / L)",
            scanner_step_5_inst: "Rotate right: RED center • TOP: White • RIGHT: Blue",
            scanner_step_6_title: "6. Yellow Face (Down / D)",
            scanner_step_6_inst: "Rotate right back to BLUE, tilt up: YELLOW center facing camera • TOP: Blue • RIGHT: Orange",

            scanner_center_correct: "Correct Center: <strong>{color}</strong>",
            scanner_center_mismatch: "Warning: Center is <strong>{detected}</strong>! Aim at <strong>{expected}</strong>",
            scanner_btn_prev: "Back",
            scanner_btn_capture: "Capture Face",
            scanner_btn_recapture: "Retake Scan",
            scanner_btn_next: "Next",
            scanner_btn_next_face: "Next Face",
            scanner_btn_finish: "Finish",
            scanner_btn_finish_cube: "Finish Cube",
            scanner_btn_upload: "Upload Photo",
            scanner_action_tip: "Aim at the face and click <strong>Capture Face</strong> to proceed.",

            scanner_warn_wrong_center: "⚠️ WARNING: Incorrect Center Detected!\n\nThe center facing the camera seems to be {detected}, but this step requires the {expected} Face!\n\nDo you want to capture this face anyway? (Click 'Cancel' to aim the correct face)",
            scanner_warn_inconsistency: "⚠️ Warning: Inconsistencies detected in scanned colors:\n\n{reason}\n{details}\nDo you want to finish anyway to adjust on the flat 2D model?\n\n• Click 'OK' to proceed to the flat model and fix stickers manually.\n• Click 'Cancel' to review and adjust faces here in the scanner.",
            scanner_toast_success: "Cube scanned successfully! Opening Step by Step...",

            // Speedcubing Timer WCA
            timer_title: "WCA Speedcubing Timer",
            timer_inspection: "Inspection (15s)",
            timer_btn_new_scramble: "New Scramble",
            timer_btn_apply_3d: "Apply to 3D Cube",
            timer_status_idle: "Press and hold SPACE (or touch) to arm",
            timer_status_holding: "Wait... Arming timer",
            timer_status_ready: "READY! Release to start!",
            timer_status_hold_hint: "Press and hold for 0.3s until it turns green",
            timer_status_inspecting: "INSPECTION: Plan your solve (15s)",
            timer_status_penalty: "Inspection time expired! (+2s penalty)",
            timer_status_running: "TIMING... Touch or press any key to stop",
            timer_status_completed: "Solve Completed!",

            timer_stat_best: "Best (Single)",
            timer_stat_ao5: "Average of 5 (Ao5)",
            timer_stat_ao12: "Average of 12 (Ao12)",
            timer_stat_solves: "Solves",
            timer_history_title: "Recent History",
            timer_history_clear: "Clear",
            timer_history_empty: "No solves recorded yet.",
            timer_delete_time_title: "Delete solve",
            timer_confirm_clear: "Do you really want to clear the entire solve history?",

            // How to Use Modal
            help_title: "How to Use CuboFácil 4U",
            help_li_1_strong: "Camera Scanner:",
            help_li_1_text: "Click \"Camera Scanner\" to read all 6 faces of your real cube automatically without manual painting!",
            help_li_2_strong: "Manual 2D Mapping:",
            help_li_2_text: "Use the flat net on the right to manually adjust any sticker with the color palette.",
            help_li_3_strong: "Solve & Step by Step:",
            help_li_3_text: "Click \"Solve\" for instant solution or \"Step by Step\" to follow each move on the 3D cube.",
            help_li_4_strong: "WCA Timer:",
            help_li_4_text: "Click \"WCA Timer\" to time your speedcubing solves with official World Cube Association rules and scramble.",
            help_li_5_strong: "Interactive Rotation:",
            help_li_5_text: "You can rotate the 3D view of the cube by dragging with your mouse or finger.",

            // Alert & Validation Modals
            alert_title_default: "Notice",
            alert_btn_ok: "Got it",
            alert_btn_fix_flat: "Adjust on Flat 2D Model",
            alert_btn_rescan: "Scan with Camera",

            alert_already_solved_title: "Cube Already Solved!",
            alert_already_solved_msg: "All cube faces are already 100% solved with matching colors.",
            alert_already_solved_step_msg: "The cube is already completely solved. Scramble the cube to see solution steps!",

            val_cant_solve_title: "Could not solve cube",
            val_cant_step_title: "Could not start Step by Step",
            val_rotating_reason: "The cube is still rotating.",
            val_rotating_details: "Wait for the animation to finish before validating or solving.",
            val_unbalanced_reason: "Color count is unbalanced.",
            val_unbalanced_details: "Each of the 6 colors must have exactly 9 stickers:\n{errors}",
            val_invalid_state: "Invalid state",
            val_incompatible_pieces: "Incompatible pieces or colors",
            val_incompatible_details: "One or more pieces have a physically impossible combination of colors (e.g. opposite side stickers on the same piece or duplicate pieces). Check if any sticker was misread on the flat model.",
            val_flipped_edges: "Flipped edge orientation (middle)",
            val_flipped_edges_details: "One of the cube edge pieces is flipped upside down.",
            val_twisted_corners: "Twisted corner orientation",
            val_twisted_corners_details: "One of the cube corners is twisted on its own axis.",
            val_parity_error: "Position parity error",
            val_parity_error_details: "Two pieces are swapped (physically impossible in a standard 3x3x3 cube without disassembly).",

            // Footer
            footer_privacy: "Privacy",
            footer_terms: "Terms of Use",
            footer_support: "Support",
            footer_copy: "© 2026 4U.IA.BR Labs • Developed by Fabiano Braga • All rights reserved"
        }
    };

    function detectInitialLang() {
        const saved = localStorage.getItem('cubofacil_lang');
        if (saved === 'pt' || saved === 'en') return saved;
        const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
        if (navLang.startsWith('pt')) {
            return 'pt';
        }
        return 'en';
    }

    let currentLang = detectInitialLang();

    function t(key, params = {}) {
        const dict = CUBE_I18N[currentLang] || CUBE_I18N.en || CUBE_I18N.pt;
        let text = dict[key];
        if (text === undefined) {
            text = (CUBE_I18N.en && CUBE_I18N.en[key] !== undefined)
                ? CUBE_I18N.en[key]
                : ((CUBE_I18N.pt && CUBE_I18N.pt[key] !== undefined) ? CUBE_I18N.pt[key] : key);
        }
        for (const [pKey, pVal] of Object.entries(params)) {
            text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), pVal);
        }
        return text;
    }

    function applyDOMTranslations() {
        // Tag html lang
        document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';

        // 1. Text elements com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = t(key);
            if (text !== undefined && text !== null) {
                if (text.includes('<') && text.includes('>')) {
                    el.innerHTML = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // 2. Titles com data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const text = t(key);
            if (text) el.title = text;
        });

        // 3. Placeholders com data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const text = t(key);
            if (text) el.placeholder = text;
        });

        // 4. Atualizar classes ativas dos botões [ PT ] [ EN ]
        const btnPt = document.getElementById('btnLangPT');
        const btnEn = document.getElementById('btnLangEN');
        if (btnPt) btnPt.classList.toggle('active', currentLang === 'pt');
        if (btnEn) btnEn.classList.toggle('active', currentLang === 'en');

        // 5. Atualizar botão de recolher/expandir se existir
        const btnToggle = document.getElementById('btnToggleHeader');
        const header = document.getElementById('header');
        if (btnToggle && header) {
            const isCollapsed = header.classList.contains('collapsed');
            const labelEl = btnToggle.querySelector('.toggle-btn-text');
            if (labelEl) {
                labelEl.textContent = isCollapsed ? t('btn_expand') : t('btn_collapse');
            }
            btnToggle.title = isCollapsed ? t('btn_expand_title') : t('btn_collapse_title');
        }

        // 6. Atualizar controles se já instanciados
        if (window.controls) {
            if (window.controls.solveButton) {
                window.controls.solveButton.textContent = t('btn_solve');
            }
            if (window.controls.solveSlowButton) {
                window.controls.solveSlowButton.textContent = t('btn_step_by_step');
            }
            if (window.controls.scrambleButton) {
                window.controls.scrambleButton.textContent = t('btn_scramble');
            }
            if (window.controls.resetButton) {
                window.controls.resetButton.textContent = t('btn_reset');
            }
            if (typeof window.controls.updateStepPlayer === 'function' && window.controls.overlay && window.controls.overlay.style.display !== 'none') {
                window.controls.updateStepPlayer();
            }
        }

        // 7. Atualizar Scanner se aberto ou instanciado
        if (window.cameraScanner && typeof window.cameraScanner.updateLanguage === 'function') {
            window.cameraScanner.updateLanguage();
        }

        // 8. Atualizar SpeedTimer se instanciado
        if (window.speedTimer && typeof window.speedTimer.updateLanguage === 'function') {
            window.speedTimer.updateLanguage();
        }
    }

    function setCubeLang(lang) {
        if (lang !== 'pt' && lang !== 'en') return;
        currentLang = lang;
        localStorage.setItem('cubofacil_lang', lang);
        applyDOMTranslations();

        window.dispatchEvent(new CustomEvent('cubeLanguageChanged', { detail: { lang } }));
    }

    function getCubeLang() {
        return currentLang;
    }

    // Exportação global
    window.CUBE_I18N = CUBE_I18N;
    window.t = t;
    window.setCubeLang = setCubeLang;
    window.getCubeLang = getCubeLang;
    window.detectCubeInitialLang = detectInitialLang;

    // Inicialização ao carregar o DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyDOMTranslations();
        });
    } else {
        applyDOMTranslations();
    }
})();
