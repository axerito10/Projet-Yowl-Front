import React, { useState, useEffect } from 'react';
import { FaStripe } from 'react-icons/fa';

const PaymentPopup = ({ onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [purchaseAmount, setPurchaseAmount] = useState(0); // Montant de l'achat récupéré depuis le backend

  useEffect(() => {
    // Simuler la récupération du montant de l'achat depuis le backend (remplacez cette logique avec votre propre récupération de données)
    const fetchPurchaseAmount = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/creations-groupes'); // Remplacez l'URL avec votre endpoint Strapi
        const data = await response.json();
        const purchaseData = data[0]; // Supposons que le montant est dans la première entrée de la table

        if (purchaseData && purchaseData.prix) {
          setPurchaseAmount(purchaseData.prix);
        } else {
          console.error("Erreur lors de la récupération du montant de l'achat.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du montant de l'achat.", error);
      }
    };

    fetchPurchaseAmount();
  }, []);

  const handlePayment = () => {
    // Ajoutez votre logique de traitement de paiement ici
    // Redirigez l'utilisateur vers le lien de paiement Stripe
    window.location.href = 'https://buy.stripe.com/5kA5lE2tH7FrfzG3cd';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded w-96">
        <div className='font-bold text-center'>
        Contenu de l'achat : 
        </div>
        <p className="font-bold mb-7">
          <br></br>- Cours privé<br></br>- Accès au groupe<br></br><br></br>
          <div className='text-center'>Total: 4,99/mois TTC</div>
        </p>
        {paymentMethod === 'stripe' && (
          <>
          </>
        )}
        <div className="space-y-2">
          <button
            onClick={handlePayment}
            className="bg-custom-orange text-white font-bold py-2 px-4 rounded w-full hover:bg-custom-orange transform hover:scale-105 transition-transform duration-300"
          >
            <div className="font-bold flex items-center justify-center">
            <span>Procéder au paiement via:
            </span><FaStripe className="text-5xl text-blue-700 mr-2 ml-2" />
            </div>
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-custom-black font-bold py-2 px-4 rounded w-full hover:bg-custom-orange transform hover:scale-105 transition-transform duration-300"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;