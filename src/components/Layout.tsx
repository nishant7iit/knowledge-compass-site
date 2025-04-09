
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 p-2 m-4 text-white bg-knowledge-600 rounded-full shadow-lg md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Header for mobile */}
      <div className="fixed z-40 w-full h-16 bg-white shadow md:hidden">
        <div className="flex items-center justify-center h-full">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="text-knowledge-600" size={24} />
            <span className="text-xl font-bold text-knowledge-950">Knowledge Compass</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-full md:ml-0">
        <main className="flex-1 mt-16 md:mt-0">{children}</main>
      </div>
    </div>
  );
};
