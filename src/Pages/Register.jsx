import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '', // Ajout d'un champ pour la confirmation du mot de passe
    role: '1',
    confirmed: true,
  });
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Vérifier si les mots de passe correspondent
      if (formData.password !== formData.confirmPassword) {
        setFeedback("Les mots de passe ne correspondent pas.");
        return;
      }

      // Ne pas inclure confirmPassword dans la requête
      const { confirmPassword, ...postData } = formData;

      const response = await fetch('http://localhost:1337/api/users?populate=*', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      setFeedback('Inscription réussie! Redirection vers la page de connexion...');

      setTimeout(() => navigate('/login'), 2000);

      console.log('Données soumises avec succès:', data);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);

      setFeedback("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("../src/assets/background-login-5.png")' }}>
      <div className="bg-warm-gray-100 p-8 sm:w-96 rounded-lg" style={{ position: 'relative', top: '-40px' }}>
        <h2 className="text-2xl font-semibold text-center mb-6">Bienvenue parmi nous</h2>

        {feedback && (
          <div className="mb-4 text-red-600">
            {feedback}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">
              Nom d'utilisateur*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
              Adresse mail*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
              Mot de passe*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-medium mb-2">
              Confirmation du mot de passe*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            S'inscrire
          </button>
        </form>

        <div className="mt-4 text-center">
          <p>Vous avez déjà un compte ?</p>
          <Link to="/login" className="text-blue-500 underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
