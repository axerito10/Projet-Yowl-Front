import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="flex items-center justify-center">
      <input
        type="text"
        placeholder="Rechercher..."
        onChange={(e) => onSearch(e.target.value)}
        className="form-input w-full max-w-xl rounded-full border border-custom-blue pl-4 pr-10 py-2 shadow-sm focus:outline-none focus:border-custom-orange focus:ring-1 focus:ring-custom-orange"
      />
    </div>
  );
};

export default SearchBar;
