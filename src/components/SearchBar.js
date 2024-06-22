import React, { useState } from "react";

const SearchBar = ({ onSearch, onButtonClick }) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="flex items-center bg-white rounded shadow p-4 ml-[25%] w-[50%]">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Search for drugs..."
      />
      <button
        onClick={onButtonClick}
        className="ml-2 p-2 bg-slate-600 text-white rounded hover:bg-black"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
