import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    adminCode: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    
    // Client-side validation
    if (formData.password !== formData.confirm) {
      setErrorMsg('Passwords do not match');
      return;
    }

    // Validate password strength (optional, but recommended)
    if (formData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    try {
      const user = await authService.signUp(formData);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      
      // More specific error handling
      if (err.message.includes('User already exists')) {
        setErrorMsg('An account with this email already exists');
      } else if (err.message.includes('Service is temporarily unavailable')) {
        setErrorMsg('Service is temporarily unavailable. Please try again later.');
      } else {
        setErrorMsg('Sign Up Failed - Please check your information and try again');
      }
    }
  }

  const disable = formData.password !== formData.confirm || 
    !formData.name || 
    !formData.email || 
    !formData.password;

  return (
    <div className="min-h-screen bg-[#98e4d3] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/95 rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#6c0957] mb-8">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c0957]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c0957]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c0957]"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              name="confirm"
              value={formData.confirm}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c0957]"
            />
          </div>

          <div>
            <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Code (Optional)
            </label>
            <input
              id="adminCode"
              type="password"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              autoComplete="off"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c0957]"
            />
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={disable}
            className="w-full py-3 px-4 bg-[#6c0957] text-white rounded-lg hover:bg-[#4a0442] transition-colors 
              disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#98e4d3]"
          >
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}