import React, { useState, useEffect } from 'react';
import { getToken } from '../helpers';

const SearchBarUsers = ({ onSearch, onUserClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([])

    const fetchUserData = async () => {
        try {
            const response = await fetch(
                `http://localhost:1337/api/users?filters[username][$contains]=${searchTerm}&populate=*`,
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
                onSearch(data.data);
                setSearchedUsers(data)
            } else {
                throw new Error("Erreur lors de la récupération des données utilisateurs");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données utilisateurs", error);
        }
    };

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            fetchUserData();
        }
    }, [searchTerm]);

    const handleUserClick = (userId) => {
        onUserClick(userId);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='max-w-xs border rounded focus:outline-none focus:border-custom-orange bg-custom-gray'
            />
            <button className='bg-custom-orange text-custom-blue p-2 rounded-3xl' onClick={fetchUserData}>Rechercher</button>
            <div className="max-h-24 overflow-y-auto bg-custom-gray max-w-xs">
                {searchedUsers.map((user) => (
                    <div key={user.id} className="mb-2" onClick={() => handleUserClick(user.id)}>
                        <div className="text-custom-blue bg-custom-gray rounded-md max-w-xs">
                            {user.username}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchBarUsers;
