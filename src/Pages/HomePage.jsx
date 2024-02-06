import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Pages/Style/WelcomePage.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getToken, getUserId } from "../helpers.js";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import Header from "../components/Header.jsx";

const HomePage = () => {
  const [groups, setGroups] = useState([]);
  const [userData, setUserData] = useState(null);
  const [groupFollow, setGroupFollow] = useState([]);
  const [userFavoris, setUserFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Récupération des favoris de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/privates/${getUserId()}?populate=*`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserFavoris(data.data.attributes.groupeFavoris.data);
        } else {
          throw new Error(
            "Erreur lors de la récupération des données de l'utilisateur"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur",
          error
        );
        setError("Erreur lors de la récupération des données de l'utilisateur");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filteredGroups = searchTerm
    ? groups.filter(group =>
        group.Titre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : groups;  

  // Fonction bouton ajout aux favoris
  const addFavorite = async (id) => {
    try {
      const raw = {
        data: {
          groupeFavoris: {
            connect: [id],
          },
        },
      };

      const response = await fetch(
        `http://localhost:1337/api/privates/${getUserId()}?populate=*`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(raw),
        }
      );

      if (response.ok) {
        console.log(`Ajout du groupe avec l'ID ${id} aux favoris réussi.`);
      } else {
        throw new Error(`Erreur lors de l'ajout du groupe aux favoris`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'ajout du groupe aux favoris`, error);
      setError(`Erreur lors de l'ajout du groupe aux favoris`);
    }
  };

  // Fonction bouton suppression des favoris
  const removeFavorite = async (id) => {
    try {
      const raw = {
        data: {
          groupeFavoris: {
            disconnect: [id],
          },
        },
      };

      const response = await fetch(
        `http://localhost:1337/api/privates/${getUserId()}?populate=*`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(raw),
        }
      );

      if (response.ok) {
        console.log(`Suppression du groupe avec l'ID ${id} des favoris réussie.`);
      } else {
        throw new Error(`Erreur lors de la suppression du groupe des favoris`);
      }
    } catch (error) {
      console.error(`Erreur lors de la suppression du groupe des favoris`, error);
      setError(`Erreur lors de la suppression du groupe des favoris`);
    }
  };

  // Fetch des groupes depuis l'API Strapi
  useEffect(() => {
    fetch("http://localhost:1337/api/groupes?populate=*", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const transformedGroups = data.data.map((item) => {
          const imageUrl = item.attributes.image?.data?.attributes?.url
            ? `http://localhost:1337${item.attributes.image.data.attributes.url}`
            : null;

          return {
            id: item.id,
            ...item.attributes,
            ImageUrl: imageUrl,
          };
        });
        setGroups(transformedGroups);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // Paramètres de configuration pour react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // Fetch des groupes suivis par l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/privates/${getUserId()}?populate=*`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setUserData(data.data.attributes.groupeFollow.data);

          if (
            data &&
            data.data &&
            data.data.attributes &&
            data.data.attributes.groupeFollow.data
          ) {
            const banners = await Promise.all(
              data.data.attributes.groupeFollow.data.map(async (groupe) => {
                try {
                  const groupeResponse = await fetch(
                    `http://localhost:1337/api/groupes/${groupe.id}?populate=*`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                      },
                    }
                  );

                  if (groupeResponse.ok) {
                    const groupeData = await groupeResponse.json();
                    const groupID = groupe.id;
                    return { ...groupeData.data.attributes, groupID };
                  } else {
                    console.error(
                      `Erreur lors de la récupération du favori ${groupe.id}`
                    );
                    // Ajouter une URL de bannière par défaut ici
                    return {
                      data: { attributes: { url: "/default-banner.jpg" } },
                    };
                  }
                } catch (error) {
                  console.error(error);
                  throw new Error(
                    "Erreur lors de la récupération des bannières"
                  );
                }
              })
            );

            setGroupFollow(banners);
          }
        } else {
          throw new Error(
            "Erreur lors de la récupération des données de l'utilisateur"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de l'utilisateur",
          error
        );
        setError("Erreur lors de la récupération des données de l'utilisateur");
      } finally {
        setLoading(false);
        setLoadingBanners(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 my-8">
        <input
          type="text"
          placeholder="Rechercher..."
          className="p-2 border border-gray-300 rounded shadow w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm ? (
        <section className="container mx-auto px-4 my-8">
          <h2 className="text-2xl font-bold mb-4 text-custom-blue">
            Résultats de recherche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <Link to={`/group/${group.id}`} key={group.id}>
                <div className="group card relative p-5 transition-transform duration-300 hover:scale-105">
                  <img
                    src={group.ImageUrl || "/default-banner.jpg"}
                    alt={group.Titre}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div className="text-center mt-2">
                    <span className="text-lg font-semibold">{group.Titre}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <>
      <section className="container mx-auto px-4 my-8">
        <h2 className="text-2xl font-bold mb-4 text-custom-blue">
          VOS RECOMMANDATIONS
        </h2>
        <Slider {...settings}>
          {groups.filter(group => group.Titre.toLowerCase().includes(searchTerm.toLowerCase())).map((group) => (
            <Link to={`/group/${group.id}`} key={group.id}>
              <div
                className="group card relative p-5 transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={group.ImageUrl}
                  alt={group.Titre}
                  className="w-full h-40 object-cover rounded-lg transition duration-300 ease-in-out group-hover:opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                  <span className="text-custom-blue text-xl font-bold">
                    {group.Titre}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </section>

      <section className="container mx-auto px-4 my-8">
        <h2 className="text-2xl font-bold mb-4 text-custom-blue">
          VOS GROUPES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupFollow.map((follow) => (
            <div
              className="group card relative p-5 transition-transform duration-300 hover:scale-105"
              key={follow.groupID}
              onMouseEnter={() => setIsHovered(follow.groupID)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Link to={`/group/${follow.groupID}`}>
                {follow.image.data && follow.image.data.attributes.url ? (
                  <img
                    className="w-full h-40 object-cover rounded-lg transition duration-300 ease-in-out group-hover:opacity-50"
                    src={`http://localhost:1337${follow.image.data.attributes.url}`}
                    alt={`Bannière du groupe ${follow.Titre || "Sans titre"}`}
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                    Aucune bannière
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                  <>
                    <h3 className="text-lg text-center font-bold mb-2">
                      {follow.Titre}
                    </h3>
                    {isHovered === follow.groupID && (
                      <button
                        className="text-custom-orange font-bold absolute top-0 right-0 p-2 z-100"
                        onClick={() =>
                          userFavoris.find(
                            (favorite) => favorite.id === follow.groupID
                          )
                            ? removeFavorite(follow.groupID)
                            : addFavorite(follow.groupID)
                        }
                      >
                        {userFavoris.find(
                          (favorite) => favorite.id === follow.groupID
                        ) ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                    )}
                  </>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 my-8">
        <h2 className="text-2xl font-bold mb-4 text-custom-blue">
          LES PLUS POPULAIRES
        </h2>
        <Slider {...settings}>
          {groups.filter(group => group.Titre.toLowerCase().includes(searchTerm.toLowerCase())).map((group) => (
            <Link to={`/group/${group.id}`} key={group.id}>
              <div
                className="group card relative p-5 transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={group.ImageUrl}
                  alt={group.Titre}
                  className="w-full h-40 object-cover rounded-lg transition duration-300 ease-in-out group-hover:opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
                  <span className="text-custom-blue text-xl font-bold">
                    {group.Titre}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </section>
      </>
      )}
      <Navbar />
    </>
  );
};

export default HomePage;