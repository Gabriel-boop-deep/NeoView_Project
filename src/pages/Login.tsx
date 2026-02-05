
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NeoLogo } from '@/components/NeoLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { User as UserIcon, Lock, AlertCircle, Loader2 } from 'lucide-react';

/**
 * ============================================================
 * PAGE: Login
 * ============================================================
 * 
 * Página de login preparada para integração com SAP HANA.
 * A autenticação será feita via requisição Python que valida
 * as credenciais contra o SAP HANA.
 * 
 * INTEGRAÇÃO BACKEND (Python):
 * ```python
 * # Endpoint: POST /api/auth/login
 * # Body: { "username": "U123456", "password": "xxx" }
 * 
 * import hdbcli.dbapi
 * 
 * def authenticate_user(username: str, password: str) -> dict:
 *     conn = hdbcli.dbapi.connect(
 *         address="<HANA_HOST>",
 *         port=30015,
 *         user="SYSTEM",
 *         password="<HANA_PASSWORD>"
 *     )
 *     cursor = conn.cursor()
 *     cursor.execute(
 *         "SELECT * FROM NEOVIEW.T_USERS WHERE username = ? AND is_active = TRUE",
 *         (username,)
 *     )
 *     user = cursor.fetchone()
 *     
 *     if user and verify_password(password, user.password_hash):
 *         return {
 *             "success": True,
 *             "token": generate_jwt(user),
 *             "user": { ... }
 *         }
 *     return { "success": False, "error": "Credenciais inválidas" }
 * ```
 * ============================================================
 */

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handler de submit preparado para integração com SAP HANA via Python.
   * 
   * Em produção, substituir o mock por:
   * ```typescript
   * const response = await fetch('/api/auth/login', {
   *   method: 'POST',
   *   headers: { 'Content-Type': 'application/json' },
   *   body: JSON.stringify({ username, password }),
   * });
   * const data = await response.json();
   * 
   * if (data.success) {
   *   localStorage.setItem('neoview_token', data.token);
   *   localStorage.setItem('neoview_user', JSON.stringify(data.user));
   *   navigate('/home');
   * } else {
   *   setError(data.error);
   * }
   * ```
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock authentication - substituir por chamada real ao backend Python/SAP HANA
    setTimeout(() => {
      if (username && password) {
        // Simula sucesso - em produção, salvar token JWT retornado pelo backend
        localStorage.setItem('neoview_auth', 'true');
        localStorage.setItem('neoview_user', JSON.stringify({
          username,
          name: 'Usuário NeoView',
          role: 'supervisor', // 'user' ou 'supervisor'
        }));
        navigate('/home');
      } else {
        setError('Por favor, preencha todos os campos.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

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

            {/* Usuário Field */}
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
              <p className="mt-1 text-xs text-muted-foreground">
                Seu código de usuário SAP
              </p>
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
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Entrar'
              )}
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
