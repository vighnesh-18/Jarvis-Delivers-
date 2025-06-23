import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useCart, useAddress } from '../context/AppContext';
import { chatAPI } from '../utils/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Load messages from localStorage or use default welcome message
  const loadMessagesFromStorage = () => {
    try {
      const savedMessages = localStorage.getItem('jarvis-chat-history');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    
    // Default welcome message
    return [
      {
        id: "1",
        type: 'bot',
        content: "Hey there! 👋 I'm Jarvis, your personal food assistant. Tell me what you're craving, your budget, or how you're feeling - I'll find the perfect meal for you!",
        timestamp: new Date()
      }
    ];
  };

  // Check if checkout has already been shown in saved messages
  const checkIfCheckoutShownInStorage = () => {
    try {
      const savedMessages = localStorage.getItem('jarvis-chat-history');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        return parsed.some(msg => 
          msg.type === 'bot' && msg.actionRequired?.type === 'checkout'
        );
      }
    } catch (error) {
      console.error('Error checking checkout state:', error);
    }
    return false;
  };

  const [messages, setMessages] = useState(loadMessagesFromStorage);
  const [inputMessage, setInputMessage] = useState('');
  
  // Use a ref to track if checkout prompt has been shown in current session
  // This persists across renders and updates immediately
  const checkoutShownRef = useRef(checkIfCheckoutShownInStorage());
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { authState } = useAuth();
  const { cartState, cartDispatch } = useCart();
  const { addressState } = useAddress();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);// Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem('jarvis-chat-history', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Debug cart state changes
  useEffect(() => {
    console.log('Cart state changed:', cartState);
    console.log('Cart items:', cartState.items);
  }, [cartState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;    const userMessage = {
      id: String(Date.now()),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);
    setIsTyping(true);    try {
      console.log('Sending chat request:', userMessage.content);
      
      // Call the AI agent crew API
      const response = await chatAPI.processQuery({
        message: userMessage.content,
        userAddress: addressState.selectedAddress,
        userId: authState.user?.id,
        conversationHistory: messages.slice(-5).map(msg => ({
          id: msg.id,
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content,
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString()
        }))
      });

      console.log('Chat API response:', response);
      console.log('Response data:', response.data);      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        
        const botMessage = {
          id: String(Date.now() + 1),
          type: 'bot',
          content: response.data?.message || response.data?.response || response.message || response.response || "I received your message, but couldn't process it properly. Please try again!",
          timestamp: new Date(),
          recommendations: response.data?.recommendations || response.recommendations || [],
          actionRequired: response.data?.actionRequired || response.actionRequired || null
        };

        setMessages(prev => [...prev, botMessage]);
        setIsProcessing(false);
      }, 1500);

    } catch (error) {
      console.error('Chat error:', error);
      setIsTyping(false);
      
      // Always show an error response in the chat
      const errorMessage = {
        id: String(Date.now() + 1),
        type: 'bot',
        content: "I'm having trouble processing your request right now. Here are some great food options I can recommend:",
        timestamp: new Date(),
        recommendations: [
          {
            id: "1",
            name: "Margherita Pizza",
            price: 12.99,
            restaurant: "Pizza Paradise",
            description: "Classic Italian pizza with fresh mozzarella, tomato sauce, and basil leaves on a crispy wood-fired crust."
          },
          {
            id: "2", 
            name: "Chicken Tikka Masala",
            price: 16.99,
            restaurant: "Spice Garden",
            description: "Tender chicken pieces marinated in yogurt and spices, cooked in a rich, creamy tomato-based curry sauce."
          },
          {
            id: "3",
            name: "California Roll",
            price: 8.99,
            restaurant: "Sushi Zen", 
            description: "Crab, avocado and cucumber rolled in rice and nori, topped with sesame seeds."
          }
        ],
        actionRequired: null
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };  const handleRecommendationAction = async (action, recommendation) => {
    if (action === 'add_to_cart') {
      try {
        console.log('=== ADD TO CART DEBUG ===');
        console.log('Checkout shown ref value:', checkoutShownRef.current);
        
        // Add to cart via context with correct structure
        const cartItem = {
          _id: recommendation.id,
          name: recommendation.name,
          price: recommendation.price,
          restaurant: typeof recommendation.restaurant === 'object' 
            ? recommendation.restaurant.name 
            : recommendation.restaurant,
          description: recommendation.description || '',
          quantity: 1
        };
        
        console.log('Adding item to cart:', cartItem);
        
        cartDispatch({
          type: 'ADD_TO_CART',
          payload: cartItem
        });

        let confirmMessage;
        
        if (!checkoutShownRef.current) {
          // No checkout prompt shown yet - show one and mark as shown
          checkoutShownRef.current = true;
          confirmMessage = {
            id: String(Date.now()),
            type: 'bot',
            content: `Awesome! I've added ${recommendation.name} to your cart. Ready to checkout? 🛒✨`,
            timestamp: new Date(),
            actionRequired: {
              type: 'checkout',
              message: 'Proceed to checkout?'
            }
          };
          console.log('Showing checkout prompt for the first time');
        } else {
          // Already shown checkout prompt - just confirm addition
          confirmMessage = {
            id: String(Date.now()),
            type: 'bot',
            content: `Great! Added ${recommendation.name} to your cart! 🛒`,
            timestamp: new Date()
          };
          console.log('Checkout already shown, just confirming item addition');
        }

        setMessages(prev => [...prev, confirmMessage]);
      } catch (error) {
        console.error('Add to cart error:', error);
        
        const errorMessage = {
          id: String(Date.now()),
          type: 'bot',
          content: `Sorry, there was an issue adding ${recommendation.name} to your cart. Please try again!`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    }
  };  const clearChatHistory = () => {
    const defaultMessage = {
      id: "1",
      type: 'bot',
      content: "Hey there! 👋 I'm Jarvis, your personal food assistant. Tell me what you're craving, your budget, or how you're feeling - I'll find the perfect meal for you!",
      timestamp: new Date()
    };
    setMessages([defaultMessage]);
    localStorage.removeItem('jarvis-chat-history');
    // Reset checkout shown flag when clearing chat
    checkoutShownRef.current = false;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full text-white font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '3px solid rgba(255,255,255,0.3)'
          }}
        >
          <span className="relative z-10">🤖</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Notification pulse */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      </div>

      {/* Chat Panel */}
      <div 
        className={`fixed bottom-0 right-0 w-full md:w-1/2 lg:w-2/5 h-full md:h-4/5 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          borderTopLeftRadius: '20px',
          borderTopRightRadius: isOpen ? '0' : '20px'
        }}
      >        {/* Chat Header */}
        <div 
          className="flex items-center justify-between p-4 text-white font-bold"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderTopLeftRadius: '20px'
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>            <div>
              <h3 className="font-bold">Jarvis AI</h3>
              <p className="text-sm opacity-90">Your Food Assistant</p>
              {cartState.items.length > 0 && (
                <p className="text-xs bg-green-500 rounded-full px-2 py-1 inline-block mt-1">
                  🛒 {cartState.items.length} items in cart
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={clearChatHistory}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-xs"
              title="Clear Chat History"
            >
              🗑️
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              ✕
            </button>
          </div>
        </div>        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Message bubble */}                <div
                  className="px-4 py-3 rounded-2xl shadow-lg"
                  style={{
                    background: message.type === 'user' 
                      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontWeight: '500',
                    color: message.type === 'user' ? '#ffffff' : '#374151',
                    margin: 0
                  }}>{message.content}</p>{/* Timestamp */}
                  <p style={{
                    fontSize: '12px',
                    marginTop: '8px',
                    color: message.type === 'user' ? 'rgba(255,255,255,0.8)' : '#6b7280',
                    margin: '8px 0 0 0'
                  }}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>                {/* Recommendations */}
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.recommendations.map((rec, index) => (
                      <div key={index} className="bg-white p-3 rounded-xl shadow-sm border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-800">{rec.name}</h4>
                          <span className="text-green-600 font-bold">${rec.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.restaurant?.name || rec.restaurant}</p>
                        <p className="text-xs text-gray-500 mb-3">{rec.description}</p>                        <button
                          onClick={() => handleRecommendationAction('add_to_cart', rec)}
                          className="w-full text-white px-3 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                            border: 'none',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          Add to Cart 🛒
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Required */}
                {message.actionRequired && (
                  <div className="mt-3">                    <button
                      className="text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                      onClick={() => {
                        if (message.actionRequired.type === 'checkout') {
                          console.log('Navigating to checkout...');
                          navigate('/checkout');
                        }
                      }}
                    >
                      {message.actionRequired.message}
                    </button>
                  </div>                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-2xl shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tell me what you're craving..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            />            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              className="px-6 py-3 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              style={{
                background: !inputMessage.trim() || isProcessing 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                border: 'none',
                boxShadow: !inputMessage.trim() || isProcessing 
                  ? 'none' 
                  : '0 4px 15px rgba(139, 92, 246, 0.3)'
              }}
            >
              {isProcessing ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChatBot;
