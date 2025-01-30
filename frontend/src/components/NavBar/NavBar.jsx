import { NavLink, Link, useNavigate } from 'react-router';
import { logOut } from '../../services/authService';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    navigate('/');
  }

  return (
    <div className="px-6 py-4">
      <nav className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="font-sans text-2xl tracking-tight font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Music Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <NavLink 
                    to="/dashboard"
                    className={({ isActive }) => `
                      px-3 py-2 rounded-lg transition-all
                      ${isActive ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    Dashboard
                  </NavLink>
                  
                  <NavLink 
                    to="/blog"
                    className={({ isActive }) => `
                      px-3 py-2 rounded-lg transition-all
                      ${isActive ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    Blog
                  </NavLink>

                  <NavLink 
                    to="/profile"
                    className={({ isActive }) => `
                      px-3 py-2 rounded-lg transition-all
                      ${isActive ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    Profile
                  </NavLink>

                  <div className="border-l border-gray-200 pl-4 ml-4 flex items-center space-x-4">
                    <span className="font-medium text-gray-700">
                      {user.name}
                    </span>
                    <button
                      onClick={handleLogOut}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Log Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/login"
                    className={({ isActive }) => `
                      px-4 py-2 rounded-lg transition-all
                      ${isActive ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    Log In
                  </NavLink>
                  <NavLink 
                    to="/signup"
                    className={({ isActive }) => `
                      px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium
                      ${isActive ? 'opacity-90' : ''}
                    `}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}