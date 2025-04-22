<template>
  <div class="chatbot-container">
    <!-- Chatbot Icon with Neon Effect -->
    <div class="chatbot-icon" @click="toggleChat" v-if="!isChatOpen">
      <span class="chat-icon">🤖</span>
    </div>

    <div class="chatbot-window" v-if="isChatOpen">
      <div class="chatbot-header">
        <h3>CampusHire Assistant</h3>
        <button class="close-btn" @click="toggleChat">×</button>
      </div>

      <div class="chatbot-messages" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message', msg.sender === 'bot' ? 'bot-message' : 'user-message']"
        >
          <div class="message-content">{{ msg.text }}</div>
        </div>
        <div v-if="isLoading" class="message bot-message">
          <div class="message-content typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div class="chatbot-input">
        <input
          type="text"
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Ask a question..."
          :disabled="isLoading"
        />
        <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      isChatOpen: false,
      userInput: '',
      messages: [
        {
          text: "Hi there! I'm your CampusHire assistant. How can I help you today?",
          sender: 'bot',
        },
      ],
      isLoading: false,
    }
  },
  methods: {
    toggleChat() {
      this.isChatOpen = !this.isChatOpen
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return

      const userMessage = this.userInput.trim()
      this.messages.push({ text: userMessage, sender: 'user' })
      this.userInput = ''
      this.isLoading = true

      try {
        const response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB3oYmnUf1M3LsnhMS2RuRLS_tz_FUqAJY',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: userMessage }] }],
            }),
          },
        )

        const data = await response.json()

        if (data?.candidates?.length > 0) {
          const candidate = data.candidates[0]

          const formattedResponse = {
            sender: 'bot',
            text:
              candidate.content?.parts
                ?.map((part) => part.text.replace(/\*/g, '').trim()) // Remove asterisks
                .join('\n') || 'No content available',
          }

          this.messages.push(formattedResponse)
        } else {
          console.error('No valid response from Gemini', JSON.stringify(data, null, 2))
          throw new Error('No response from Gemini')
        }
      } catch (error) {
        console.error('Chatbot error:', error)
        this.messages.push({
          text: 'I seem to be having trouble connecting. Please try again later.',
          sender: 'bot',
        })
      } finally {
        this.isLoading = false
        this.$nextTick(() => this.scrollToBottom())
      }
    },
    scrollToBottom() {
      if (this.$refs.messagesContainer) {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      }
    },
  },
}
</script>

<style scoped>
.chatbot-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* Chatbot Icon with Neon Glow Effect */
.chatbot-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4caf50;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 0 5px #00f, 0 0 10px #00f, 0 0 15px #00f;
  transition: transform 0.3s ease;
}

.chatbot-icon:hover {
  transform: scale(1.1);
}

.chat-icon {
  font-size: 24px;
  color: white;
  text-shadow: 0 0 5px #00f, 0 0 10px #00f, 0 0 15px #00f;
}

/* Chatbot Window Styles */
.chatbot-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #4caf50;
  color: white;
}

.chatbot-header h3 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.chatbot-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 10px 15px;
  border-radius: 18px;
  margin-bottom: 5px;
}

.bot-message {
  align-self: flex-start;
  background-color: #f1f1f1;
}

.user-message {
  align-self: flex-end;
  background-color: #4caf50;
  color: white;
}

.chatbot-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.chatbot-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 10px;
  outline: none;
}

.chatbot-input button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
}

.chatbot-input button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.typing {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
}

.typing span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #777;
  border-radius: 50%;
  margin: 0 2px;
  animation: typing 1s infinite ease-in-out;
}

.typing span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
</style>