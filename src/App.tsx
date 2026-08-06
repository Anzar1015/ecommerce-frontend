import { useEffect, useRef } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from '@/routes/AppRoutes';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { mergeGuestCartOnLogin, resetCart } from '@/store/slices/cartSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
});

function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const { restoreSession } = useAuth();

  // On first load, ask the backend "who am I?" using the httpOnly cookie.
  // This is what makes refreshing the page keep the user logged in.
  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

/** Bridges auth state to cart state: merges any guest (localStorage) cart
 * into the server cart the moment a session becomes authenticated — via
 * fresh login, registration, or a restored session on page load — and
 * clears the cart again on logout so the next guest starts empty. */
function CartBootstrap({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, status } = useAuth();
  const dispatch = useAppDispatch();
  const wasAuthenticatedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return;

    const wasAuthenticated = wasAuthenticatedRef.current;
    wasAuthenticatedRef.current = isAuthenticated;

    if (isAuthenticated && wasAuthenticated !== true) {
      dispatch(mergeGuestCartOnLogin());
    } else if (!isAuthenticated && wasAuthenticated === true) {
      dispatch(resetCart());
    }
  }, [isAuthenticated, status, dispatch]);

  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionBootstrap>
          <CartBootstrap>
            <AppRoutes />
          </CartBootstrap>
        </SessionBootstrap>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
