/**
 * ============================================================
 * HOOK: useAuth
 * ============================================================
 * 
 * Hook de autenticação preparado para integração com backend.
 * 
 * INTEGRAÇÃO BACKEND:
 * 1. Substitua as funções mock pelos calls reais do Supabase
 * 2. Implemente os handlers de session
 * 3. Configure o refresh token automático
 * 
 * EXEMPLO DE INTEGRAÇÃO:
 * ```typescript
 * import { supabase } from '@/integrations/supabase/client';
 * 
 * const signIn = async (credentials: LoginCredentials) => {
 *   const { data, error } = await supabase.auth.signInWithPassword({
 *     email: credentials.email,
 *     password: credentials.password,
 *   });
 *   return { user: data.user, error };
 * };
 * ```
 * ============================================================
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import type { User, LoginCredentials, AuthResponse, UserRole } from '@/types/backend';

// ==================== MOCK DATA (REMOVER EM PRODUÇÃO) ====================

const MOCK_USERS: Record<string, { user: User; password: string; roles: UserRole[] }> = {
  'admin@neoview.com': {
    user: {
      id: 'usr-001',
      email: 'admin@neoview.com',
      full_name: 'Administrador Sistema',
      department: 'TI',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    password: 'admin123',
    roles: ['admin'],
  },
  'supervisor@neoview.com': {
    user: {
      id: 'usr-002',
      email: 'supervisor@neoview.com',
      full_name: 'Maria Silva',
      department: 'Operações',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    password: 'super123',
    roles: ['supervisor'],
  },
  'analista@neoview.com': {
    user: {
      id: 'usr-003',
      email: 'analista@neoview.com',
      full_name: 'João Santos',
      department: 'Análise',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    password: 'analista123',
    roles: ['analyst'],
  },
};

// ==================== CONTEXT ====================

interface AuthContextType {
  user: User | null;
  roles: UserRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signUp: (credentials: LoginCredentials & { full_name: string }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sessão existente ao carregar
  useEffect(() => {
    const checkSession = async () => {
      try {
        // TODO: Substituir por Supabase
        // const { data: { session } } = await supabase.auth.getSession();
        
        const storedAuth = localStorage.getItem('neoview_auth');
        if (storedAuth) {
          const { user: storedUser, roles: storedRoles } = JSON.parse(storedAuth);
          setUser(storedUser);
          setRoles(storedRoles);
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // TODO: Implementar listener de mudança de auth
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(
    //   async (event, session) => { ... }
    // );
    // return () => subscription.unsubscribe();
  }, []);

  /**
   * Login com email e senha
   * 
   * BACKEND: supabase.auth.signInWithPassword()
   */
  const signIn = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // TODO: Substituir por call real
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: credentials.email,
      //   password: credentials.password,
      // });

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser = MOCK_USERS[credentials.email];
      if (!mockUser || mockUser.password !== credentials.password) {
        return {
          user: null,
          session: null,
          error: 'Email ou senha inválidos',
        };
      }

      const authData = {
        user: mockUser.user,
        roles: mockUser.roles,
      };

      localStorage.setItem('neoview_auth', JSON.stringify(authData));
      setUser(mockUser.user);
      setRoles(mockUser.roles);

      return {
        user: mockUser.user,
        session: {
          access_token: 'mock-token-' + Date.now(),
          refresh_token: 'mock-refresh-' + Date.now(),
          expires_at: Date.now() + 3600000,
        },
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: 'Erro ao realizar login',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cadastro de novo usuário
   * 
   * BACKEND: supabase.auth.signUp()
   */
  const signUp = useCallback(async (
    credentials: LoginCredentials & { full_name: string }
  ): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      // TODO: Substituir por call real
      // const { data, error } = await supabase.auth.signUp({
      //   email: credentials.email,
      //   password: credentials.password,
      //   options: {
      //     data: { full_name: credentials.full_name },
      //     emailRedirectTo: window.location.origin,
      //   },
      // });

      await new Promise(resolve => setTimeout(resolve, 800));

      const newUser: User = {
        id: 'usr-' + Date.now(),
        email: credentials.email,
        full_name: credentials.full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return {
        user: newUser,
        session: null,
        error: undefined,
      };
    } catch (error) {
      return {
        user: null,
        session: null,
        error: 'Erro ao criar conta',
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout
   * 
   * BACKEND: supabase.auth.signOut()
   */
  const signOut = useCallback(async () => {
    try {
      // TODO: Substituir por call real
      // await supabase.auth.signOut();
      
      localStorage.removeItem('neoview_auth');
      setUser(null);
      setRoles([]);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  /**
   * Reset de senha
   * 
   * BACKEND: supabase.auth.resetPasswordForEmail()
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      // TODO: Substituir por call real
      // const { error } = await supabase.auth.resetPasswordForEmail(email, {
      //   redirectTo: `${window.location.origin}/reset-password`,
      // });

      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao enviar email de reset' };
    }
  }, []);

  /**
   * Atualizar perfil
   * 
   * BACKEND: supabase.from('profiles').update()
   */
  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return { success: false, error: 'Usuário não autenticado' };

    try {
      // TODO: Substituir por call real
      // const { error } = await supabase
      //   .from('profiles')
      //   .update(data)
      //   .eq('id', user.id);

      const updatedUser = { ...user, ...data, updated_at: new Date().toISOString() };
      setUser(updatedUser);
      
      const storedAuth = localStorage.getItem('neoview_auth');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        parsed.user = updatedUser;
        localStorage.setItem('neoview_auth', JSON.stringify(parsed));
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar perfil' };
    }
  }, [user]);

  /**
   * Verificar se usuário tem role específica
   */
  const hasRole = useCallback((role: UserRole) => {
    return roles.includes(role);
  }, [roles]);

  /**
   * Verificar se usuário tem qualquer uma das roles
   */
  const hasAnyRole = useCallback((checkRoles: UserRole[]) => {
    return checkRoles.some(role => roles.includes(role));
  }, [roles]);

  const value: AuthContextType = {
    user,
    roles,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ==================== HOOK ====================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export default useAuth;
