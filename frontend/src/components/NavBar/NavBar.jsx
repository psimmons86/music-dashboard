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
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#6c0957]">
              Music Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NavLink 
                  to="/dashboard"
                  className={({ isActive }) => `
                    px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-[#98e4d3] text-gray-800' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  Dashboard
                </NavLink>
                
                <NavLink 
                  to="/blog"
                  className={({ isActive }) => `
                    px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-[#98e4d3] text-gray-800' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  Blog
                </NavLink>

                <NavLink 
                  to="/profile"
                  className={({ isActive }) => `
                    px-3 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-[#98e4d3] text-gray-800' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  Profile
                </NavLink>

                <div className="border-l border-gray-200 pl-4 ml-4 flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {user.name}
                  </span>
                  <button
                    onClick={handleLogOut}
                    className="px-4 py-2 bg-[#d4e7aa] text-gray-800 rounded-lg hover:bg-[#c3d69b] transition-colors"
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
                    px-4 py-2 rounded-lg transition-colors
                    ${isActive ? 'bg-[#98e4d3] text-gray-800' : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  Log In
                </NavLink>
                <NavLink 
                  to="/signup"
                  className={({ isActive }) => `
                    px-4 py-2 bg-[#d4e7aa] text-gray-800 rounded-lg hover:bg-[#c3d69b] transition-colors
                    ${isActive ? 'bg-[#c3d69b]' : ''}
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
  );
}