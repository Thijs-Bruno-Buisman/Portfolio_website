import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Send, Settings, X } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

const STORAGE_KEY = 'hu_portfolio_gemini_api_key';
const MODEL = 'gemini-3.6-flash';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '');
  const [draftKey, setDraftKey] = useState(apiKey);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hoi! Ik ben de portfolio-assistent. Stel een vraag over je leeruitkomsten, sprints of bewijsstukken.' },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveApiKey = () => {
    const trimmedKey = draftKey.trim();
    setApiKey(trimmedKey);
    if (trimmedKey) localStorage.setItem(STORAGE_KEY, trimmedKey);
    else localStorage.removeItem(STORAGE_KEY);
    setIsSettingsOpen(false);
    setError('');
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      setError('Voer eerst je Gemini API-key in bij de instellingen.');
      return;
    }

    const nextMessages = [...messages, { role: 'user' as const, text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: 'Je bent een behulpzame, beknopte Nederlandstalige assistent voor een studentenportfolio van de HU minor Future-proof met AI. Geef praktische feedback en verzin geen portfoliofeiten.' }] },
            contents: nextMessages.map((message) => ({ role: message.role, parts: [{ text: message.text }] })),
            generationConfig: { temperature: 0.7, maxOutputTokens: 700 },
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Gemini kon geen antwoord geven.');
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!answer) throw new Error('Gemini stuurde geen tekst terug.');
      setMessages((current) => [...current, { role: 'model', text: answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Er ging iets mis bij Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <section className="fixed bottom-20 right-4 z-40 flex h-[min(560px,calc(100vh-6rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500"><Bot className="h-4 w-4" /></span><div><h2 className="text-sm font-bold">Portfolio-assistent</h2><p className="text-[11px] text-slate-300">Gemini • lokaal ingesteld</p></div></div>
            <div className="flex items-center gap-1"><button onClick={() => setIsSettingsOpen((open) => !open)} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white" title="API-key instellen"><Settings className="h-4 w-4" /></button><button onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white" title="Chat sluiten"><X className="h-4 w-4" /></button></div>
          </header>

          {isSettingsOpen && <div className="border-b border-slate-200 bg-slate-50 p-3"><label className="mb-1 block text-xs font-semibold text-slate-700" htmlFor="gemini-key">Gemini API-key</label><div className="flex gap-2"><input id="gemini-key" type="password" value={draftKey} onChange={(event) => setDraftKey(event.target.value)} placeholder="Plak je key hier" className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-emerald-500" /><button onClick={saveApiKey} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Opslaan</button></div><p className="mt-2 text-[11px] leading-4 text-slate-500">De key blijft alleen in deze browser en wordt niet naar Git opgeslagen.</p></div>}

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-5 ${message.role === 'user' ? 'rounded-br-md bg-emerald-600 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>{message.text}</div></div>)}{isLoading && <div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Even nadenken...</div>}{error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs leading-4 text-rose-700">{error}</p>}<div ref={messagesEndRef} /></div>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-slate-200 bg-white p-3"><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Stel een vraag..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:bg-white" aria-label="Bericht" /><button type="submit" disabled={isLoading || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40" title="Bericht versturen"><Send className="h-4 w-4" /></button></form>
        </section>
      )}
      <button onClick={() => setIsOpen((open) => !open)} className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition hover:scale-105 hover:bg-emerald-700" title="Portfolio-assistent openen" aria-label="Portfolio-assistent openen">{isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}</button>
      {!apiKey && !isOpen && <span className="fixed bottom-5 right-[4.25rem] z-40 rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg">API-key instellen</span>}
    </>
  );
}