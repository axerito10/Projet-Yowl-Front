import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      if (formData.password !== formData.confirmPassword) {
        setFeedback("Les mots de passe ne correspondent pas.");
        return;
      }

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
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center font-Avenir">
      <div className="bg-warm-gray-100 p-8 sm:w-96 rounded-lg" style={{ position: 'relative' }}>
        <div className="flex items-center justify-center mb-6">
          <img src="../public/Logo.png" alt="Logo de SKILLS" className="w-2/6 rounded mb-6"/>
        </div>
        <h2 className="text-3xl font-black text-center mb-6">Bienvenue parmi nous</h2>

        {feedback && (
          <div className="mb-4 text-custom-orange">
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
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              className="w-full bg-custom-gray px-4 py-2 border rounded-md focus:outline-none focus:border-custom-orange"
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
              placeholder="Adresse mail"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-custom-gray px-4 py-2 border rounded-md focus:outline-none focus:border-custom-orange"
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
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-custom-gray px-4 py-2 border rounded-md focus:outline-none focus:border-custom-orange"
              required
            />
          </div>
          <div className="mb-1">
            <label htmlFor="confirmPassword" className="block text-gray-600 text-sm font-medium mb-2">
              Confirmation du mot de passe*
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmation du mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 bg-custom-gray py-2 border rounded-md focus:outline-none focus:border-custom-orange"
              required
            />
          </div>
          
          <div className='text-xs flex justify-end align-items-right mb-4'>
            <input type="checkbox" className="accent-custom-orange" style={{ marginRight: '5px' }} />
            <span>J’ai lu et j’accepte la politique de confidentialité</span>
          </div>



          <div className='mb-2 mt-2 flex justify-between'>
            <Link to="/" className="bg-custom-orange hover:bg-custom-hoverorange text-custom-blue mr-4 p-2 rounded-3xl w-full text-center">ANNULER</Link>
            <button className="bg-custom-orange hover:bg-custom-hoverorange text-custom-blue p-2 rounded-3xl w-full" onClick={handleSubmit}>S'INSCRIRE</button>
          </div>
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
