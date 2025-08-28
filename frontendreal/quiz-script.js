// Base de dados para exercícios por nível
const questionDatabase = {
    facil: {
        gramatica: [
            {
                question: "Qual é o plural de 'animal'?",
                options: ["Animals", "Animais", "Animales", "Animaes"],
                correct: 1,
                explanation: "O plural de 'animal' é 'animais'. Palavras terminadas em -al fazem plural trocando -al por -ais."
            },
            {
                question: "Qual palavra está correta?",
                options: ["Geito", "Jeito", "Geitto", "Jeitto"],
                correct: 1,
                explanation: "'Jeito' se escreve com J. Palavras com som de 'jei' geralmente se escrevem com J."
            },
            {
                question: "Complete: 'Eu ____ muito feliz hoje.'",
                options: ["está", "estou", "estamos", "estão"],
                correct: 1,
                explanation: "Para 'eu' usamos 'estou'. É a conjugação do verbo 'estar' na 1ª pessoa do singular."
            }
        ],
        conjugacao: [
            {
                verb: "amar",
                person: "eu",
                tense: "presente",
                answer: "amo",
                hint: "Verbo regular da 1ª conjugação (-ar)"
            },
            {
                verb: "comer",
                person: "você",
                tense: "presente", 
                answer: "come",
                hint: "Verbo regular da 2ª conjugação (-er)"
            },
            {
                verb: "partir",
                person: "nós",
                tense: "presente",
                answer: "partimos",
                hint: "Verbo regular da 3ª conjugação (-ir)"
            }
        ],
        ortografia: [
            {
                word: "casa",
                hint: "Onde moramos",
                difficulty: "facil"
            },
            {
                word: "escola",
                hint: "Lugar de estudar",
                difficulty: "facil"
            },
            {
                word: "amigo",
                hint: "Pessoa querida",
                difficulty: "facil"
            }
        ]
    },
    medio: {
        gramatica: [
            {
                question: "Qual frase tem erro de concordância?",
                options: ["Fazem dois anos que me formei", "Havia muitas pessoas", "Choveu muito ontem", "Bateram meio-dia"],
                correct: 0,
                explanation: "O correto é 'Faz dois anos'. O verbo 'fazer' indicando tempo é impessoal e fica no singular."
            },
            {
                question: "Em 'João deu o livro para Maria', qual é o objeto indireto?",
                options: ["João", "livro", "para Maria", "deu"],
                correct: 2,
                explanation: "'Para Maria' é o objeto indireto, pois indica o destinatário da ação verbal."
            }
        ],
        conjugacao: [
            {
                verb: "fazer",
                person: "ele",
                tense: "pretérito",
                answer: "fez",
                hint: "Verbo irregular no pretérito perfeito"
            },
            {
                verb: "ter",
                person: "eles",
                tense: "presente",
                answer: "têm",
                hint: "Lembre-se do acento circunflexo na 3ª pessoa do plural"
            }
        ],
        ortografia: [
            {
                word: "exceção",
                hint: "Algo fora da regra",
                difficulty: "medio"
            },
            {
                word: "assessoria", 
                hint: "Serviço de consultoria (com dois 's')",
                difficulty: "medio"
            }
        ]
    },
    dificil: {
        gramatica: [
            {
                question: "Identifique o erro na frase: 'Prefiro mais cinema do que teatro.'",
                options: ["Não há erro", "Prefiro cinema a teatro", "Prefiro mais cinema que teatro", "Todas estão certas"],
                correct: 1,
                explanation: "O verbo 'preferir' não admite 'mais' nem 'do que'. O correto é 'Prefiro cinema a teatro'."
            },
            {
                question: "Em qual frase a crase está correta?",
                options: ["Vou à pé", "Refiro-me à pessoas", "Entreguei à Maria", "Saiu às pressas"],
                correct: 3,
                explanation: "'Saiu às pressas' está correto. É uma locução adverbial feminina que exige crase."
            }
        ],
        conjugacao: [
            {
                verb: "intervir",
                person: "eu",
                tense: "presente",
                answer: "intervenho",
                hint: "Segue a conjugação do verbo 'vir'"
            },
            {
                verb: "requisitar",
                person: "nós", 
                tense: "futuro",
                answer: "requisitaremos",
                hint: "Verbo regular no futuro do presente"
            }
        ],
        ortografia: [
            {
                word: "paralelepípedo",
                hint: "Figura geométrica tridimensional",
                difficulty: "dificil"
            },
            {
                word: "acontecimento",
                hint: "Evento, ocorrência",
                difficulty: "dificil"
            }
        ]
    }
};

// Estado do jogo
let currentDifficulty = 'facil';
let currentScore = 0;
let currentStreak = 0;
let questionNumber = 0;
let totalQuestions = 10;
let currentQuestion = null;
let aiEnabled = false;
let userStats = {
    totalCorrect: 0,
    totalAnswered: 0,
    streakRecord: 0,
    achievements: new Set()
};

// Inicialização
window.onload = function() {
    loadQuestion();
    updateStats();
    checkAchievements();
};

// Controle da IA
function toggleAI() {
    aiEnabled = !aiEnabled;
    const btn = document.getElementById('ai-btn');
    const tooltip = document.getElementById('ai-tooltip');
    
    if (aiEnabled) {
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btn.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
        tooltip.textContent = 'IA Ativada! Receba explicações detalhadas';
    } else {
        btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        btn.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        tooltip.textContent = 'Clique para ativar a IA que simplifica explicações!';
    }
}

// Seletor de dificuldade
function setDifficulty(level) {
    currentDifficulty = level;
    questionNumber = 0;
    currentScore = 0;
    currentStreak = 0;
    
    // Atualizar botões
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-level="${level}"]`).classList.add('active');
    
    // Atualizar display
    document.getElementById('current-level').textContent = 
        level === 'facil' ? 'Fácil' : 
        level === 'medio' ? 'Médio' : 'Difícil';
    
    loadQuestion();
    updateStats();
}

// Carregar pergunta
function loadQuestion() {
    if (questionNumber >= totalQuestions) {
        showFinalResults();
        return;
    }
    
    questionNumber++;
    const questionTypes = ['gramatica', 'conjugacao', 'ortografia'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    const questions = questionDatabase[currentDifficulty][randomType];
    currentQuestion = {
        type: randomType,
        data: questions[Math.floor(Math.random() * questions.length)]
    };
    
    displayQuestion();
    updateProgress();
}

// Exibir pergunta
function displayQuestion() {
    const questionArea = document.getElementById('question-area');
    const answerArea = document.getElementById('answer-area');
    const questionText = document.getElementById('question-text');
    const questionType = document.getElementById('question-type');
    
    // Limpar área anterior
    document.getElementById('feedback-area').style.display = 'none';
    document.getElementById('ai-explanation').style.display = 'none';
    
    // Definir tipo
    const typeLabels = {
        gramatica: '📚 Gramática',
        conjugacao: '🔄 Conjugação',
        ortografia: '✏️ Ortografia'
    };
    
    questionType.textContent = typeLabels[currentQuestion.type];
    
    if (currentQuestion.type === 'gramatica') {
        questionText.textContent = currentQuestion.data.question;
        answerArea.innerHTML = '';
        
        currentQuestion.data.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = option;
            btn.onclick = () => selectOption(index);
            answerArea.appendChild(btn);
        });
        
    } else if (currentQuestion.type === 'conjugacao') {
        questionText.textContent = `Conjugue o verbo "${currentQuestion.data.verb}" para "${currentQuestion.data.person}" no ${currentQuestion.data.tense}:`;
        answerArea.innerHTML = `
            <input type="text" class="input-answer" id="conjugacao-input" 
                   placeholder="Digite a conjugação..." onkeypress="handleEnter(event, 'conjugacao')">
            <button class="btn" onclick="checkConjugacao()" style="margin-top: 15px;">Verificar</button>
        `;
        document.getElementById('conjugacao-input').focus();
        
    } else if (currentQuestion.type === 'ortografia') {
        questionText.textContent = `Como se escreve esta palavra?`;
        answerArea.innerHTML = `
            <div class="question-help" style="display: block;">
                <div class="help-icon">💡</div>
                <div class="help-text">${currentQuestion.data.hint}</div>
            </div>
            <input type="text" class="input-answer" id="ortografia-input" 
                   placeholder="Digite a palavra..." onkeypress="handleEnter(event, 'ortografia')">
            <button class="btn" onclick="checkOrtografia()" style="margin-top: 15px;">Verificar</button>
        `;
        document.getElementById('ortografia-input').focus();
    }
}

// Seleção de opção (gramática)
function selectOption(selectedIndex) {
    const correct = currentQuestion.data.correct;
    const options = document.querySelectorAll('.option-btn');
    
    userStats.totalAnswered++;
    
    options.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== correct) {
            btn.classList.add('incorrect');
        }
    });
    
    const isCorrect = selectedIndex === correct;
    processAnswer(isCorrect);
}

// Verificar conjugação
function checkConjugacao() {
    const userAnswer = document.getElementById('conjugacao-input').value.toLowerCase().trim();
    const correctAnswer = currentQuestion.data.answer.toLowerCase();
    
    userStats.totalAnswered++;
    const isCorrect = userAnswer === correctAnswer;
    
    // Visual feedback
    const input = document.getElementById('conjugacao-input');
    input.style.borderColor = isCorrect ? '#10b981' : '#ef4444';
    input.style.background = isCorrect ? '#ecfdf5' : '#fef2f2';
    
    processAnswer(isCorrect);
}

// Verificar ortografia
function checkOrtografia() {
    const userAnswer = document.getElementById('ortografia-input').value.toLowerCase().trim();
    const correctAnswer = currentQuestion.data.word.toLowerCase();
    
    userStats.totalAnswered++;
    const isCorrect = userAnswer === correctAnswer;
    
    // Visual feedback
    const input = document.getElementById('ortografia-input');
    input.style.borderColor = isCorrect ? '#10b981' : '#ef4444';
    input.style.background = isCorrect ? '#ecfdf5' : '#fef2f2';
    
    processAnswer(isCorrect);
}

// Processar resposta
function processAnswer(isCorrect) {
    if (isCorrect) {
        currentScore += getDifficultyPoints();
        currentStreak++;
        userStats.totalCorrect++;
        
        if (currentStreak > userStats.streakRecord) {
            userStats.streakRecord = currentStreak;
        }
    } else {
        currentStreak = 0;
    }
    
    updateStats();
    checkAchievements();
    showFeedback(isCorrect);
    
    if (aiEnabled && !isCorrect) {
        showAIExplanation();
    }
}

// Pontuação por dificuldade
function getDifficultyPoints() {
    const points = {
        facil: 10,
        medio: 15,
        dificil: 25
    };
    return points[currentDifficulty];
}

// Exibir feedback
function showFeedback(isCorrect) {
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackContent = document.getElementById('feedback-content');
    
    if (isCorrect) {
        const encouragements = [
            '🎉 Excelente! Você acertou!',
            '✨ Perfeito! Continue assim!',
            '🚀 Muito bem! Você está indo ótimo!',
            '⭐ Fantástico! Resposta correta!'
        ];
        feedbackContent.innerHTML = encouragements[Math.floor(Math.random() * encouragements.length)];
        feedbackArea.style.borderLeftColor = '#10b981';
        feedbackArea.style.background = '#ecfdf5';
    } else {
        let correctAnswerText = '';
        if (currentQuestion.type === 'gramatica') {
            correctAnswerText = currentQuestion.data.options[currentQuestion.data.correct];
        } else if (currentQuestion.type === 'conjugacao') {
            correctAnswerText = currentQuestion.data.answer;
        } else {
            correctAnswerText = currentQuestion.data.word;
        }
        
        feedbackContent.innerHTML = `❌ Não foi dessa vez! A resposta correta é: <strong>${correctAnswerText}</strong>`;
        feedbackArea.style.borderLeftColor = '#ef4444';
        feedbackArea.style.background = '#fef2f2';
    }
    
    feedbackArea.style.display = 'block';
}

// Explicação da IA
function showAIExplanation() {
    const aiExplanation = document.getElementById('ai-explanation');
    const aiContent = document.getElementById('ai-content');
    
    let explanation = '';
    
    if (currentQuestion.type === 'gramatica' && currentQuestion.data.explanation) {
        explanation = currentQuestion.data.explanation;
    } else if (currentQuestion.type === 'conjugacao') {
        explanation = `${currentQuestion.data.hint}. A forma correta é "${currentQuestion.data.answer}" para ${currentQuestion.data.person} no ${currentQuestion.data.tense}.`;
    } else if (currentQuestion.type === 'ortografia') {
        explanation = `A palavra "${currentQuestion.data.word}" se escreve dessa forma. Dica: ${currentQuestion.data.hint}`;
    }
    
    aiContent.textContent = explanation || 'Continue praticando! Cada erro é uma oportunidade de aprender algo novo.';
    aiExplanation.style.display = 'block';
}

function closeAIExplanation() {
    document.getElementById('ai-explanation').style.display = 'none';
}

// Próxima questão
function nextQuestion() {
    loadQuestion();
}

// Atualizar estatísticas
function updateStats() {
    document.getElementById('current-score').textContent = currentScore;
    document.getElementById('current-streak').textContent = currentStreak;
}

// Atualizar progresso
function updateProgress() {
    const progress = (questionNumber / totalQuestions) * 100;
    document.getElementById('main-progress').style.width = progress + '%';
    document.getElementById('question-number').textContent = questionNumber;
    document.getElementById('total-questions').textContent = totalQuestions;
}

// Verificar conquistas
function checkAchievements() {
    if (userStats.totalCorrect >= 1 && !userStats.achievements.has('first-correct')) {
        unlockAchievement('first-correct');
    }
    
    if (currentStreak >= 5 && !userStats.achievements.has('streak-5')) {
        unlockAchievement('streak-5');
    }
    
    if (userStats.totalCorrect >= 10 && currentDifficulty === 'dificil' && !userStats.achievements.has('grammar-expert')) {
        unlockAchievement('grammar-expert');
    }
    
    if (userStats.totalAnswered > 0 && (userStats.totalCorrect / userStats.totalAnswered) >= 0.9 && !userStats.achievements.has('perfect-spelling')) {
        unlockAchievement('perfect-spelling');
    }
}

function unlockAchievement(achievementId) {
    userStats.achievements.add(achievementId);
    const achievement = document.getElementById(achievementId);
    achievement.classList.add('unlocked');
    
    // Efeito visual
    achievement.style.animation = 'pulse 0.6s ease-in-out';
    setTimeout(() => {
        achievement.style.animation = '';
    }, 600);
}

// Resultados finais
function showFinalResults() {
    const accuracy = Math.round((userStats.totalCorrect / userStats.totalAnswered) * 100) || 0;
    const questionArea = document.getElementById('question-area');
    
    questionArea.innerHTML = `
        <div class="final-results">
            <h2>🎊 Parabéns! Quiz Concluído!</h2>
            <div class="results-summary">
                <div class="result-stat">
                    <div class="result-number">${currentScore}</div>
                    <div class="result-label">Pontos Totais</div>
                </div>
                <div class="result-stat">
                    <div class="result-number">${accuracy}%</div>
                    <div class="result-label">Precisão</div>
                </div>
                <div class="result-stat">
                    <div class="result-number">${userStats.streakRecord}</div>
                    <div class="result-label">Melhor Sequência</div>
                </div>
            </div>
            <div class="final-actions">
                <button class="btn" onclick="restartQuiz()">🔄 Novo Quiz</button>
                <button class="btn" onclick="goBack()">🏠 Voltar</button>
            </div>
        </div>
    `;
}

function restartQuiz() {
    questionNumber = 0;
    currentScore = 0;
    currentStreak = 0;
    loadQuestion();
    updateStats();
}

// Funcionalidades extras
function startSpeedRound() {
    alert('🚧 Em desenvolvimento! Rodada rápida chegando em breve!');
}

function startDailyChallenge() {
    alert('🚧 Em desenvolvimento! Desafio diário chegando em breve!');
}

function reviewMistakes() {
    alert('🚧 Em desenvolvimento! Revisão de erros chegando em breve!');
}

// Navegação
function goBack() {
    window.location.href = 'index.html';
}

// Utilitários
function handleEnter(event, type) {
    if (event.key === 'Enter') {
        if (type === 'conjugacao') {
            checkConjugacao();
        } else if (type === 'ortografia') {
            checkOrtografia();
        }
    }
}

async function enviarMensagem() {
  const input = document.getElementById("mensagem");
  const texto = input.value;

  const response = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensagem: texto })
  });

  const data = await response.json();
  document.getElementById("resposta").innerText = data.resposta;
}
