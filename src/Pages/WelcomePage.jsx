import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Pages/Style/WelcomePage.css'; 

const App = () => {
  const navigate = useNavigate();

  // Fonctions pour gérer les clics sur les boutons
  const handleLogin = () => {
    // Logique de connexion ou redirection vers le composant/page de connexion
    navigate('/login');
  };

  const handleSignup = () => {
    // Logique d'inscription ou redirection vers le composant/page d'inscription
    navigate('/register');
  };

  return (
    <div className="App overflow-hidden"> {/* Ajoutez overflow-hidden ici */}
      <div className="App-header flex flex-col justify-center items-center min-h-screen">
        <div className="-mt"> 
          <h1 className="text-4xl font-bold flex items-center mb-12">
            <img
              className="h-14 mr- align-middle" 
              src="https://cdn.discordapp.com/attachments/1182732629573910569/1196830881592131677/Logo_2_Skills.png"
              alt="Skills logo"
            />
            <span className="text-7xl">KILLS</span>
          </h1>
        </div>
        <img
          className="mt-12 w-2/6"
          src="https://cdn.discordapp.com/attachments/1182732629573910569/1199792458377211966/Capture_decran_le_2024-01-24_a_20.06.37.png?ex=65c3d4cd&is=65b15fcd&hm=bcfd11b52301309a4225c84febce2e15964eebd99c1533696f283f77419a1b7f&"
          alt="Description"
        />
        <p className="mt-[60px] mb-9"> 
        Prêt à acquérir de nouvelles compétences ?<br />Alors rejoins-nous.
        </p>
        <div className="mb-2 flex justify-between">
          <button onClick={handleLogin} 
          className="bg-custom-orange text-custom-blue font-bold py-2 px-4 rounded-full border border-orange-500 hover:bg-custom-hoverorange mx-4 md:mx-8 lg:mx-20">
            SE CONNECTER
          </button>
          <button onClick={handleSignup}
          className="bg-custom-orange text-custom-blue font-bold py-2 px-4 rounded-full border border-orange-500 hover:bg-custom-hoverorange mx-4 md:mx-8 lg:mx-20">
            S'INSCRIRE
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;