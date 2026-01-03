'use client';

import { authClient } from '@/lib/auth-client';
import { Session, User } from 'better-auth/types';
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContext {
  session: Session | null;
  user: any | null;
  isLoading: boolean;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  isLoading: false,
  setSession: () => {},
  setUser: () => {},
  refetchAuth: async () => {}
});

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchSession = useCallback(async () => {
    if (pathname?.startsWith('/auth')) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data: response } = await authClient.getSession();

      if (!response?.session) {
        setSession(null);
        setUser(null);
        router.push('/auth/sign-in');
      } else {
        setSession(response.session);
        setUser(response.user || null);
      }
    } catch (error) {
      console.log('Failed to get the session');
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname]);

  useEffect(() => {
    if (!session && !pathname.startsWith('/auth')) {
      fetchSession();
    }
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        session: session,
        user: user,
        isLoading: isLoading,
        setSession,
        setUser,
        refetchAuth: fetchSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthSession = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'Please wrap your page in AuthContextProvider to use this hook'
    );
  }
  return context;
};