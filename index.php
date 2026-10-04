<?php
// =========================================================================
// ANTI-CACHE AGRESSIVO HTTP (Servidor Hostinger / Apache / Nginx)
// Impede que navegadores, proxies e CDNs armazenem cache desta página
// =========================================================================
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// Timestamp dinâmico para garantir que todos os scripts sempre recebam versão 100% atualizada
$antiCache = time();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>CuboFácil 4U | Solucionador 3D de Cubo Mágico & Timer WCA</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
    <meta name="description" content="Solucionador 3D inteligente de Cubo Mágico com escaneamento de cores por câmera, visualizador interativo e cronômetro oficial de Speedcubing (WCA).">

    <!-- Anti-Cache Meta Tags -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">

    <link rel="manifest" href="manifest.json?v=<?= $antiCache ?>">
    <meta name="theme-color" content="#4f46e5"/>
    <link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32x32.png">
    <link rel="shortcut icon" href="favicon.ico">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="CuboFácil">
    <meta name="mobile-web-app-capable" content="yes">

    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

    <!-- Registro do Service Worker para PWA (Offline & Instalação) -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('sw.js?v=<?= $antiCache ?>')
                    .then(function(reg) {
                        reg.update();
                    })
                    .catch(function(err) {
                        console.warn('[SW] Falha ao registrar Service Worker:', err);
                    });
            });
        }
    </script>

    <!-- Motores do Cubo & Algoritmos com Anti-Cache Dinâmico -->
    <script type="text/javascript" src='i18n.js?v=<?= $antiCache ?>'></script>
    <script type="text/javascript" src='rubiks.js?v=<?= $antiCache ?>'></script>
    <script type="text/javascript" src='solver.js?v=<?= $antiCache ?>'></script>
    <script type="text/javascript" src='flat.js?v=<?= $antiCache ?>'></script>
    <script type="text/javascript" src='camera_scanner.js?v=<?= $antiCache ?>'></script>
    <script type="text/javascript" src='speed_timer.js?v=<?= $antiCache ?>'></script>
    
    <style type="text/css">
        :root {
            --brand-primary: #10b981;
            --brand-indigo: #6366f1;
            --brand-purple: #8b5cf6;
            --bg-gradient: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%);
            --glass-bg: rgba(255, 255, 255, 0.12);
            --glass-card: rgba(15, 23, 42, 0.75);
            --glass-border: rgba(255, 255, 255, 0.18);
            --text-main: #f8fafc;
            --text-muted: #cbd5e1;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background: var(--bg-gradient);
            background-attachment: fixed;
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text-main);
            min-height: 100vh;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
        }

        /* ==================== HEADER 4U ==================== */
        #header {
            width: 100%;
            padding: 16px 24px;
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(15, 23, 42, 0.82);
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
        }

        .header-inner {
            max-width: 1100px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 14px;
        }

        .header-title-box {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-logo-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.45);
            flex-shrink: 0;
            overflow: hidden;
        }

        .header-brand-stacked {
            display: flex;
            flex-direction: column;
            line-height: 1;
            user-select: none;
            justify-content: center;
        }

        .brand-word-cubo {
            font-size: 0.95rem;
            font-weight: 900;
            letter-spacing: 0.02em;
            color: #ffffff;
            text-transform: uppercase;
        }

        .brand-word-facil {
            font-size: 0.85rem;
            font-weight: 900;
            color: #38bdf8;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }

        .header-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 16px;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .header-btn:hover {
            background: rgba(255, 255, 255, 0.16);
            transform: translateY(-1px);
            border-color: rgba(255, 255, 255, 0.3);
        }

        .header-btn.btn-scanner {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-color: rgba(16, 185, 129, 0.4);
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
        }

        .header-btn.btn-scanner:hover {
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.55);
        }

        .header-btn.btn-timer {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            border-color: rgba(99, 102, 241, 0.4);
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
        }

        .header-btn.btn-timer:hover {
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.55);
        }

        .header-btn.btn-install {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border-color: rgba(245, 158, 11, 0.45);
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
        }

        .header-btn.btn-install:hover {
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.55);
            background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
        }

        .header-btn.btn-install.installed {
            display: none !important;
        }

        /* Language Switcher Buttons [ PT ] [ EN ] */
        .lang-switch-box {
            display: inline-flex;
            align-items: center;
            background: rgba(15, 23, 42, 0.78);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 12px;
            padding: 3px;
            gap: 2px;
            backdrop-filter: blur(8px);
        }

        .lang-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 0.76rem;
            font-weight: 800;
            font-family: inherit;
            padding: 5px 10px;
            border-radius: 9px;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            line-height: 1;
            letter-spacing: 0.5px;
            user-select: none;
        }

        .lang-btn:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.12);
        }

        .lang-btn.active {
            background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
            color: #ffffff;
            font-weight: 900;
            box-shadow: 0 2px 10px rgba(99, 102, 241, 0.45);
        }

        /* ==================== CONTROLES DE RECOLHER/EXPANDIR O CABEÇALHO ==================== */
        #header {
            transition: padding 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease, box-shadow 0.25s ease;
        }



        @media (max-width: 650px) {
            #header {
                padding: 6px 8px !important;
            }
            .header-inner {
                flex-direction: row !important;
                justify-content: space-between !important;
                align-items: center !important;
                flex-wrap: nowrap !important;
                gap: 6px !important;
            }
            .header-title-box {
                flex-direction: row !important;
                align-items: center !important;
                gap: 6px !important;
                flex-shrink: 0 !important;
            }
            .header-logo-icon {
                width: 28px !important;
                height: 28px !important;
                border-radius: 7px !important;
            }
            .brand-word-cubo {
                font-size: 0.80rem !important;
            }
            .brand-word-facil {
                font-size: 0.70rem !important;
            }
            .header-actions {
                width: auto !important;
                justify-content: flex-end !important;
                gap: 4px !important;
                flex-wrap: nowrap !important;
                flex-shrink: 1 !important;
            }
            .header-btn {
                padding: 6px 8px !important;
                min-width: 30px !important;
                border-radius: 8px !important;
                gap: 0 !important;
                justify-content: center !important;
                font-size: 0.85rem !important;
            }
            .header-btn.btn-scanner {
                min-width: 68px !important;
                padding: 6px 14px !important;
                font-size: 1.05rem !important;
                border-radius: 10px !important;
                box-shadow: 0 4px 15px rgba(16, 185, 129, 0.45) !important;
            }
            .header-btn .btn-label {
                display: none !important;
            }
            .lang-switch-box {
                padding: 2px !important;
                gap: 1px !important;
                border-radius: 8px !important;
            }
            .lang-btn {
                padding: 3px 5px !important;
                font-size: 0.68rem !important;
                border-radius: 6px !important;
            }

        }

        /* ==================== CONTAINER & CARDS ==================== */
        #app-container {
            position: relative;
            max-width: 900px;
            width: 100%;
            margin: 15px auto 40px auto;
            padding: 20px 15px;
            flex: 1;
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #cube,
        #controls,
        #flat-cube {
            background: var(--glass-card);
            -webkit-backdrop-filter: blur(20px);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 22px;
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
            padding: 10px;
            transition: all 0.25s ease;
        }

        #cube:hover,
        #controls:hover,
        #flat-cube:hover {
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        #cube {
            padding: 0;
            overflow: hidden;
        }

        #cube-canvas {
            width: 100%;
            height: 100%;
            display: block;
            background: transparent !important;
        }

        #help-icon {
            position: absolute;
            top: 12px;
            right: 12px;
            width: 32px;
            height: 32px;
            background: rgba(0, 0, 0, 0.45);
            color: #fff;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            cursor: pointer;
            z-index: 5;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
        }

        #help-icon:hover {
            background: var(--brand-indigo);
            transform: scale(1.1);
        }

        /* ==================== BOTÕES DE CONTROLE ==================== */
        .rc-button {
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 700;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .rc-button:hover {
            transform: translateY(-2px);
            filter: brightness(1.1);
        }

        .rc-button:active {
            transform: translateY(0);
        }

        .rc-move-button {
            background-color: rgba(15, 23, 42, 0.92);
            border-radius: 50% !important;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.45);
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-size: 60% 60% !important;
            cursor: pointer;
        }

        .rc-move-button:hover {
            transform: translateY(-2px) scale(1.08);
            filter: brightness(1.2);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.6);
        }

        .rc-solve-button {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
            color: white !important;
        }

        .rc-solve-slow-button {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            color: white !important;
        }

        .rc-scramble-button {
            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%) !important;
            color: white !important;
        }

        .rc-reset-button {
            background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%) !important;
            color: white !important;
        }

        /* ==================== STEP-BY-STEP PLAYER (PASSO A PASSO) ==================== */
        .rc-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(15, 23, 42, 0.95) !important;
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);
            padding: 10px 12px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            z-index: 50;
            animation: fadeInStep 0.25s ease-out;
        }

        @keyframes fadeInStep {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
        }

        .step-player-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 6px;
            padding-bottom: 5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .step-player-title-wrap {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.82rem;
            font-weight: 800;
            color: #f8fafc;
        }

        .step-player-title-wrap i {
            color: var(--brand-primary);
        }

        .step-player-counter {
            font-size: 0.74rem;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 12px;
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.35);
            white-space: nowrap;
        }

        .step-player-close {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #94a3b8;
            border-radius: 8px;
            padding: 3px 8px;
            font-size: 0.72rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .step-player-close:hover {
            background: rgba(239, 68, 68, 0.25);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.4);
        }

        .step-progress-track {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
            margin: 4px 0;
        }

        .step-progress-fill {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #10b981, #3b82f6);
            border-radius: 2px;
            transition: width 0.3s ease;
        }

        .step-main-card {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 6px 10px;
            flex: 1;
            margin: 3px 0;
        }

        .step-move-badge {
            width: 48px;
            height: 48px;
            min-width: 48px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.7);
            user-select: none;
        }

        .step-move-badge-letter {
            font-size: 1.15rem;
            font-weight: 900;
            font-family: 'JetBrains Mono', monospace;
            line-height: 1.1;
        }

        .step-move-badge-icon {
            font-size: 0.8rem;
            font-weight: 800;
            line-height: 1;
        }

        .step-details {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
            text-align: left;
            min-width: 0;
        }

        .step-face-name {
            font-size: 0.84rem;
            font-weight: 800;
            color: #f8fafc;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .step-rotation-title {
            font-size: 0.75rem;
            font-weight: 700;
            color: #60a5fa;
        }

        .step-instruction {
            font-size: 0.72rem;
            color: #cbd5e1;
            line-height: 1.25;
        }

        .step-player-actions {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
        }

        .step-act-btn {
            flex: 1;
            padding: 7px 8px;
            border-radius: 10px;
            font-size: 0.78rem;
            font-weight: 700;
            cursor: pointer;
            border: 1px solid rgba(255, 255, 255, 0.15);
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .step-act-btn:hover:not(:disabled) {
            transform: translateY(-1px);
            background: rgba(255, 255, 255, 0.16);
        }

        .step-act-btn:disabled {
            opacity: 0.35;
            cursor: not-allowed;
        }

        .step-act-btn.btn-prev {
            background: rgba(148, 163, 184, 0.15);
            color: #cbd5e1;
        }

        .step-act-btn.btn-auto {
            background: rgba(99, 102, 241, 0.2);
            border-color: rgba(99, 102, 241, 0.4);
            color: #a5b4fc;
        }

        .step-act-btn.btn-auto.active-playing {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: #fff;
            border-color: rgba(239, 68, 68, 0.6);
            animation: pulsePlay 1.2s infinite;
        }

        @keyframes pulsePlay {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        .step-act-btn.btn-next {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-color: rgba(16, 185, 129, 0.5);
            color: #fff;
            box-shadow: 0 3px 10px rgba(16, 185, 129, 0.35);
        }

        .step-completed-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 10px;
            gap: 4px;
            flex: 1;
        }

        .step-completed-icon {
            font-size: 2rem;
            animation: bounceTrophy 0.8s ease infinite alternate;
        }

        @keyframes bounceTrophy {
            from { transform: translateY(0); }
            to { transform: translateY(-5px); }
        }

        .step-completed-title {
            font-size: 1.1rem;
            font-weight: 800;
            color: #34d399;
        }

        .step-completed-desc {
            font-size: 0.78rem;
            color: #94a3b8;
            max-width: 250px;
        }

        /* ==================== CUBO 2D STICKERS ==================== */
        .rc-sticker {
            border: 1.5px solid rgba(0, 0, 0, 0.6) !important;
            border-radius: 6px !important; 
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: all 0.15s ease;
        }

        .rc-sticker:hover {
            transform: scale(1.12);
            border-color: rgba(255, 255, 255, 0.9) !important;
            z-index: 10;
        }

        .rc-color-picker {
            background: rgba(15, 23, 42, 0.65);
            border: 1px solid var(--glass-border) !important;
            border-radius: 16px !important;
            padding: 6px;
            backdrop-filter: blur(10px);
        }

        .rc-picker-choice {
            transition: all 0.2s ease;
        }
        .rc-picker-choice:hover { transform: scale(1.18); }

        .rc-picker-choice.selected {
            transform: scale(1.15);
            border-width: 3px !important;
            border-color: #fff !important;
            box-shadow: 0 0 14px rgba(255, 255, 255, 0.7);
        }

        .rc-message {
            color: #f87171 !important;
            font-weight: 700;
            text-align: center;
            width: 100%;
            left: 0 !important;
            text-shadow: 0 2px 8px rgba(0,0,0,0.8);
        }

        .rc-progress {
            background: linear-gradient(90deg, #10b981, #06b6d4) !important;
            opacity: 0.85;
            border-radius: 16px 0 0 16px;
        }

        /* ==================== PARITY TRACKER SCANNER ==================== */
        .scanner-parity-container {
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            padding: 6px 10px;
            margin-bottom: 8px;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
        }

        .scanner-parity-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.72rem;
            font-weight: 700;
            color: #94a3b8;
            margin-bottom: 4px;
        }

        .parity-status-tag {
            font-size: 0.68rem;
            font-weight: 700;
            padding: 1px 6px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.1);
            color: #f1f5f9;
        }

        .parity-status-tag.valid {
            background: rgba(16, 185, 129, 0.25);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .parity-status-tag.warning {
            background: rgba(245, 158, 11, 0.25);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.4);
        }

        .scanner-parity-bar {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 3px;
            width: 100%;
            box-sizing: border-box;
        }

        .parity-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2px;
            padding: 3px 1px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.05);
            border: 1.5px solid rgba(255, 255, 255, 0.15);
            font-size: 0.64rem;
            color: #e2e8f0;
            min-width: 0;
            white-space: nowrap;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        .parity-pill.complete {
            background: rgba(16, 185, 129, 0.15);
            border-color: #10b981 !important;
            color: #34d399;
        }

        .parity-pill.overflow {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444 !important;
            color: #f87171;
        }

        .parity-color-dot {
            width: 6px;
            height: 6px;
            flex-shrink: 0;
            border-radius: 50%;
            display: inline-block;
            border: 1px solid rgba(255,255,255,0.7);
        }

        /* ==================== MODAL BASE ==================== */
        .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            height: 100dvh;
            background: rgba(0, 0, 0, 0.78);
            -webkit-backdrop-filter: blur(12px);
            backdrop-filter: blur(12px);
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            padding: max(16px, env(safe-area-inset-top, 16px)) 12px max(16px, env(safe-area-inset-bottom, 16px)) 12px;
            box-sizing: border-box;
            opacity: 0;
            transition: opacity 0.25s ease;
        }

        .modal-backdrop.active,
        .modal-backdrop.modal-open {
            display: flex;
            opacity: 1;
        }

        .modal-window {
            background: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 24px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
            color: #fff;
            max-width: 440px;
            width: 100%;
            max-height: calc(100dvh - 32px);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-sizing: border-box;
            animation: modalScale 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalScale {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .modal-header {
            padding: 12px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }

        .modal-title {
            font-size: 1.15rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .modal-close-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #cbd5e1;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 1.05rem;
            transition: all 0.2s ease;
            flex-shrink: 0;
        }

        .modal-close-btn:hover {
            background: rgba(239, 68, 68, 0.25);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.4);
        }

        .modal-body {
            padding: 10px 12px;
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            box-sizing: border-box;
            width: 100%;
        }

        @media (max-width: 600px) {
            .modal-backdrop {
                padding: max(16px, env(safe-area-inset-top, 16px)) 8px max(16px, env(safe-area-inset-bottom, 16px)) 8px !important;
                align-items: center !important;
            }
            .modal-window {
                width: 100% !important;
                max-width: 100% !important;
                max-height: calc(100dvh - 32px) !important;
                border-radius: 18px !important;
            }
            .modal-body {
                padding: 10px 10px !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
            }
            .modal-header {
                padding: 10px 14px !important;
            }
            .modal-title {
                font-size: 0.95rem !important;
            }
            .modal-close-btn {
                width: 32px !important;
                height: 32px !important;
                font-size: 1.15rem !important;
            }
        }

        /* ==================== PÁGINAS OFICIAIS NO MODAL DE INSTRUÇÕES ==================== */
        .help-official-section {
            margin-top: 18px;
            padding-top: 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .help-official-header {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.82rem;
            font-weight: 800;
            color: #f1f5f9;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .help-official-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
        }

        .help-official-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 10px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.10);
            border-radius: 12px;
            text-decoration: none;
            color: #f8fafc;
            transition: all 0.2s ease;
            position: relative;
        }

        .help-official-card:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(99, 102, 241, 0.45);
            transform: translateY(-2px);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
        }

        .help-official-icon {
            width: 32px;
            height: 32px;
            border-radius: 9px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.95rem;
            flex-shrink: 0;
        }

        .help-official-icon.portal-icon {
            background: rgba(59, 130, 246, 0.2);
            color: #60a5fa;
            border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .help-official-icon.support-icon {
            background: rgba(16, 185, 129, 0.2);
            color: #34d399;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .help-official-icon.privacy-icon {
            background: rgba(168, 85, 247, 0.2);
            color: #c084fc;
            border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .help-official-icon.terms-icon {
            background: rgba(245, 158, 11, 0.2);
            color: #fbbf24;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .help-official-icon.github-icon {
            background: rgba(255, 255, 255, 0.12);
            color: #f1f5f9;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .help-official-icon.donate-icon {
            background: rgba(0, 112, 186, 0.25);
            color: #38bdf8;
            border: 1px solid rgba(0, 112, 186, 0.4);
        }

        .help-official-card.donate-card:hover {
            border-color: rgba(239, 68, 68, 0.5);
        }

        .help-official-info {
            display: flex;
            flex-direction: column;
            min-width: 0;
            flex: 1;
        }

        .help-official-name {
            font-size: 0.78rem;
            font-weight: 700;
            color: #fff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .help-official-sub {
            font-size: 0.68rem;
            color: #94a3b8;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .help-official-arrow {
            font-size: 0.7rem;
            color: #64748b;
            margin-left: auto;
            flex-shrink: 0;
            transition: color 0.2s, transform 0.2s;
        }

        .help-official-card:hover .help-official-arrow {
            color: #fff;
            transform: translate(2px, -2px);
        }

        @media (max-width: 480px) {
            .help-official-grid {
                grid-template-columns: 1fr;
                gap: 6px;
            }
        }

        /* ==================== TOAST & ALERT NOTIFICATIONS ==================== */
        .cube-toast {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(30px);
            background: rgba(15, 23, 42, 0.96);
            border: 1px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            color: #ffffff;
            padding: 12px 22px;
            border-radius: 14px;
            font-size: 0.92rem;
            font-weight: 600;
            box-shadow: 0 12px 32px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 99999;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
            max-width: 90vw;
            text-align: center;
        }
        .cube-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        .cube-toast.toast-success {
            border-color: rgba(16, 185, 129, 0.6);
            color: #4ade80;
        }
        .cube-toast.toast-warning {
            border-color: rgba(245, 158, 11, 0.6);
            color: #fbbf24;
        }

        /* ==================== CAMERA SCANNER UI ==================== */
        /* Painel Superior Unificado de Orientação */
        .scanner-orient-card {
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 14px;
            padding: 8px 12px;
            margin-bottom: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .orient-card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .orient-step-title {
            font-size: 0.88rem;
            font-weight: 700;
            color: #f1f5f9;
        }

        .scanner-stepper {
            display: flex;
            gap: 5px;
        }

        .step-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
        }

        .step-dot.active {
            transform: scale(1.3);
            background: #60a5fa !important;
            box-shadow: 0 0 8px #60a5fa;
        }

        .orient-box-front {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 5px 8px;
            border-radius: 12px;
            border: 2px solid #10b981 !important;
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(15, 23, 42, 0.8) 100%) !important;
            box-shadow: 0 0 14px rgba(16, 185, 129, 0.4), inset 0 0 8px rgba(16, 185, 129, 0.15) !important;
            min-height: 48px;
            margin-bottom: 5px;
            box-sizing: border-box;
            transition: all 0.25s ease;
        }

        .orient-front-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 2px;
        }

        .orient-front-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #10b981;
            color: #064e3b;
            font-size: 0.58rem;
            font-weight: 900;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            padding: 1px 6px;
            border-radius: 6px;
        }

        .orient-box-front .orient-sub {
            color: #6ee7b7 !important;
            font-size: 0.70rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 0;
        }

        .orient-val {
            font-size: 1.05rem;
            font-weight: 900;
            letter-spacing: 0.05em;
            color: #ffffff;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
            line-height: 1.1;
        }

        /* 4 VIZINHAS: TODOS OS BOTÕES RIGOROSAMENTE DO MESMO TAMANHO */
        .orient-neighbors-strip {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
            width: 100%;
            box-sizing: border-box;
            margin-top: 1px;
        }

        .orient-pill {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
            min-height: 28px;
            padding: 2px 2px;
            border-radius: 8px;
            font-size: 0.70rem;
            font-weight: 700;
            background: rgba(255, 255, 255, 0.06);
            border: 1.5px solid rgba(255, 255, 255, 0.15);
            color: #e2e8f0;
            white-space: nowrap;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        @media (max-width: 380px) {
            .orient-neighbors-strip {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .scanner-center-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 5px 14px;
            margin: 0 auto 5px auto;
            border-radius: 10px;
            font-size: 0.78rem;
            font-weight: 700;
            text-align: center;
            line-height: 1.25;
            width: fit-content;
            max-width: 95%;
            box-sizing: border-box;
            transition: all 0.25s ease;
        }

        .scanner-center-badge i {
            font-size: 0.90rem;
            flex-shrink: 0;
        }

        .scanner-center-badge span {
            display: inline;
            text-align: center;
        }

        .scanner-center-badge.match {
            background: rgba(16, 185, 129, 0.18);
            border: 1.5px solid rgba(16, 185, 129, 0.7);
            color: #34d399;
            box-shadow: 0 2px 10px rgba(16, 185, 129, 0.2);
        }

        .scanner-center-badge.mismatch {
            background: rgba(239, 68, 68, 0.22);
            border: 1.5px solid rgba(239, 68, 68, 0.85);
            color: #fca5a5;
            box-shadow: 0 2px 12px rgba(239, 68, 68, 0.3);
            animation: pulse-mismatch 1.8s infinite;
        }

        .scanner-center-badge.mismatch strong {
            color: #ffffff;
            font-weight: 900;
        }

        @keyframes pulse-mismatch {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        .scanner-camera-wrapper {
            position: relative;
            width: 100%;
            max-width: 270px;
            height: 180px;
            margin: 0 auto 5px auto;
            border-radius: 14px;
            overflow: hidden;
            background: #000;
            border: 2px solid rgba(16, 185, 129, 0.4);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }

        #scannerVideo {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        #scannerCanvasOverlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .scanner-controls {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px;
            width: 100%;
            box-sizing: border-box;
            margin-top: 2px;
        }

        .scanner-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            padding: 8px 6px;
            border-radius: 8px;
            font-size: 0.80rem;
            font-weight: 700;
            cursor: pointer;
            border: none;
            color: #fff;
            width: 100%;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        .scanner-btn.capture {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            box-shadow: 0 3px 12px rgba(16, 185, 129, 0.4);
        }

        .scanner-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .scanner-btn.upload {
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: #a5b4fc;
        }

        .scanner-action-tip {
            font-size: 0.69rem;
            color: #94a3b8;
            text-align: center;
            line-height: 1.25;
            margin-top: 4px;
            padding: 3px 6px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.06);
            width: 100%;
            box-sizing: border-box;
        }

        /* ==================== SPEED TIMER UI ==================== */
        .modal-window-timer {
            max-width: 780px;
            background: #090d16;
        }

        .timer-modal-header {
            padding: 12px 18px;
            background: linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-shrink: 0;
        }

        .timer-header-title {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
            flex-shrink: 1;
        }

        .timer-header-icon {
            font-size: 1.25rem;
            color: #60a5fa;
            flex-shrink: 0;
        }

        .timer-title-text {
            font-size: 1.05rem;
            font-weight: 800;
            color: #fff;
            white-space: nowrap;
        }

        .timer-wca-pill {
            font-size: 0.65rem;
            text-transform: uppercase;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 6px;
            background: rgba(96, 165, 250, 0.15);
            color: #60a5fa;
            border: 1px solid rgba(96, 165, 250, 0.3);
            letter-spacing: 0.5px;
            white-space: nowrap;
        }

        .timer-header-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-shrink: 0;
        }

        .timer-inspection-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 12px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 20px;
            font-size: 0.78rem;
            font-weight: 600;
            color: #cbd5e1;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease;
            white-space: nowrap;
        }

        .timer-inspection-pill:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(99, 102, 241, 0.4);
            color: #fff;
        }

        .timer-inspection-pill input[type="checkbox"] {
            accent-color: #6366f1;
            width: 15px;
            height: 15px;
            cursor: pointer;
            margin: 0;
        }

        @media (max-width: 600px) {
            .timer-modal-header {
                padding: 10px 12px !important;
                gap: 8px !important;
            }
            .timer-header-icon {
                font-size: 1.1rem !important;
            }
            .timer-title-text {
                font-size: 0.95rem !important;
            }
            .timer-wca-pill {
                font-size: 0.62rem !important;
                padding: 1px 5px !important;
            }
            .timer-header-controls {
                gap: 8px !important;
            }
            .timer-inspection-pill {
                padding: 4px 8px !important;
                font-size: 0.74rem !important;
                gap: 5px !important;
            }
            .timer-inspection-pill input[type="checkbox"] {
                width: 13px !important;
                height: 13px !important;
            }
        }

        @media (max-width: 360px) {
            .timer-wca-pill {
                display: none !important;
            }
        }

        .timer-scramble-box {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 14px 18px;
            margin-bottom: 18px;
            text-align: center;
        }

        .scramble-text {
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.15rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            color: #60a5fa;
            line-height: 1.5;
            user-select: all;
        }

        .scramble-actions {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 10px;
        }

        .timer-sm-btn {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: var(--text-muted);
            font-size: 0.78rem;
            font-weight: 700;
            padding: 5px 12px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .timer-sm-btn:hover {
            background: rgba(255, 255, 255, 0.16);
            color: #fff;
        }

        .timer-touch-surface {
            background: rgba(15, 23, 42, 0.8);
            border: 2px dashed rgba(255, 255, 255, 0.15);
            border-radius: 20px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease;
            margin-bottom: 20px;
        }

        .timer-touch-surface:hover {
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(15, 23, 42, 0.95);
        }

        .timer-big-digits {
            font-family: 'JetBrains Mono', monospace;
            font-size: 4.8rem;
            font-weight: 800;
            letter-spacing: -0.04em;
            color: #f8fafc;
            line-height: 1;
            transition: color 0.15s ease;
        }

        .timer-big-digits.holding { color: #f59e0b !important; }
        .timer-big-digits.ready { color: #10b981 !important; text-shadow: 0 0 30px rgba(16, 185, 129, 0.6); }
        .timer-big-digits.inspecting { color: #ef4444 !important; }
        .timer-big-digits.running { color: #38bdf8 !important; }

        .timer-status-badge {
            display: inline-block;
            margin-top: 14px;
            font-size: 0.85rem;
            font-weight: 700;
            padding: 5px 14px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-muted);
        }

        .timer-status-badge.status-ready { background: rgba(16, 185, 129, 0.2); color: #34d399; }
        .timer-status-badge.status-holding { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
        .timer-status-badge.status-inspecting { background: rgba(239, 68, 68, 0.2); color: #f87171; }

        .timer-stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 18px;
        }

        .stat-card {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 10px;
            text-align: center;
        }

        .stat-label {
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            font-weight: 700;
        }

        .stat-val {
            font-family: 'JetBrains Mono', monospace;
            font-size: 1.15rem;
            font-weight: 800;
            color: #fff;
            margin-top: 3px;
        }

        .timer-history-container {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            padding: 12px;
            max-height: 160px;
            overflow-y: auto;
        }

        .history-item-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 6px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            font-size: 0.85rem;
        }

        .solve-time {
            font-family: 'JetBrains Mono', monospace;
            font-weight: 700;
            color: #38bdf8;
        }

        .solve-del-btn {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 1.1rem;
            cursor: pointer;
            padding: 0 4px;
        }
        .solve-del-btn:hover { color: #ef4444; }

        @media (max-width: 768px) {
            .timer-big-digits { font-size: 3.4rem; }
            .timer-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>

<body>
    <!-- ==================== HEADER ==================== -->
    <header id="header">
        <div class="header-inner">
            <div class="header-title-box">
                <div class="header-logo-icon">
                    <img src="icons/icon-192x192.png" alt="CuboFácil" style="width:100%;height:100%;border-radius:10px;object-fit:cover;display:block;">
                </div>
                <div class="header-title-group">
                    <div class="header-brand-stacked">
                        <span class="brand-word-cubo" data-i18n="brand_word_cubo">Cubo</span>
                        <span class="brand-word-facil" data-i18n="brand_word_facil">Fácil</span>
                    </div>
                </div>
            </div>

            <div class="header-actions">
                <button id="btnOpenScanner" class="header-btn btn-scanner" data-i18n-title="btn_scan_camera_title" title="Escanear as faces com a Câmera">
                    <i class="fas fa-camera"></i> <span class="btn-label" data-i18n="btn_scan_camera">Escanear Câmera</span>
                </button>
                <button id="btnOpenTimer" class="header-btn btn-timer" data-i18n-title="btn_timer_wca_title" title="Cronômetro de Speedcubing">
                    <i class="fas fa-stopwatch"></i> <span class="btn-label" data-i18n="btn_timer_wca">Timer WCA</span>
                </button>
                <button id="btnInstallPwa" class="header-btn btn-install" data-i18n-title="btn_install_title" title="Instalar CuboFácil no seu dispositivo">
                    <i class="fas fa-download"></i> <span class="btn-label" data-i18n="btn_install_app">Instalar App</span>
                </button>
                <div class="lang-switch-box" id="langSwitchBox" data-i18n-title="lang_switch_title" title="Mudar Idioma / Switch Language">
                    <button type="button" class="lang-btn" id="btnLangPT" data-lang="pt" onclick="if(window.setCubeLang) window.setCubeLang('pt')">PT</button>
                    <button type="button" class="lang-btn" id="btnLangEN" data-lang="en" onclick="if(window.setCubeLang) window.setCubeLang('en')">EN</button>
                </div>
            </div>
        </div>
    </header>

    <!-- ==================== ÁREA PRINCIPAL DO CUBO ==================== -->
    <div id="app-container">
        <div id="cube"> 
            <canvas id="cube-canvas">HTML5 CANVAS</canvas>
            <div id="help-icon" data-i18n-title="canvas_help_title" title="Ajuda">?</div>
        </div>
        
        <div id='controls'></div>
        <div id='flat-cube'></div>
    </div>

    <!-- ==================== MODAL 1: SCANNER POR CÂMERA ==================== -->
    <div id="cameraScannerModal" class="modal-backdrop">
        <div class="modal-window">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-camera" style="color:var(--brand-primary);"></i>
                    <span data-i18n="scanner_title">Scanner Óptico de Cores</span>
                </div>
                <button class="modal-close-btn" id="scannerBtnClose" data-i18n-title="scanner_close_title" title="Fechar">&times;</button>
            </div>
            <div class="modal-body">
                <div id="scannerCameraStatus" style="display:none; padding:10px 14px; background:rgba(239, 68, 68, 0.2); border:1px solid rgba(239, 68, 68, 0.4); border-radius:12px; font-size:0.85rem; margin-bottom:12px; color:#fca5a5;"></div>

                <!-- Painel Superior Unificado de Orientação -->
                <div class="scanner-orient-card">
                    <div class="orient-card-header">
                        <span id="scannerStepTitle" class="orient-step-title">1. Face Branca (Topo)</span>
                        <div class="scanner-stepper" id="scannerStepperDots"></div>
                    </div>

                    <!-- Foco Principal: CÂMERA (SUA FRENTE) -->
                    <div class="orient-box orient-box-front">
                        <div class="orient-front-header">
                            <span class="orient-front-badge"><i class="fas fa-bullseye"></i> <span data-i18n="scanner_badge_main_face">FACE PRINCIPAL</span></span>
                            <span class="orient-sub"><i class="fas fa-camera"></i> <span data-i18n="scanner_badge_camera_front">CÂMERA (SUA FRENTE)</span></span>
                        </div>
                        <div id="guideFrontText" class="orient-val">BRANCO</div>
                    </div>

                    <!-- 4 Vizinhas: Cima, Dir, Baixo, Esq -->
                    <div class="orient-neighbors-strip">
                        <span id="compassTop" class="orient-pill">▲ Cima: Verde</span>
                        <span id="compassRight" class="orient-pill">▶ Dir: Laranja</span>
                        <span id="compassBottom" class="orient-pill">▼ Baixo: Azul</span>
                        <span id="compassLeft" class="orient-pill">◀ Esq: Vermelho</span>
                        <span id="compassCenter" style="display:none;"></span>
                        <span id="scannerStepTip" style="display:none;"></span>
                    </div>
                </div>

                <!-- Status de Validação do Centro em Tempo Real -->
                <div id="scannerCenterStatus" class="scanner-center-badge" style="display:none;"></div>

                <div class="scanner-camera-wrapper">
                    <video id="scannerVideo" playsinline autoplay muted></video>
                    <canvas id="scannerCanvasOverlay"></canvas>
                </div>

                <div class="scanner-controls">
                    <button id="scannerBtnPrev" class="scanner-btn secondary"><i class="fas fa-arrow-left"></i> <span data-i18n="scanner_btn_prev">Anterior</span></button>
                    <button id="scannerBtnCapture" class="scanner-btn capture"><i class="fas fa-camera"></i> <span data-i18n="scanner_btn_capture">Capturar Face</span></button>
                    <button id="scannerBtnNext" class="scanner-btn secondary"><i class="fas fa-arrow-right"></i> <span data-i18n="scanner_btn_next">Avançar</span></button>
                    <button id="scannerBtnUpload" class="scanner-btn upload"><i class="fas fa-image"></i> <span data-i18n="scanner_btn_upload">Carregar Foto</span></button>
                    <input type="file" id="scannerFileInput" accept="image/*" style="display:none;">
                </div>

                <div class="scanner-action-tip" data-i18n="scanner_action_tip">
                    <i class="fas fa-info-circle"></i> Aponte a face e clique em <strong>Capturar Face</strong> para avançar.
                </div>
            </div>
        </div>
    </div>

    <!-- ==================== MODAL 2: CRONÔMETRO WCA ==================== -->
    <div id="speedTimerModal" class="modal-backdrop">
        <div class="modal-window modal-window-timer">
            <div class="modal-header timer-modal-header">
                <div class="modal-title timer-header-title">
                    <i class="fas fa-stopwatch timer-header-icon"></i>
                    <span class="timer-title-text" data-i18n="timer_title">Timer WCA</span>
                    <span class="timer-wca-pill">3x3x3</span>
                </div>
                <div class="timer-header-controls">
                    <label class="timer-inspection-pill" data-i18n-title="timer_inspection_title" title="Regra oficial WCA: 15 segundos de inspeção">
                        <input type="checkbox" id="timerInspectionToggle">
                        <span data-i18n="timer_inspection">Inspeção (15s)</span>
                    </label>
                    <button class="modal-close-btn" id="timerBtnClose" data-i18n-title="scanner_close_title" title="Fechar">&times;</button>
                </div>
            </div>
            <div class="modal-body">
                <!-- Scramble Box -->
                <div class="timer-scramble-box">
                    <div id="timerScrambleText" class="scramble-text">R' U2 F L2 B...</div>
                    <div class="scramble-actions">
                        <button id="timerBtnNewScramble" class="timer-sm-btn"><i class="fas fa-rotate"></i> <span data-i18n="timer_btn_new_scramble">Novo Scramble</span></button>
                        <button id="timerBtnApplyScramble" class="timer-sm-btn"><i class="fas fa-cube"></i> <span data-i18n="timer_btn_apply_3d">Aplicar no Cubo 3D</span></button>
                    </div>
                </div>

                <!-- Touch & Display Area -->
                <div id="timerTouchArea" class="timer-touch-surface">
                    <div id="timerDisplay" class="timer-big-digits">0.000</div>
                    <div id="timerStatusBadge" class="timer-status-badge status-idle" data-i18n="timer_status_idle">Pressione e segure ESPAÇO (ou toque) para armar</div>
                </div>

                <!-- Stats Bar -->
                <div class="timer-stats-grid">
                    <div class="stat-card">
                        <div class="stat-label" data-i18n="timer_stat_best">Melhor (Single)</div>
                        <div class="stat-val" id="timerStatBest">--</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label" data-i18n="timer_stat_ao5">Média de 5 (Ao5)</div>
                        <div class="stat-val" id="timerStatAo5">--</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label" data-i18n="timer_stat_ao12">Média de 12 (Ao12)</div>
                        <div class="stat-val" id="timerStatAo12">--</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label" data-i18n="timer_stat_solves">Soluções</div>
                        <div class="stat-val" id="timerStatCount">0</div>
                    </div>
                </div>

                <!-- History -->
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase;" data-i18n="timer_history_title">Histórico Recente</span>
                    <button id="timerBtnClearHistory" class="timer-sm-btn" style="color:#ef4444;"><i class="fas fa-trash"></i> <span data-i18n="timer_history_clear">Limpar</span></button>
                </div>
                <div class="timer-history-container" id="timerHistoryList"></div>
            </div>
        </div>
    </div>

    <!-- ==================== MODAL 3: COMO USAR ==================== -->
    <div id="help-modal-overlay" class="modal-backdrop">
        <div class="modal-window" style="max-width: 500px;">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-circle-question" style="color:var(--brand-indigo);"></i>
                    <span data-i18n="help_title">Como Usar o CuboFácil 4U</span>
                </div>
                <button class="modal-close-btn" id="help-modal-close" data-i18n-title="scanner_close_title" title="Fechar">&times;</button>
            </div>
            <div class="modal-body" style="line-height:1.6;">
                <ol style="padding-left: 20px; margin-bottom: 16px;">
                    <li style="margin-bottom:10px;"><strong data-i18n="help_li_1_strong">Escanear com Câmera:</strong> <span data-i18n="help_li_1_text">Clique em "Escanear Câmera" para ler as 6 faces do seu cubo real automaticamente sem precisar pintar na tela!</span></li>
                    <li style="margin-bottom:10px;"><strong data-i18n="help_li_2_strong">Mapeamento 2D Manual:</strong> <span data-i18n="help_li_2_text">Use a cruz planificada à direita para ajustar qualquer adesivo manualmente com a paleta de cores.</span></li>
                    <li style="margin-bottom:10px;"><strong data-i18n="help_li_3_strong">Resolver e Passo a Passo:</strong> <span data-i18n="help_li_3_text">Clique em "Resolver" para ver a solução instantânea ou "Passo a Passo" para acompanhar cada movimento no cubo 3D.</span></li>
                    <li style="margin-bottom:10px;"><strong data-i18n="help_li_4_strong">Timer WCA:</strong> <span data-i18n="help_li_4_text">Clique em "Timer WCA" para cronometrar seus tempos de speedcubing com regras da World Cube Association e Scramble oficial.</span></li>
                    <li style="margin-bottom:10px;"><strong data-i18n="help_li_5_strong">Giro Interativo:</strong> <span data-i18n="help_li_5_text">Você pode rotacionar a visão do cubo 3D clicando e arrastando com o mouse ou dedo.</span></li>
                </ol>

                <!-- Seção de Páginas Oficiais do Ecossistema 4U -->
                <div class="help-official-section">
                    <div class="help-official-header">
                        <i class="fas fa-compass" style="color:var(--brand-primary);"></i>
                        <span data-i18n="help_official_title">Nossas Páginas Oficiais</span>
                    </div>
                    <div class="help-official-grid">
                        <a href="https://4u.ia.br" target="_blank" rel="noopener noreferrer" class="help-official-card">
                            <div class="help-official-icon portal-icon"><i class="fas fa-globe"></i></div>
                            <div class="help-official-info">
                                <span class="help-official-name">Portal 4U.IA.BR</span>
                                <span class="help-official-sub" data-i18n="help_link_portal_sub">Ecossistema & Aplicativos</span>
                            </div>
                            <i class="fas fa-arrow-up-right-from-square help-official-arrow"></i>
                        </a>
                        <a href="suporte.html" target="_blank" rel="noopener noreferrer" class="help-official-card">
                            <div class="help-official-icon support-icon"><i class="fas fa-headset"></i></div>
                            <div class="help-official-info">
                                <span class="help-official-name" data-i18n="footer_support">Suporte</span>
                                <span class="help-official-sub" data-i18n="help_link_support_sub">Central de Atendimento</span>
                            </div>
                            <i class="fas fa-arrow-up-right-from-square help-official-arrow"></i>
                        </a>
                        <a href="privacidade.html" target="_blank" rel="noopener noreferrer" class="help-official-card">
                            <div class="help-official-icon privacy-icon"><i class="fas fa-shield-halved"></i></div>
                            <div class="help-official-info">
                                <span class="help-official-name" data-i18n="footer_privacy">Privacidade</span>
                                <span class="help-official-sub" data-i18n="help_link_privacy_sub">Segurança & LGPD</span>
                            </div>
                            <i class="fas fa-arrow-up-right-from-square help-official-arrow"></i>
                        </a>
                        <a href="termos.php" target="_blank" rel="noopener noreferrer" class="help-official-card">
                            <div class="help-official-icon terms-icon"><i class="fas fa-file-contract"></i></div>
                            <div class="help-official-info">
                                <span class="help-official-name" data-i18n="footer_terms">Termos de Uso</span>
                                <span class="help-official-sub" data-i18n="help_link_terms_sub">Diretrizes Legais</span>
                            </div>
                            <i class="fas fa-arrow-up-right-from-square help-official-arrow"></i>
                        </a>
                        <a href="https://github.com/4u-Labs/cubo" target="_blank" rel="noopener noreferrer" class="help-official-card">
                            <div class="help-official-icon github-icon"><i class="fab fa-github"></i></div>
                            <div class="help-official-info">
                                <span class="help-official-name">GitHub 4u-Labs</span>
                                <span class="help-official-sub" data-i18n="help_link_github_sub">Código Aberto & Versões</span>
                            </div>
                            <i class="fas fa-arrow-up-right-from-square help-official-arrow"></i>
                        </a>
                        <a href="https://www.paypal.com/ncp/payment/L7YRCS984T33N" target="_blank" rel="noopener noreferrer" class="help-official-card donate-card">
                            <div class="help-official-icon donate-icon"><i class="fab fa-paypal"></i></div>
                            <div class="help-official-info">
                                <span class="help-official-name" data-i18n="help_link_donate">Apoie o Projeto</span>
                                <span class="help-official-sub" data-i18n="help_link_donate_sub">Contribuição Voluntária</span>
                            </div>
                            <i class="fas fa-heart help-official-arrow" style="color:#ef4444;"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ==================== MODAL DE ALERTA E VALIDAÇÃO ==================== -->
    <div id="cubeAlertModal" class="modal-backdrop">
        <div class="modal-window" style="max-width: 440px;">
            <div class="modal-header">
                <div class="modal-title">
                    <i id="alertModalIcon" class="fas fa-exclamation-triangle" style="color:#f59e0b;"></i>
                    <span id="alertModalTitle" data-i18n="alert_title_default">Aviso</span>
                </div>
                <button class="modal-close-btn" id="alertModalBtnClose" data-i18n-title="scanner_close_title" title="Fechar">&times;</button>
            </div>
            <div class="modal-body" style="line-height:1.5;">
                <p id="alertModalMessage" style="font-size:0.95rem; margin-bottom:12px; color:var(--text-main); font-weight:500;"></p>
                <div id="alertModalDetailsBox" style="display:none; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:10px 14px; font-size:0.84rem; color:var(--text-muted); margin-bottom:16px; font-family:'JetBrains Mono', monospace; white-space:pre-wrap;"></div>
                <div id="alertModalActions" style="display:flex; flex-direction:column; gap:8px;">
                    <button id="alertBtnFixFlat" class="scanner-btn capture" style="display:none; width:100%; justify-content:center;">
                        <i class="fas fa-th"></i> <span data-i18n="alert_btn_fix_flat">Ajustar no Modelo Planificado</span>
                    </button>
                    <button id="alertBtnRescan" class="scanner-btn secondary" style="display:none; width:100%; justify-content:center;">
                        <i class="fas fa-camera"></i> <span data-i18n="alert_btn_rescan">Escanear com a Câmera</span>
                    </button>
                    <button id="alertBtnOk" class="scanner-btn secondary" style="width:100%; justify-content:center;" data-i18n="alert_btn_ok">
                        Entendido
                    </button>
                </div>
            </div>
    </div>

    <!-- ==================== LOGICA PRINCIPAL ==================== -->
    <script type="text/javascript">
        var cube, flatCube, controls;
        var modalOverlay = null;

        window.showCubeToast = function(msg, type) {
            var old = document.querySelector('.cube-toast');
            if (old) old.remove();

            var toast = document.createElement('div');
            toast.className = 'cube-toast toast-' + (type || 'info');
            var icon = (type === 'success') ? 'fa-check-circle' : (type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle');
            toast.innerHTML = '<i class="fas ' + icon + '"></i> <span>' + msg + '</span>';
            document.body.appendChild(toast);
            setTimeout(function() { toast.classList.add('show'); }, 15);
            setTimeout(function() {
                toast.classList.remove('show');
                setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
            }, 3800);
        };

        window.showCubeAlert = function(opts) {
            var modal = document.getElementById('cubeAlertModal');
            if (!modal) {
                alert((opts.title ? opts.title + '\n\n' : '') + opts.message + (opts.details ? '\n\n' + opts.details : ''));
                return;
            }
            var titleEl = document.getElementById('alertModalTitle');
            var iconEl = document.getElementById('alertModalIcon');
            var msgEl = document.getElementById('alertModalMessage');
            var detailsBox = document.getElementById('alertModalDetailsBox');
            var btnFixFlat = document.getElementById('alertBtnFixFlat');
            var btnRescan = document.getElementById('alertBtnRescan');
            var btnOk = document.getElementById('alertBtnOk');
            var closeBtn = document.getElementById('alertModalBtnClose');

            if (titleEl) titleEl.textContent = opts.title || (window.t ? window.t('alert_title_default') : 'Aviso');
            if (msgEl) msgEl.innerHTML = opts.message || '';

            if (iconEl) {
                if (opts.type === 'success') {
                    iconEl.className = 'fas fa-check-circle';
                    iconEl.style.color = '#10b981';
                } else if (opts.type === 'warning') {
                    iconEl.className = 'fas fa-exclamation-triangle';
                    iconEl.style.color = '#f59e0b';
                } else {
                    iconEl.className = 'fas fa-info-circle';
                    iconEl.style.color = '#3b82f6';
                }
            }

            if (detailsBox) {
                if (opts.details) {
                    detailsBox.innerText = opts.details;
                    detailsBox.style.display = 'block';
                } else {
                    detailsBox.style.display = 'none';
                }
            }

            var closeModal = function() { modal.classList.remove('active'); };

            if (btnFixFlat) {
                if (opts.showFixFlat) {
                    btnFixFlat.style.display = 'flex';
                    var fixLabel = window.t ? window.t('alert_btn_fix_flat') : 'Ajustar no Modelo Planificado';
                    btnFixFlat.innerHTML = '<i class="fas fa-th"></i> <span>' + fixLabel + '</span>';
                    btnFixFlat.onclick = function() {
                        closeModal();
                        var flatEl = document.getElementById('flat-cube');
                        if (flatEl) {
                            flatEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            flatEl.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.9)';
                            flatEl.style.borderColor = '#3b82f6';
                            setTimeout(function() {
                                flatEl.style.boxShadow = '';
                                flatEl.style.borderColor = '';
                            }, 3000);
                        }
                    };
                } else {
                    btnFixFlat.style.display = 'none';
                }
            }

            if (btnRescan) {
                if (opts.showRescan) {
                    btnRescan.style.display = 'flex';
                    var rescanLabel = window.t ? window.t('alert_btn_rescan') : 'Escanear com a Câmera';
                    btnRescan.innerHTML = '<i class="fas fa-camera"></i> <span>' + rescanLabel + '</span>';
                    btnRescan.onclick = function() {
                        closeModal();
                        if (window.cameraScanner) window.cameraScanner.open();
                    };
                } else {
                    btnRescan.style.display = 'none';
                }
            }

            if (btnOk) {
                btnOk.textContent = window.t ? window.t('alert_btn_ok') : 'Entendido';
                btnOk.onclick = closeModal;
            }
            if (closeBtn) closeBtn.onclick = closeModal;
            modal.onclick = function(e) { if (e.target === modal) closeModal(); };

            modal.classList.add('active');
        };

        function openModal() {
            if (modalOverlay) modalOverlay.classList.add('active');
        }
        
        function closeModal() {
            if (modalOverlay) modalOverlay.classList.remove('active');
        }

        var run = function () {
            if (cube) {
                cube.tick();
                cube.render();
            }
            requestAnimationFrame(run);
        };

        var oldWidth = null;

        var reset = function () {
            var down = false;
            var parent = document.getElementById('app-container');
            var parentWidth = parent.offsetWidth - 30;
            var headerHeight = document.getElementById('header').offsetHeight;
            var availableHeight = window.innerHeight - headerHeight - 100;

            var width = Math.min(parentWidth / 2 - 15, availableHeight / 5 * 3);
            
            if (parentWidth < 700 || (width < 250 && parentWidth < availableHeight)) {
                width = parentWidth;
                down = true;
            } else if (width < 250) {
                width = Math.min(parentWidth / 2 - 15, availableHeight / 5 * 3);
            }

            if(width < 250) width = 250; 
            oldWidth = width;
            
            var appHeight = 0;
            var flatCubeHeight = (width / 3) * 4.75;
            var flatCubeTop; 
            var controlsTop;

            if (down) {
                controlsTop = 20 + width + 15;
                var controlsHeight = Math.max(Math.round(width * 15 / 28), 230);
                flatCubeTop = controlsTop + controlsHeight + 15;
                appHeight = flatCubeTop + flatCubeHeight + 20;
            } else {
                controlsTop = 20 + width + 15;
                var controlsHeight = Math.max(Math.round(width * 15 / 28), 230);
                var leftColHeight = controlsTop + controlsHeight;
                flatCubeTop = 20;
                var rightColHeight = flatCubeTop + flatCubeHeight;
                appHeight = Math.max(leftColHeight, rightColHeight) + 20;
            }

            parent.style.height = appHeight + 'px';

            var cubeContainer = document.getElementById('cube');
            cubeContainer.style.position = 'absolute';
            cubeContainer.style.top = '20px';
            cubeContainer.style.left = '15px';
            cubeContainer.style.width = width + 'px';
            cubeContainer.style.height = width + 'px';

            cube = new RubiksCube('cube-canvas', width);
            
            flatCube = new FlatCube(
                'flat-cube', 
                width, 
                down,
                flatCubeTop
            );
            controls = new RubiksCubeControls('controls', cube, width, controlsTop);

            cube.flatCube = flatCube;
            flatCube.cube = cube;
        };

        var init = function () {
            reset();
            run();

            // Modal de Ajuda
            modalOverlay = document.getElementById('help-modal-overlay');
            var helpIcon = document.getElementById('help-icon');
            var closeModalBtn = document.getElementById('help-modal-close');
            var btnOpenHelp = document.getElementById('btnOpenHelp');

            if (helpIcon) helpIcon.addEventListener('click', openModal);
            if (btnOpenHelp) btnOpenHelp.addEventListener('click', openModal);
            if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
            if (modalOverlay) {
                modalOverlay.addEventListener('click', function(e) {
                    if (e.target === modalOverlay) closeModal();
                });
            }

            // Inicializar Camera Scanner com auto-lançamento do Passo a Passo
            window.cameraScanner = new CuboCameraScanner(flatCube, function(isValid, validation) {
                if (controls) {
                    if (isValid) {
                        setTimeout(function() {
                            if (controls.solveSlowButton) {
                                controls.solveSlowButton.click();
                            }
                        }, 350);
                    } else {
                        controls.setSolution('');
                        if (window.showCubeAlert && validation) {
                            window.showCubeAlert({
                                title: 'Cores Inconsistentes Detectadas',
                                message: 'O cubo lido pela câmera possui peças ou cores que não formam uma montagem válida:',
                                details: validation.reason + (validation.details ? '\n' + validation.details : ''),
                                type: 'warning',
                                showFixFlat: true,
                                showRescan: true
                            });
                        }
                    }
                }
            });

            var btnOpenScanner = document.getElementById('btnOpenScanner');
            if (btnOpenScanner) {
                btnOpenScanner.addEventListener('click', function() {
                    window.cameraScanner.open();
                });
            }

            // Inicializar Speedcubing Timer
            window.speedTimer = new CuboSpeedTimer(cube);

            var btnOpenTimer = document.getElementById('btnOpenTimer');
            if (btnOpenTimer) {
                btnOpenTimer.addEventListener('click', function() {
                    window.speedTimer.open();
                });
            }

            try {
                localStorage.removeItem('cubofacil_header_collapsed');
            } catch(e) {}
        };

        window.addEventListener('load', init, false);

        window.addEventListener('resize', function () {
            var down = false;
            var parent = document.getElementById('app-container');
            var parentWidth = parent.offsetWidth - 30;
            var headerHeight = document.getElementById('header').offsetHeight;
            var availableHeight = window.innerHeight - headerHeight - 100;

            var width = Math.min(parentWidth / 2 - 15, availableHeight / 5 * 3);
            
            if (parentWidth < 700 || (width < 250 && parentWidth < availableHeight)) {
                width = parentWidth;
                down = true;
            } else if (width < 250) {
                width = Math.min(parentWidth / 2 - 15, availableHeight / 5 * 3);
            }

            if(width < 250) width = 250;
            if (width == oldWidth) return;
            oldWidth = width;

            var appHeight = 0;
            var flatCubeHeight = (width / 3) * 4.75;
            var flatCubeTop; 
            var controlsTop;

            if (down) {
                controlsTop = 20 + width + 15;
                var controlsHeight = Math.max(Math.round(width * 15 / 28), 230);
                flatCubeTop = controlsTop + controlsHeight + 15;
                appHeight = flatCubeTop + flatCubeHeight + 20;
            } else {
                controlsTop = 20 + width + 15;
                var controlsHeight = Math.max(Math.round(width * 15 / 28), 230);
                var leftColHeight = controlsTop + controlsHeight;
                flatCubeTop = 20;
                var rightColHeight = flatCubeTop + flatCubeHeight;
                appHeight = Math.max(leftColHeight, rightColHeight) + 20;
            }

            parent.style.height = appHeight + 'px';

            var cubeContainer = document.getElementById('cube');
            cubeContainer.style.position = 'absolute';
            cubeContainer.style.top = '20px';
            cubeContainer.style.left = '15px';
            cubeContainer.style.width = width + 'px';
            cubeContainer.style.height = width + 'px';

            cube.updateSize(width);
            controls.setWidth(width, controlsTop);
            flatCube = new FlatCube(
                'flat-cube', 
                width, 
                down,
                flatCubeTop
            );
            cube.flatCube = flatCube;
            flatCube.cube = cube;
            cube.update();
            flatCube.update();

            // Atualiza referência no scanner
            if (window.cameraScanner) {
                window.cameraScanner.flatCube = flatCube;
            }
        });
    </script>

    <!-- ==================== PWA INSTALL CONTROLLER ==================== -->
    <script>
        (function() {
            let deferredPwaPrompt = null;
            const btn = document.getElementById('btnInstallPwa');
            if (!btn) return;

            function isAppStandalone() {
                return window.matchMedia('(display-mode: standalone)').matches 
                    || window.navigator.standalone === true 
                    || document.referrer.includes('android-app://');
            }

            function updatePwaUi() {
                if (isAppStandalone()) {
                    btn.style.display = 'none';
                    btn.classList.add('installed');
                } else {
                    btn.style.display = 'inline-flex';
                    btn.classList.remove('installed');
                }
            }

            // Inicializa visibilidade de acordo com o modo standalone
            updatePwaUi();

            // Intercepta evento nativo de instalação PWA (Chrome, Edge, Samsung Internet, Android)
            window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                deferredPwaPrompt = e;
                updatePwaUi();
            });

            // Disparado quando o app é instalado com sucesso
            window.addEventListener('appinstalled', function() {
                deferredPwaPrompt = null;
                btn.style.display = 'none';
                btn.classList.add('installed');
                const msg = (window.t) ? window.t('install_success') : 'CuboFácil instalado com sucesso!';
                console.log('[PWA]', msg);
            });

            // Clique no botão de instalar
            btn.addEventListener('click', async function() {
                if (deferredPwaPrompt) {
                    deferredPwaPrompt.prompt();
                    const choiceResult = await deferredPwaPrompt.userChoice;
                    if (choiceResult && choiceResult.outcome === 'accepted') {
                        btn.style.display = 'none';
                        btn.classList.add('installed');
                    }
                    deferredPwaPrompt = null;
                } else {
                    if (isAppStandalone()) {
                        const alertMsg = (window.t)
                            ? window.t('install_already_installed')
                            : 'O CuboFácil já está instalado e rodando em modo aplicativo!';
                        alert(alertMsg);
                    } else {
                        const guideMsg = (window.t)
                            ? window.t('install_manual_guide')
                            : 'Para instalar o CuboFácil no seu dispositivo:\n• No Chrome/Edge: Clique no ícone de instalar na barra de endereços ou no menu do navegador.\n• No iPhone/iPad (Safari): Toque em Compartilhar e selecione "Adicionar à Tela de Início".';
                        alert(guideMsg);
                    }
                }
            });
        })();
    </script>
</body>
</html>
