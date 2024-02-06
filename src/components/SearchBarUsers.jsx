import React, { useState, useEffect } from 'react';
import { getToken } from '../helpers';

const SearchBarUsers = ({ onSearch, onUserClick, currentUserId }) => {
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
                setSearchedUsers(data.filter(user => user.id !== currentUserId));
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
        <div className="flex flex-col items-center p-4">
            <div className='flex space-x-4 items-center'>
                <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full sm:max-w-xs border border-gray-300 rounded-lg focus:ring-custom-orange focus:border-custom-orange bg-white py-2 px-4 shadow-sm'
                />
                <button className='bg-custom-orange text-custom-blue py-2 px-4 rounded-lg shadow hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-orange transition duration-150 ease-in-out' onClick={fetchUserData}>Rechercher</button>
            </div>
            <div className="mt-4 overflow-y-auto bg-white rounded-lg shadow max-h-60 w-full sm:max-w-xs">
                {searchedUsers.map((user) => (
                    <div key={user.id} className="py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                        <div className="text-custom-blue px-4">
                            {user.username}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchBarUsers;
