import Link from "next/link"
import { useState, useEffect, useRef, KeyboardEvent } from "react"
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa'

// Define types for messages
type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function FloatingIcons() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome to WTL Tourism! How can I help you today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      inputRef.current?.focus()
    }
  }, [isChatOpen])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent form submission
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage) return
    
    const userMessage: Message = { role: 'user', content: trimmedMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    
    try {
      // Create a copy of the messages array to include the new user message
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }))
  
      // Call your API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Instead of throwing an error, provide a fallback response
        if (data.code === 402) {
          // Add a fallback response instead of throwing an error
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "I'm currently experiencing high demand. Let me provide a simple response instead. How can I help you with WTL Tourism services today?"
          }]);
          return; // Exit the function early
        }
        
        // For other errors, still throw
        throw new Error('Sorry, I encountered an error. Please try again later.');
      }
      
      if (data?.content) {
        const botResponse: Message = { 
          role: 'assistant', 
          content: data.content
        };
        
        setMessages(prev => [...prev, botResponse]);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error: any) {
      console.error('Error calling chat API:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error.message || 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Call + Chatbot Icons (bottom-left) */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-4 items-start">
        <Link 
          href="tel:+919730545491"
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          aria-label="Call us"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        </Link>

        {/* Chatbot Icon */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center relative"
          aria-label="Open Chatbot"
        >
          <FaRobot className="w-6 h-6" />
          {!isChatOpen && messages.length > 1 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  aria-label={`${messages.length - 1} unread messages`}>
              {messages.length - 1}
            </span>
          )}
        </button>
      </div>
      
      {/* Chatbot Interface */}
      {isChatOpen && (
        <div className="fixed bottom-24 left-6 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
          {/* Chat Header */}
          <div className="bg-purple-600 text-white p-3 flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-medium">WTL Tourism Assistant</h3>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block p-3 rounded-lg ${message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'}`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-gray-200 text-gray-800">
                  <FaSpinner className="animate-spin" aria-label="Loading..." />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Message input"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-purple-600 text-white p-2 rounded-r-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Play Store + WhatsApp Icons (bottom-right) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        {/* Play Store Icon */}
        <Link 
          href="https://play.google.com/store/apps/details?id=com.yourcompany.worldtriplink&hl=en"
          target="_blank"
          className="bg-white text-green-500 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
          aria-label="Get the app on Google Play"
        >
          <img
            src="/images/play_store.jpg"
            alt="Google Play"
            className="w-6 h-6 object-contain"
          />
        </Link>

        {/* WhatsApp Icon */}
        <Link 
          href="https://wa.me/919730545491" 
          target="_blank"
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </Link>
      </div>

    </>
  )
}