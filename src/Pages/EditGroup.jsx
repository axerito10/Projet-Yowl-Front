import React, { useState, useEffect } from 'react';
import { getToken } from '../helpers.js';
import defaultImage from '../../public/no-profil-picture.png';
import { useNavigate } from 'react-router-dom';


const EditGroup = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const urlParts = window.location.pathname.split('/');
  const groupeID = urlParts[urlParts.length - 1];
  const [userData, setUserData] = useState(null); // État pour les données de l'utilisateur
  const [image, setImage] = useState(null); // État pour l'image du groupe
  const [categories, setCategories] = useState([]); // État pour les catégories chargées depuis Strapi
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupBanners, setGroupBanners] = useState([]);
  const [chapters, setChapters] = useState([{ titre: '', description: '' }]);
  const [chapterIds, setChapterIds] = useState([]);
  const [userMail, setUserMail] = useState("")
  const [group, setGroup] = useState({
      titre: '',
      description: '',
      titreContenu: '',
      descriptionContenu: '',
      payant: false,
      proprietaire: '',
  });


  // Sauvegarde
  // Vérification que l'utilisateur a bien les droits pour modifier le groupe
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch des données utilisateur
        const userResponse = await fetch(`http://localhost:1337/api/users/me?populate=*`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userMail = userData?.email || '';
          console.log("user mail :", userMail);

          // Fetch des données du groupe
          const groupResponse = await fetch(`http://localhost:1337/api/groupes/${groupeID}?populate=*`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getToken()}`,
            },
          });

          if (groupResponse.ok) {
            const groupData = await groupResponse.json();
            const groupOwnerMail = groupData.data.attributes.owner.data.attributes.email;

            if (groupOwnerMail !== userMail) {
              console.log("Différents");
              navigate('/profil');
            } else {
              console.log("Identiques");
              console.log(groupData.data.attributes)
              setGroup({
                titre: groupData.data.attributes.Titre,
                description: groupData.data.attributes.Description,
                payant: groupData.data.attributes.Payant,
              });
            }
          } else {
            throw new Error('Erreur lors de la récupération des données du groupe');
          }
        } else {
          throw new Error('Erreur lors de la récupération des données de l\'utilisateur');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
        setError('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupeID, navigate]);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  if (error) {
    return <p>Une erreur s'est produite : {error}</p>;
  }

  

  // Fonction d'envoie du formulaire sur la base de donnée
  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const chapter of chapters) {
      await addChapterAndLinkToGroup(chapter);
    }

    const owner = userData ? String(userData.id) : '';


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
        Proprietaire: owner, 
        Payant: group.payant,
        categories: selectedCategories.map((categoryId) => categoryId),
        chapitres: chapterIds,
        owner: owner,
      },
    };    
  
    // Convertissez l'objet en JSON et ajoutez-le au FormData
    formData.append('data', JSON.stringify(dataToSend.data));
  
    try {
      const response = await fetch(`http://localhost:1337/api/groupes${groupeID}?populate=*`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la publication du groupe');
      }
  
      setSuccessMessage('Le groupe à été publié.');
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

  const toggleCategories = (event) => {
    event.preventDefault(); // This prevents the default form submission behavior
    setShowCategories(!showCategories);
  };
  
  const createChapter = async (chapter) => {
    const token = getToken();
    const response = await fetch('http://localhost:1337/api/chapitres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ data: chapter })
    });

    if (response.ok) {
      const data = await response.json();
      return data.data.id; // Return the ID of the created chapter
    } else {
      // Handle error
      console.error('Error creating chapter');
    }
  };

  const addChapter = () => {
    setChapters([...chapters, { titre: '', description: '' }]);
  };

  // Function to handle chapter form submission
  const addChapterAndLinkToGroup = async (index) => {
    const id = await createChapter(chapters[index]);
    if (id) {
      setChapterIds(prevIds => [...prevIds, id]); // Add the new chapter's ID to the state
    }
  };

  const handleCategoryChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCategories(values);
  };

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
        <h1 className="text-2xl font-black mb-4 text-custom-blue">Modification de votre groupe</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 ml-12 mr-12">

      <div>

      </div>
      
      <div className="mb-6">
        <label 
          htmlFor="imageInput" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Ajouter une image
        </label>
        <input 
          type="file" 
          id="imageInput" 
          onChange={handleImageChange} 
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <button 
          type="button" 
          className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-custom-blue bg-custom-orange hover:bg-custom-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-orange"
        >
          Ajouter Image
        </button>
      </div>


      <div className="mb-6">
        <label 
          htmlFor="titre" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Titre
        </label>
        <input 
          type="text" 
          name="titre" 
          id="titre" 
          required
          onChange={handleChange} 
          value={group.titre}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
        />
      </div>


      <div className="mb-6">
        <label 
          htmlFor="description" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description
        </label>
        <textarea 
          name="description" 
          id="description" 
          required
          onChange={handleChange} 
          value={group.description}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out h-32 resize-vertical"
        ></textarea>
      </div>

      <div className="mb-6">
        <label 
          htmlFor="category" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Catégorie(s)
        </label>
        <button
          type="button"
          onClick={toggleCategories}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-custom-blue bg-custom-orange hover:bg-custom-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-orange transition duration-150 ease-in-out"
        >
          {showCategories ? 'Masquer Catégories' : 'Voir Catégories'}
          <svg className={`ml-2 -mr-0.5 h-4 w-4 ${showCategories ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>


{showCategories && (
        <div className="mb-6">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center mt-3">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              className="form-checkbox h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              value={category.id}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategorySelection(category.id)}
            />
            <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
              {category.name}
            </label>
          </div>
        ))}
      </div>      
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        {selectedCategories.map((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          return (
            <span key={categoryId} className="flex items-center gap-2 bg-custom-orange text-custom-blue px-3 py-1 rounded-full text-sm font-medium">
              {category?.name}
              <button
                type="button"
                onClick={() => handleCategorySelection(categoryId)}
                className="bg-custom-orange hover:bg-custom-yellow rounded-full p-1 inline-flex items-center justify-center text-custom-blue"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </span>
          );
        })}
      </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">CONTENU</h2>
        </div>

        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={index} className="p-4 border border-gray-300 rounded-lg shadow">
              <input
                type="text"
                placeholder="Titre du chapitre"
                value={chapter.titre}
                onChange={(e) => handleChapterChange(index, 'titre', e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                placeholder="Description du chapitre"
                value={chapter.description}
                onChange={(e) => handleChapterChange(index, 'description', e.target.value)}
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
              ></textarea>
              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => publishChapter(index)}
                  className="px-4 py-2 bg-custom-yellow hover:bg-custom-orange text-custom-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-yellow focus:ring-offset-2"
                >
                  Publier le chapitre
                </button>
                {chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChapter(index)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Supprimer le chapitre
                  </button>
                )}
              </div>
            </div>
          ))}

        <button
          type="button"
          onClick={addChapter}
          className="mt-4 px-4 py-2 bg-custom-orange hover:bg-custom-yellow text-custom-blue font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-custom-orange focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Ajouter un chapitre
        </button>
      </div>

      <div className="mb-6">
          <label htmlFor="payant" className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="payant"
              id="payant"
              onChange={handleCheckboxChange}
              checked={group.payant}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-700">Payant</span>
          </label>
        </div>

      <div className="mt-8 flex justify-center">
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-custom-blue bg-custom-orange hover:bg-custom-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-orange">
          Créer Groupe
        </button>
      </div>
      <div>

      </div>

      </form>
    </>
  );
};

export default EditGroup;
