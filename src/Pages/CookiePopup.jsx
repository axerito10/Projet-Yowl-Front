import React, { useState, useEffect } from 'react';

const CookiePopup = ({ onClose }) => {
  const [accepted, setAccepted] = useState(false);
  const [enableStatistics, setEnableStatistics] = useState(true);
  const [enablePersonalizedAds, setEnablePersonalizedAds] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPopupVisible(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleAcceptAll = () => {
    setAccepted(true);
    onClose();
  };

  const handleSavePreferences = () => {
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${popupVisible ? 'opacity-100 transition-opacity duration-300' : 'opacity-0'}`}>
      <div className="bg-white p-8 rounded w-96">
        <p className="text-center mb-4">
          Pour mieux te connaître, SKILLS utilisent des cookies avec ton consentement.
          Ces cookies permettent de mesurer le trafic du site et de personnaliser ton expérience : contenus, publicités.
          Tu peux modifier tes préférences à tout moment en cliquant en bas de page sur Cookies.
        </p>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span>Statistiques</span>
            <button
              onClick={() => setEnableStatistics(!enableStatistics)}
              className={`relative bg-custom-orange w-10 h-6 rounded-full p-1 transition-transform duration-300 ease-in-out transform ${
                enableStatistics ? 'bg-custom-orange' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transform ${
                  enableStatistics ? 'translate-x-full' : 'translate-x-0'
                } transition-transform duration-300 ease-in-out`}
              />
            </button>
          </div>
          <div className="flex justify-between items-center mb-2 relative">
            <span>Pub personnalisée</span>
            <button
              onClick={() => setEnablePersonalizedAds(!enablePersonalizedAds)}
              className={`relative bg-custom-orange w-10 h-6 rounded-full p-1 transition-transform duration-300 ease-in-out transform ${
                enablePersonalizedAds ? 'bg-custom-orange' : 'bg-gray-300'
              }`}
            >
              <span
                className={`block w-4 h-4 bg-white rounded-full transform ${
                  enablePersonalizedAds ? 'translate-x-full' : 'translate-x-0'
                } transition-transform duration-300 ease-in-out`}
              />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={handleAcceptAll}
            className="bg-custom-orange text-white font-bold py-2 px-4 rounded w-full hover:bg-custom-orange transform hover:scale-105 transition-transform duration-300"
          >
            Tout accepter
          </button>
          <button
            onClick={handleSavePreferences}
            className="bg-gray-300 text-custom-black font-bold py-2 px-4 rounded w-full hover:bg-custom-orange transform hover:scale-105 transition-transform duration-300"
          >
            Enregistrer les préférences
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiePopup;