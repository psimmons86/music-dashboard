import { useState } from 'react';
import { useNavigate } from 'react-router';
import * as authService from '../../services/authService';

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg('');
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await authService.logIn(formData);
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      setErrorMsg('Log In Failed - Try Again');
    }
  }

  return (
    <div className="min-h-screen bg-[#98e4d3] flex items-center justify-center p-6">
      <div className="bg-[#d4e7aa]/95 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Log In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#98e4d3] focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#98e4d3] text-gray-800 py-2 rounded-lg font-semibold hover:bg-[#7dcfbe] transition-colors"
          >
            LOG IN
          </button>
          {errorMsg && (
            <p className="text-red-500 text-sm text-center mt-4">{errorMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
