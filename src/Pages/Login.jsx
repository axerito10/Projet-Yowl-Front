import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (response.ok) {
        console.log('Connexion réussie');
        const data = await response.json();
        sessionStorage.setItem('jwt', data.jwt);
        sessionStorage.setItem('userId', data.user.id)

        setError('');
        navigate('/home');
      } else {
        const data = await response.json();
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      setError('Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("../src/assets/background-login-5.png")' }}>
      <div className="bg-warm-gray-100 p-8 sm:w-96 rounded-lg" style={{ position: 'relative', top: '-35px' }}>
        <h2 className="text-2xl font-semibold mb-4 text-center">Bienvenue parmi nous</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Adresse mail :</label>
          <input
            className="w-full border p-2 rounded"
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="Adresse mail"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mot de passe :</label>
          <input
            className="w-full border p-2 rounded"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Mot de passe"
          />
        </div>
        <button className="bg-custom-blue hover:bg-custom-hover-blue disabled:opacity-50 text-white p-2 rounded w-full" onClick={handleLogin}>Se connecter</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mt-4 text-center">
          <p>Vous n'avez pas de compte ?</p>
          <Link to="/register" className="text-custom-blue underline">S'enregistrer</Link>
        </div>
        <div className=' text-center '>
          <Link to="/" className="text-black italic text-xs">Continuer sans s'enregistrer</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
  