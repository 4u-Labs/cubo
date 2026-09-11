<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Termos de Uso - CuboFácil 4U | 4U.IA.BR</title>
    <link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192x192.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        :root {
            --brand-primary: #10b981;
            --brand-indigo: #6366f1;
            --bg-dark: #060a12;
            --bg-card: rgba(15, 23, 42, 0.9);
            --border-card: rgba(255, 255, 255, 0.1);
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
            color: #f1f5f9;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .container {
            max-width: 760px;
            width: 100%;
            background: var(--bg-card);
            border: 1px solid var(--border-card);
            border-radius: 28px;
            padding: 44px;
            backdrop-filter: blur(20px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
        }
        .back-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: var(--brand-indigo);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 700;
            padding: 8px 16px;
            border-radius: 12px;
            background: rgba(99, 102, 241, 0.12);
            border: 1px solid rgba(99, 102, 241, 0.25);
            margin-bottom: 28px;
            transition: all 0.2s ease;
        }
        .back-btn:hover { background: rgba(99, 102, 241, 0.22); transform: translateY(-1px); }
        h1 { color: #ffffff; font-size: 1.8rem; font-weight: 800; margin-bottom: 20px; }
        h2 { color: #818cf8; font-size: 1.15rem; margin: 24px 0 8px 0; font-weight: 700; }
        p { color: #cbd5e1; font-size: 0.95rem; line-height: 1.7; margin-bottom: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <a href="index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Voltar ao CuboFácil</a>
        <h1>Termos de Uso — CuboFácil 4U</h1>
        <p>Ao utilizar a aplicação <strong>CuboFácil 4U</strong>, você concorda com os seguintes termos:</p>

        <h2>1. Finalidade da Aplicação</h2>
        <p>O CuboFácil 4U é uma ferramenta interativa e educacional projetada para auxiliar no aprendizado de algoritmos de resolução do Cubo Mágico (Rubik's Cube 3x3x3), cronometragem de speedcubing e análise combinatória.</p>

        <h2>2. Propriedade Intelectual & Código Aberto</h2>
        <p>O projeto integra o ecossistema <strong>4U.IA.BR Labs</strong> sob licença MIT. O código-fonte está disponível publicamente em <a href="https://github.com/4u-Labs/cubo" target="_blank" style="color:#60a5fa;">github.com/4u-Labs/cubo</a>.</p>
    </div>
</body>
</html>
