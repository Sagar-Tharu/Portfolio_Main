import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PortfolioProvider } from '@/context/PortfolioContext';
import { Login } from '@/pages/Login';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { PortfolioDisplay } from '@/components/PortfolioDisplay';

// Protected route wrapper for admin
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Public route wrapper (redirects to admin if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <BrowserRouter>
        <AuthProvider>
          <PortfolioProvider>
            <Toaster 
              position="top-right" 
              richColors 
              theme="dark"
              toastOptions={{
                style: {
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#fff',
                },
              }}
            />
            <Routes>
              {/* Login Route */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              
              {/* Admin Dashboard Route */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Portfolio Preview Route - Dynamic username */}
              <Route path="/portfolio/:username" element={<PortfolioDisplay />} />
              
              {/* Default Portfolio Display Route */}
              <Route path="/" element={<PortfolioDisplay />} />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PortfolioProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
