import { Link, NavLink } from 'react-router';
import { logOut } from '../../services/authService';
import './NavBar.css';

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    logOut();
    setUser(null);
  }

  return (
    <nav className="NavBar">
      <NavLink to="/">Home</NavLink>
      &nbsp; | &nbsp;
      {user ? (
        <>
          <NavLink to="/news">News</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/posts" end>
            Post List
          </NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/posts/new">New Post</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/profile">Profile</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/dashboard">Dashboard</NavLink>
          &nbsp; | &nbsp;
          <Link to="" onClick={handleLogOut}>
            Log Out
          </Link>
          &nbsp; | &nbsp;
          <span>Welcome, {user.name}</span>
        </>
      ) : (
        <>
          <NavLink to="/login">Log In</NavLink>
          &nbsp; | &nbsp;
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}