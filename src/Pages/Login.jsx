import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase-config.js'
import { signInWithEmailAndPassword  } from 'firebase/auth'

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

        //
      const test = await fetch(`http://localhost:1337/api/privates/${data.user.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.jwt}`,
      }});
      
      if (test.ok) {
        console.log ("La catégorie private de cet utilisateur existe déjà")
      }
      else {
        console.log(data.user.id, data.jwt)
        const raw = {
          "data":
          {
            "owner":
            {
              "connect": [data.user.id]
            }
            
          }
        }

        await fetch(`http://localhost:1337/api/privates?populate=*`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.jwt}`,
        },
          body: JSON.stringify(raw)
        });
      }
        //
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseToken = await userCredential.user.getIdToken();
          console.log('Connexion réussie sur Firebase', firebaseToken);
          setError('');
          sessionStorage.setItem('firebaseToken', firebaseToken);
        } catch (firebaseError) {
          console.error('Erreur lors de la connexion Firebase', firebaseError);
          setError('Erreur de connexion Firebase');
          return;
        }
        //

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
    <div className="min-h-screen flex items-center justify-center font-bold font-Avenir">
      <div className="bg-warm-gray-100 p-8 sm:w-96 rounded-lg" style={{ position: 'relative', top: '-25px' }}>
        <div className="flex items-center justify-center mb-6">
          <img src="../public/Logo.png" alt="Logo de SKILLS" className="w-3/6 rounded mb-6"/>
        </div>
        <h2 className="text-3xl font-black mb-4 text-center">Bon retour parmi nous</h2>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Adresse mail :</label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:border-custom-orange bg-custom-gray"
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="Adresse mail"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mot de passe :</label>
          <input
            className="w-full border p-2 rounded focus:outline-none focus:border-custom-orange bg-custom-gray"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Mot de passe"
          />
        </div>
        <div className='mb-2 flex justify-between'>
          <Link to="/" className="bg-custom-orange hover:bg-custom-hoverorange text-custom-blue mr-4 p-2 rounded-3xl w-full text-center">ANNULER</Link>
          <button className="bg-custom-orange text-custom-blue p-2 rounded-3xl w-full" onClick={handleLogin}>SE CONNECTER</button>
        </div>
        <div className="mt-14 text-center">
          <p>Vous n'avez pas de compte ?</p>
          <Link to="/register" className="text-blue-500 underline">S'enregistrer</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;