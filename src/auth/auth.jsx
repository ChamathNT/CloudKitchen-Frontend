// src/auth/auth.js
import { jwtDecode } from 'jwt-decode';
import api from './api'; 
import { toast } from 'react-toastify';
import axios from 'axios';

export const isAuthenticated = () => {
  // With HttpOnly cookies, we can't read tokens directly.
  // A lightweight approach: check a small ping to auth verify (cached) or rely on route guards that call the API.
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  try { return !isTokenExpired(token); } catch { return false; }
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('role');
  
  toast.info('You have been logged out.', {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
  });
  setTimeout(() => {
    window.location.href = '/login';
  }, 2000); // Wait for the toast to show before redirect
};
export const signOut = async () => {
  try {
    // Call via API gateway; cookies will be sent automatically with withCredentials
    await axios.post('http://localhost:3000/api/auth-service/user/signout', null, { withCredentials: true });

    toast.info('Signed out successfully.', {
      position: "top-center",
      autoClose: 2000,
      style: {
        backgroundColor: '#fff',
        color: '#FFA500',
        fontWeight: 'bold',
      },
      icon: '👋',
    });
  } catch (error) {
    toast.error('Server logout failed.', {
      position: "top-center",
      autoClose: 3000,
      style: {
        backgroundColor:'#fff' ,
        color: '#FFA500',
        fontWeight: 'bold',
      },
      icon: '⚠️',
    });
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');

    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
};


export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};