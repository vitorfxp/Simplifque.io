async function enviarMensagem(texto){
  const r = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ mensagem: texto })
  });
  const data = await r.json();
  return data.resposta;
}

// Função para enviar mensagens para a OpenAI via sua API
async function enviarMensagem(texto) {
    try {
        // Validação básica
        if (!texto || texto.trim() === '') {
            throw new Error('Mensagem não pode estar vazia');
        }

        // Mostra loading (opcional)
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }

        // Requisição para sua API
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: texto.trim()
            })
        });

        // Verifica se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        
        // Esconde loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // Retorna a resposta da IA
        return data.response || data.resposta || 'Resposta não encontrada';

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        
        // Esconde loading em caso de erro
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        // Retorna mensagem de erro amigável
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return 'Erro: Não foi possível conectar com o servidor. Verifique se a API está rodando.';
        } else if (error.message.includes('HTTP: 500')) {
            return 'Erro interno do servidor. Tente novamente em alguns segundos.';
        } else {
            return `Erro: ${error.message}`;
        }
    }
}

// Função para criar interface de chat (opcional)
function criarInterfaceChat(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Elemento com ID '${containerId}' não encontrado`);
        return;
    }

    container.innerHTML = `
        <div class="chat-container" style="border: 1px solid #ddd; border-radius: 8px; padding: 20px; max-width: 600px; margin: 0 auto;">
            <div id="chat-messages" style="height: 300px; overflow-y: auto; border: 1px solid #eee; padding: 10px; margin-bottom: 10px; background-color: #f9f9f9;"></div>
            <div style="display: flex; gap: 10px;">
                <input type="text" id="message-input" placeholder="Digite sua mensagem..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                <button onclick="enviarEProcessarMensagem()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Enviar</button>
            </div>
            <div id="loading" style="display: none; text-align: center; margin-top: 10px; color: #666;">Processando...</div>
        </div>
    `;
}

// Função para processar mensagem e exibir na interface
async function enviarEProcessarMensagem() {
    const input = document.getElementById('message-input');
    const messagesDiv = document.getElementById('chat-messages');
    
    if (!input || !messagesDiv) {
        console.error('Elementos de interface não encontrados');
        return;
    }

    const mensagem = input.value.trim();
    if (!mensagem) {
        alert('Por favor, digite uma mensagem');
        return;
    }

    // Adiciona mensagem do usuário
    adicionarMensagem('Você', mensagem, 'user');
    
    // Limpa input
    input.value = '';
    
    // Envia para IA e recebe resposta
    const resposta = await enviarMensagem(mensagem);
    
    // Adiciona resposta da IA
    adicionarMensagem('IA', resposta, 'ai');
}

// Função auxiliar para adicionar mensagens na interface
function adicionarMensagem(remetente, texto, tipo) {
    const messagesDiv = document.getElementById('chat-messages');
    if (!messagesDiv) return;

    const messageDiv = document.createElement('div');
    messageDiv.style.marginBottom = '10px';
    messageDiv.style.padding = '8px';
    messageDiv.style.borderRadius = '4px';
    
    if (tipo === 'user') {
        messageDiv.style.backgroundColor = '#e3f2fd';
        messageDiv.style.textAlign = 'right';
    } else {
        messageDiv.style.backgroundColor = '#f1f8e9';
        messageDiv.style.textAlign = 'left';
    }

    messageDiv.innerHTML = `<strong>${remetente}:</strong> ${texto}`;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Permite enviar mensagem com Enter
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('message-input');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                enviarEProcessarMensagem();
            }
        });
    }
});

const resposta = await enviarMensagem("Sua pergunta aqui");
console.log(resposta);

criarInterfaceChat('seu-container-id');