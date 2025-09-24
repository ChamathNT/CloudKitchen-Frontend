import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const ProtectedRoute = () => {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const toastShown = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await axios.get('http://localhost:3000/api/auth-service/user/verify-token', { withCredentials: true });
        if (!cancelled) {
          setAuthed(true);
          setChecked(true);
        }
      } catch (e) {
        if (!cancelled) {
          setAuthed(false);
          setChecked(true);
          if (!toastShown.current) {
            toast.info('Please login to the system.', {
              position: 'top-center',
              autoClose: 2000,
              style: { backgroundColor: '#FFA500', color: '#fff', fontWeight: 'bold' },
              icon: '⚠️',
            });
            toastShown.current = true;
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!checked) return null; // or a loader
  if (!authed) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
