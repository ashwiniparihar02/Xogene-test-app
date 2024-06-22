import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResult";
import DrugDetails from "./components/DrugDetails";
import Header from "./components/Header"; // Import the Header component
import debounce from "lodash.debounce";

const App = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const fetchResults = async (searchQuery) => {
    try {
      setError("");
      setResults([]); // Clear previous results
      console.log(`Searching for: ${searchQuery}`);

      const response = await axios.get(
        `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${searchQuery}`
      );

      console.log("Drugs API response:", response.data);

      const drugs = response.data.drugGroup.conceptGroup
        ? response.data.drugGroup.conceptGroup.flatMap(
            (group) => group.conceptProperties || []
          )
        : [];

      console.log("Parsed Drugs:", drugs);

      if (drugs.length > 0) {
        setResults(drugs);
      } else {
        setError("No results found.");
      }
    } catch (error) {
      console.error("Error searching for drugs:", error);
      setError("An error occurred while searching.");
    }
  };

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery) => {
      try {
        const suggestionResponse = await axios.get(
          `https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${searchQuery}`
        );

        console.log("Suggestions API response:", suggestionResponse.data);

        const suggestions =
          suggestionResponse.data.suggestionGroup.suggestionList?.suggestion ||
          [];

        console.log("Parsed Suggestions:", suggestions);

        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (query) {
      fetchSuggestions(query);
    }
  }, [query, fetchSuggestions]);

  const handleSearch = () => {
    fetchResults(query);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto p-5">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SearchBar
                    onSearch={(value) => setQuery(value)}
                    onButtonClick={handleSearch}
                  />
                  {error && (
                    <div className="text-red-500 mt-5 ml-36">{error}</div>
                  )}
                  <SearchResults results={results} suggestions={suggestions} />
                </>
              }
            />
            <Route
              path="/drugs/:drug_name"
              element={<DrugDetails query={query} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
