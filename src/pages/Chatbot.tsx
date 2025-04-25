
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import StarField from '@/components/ui/StarField';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGroqChat } from '@/hooks/useGroqChat';
import { getAstronomyPictureOfDay, searchNasaImages, NasaImage } from '@/lib/nasa';
import { NasaImageCard } from '@/components/chat/NasaImageCard';

interface Message {
  type: 'bot' | 'user';
  content: string;
  images?: NasaImage[];
}

const Chatbot = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: "Hello! I'm your SolarSentinel AI assistant. You can ask me about space weather, or try these commands:\n• 'show me today's space photo'\n• 'show me solar flares'\n• 'tell me about auroras'" 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading } = useGroqChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processCommand = async (text: string): Promise<Message | null> => {
    const normalizedText = text.toLowerCase();
    
    try {
      // Handle APOD request
      if (normalizedText.includes("today's space photo") || normalizedText.includes("astronomy picture")) {
        const apod = await getAstronomyPictureOfDay();
        return {
          type: 'bot',
          content: "Here's today's Astronomy Picture of the Day from NASA:",
          images: [apod]
        };
      }
      
      // Handle image search requests
      if (normalizedText.includes("show me") || normalizedText.includes("search for")) {
        let searchTerm = "";
        if (normalizedText.includes("solar flare")) searchTerm = "solar flare";
        else if (normalizedText.includes("aurora")) searchTerm = "aurora borealis";
        else if (normalizedText.includes("galaxy")) searchTerm = "galaxy";
        else if (normalizedText.includes("nebula")) searchTerm = "nebula";
        
        if (searchTerm) {
          const images = await searchNasaImages(searchTerm);
          return {
            type: 'bot',
            content: `Here are some NASA images related to "${searchTerm}":`,
            images
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error processing command:', error);
      return {
        type: 'bot',
        content: "I apologize, but I encountered an error while fetching the images. Please try again later."
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    const userMessage = { type: 'user' as const, content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    try {
      // First, check if it's a special command
      const commandResponse = await processCommand(userMessage.content);
      if (commandResponse) {
        setMessages(prev => [...prev, commandResponse]);
      } else {
        // If not a command, process with Groq
        const groqMessages = messages.map(msg => ({
          role: msg.type,
          content: msg.content
        }));
        groqMessages.push({ role: 'user', content: userMessage.content });
        
        const response = await sendMessage(groqMessages);
        if (response) {
          setMessages(prev => [...prev, { type: 'bot', content: response }]);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        type: 'bot',
        content: "I apologize, but I encountered an error. Please try again."
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-space">
      <Navbar />
      <StarField />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/" className="text-space-muted hover:text-white flex items-center gap-2 mb-4 transition-colors">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">AI Space Weather Assistant</h1>
            <p className="text-xl text-space-muted">
              Ask questions about space weather or request NASA images.
            </p>
          </div>
          
          <div className="glass-card p-6 rounded-xl min-h-[600px] flex flex-col">
            <div className="flex items-center border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-full bg-space-accent flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <div className="ml-3">
                <h2 className="font-bold text-white">SolarSentinel AI</h2>
                <p className="text-xs text-space-muted">Powered by NASA data</p>
              </div>
              <div className="ml-auto flex items-center">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto py-6 space-y-6">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.type === 'bot' ? '' : 'justify-end'} space-y-4`}
                >
                  <div className="flex max-w-[80%] gap-3">
                    {message.type === 'bot' && (
                      <div className="w-10 h-10 rounded-full bg-space-accent/20 flex items-center justify-center self-start mt-1">
                        <Bot size={20} className="text-space-accent" />
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div 
                        className={`rounded-xl px-4 py-3 ${
                          message.type === 'bot' 
                            ? 'bg-space-blue/30 text-white' 
                            : 'bg-space-accent text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.images && (
                        <div className="space-y-4 mt-4">
                          {message.images.map((image, imgIndex) => (
                            <NasaImageCard key={imgIndex} image={image} />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {message.type === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-space-blue/40 flex items-center justify-center self-start mt-1">
                        <User size={20} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="mt-4 border-t border-white/10 pt-4 flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about space weather or request NASA images..."
                className="flex-grow px-4 py-3 bg-space-blue/20 rounded-l-lg border border-white/10 text-white focus:outline-none focus:border-space-accent"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className={`px-4 py-3 bg-space-accent text-white rounded-r-lg transition-colors duration-200 ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-600'
                }`}
                disabled={isProcessing}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Chatbot;
