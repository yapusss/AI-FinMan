
import React, { useState, useRef, useEffect } from 'react';
import Page from '../components/layout/Page';
import { useData } from '../contexts/DataContext';
import { getFinancialAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const AIChatPage: React.FC = () => {
  const { transactions } = useData();
  const { accent } = useTheme();
  const location = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const handleInitialAnalysis = async () => {
      const prompt = "Analisis pengeluaran bulan ini. Identifikasi pemborosan dan berikan saran efisiensi. Hitung berapa yang bisa saya tabung jika tidak boros.";
      setMessages([{ sender: 'user', text: prompt }]);
      setIsLoading(true);
      try {
        const aiResponse = await getFinancialAdvice(transactions, prompt);
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Maaf, terjadi kesalahan.' }]);
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    if (location.state?.analyze) {
        handleInitialAnalysis();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getFinancialAdvice(transactions, input);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Maaf, terjadi kesalahan.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickPrompts = [
      "Analisis pemborosan bulan ini",
      "Prioritaskan kebutuhan & keinginan saya",
      "Beri saya tips menabung efektif"
  ];

  return (
    <Page title="Konsultasi AI">
      <div className="flex flex-col h-[calc(100vh-150px)]">
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {messages.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                  <p className="mb-4">Tanyakan apapun tentang keuangan Anda. Coba salah satu prompt di bawah ini:</p>
                  <div className="flex flex-col items-center gap-2">
                      {quickPrompts.map(prompt => (
                          <button key={prompt} onClick={() => setInput(prompt)} className="w-full max-w-xs text-left p-2 rounded-lg bg-light-card dark:bg-dark-card border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                              {prompt}
                          </button>
                      ))}
                  </div>
              </div>
          )}
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.sender === 'user' ? `bg-gradient-to-r ${accent.gradient} text-white` : 'bg-light-card dark:bg-dark-card'}`}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs p-3 rounded-lg bg-light-card dark:bg-dark-card">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-grow p-3 rounded-full bg-light-card dark:bg-dark-card border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
          />
          <button type="submit" className={`p-3 rounded-full text-white bg-gradient-to-r ${accent.gradient} disabled:opacity-50`} disabled={isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </Page>
  );
};

export default AIChatPage;
