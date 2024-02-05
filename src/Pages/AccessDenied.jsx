import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("../src/assets/background-login-4.jpg")' }}>
      <div className="md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div className="bg-red-500 p-8 rounded-md text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Utilisateur déconnecté</h1>
          <p>Vous n'avez pas l'autorisation d'accéder à cette page.</p>
          <p>Veuillez vous connecter...</p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
