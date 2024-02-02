import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getToken, getUserId } from '../helpers';
import { FaSave, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import defaultImage from '../../public/no-profil-picture.png';

const UserProfilePage = () => {
  const [user, setUser] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    photo: null,
  });
  const [photoURL, setPhotoURL] = useState(defaultImage);
  const [isModified, setIsModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [redirectToProfile, setRedirectToProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoModified, setPhotoModified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessage2, setErrorMessage2] = useState('');
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  


  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result); 
      };
      reader.readAsDataURL(file); 
    }
    setUser({
      ...user,
      photo: file,
    });
    setPhotoModified(true);
    setIsModified(true); 
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      try {
        const response = await fetch('http://localhost:1337/api/users/me?populate=*', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Erreur de chargement des données de profil');
        }
        const userData = await response.json();

        setUser({
          ...user,
          email: userData.email,
          telephone: userData.telephone || '',
        });

        if (userData.photo) {
          setPhotoURL(`http://localhost:1337${userData.photo.url}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (redirectToProfile) {
      window.location.href = '/profil';
    }
  }, [redirectToProfile]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
    setIsModified(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    setErrorMessage('');
    setSuccessMessage('');
  
    if (!isValidEmail(user.email)) {
      setErrorMessage("L'adresse email n'est pas correcte.");
      setIsSubmitting(false);
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    if (user.password !== user.confirmPassword) {
      setPasswordsMatch(false);
      setIsSubmitting(false);
      setErrorMessage2('Les mots de passe ne correspondent pas.');
      setTimeout(() => setErrorMessage2(''), 2000);
      return;
    }

    setErrorMessage('');
    setErrorMessage2('');
  
    const dataToSend = {
      email: user.email,
      telephone: user.telephone,
    };
  
    if (user.password) {
      dataToSend.password = user.password;
    }
  
    try {
      const response = await fetch(`http://localhost:1337/api/users/${getUserId()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
  
      setSuccessMessage('Les modifications ont été enregistrées.');
      setTimeout(() => {
        setRedirectToProfile(true);
        window.location.href = '/profil';
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white font-Avenir min-h-screen">
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
    {errorMessage && (
        <div className="bg-red-200 text-red-700 p-3 mb-4 rounded">
          {errorMessage}
        </div>
      )}
      {errorMessage2 && (
        <div className="bg-red-200 text-red-700 p-3 mb-4 rounded">
          {errorMessage2}
        </div>
      )}
          <div className='flex justify-between items-center mb-10'>
            <Link to="/profil" className='text-orange-500 text-2xl mr-4'>
              <FaArrowLeft />
            </Link>
          </div>
          {successMessage && (
            <div className="bg-green-200 text-green-700 p-3 mb-4 rounded">
              {successMessage}
            </div>
          )}
          <div className="relative mb-6">
            <input
              type="file"
              id="profilePhotoInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
            />
            <label htmlFor="profilePhotoInput" className="flex justify-center cursor-pointer">
              <div className="relative w-32 h-32">
                <img 
                  className="rounded-full border-2 border-gray-300 h-full w-full object-cover" 
                  src={photoURL} 
                  alt="Photo de profil"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300">
                  <p className="text-white text-sm text-center px-2">Modifier la photo</p>
                </div>
              </div>
            </label>
          </div>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
                required
                placeholder="Modifiez votre email"
                className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 w-full focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="mb-4 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={user.password}
                  onChange={handleInputChange}
                  placeholder="Modifiez votre mot de passe"
                  className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 w-full focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirmation du mot de passe</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={user.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirmez le mot de passe"
                  className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 w-full focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
                  onClick={toggleShowConfirmPassword}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">Numéro de téléphone (facultatif)</label>
              <input
                id="telephone"
                name="telephone"
                type="tel"
                value={user.telephone}
                onChange={handleInputChange}
                placeholder="Modifiez votre numéro de téléphone (facultatif)"
                className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-100 w-full focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="mb-4 flex justify-center items-center">
              <button
                type="submit"
                disabled={!isModified || isSubmitting || !passwordsMatch}
                className={`px-4 py-2 rounded-full ${isModified ? 'bg-custom-orange hover:bg-orange-600 text-custom-blue' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
              >
                <FaSave className="inline-block mr-2" />
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;


//POUR PUSH