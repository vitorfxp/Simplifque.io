// Base de dados para vocabulário
const vocabulary = [
    {word: "Efêmero", meaning: "Que dura pouco tempo"},
    {word: "Serendipidade", meaning: "Descoberta feliz por acaso"},
    {word: "Melancolia", meaning: "Tristeza vaga e permanente"},
    {word: "Perspicaz", meaning: "Que tem visão penetrante"},
    {word: "Eloquente", meaning: "Que fala com facilidade"},
    {word: "Benevolente", meaning: "Que demonstra bondade"},
    {word: "Magnânimo", meaning: "Generoso, nobre de caráter"},
    {word: "Cordial", meaning: "Afetuoso, gentil"},
    {word: "Austero", meaning: "Simples, sem luxo"},
    {word: "Pragmático", meaning: "Prático, objetivo"},
    {word: "Sublime", meaning: "Elevado, majestoso"},
    {word: "Peculiar", meaning: "Característico, singular"},
    {word: "Altruísta", meaning: "Que se dedica ao bem dos outros"},
    {word: "Resiliente", meaning: "Que tem capacidade de recuperação"},
    {word: "Enigmático", meaning: "Misterioso, de difícil compreensão"}
];

// Inicialização
window.onload = function() {
    loadNewVocabulary();
};

// Vocabulário
function loadNewVocabulary() {
    const vocabularyList = document.getElementById('vocabulary-list');
    vocabularyList.innerHTML = '';
    
    // Seleciona 6 palavras aleatórias
    const shuffled = vocabulary.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);
    
    selected.forEach(item => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word-item';
        wordDiv.innerHTML = `
            <div class="word">${item.word}</div>
            <div class="meaning">${item.meaning}</div>
        `;
        vocabularyList.appendChild(wordDiv);
    });
}

// Navegação para página de quizzes
function goToQuizzes() {
    window.location.href = 'quizzes.html';
}