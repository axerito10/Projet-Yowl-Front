import React, { useState, useEffect } from 'react';
import { getToken } from '../helpers'; // Assurez-vous que ce chemin est correct
import defaultImage from '../../public/no-profil-picture.png';

const CreateGroupForm = () => {
  const [group, setGroup] = useState({
    titre: '',
    description: '',
    titreContenu: '',
    descriptionContenu: '',
    payant: false,
    proprietaire: '',
    // Ajoutez les autres états ici si nécessaire
  });

  const [userData, setUserData] = useState(null); // État pour les données de l'utilisateur
  const [image, setImage] = useState(null); // État pour l'image du groupe
  const [categories, setCategories] = useState([]); // État pour les catégories chargées depuis Strapi
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBanners, setGroupBanners] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroup({ ...group, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setGroup({ ...group, [name]: checked });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e) => {
    // Convertissez les options sélectionnées en tableau
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCategories(values);
  };    

  const toggleCategories = (event) => {
    event.preventDefault(); // This prevents the default form submission behavior
    setShowCategories(!showCategories);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Créez un objet FormData pour envoyer l'image
    const formData = new FormData();
    if (image) {
      formData.append('files.image', image); // Ajoutez l'image ici
    }
  
    // Créez l'objet à envoyer, avec une clé "data"
    const dataToSend = {
      data: {
        Titre: group.titre,
        Description: group.description,
        Titre_contenu: group.titreContenu,
        Description_contenu: group.descriptionContenu,
        Proprietaire: group.proprietaire,
        Payant: group.payant,
        categories: selectedCategories.map((categoryId) => categoryId), // Assurez-vous que cela correspond à ce que Strapi attend
      },
    };    
  
    // Convertissez l'objet en JSON et ajoutez-le au FormData
    formData.append('data', JSON.stringify(dataToSend.data));
  
    try {
      // Envoie des données au serveur
      const response = await fetch('http://localhost:1337/api/groupes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`, // Utilisez le jeton de l'utilisateur
        },
        body: formData,
      });

      console.log('User Token:', userToken); // Vérifiez que le token est correct
  
      if (response.ok) {
        // Traitement de la réponse réussie
        const data = await response.json();
        console.log('Groupe créé :', data);
        // Redirection ou mise à jour de l'UI ici
      } else {
        // Traitement de la réponse d'échec
        const errorData = await response.json();
        console.error('Échec de la création du groupe', errorData);
      }
    } catch (error) {
      // Gestion des erreurs lors de la demande
      console.error('Erreur lors de la création du groupe :', error);
    }
  };   

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('User Token:', userToken);
        const response = await fetch('http://localhost:1337/api/categories', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          const categoriesData = jsonResponse.data.map(cat => ({
            id: cat.id,
            name: cat.attributes.category // Now it's getting the 'category' from the attributes
          }));
          setCategories(categoriesData); // Now you're setting an array of {id, name}
        } else {
          // Handle errors, perhaps by setting an error state
        }
      } catch (error) {
        // Handle errors, perhaps by setting an error state
      }
    };
  
    fetchData();
  }, []);
  
   
  

  useEffect(() => {
    const fetchUserDataAndCategories = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/users/me?populate=*`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);

          const banners = await Promise.all(data.mesGroupes.map(async (groupe) => {
            const groupeResponse = await fetch(`http://localhost:1337/api/groupes/${groupe.id}?populate=*`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
              },
            });

            if (groupeResponse.ok) {
              const groupeData = await groupeResponse.json();
              return groupeData.data.attributes.image;
            } else {
              throw new Error(`Erreur lors de la récupération de la bannière du groupe ${groupe.id}`);
            }
          }));

        } else {
          throw new Error('Erreur lors de la récupération des données de l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
        setError('Erreur lors de la récupération des données de l\'utilisateur');
      } finally {
      }
    };

    fetchUserDataAndCategories();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken(); // Assurez-vous que cette fonction retourne le token correct
      if (token) {
        setUserToken(token); // Définissez le token d'utilisateur
        try {
          const response = await fetch('http://localhost:1337/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            setUserData(userData);
  
            // Ajoutez la ligne de code suivante pour convertir l'ID en chaîne de caractères
            setGroup(prevGroup => ({ ...prevGroup, proprietaire: userData.id.toString() }));
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      } else {
        console.error('No token found');
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/users/me?populate=*`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);

                const banners = await Promise.all(data.mesGroupes.map(async (groupe) => {
                    const groupeResponse = await fetch(`http://localhost:1337/api/groupes/${groupe.id}?populate=*`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                    });

                    if (groupeResponse.ok) {
                        const groupeData = await groupeResponse.json();
                        return groupeData.data.attributes.image;
                    } else {
                        throw new Error(`Erreur lors de la récupération de la bannière du groupe ${groupe.id}`);
                    }
                }));

                setGroupBanners(banners);

            } else {
                throw new Error('Erreur lors de la récupération des données de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
            setError('Erreur lors de la récupération des données de l\'utilisateur');
        } finally {
            setLoading(false);
        }
    };

    fetchUserData();
}, []);
   

  return (
    <>
      <header className="flex justify-between items-center p-4 ml-7 mr-7">
        <div> {/* Conteneur pour la flèche */}
          <button onClick={() => window.history.back()} className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0L4.293 10.5a1 1 0 011.414-1.414L9 13.086V3a1 1 0 112 0v10.086l3.293-3.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div> {/* Conteneur pour la photo de profil */}
          <img
            className="rounded-full border-2 border-gray-300 h-20 w-20"
            src={userData && userData.Photo ? `http://localhost:1337${userData.Photo.url}` : defaultImage}
            alt="Photo de profil"
          />
        </div>
      </header>

      <div className='flex item-center justify-center'>
        <h1 className="text-2xl font-black mb-4 text-custom-blue">Création de votre groupe</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ml-12 mr-12">
        <div className="mb-4">
          <label htmlFor="imageInput" className="block text-sm font-medium text-custom-chapitre">Ajouter une image</label>
          <input type="file" id="imageInput" onChange={handleImageChange} className="mt-1 block w-full"/>
          <button type="button" className="mt-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Ajouter Image
          </button>
        </div>

        <div>
          <label htmlFor="titre" className="block text-sm font-medium text-custom-chapitre">Titre</label>
          <input type="text" name="titre" id="titre" required
                 onChange={handleChange} value={group.titre}
                 className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-custom-chapitre">Description</label>
          <textarea name="description" id="description" required
                    onChange={handleChange} value={group.description}
                    className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div className="mb-4">
  <label htmlFor="category" className="block text-sm font-medium text-custom-chapitre">
    Catégorie(s)
  </label>
  <button
  type="button"
  onClick={toggleCategories}
  className="text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
  {showCategories ? 'Masquer Catégories' : 'Voir Catégories'}
</button>
</div>

{showCategories && (
  <div className="mb-4">
    <select
      multiple
      id="categories" // Utilisez "categories" comme id
      name="categories" // Utilisez "categories" comme name
      value={selectedCategories}
      onChange={handleCategoryChange}
      className="mt-1 block w-full text-black"
      style={{ backgroundColor: 'white', color: 'black' }}
    >

       {categories.map((category) => (
        <option
          key={category.id}
          value={category.id}
          className={`block w-full text-black mt-1 ${selectedCategories.includes(category.id) ? 'bg-indigo-600 text-white' : 'bg-white text-black'} focus:ring-indigo-500`}
        >
          {category.name}
        </option>
      ))}

    </select>
  </div>
)}

        <div>
          <h2 className="text-2xl font-bold mb-4 text-custom-chapitre">CONTENU</h2>
        </div>
        <div>
          <label htmlFor="titre_contenu" className="block text-sm font-medium text-custom-chapitre">Titre</label>
          <textarea name="titre_contenu" id="titre_contenu" required
                    onChange={handleChange} value={group.titre_contenu}
                    className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>

        <div>
          <label htmlFor="description_contenu" className="block text-sm font-medium text-custom-chapitre">Contenu</label>
          <textarea name="description_contenu" id="description_contenu" required
                    onChange={handleChange} value={group.description_contenu}
                    className="mt-1 block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>

        {/* Répétez la structure ci-dessus pour les autres champs du formulaire */}

        <div>
          <label htmlFor="payant" className="flex items-center">
            <input type="checkbox" name="payant" id="payant"
                   onChange={handleCheckboxChange} checked={group.payant}
                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
            <span className="ml-2 text-sm text-custom-chapitre">Payant</span>
          </label>
        </div>

        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Créer Groupe
        </button>
      </form>
    </>
  );
};

export default CreateGroupForm;
