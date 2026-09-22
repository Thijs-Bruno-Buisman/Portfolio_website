import React, { useState } from 'react';
import { loginWithGoogle } from '../lib/supabase';
import { ShieldCheck, AlertCircle, X, Terminal } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setError(
        'Inloggen met Google kon niet worden gestart. Controleer de Supabase- en Google-instellingen.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/85 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white border border-[#050505] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1F1F1F] flex items-start justify-between bg-[#050505] text-white">
          <div className="flex items-center gap-3 font-mono">
            <div className="w-8 h-8 bg-[#E32636] text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">BEHEERDERSTOEGANG // AUTH</h3>
              <p className="text-[10px] text-[#D5D5D0] uppercase">Inloggen als portfolio-eigenaar</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-[#D5D5D0] hover:text-[#E32636] transition-colors cursor-pointer"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-[#F4F3EF] border-l-2 border-[#050505] text-xs font-mono text-[#050505] leading-relaxed">
            <strong>DOCUMENTATIE VOOR BEOORDELAARS:</strong> Docenten en assessoren hebben geen account nodig. Alle opgeslagen sprints, links en documenten zijn direct zichtbaar in de beveiligde leesmodus.
          </div>

          {error && (
            <div className="p-3 bg-[#050505] border border-[#E32636] text-xs font-mono text-[#E32636] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isLoading ? 'BEZIG MET VERIFIËREN...' : 'INLOGGEN MET GOOGLE'}</span>
          </button>

          <p className="font-mono text-[11px] leading-relaxed text-[#6B6B6B]">
            Alleen het Google-account dat in Supabase als portfolio-eigenaar is geconfigureerd krijgt beheerdersrechten.
          </p>
        </div>
      </div>
    </div>
  );
};
