import { FormEvent, useEffect, useRef, useState } from 'react';
import { Loader2, Send, X, Terminal } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

const API_KEY = import.meta.env.GEMINI_API_KEY?.trim();
const MODEL = 'gemini-3.6-flash';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'RESEARCH ASSISTANT // ONLINE\nStel een vraag over de minor, sprints, competenties of evaluatie-eisen.' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    if (!API_KEY) {
      setError('GEMINI_API_KEY ontbreekt in .env. Voeg de sleutel toe en herstart de applicatie.');
      return;
    }

    const nextMessages = [...messages, { role: 'user' as const, text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(API_KEY)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: 'Je bent een beknopte, wetenschappelijke en Nederlandstalige assistent voor het AI-minorportfolio van Thijs Buisman (HU). Beantwoord vragen direct, accuraat en zakelijk zonder decoratieve metaforen.' }] },
            contents: nextMessages.map((message) => ({ role: message.role, parts: [{ text: message.text }] })),
            generationConfig: { temperature: 0.5, maxOutputTokens: 700 },
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Gemini kon geen antwoord geven.');
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!answer) throw new Error('Geen antwoord ontvangen van het model.');
      setMessages((current) => [...current, { role: 'model', text: answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Communicatiefout met Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <section 
          aria-label="Research Console Chatbot"
          className="fixed bottom-20 right-4 sm:right-6 z-40 flex h-[min(560px,calc(100vh-6rem))] w-[min(420px,calc(100vw-2rem))] flex-col bg-white border border-[#050505] shadow-2xl"
        >
          {/* Terminal Header */}
          <header className="flex items-center justify-between bg-[#050505] px-4 py-3 text-white border-b border-[#1F1F1F]">
            <div className="flex items-center gap-2.5 font-mono">
              <Terminal className="h-4 w-4 text-[#E32636]" />
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-white">RESEARCH ASSISTANT</h2>
                <p className="text-[10px] text-[#6B6B6B] uppercase tracking-wide">GEMINI-3.6-FLASH // HU AI LAB</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 text-[#D5D5D0] hover:text-[#E32636] transition-colors cursor-pointer" 
              title="Console sluiten"
              aria-label="Console sluiten"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* Messages Stream */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F4F3EF] p-4 text-xs">
            {messages.map((message, index) => (
              <div 
                key={`${message.role}-${index}`} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[88%] p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    message.role === 'user' 
                      ? 'bg-[#050505] text-white font-mono border border-[#050505]' 
                      : 'bg-white text-[#050505] border border-[#D5D5D0]'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 font-mono text-xs text-[#6B6B6B]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#E32636]" />
                <span>QUERY VERWERKEN...</span>
              </div>
            )}
            {error && (
              <p className="p-2.5 bg-[#050505] border border-[#E32636] font-mono text-xs text-[#E32636]">
                [FOUT] {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="flex border-t border-[#D5D5D0] bg-white p-2.5 gap-2">
            <input 
              value={input} 
              onChange={(event) => setInput(event.target.value)} 
              placeholder="Stel een vraag over dossiers, doelen of sprints..." 
              className="min-w-0 flex-1 border border-[#D5D5D0] bg-[#F4F3EF] px-3 py-2 text-xs font-mono outline-none focus:border-[#050505] focus:bg-white text-[#050505]" 
              aria-label="Prompt invoeren" 
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#050505] text-white hover:bg-[#E32636] transition-colors disabled:opacity-40 cursor-pointer" 
              title="Versturen"
              aria-label="Versturen"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </section>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen((open) => !open)} 
        className="fixed bottom-5 right-5 z-40 bg-[#050505] hover:bg-[#E32636] text-white border border-[#1F1F1F] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg" 
        title="Onderzoeksassistent openen" 
        aria-label="Onderzoeksassistent openen"
      >
        <Terminal className="h-3.5 w-3.5 text-[#E32636] group-hover:text-white" />
        <span>{isOpen ? '[ SLUITEN ]' : '[ AI CONSOLE ]'}</span>
      </button>
    </>
  );
}
