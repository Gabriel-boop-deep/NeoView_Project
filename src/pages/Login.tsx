
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeoLogo } from '@/components/NeoLogo';
import { User as UserIcon, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(''); // trocado de email -> username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple mock authentication
    setTimeout(() => {
      if (username && password) {
        localStorage.setItem('neoview_auth', 'true');
        navigate('/dashboard');
      } else {
        setError('Por favor, preencha todos os campos.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block">
            <NeoLogo size="lg" />
          </div>
          <p className="mt-4 text-muted-foreground">
            Entre para acessar a plataforma
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-card border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Usuário Field (substitui o campo E-mail) */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Usuário
              </label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  placeholder="Ex: U123456"
                  className="search-input pl-12"
                  autoComplete="username"
                  inputMode="text"
                  spellCheck={false}
                  autoCapitalize="off"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="search-input pl-12"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            ← Voltar para a página inicial
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
