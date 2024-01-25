import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './WelcomePage.css'; // Assurez-vous de créer un fichier CSS approprié

const App = () => {
  const navigate = useNavigate();

  // Fonctions pour gérer les clics sur les boutons
  const handleLogin = () => {
    // Logique de connexion ou redirection vers le composant/page de connexion
    navigate('/');
  };

  const handleSignup = () => {
    // Logique d'inscription ou redirection vers le composant/page d'inscription
    navigate('/signup');
  };

  return (
    <div className="App">
      <header className="App-header flex flex-col justify-center items-center min-h-screen">
        <div className="-mt"> {/* Appliquez la marge négative ici */}
          <h1 className="text-4xl font-bold flex items-center mb-12">
            <img
              className="h-14 mr- align-middle" // Ajustez la marge à droite (mr-) si nécessaire
              src="https://cdn.discordapp.com/attachments/1182732629573910569/1196830881592131677/Logo_2_Skills.png"
              alt="Skills logo"
            />
            <span className="text-7xl">KILLS</span>
          </h1>
        </div>
        <img
          className="mt-12"
          style={{ height: '500px' }} // Taille personnalisée
          src="https://cdn.discordapp.com/attachments/1182732629573910569/1199792458377211966/Capture_decran_le_2024-01-24_a_20.06.37.png?ex=65c3d4cd&is=65b15fcd&hm=bcfd11b52301309a4225c84febce2e15964eebd99c1533696f283f77419a1b7f&"
          alt="Description"
        />
        <p className="mt-[100px] mb-9"> {/* Ajoutez ici la marge négative en haut */}
        Prêt à acquérir de nouvelles compétences ?<br />Alors rejoins-nous.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={handleLogin} 
          className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full border border-orange-500 hover:bg-orange-600 mx-4 md:mx-8 lg:mx-20">
            SE CONNECTER
          </button>
          <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-full border border-orange-500 hover:bg-orange-600 mx-4 md:mx-8 lg:mx-20">
            S'INSCRIRE
          </button>
        </div>
      </header>
    </div>
  );
};

export default App;