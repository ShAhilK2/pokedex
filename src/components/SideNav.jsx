import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";

export default function SideNav({
  selectedPokemon,
  setSelectedPokemon,
  showSideMenu,
  handleCloseMenu,
}) {
  const [searchValue, setSearchValue] = useState("");

  const filterPokemon = first151Pokemon.filter((ele, eleIndex) => {
    if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
      return true;
    }
    if (ele.toLowerCase().includes(searchValue.toLowerCase())) {
      return true;
    }
    return false;
  });

  return (
    <nav className={`${!showSideMenu ? "open" : ""}`}>
      <div className={`header ${!showSideMenu ? "open" : ""}`}>
        <button className="open-nav-button" onClick={handleCloseMenu}>
          <i className="fa-solid fa-arrow-left-long"></i>
        </button>
        <h1 className="text-gradient">Pokèdex</h1>
      </div>
      <input
        placeholder="E.g 001 0r bulba...."
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
      {filterPokemon.map((pokemon, pokemonIndex) => {
        const truePokedexNumber = first151Pokemon.indexOf(pokemon);
        return (
          <button
            key={pokemonIndex}
            className={`nav-card ${
              selectedPokemon === pokemonIndex ? "nav-card-selected" : ""
            }`}
            onClick={() => {
              setSelectedPokemon(truePokedexNumber);
              handleCloseMenu();
            }}
          >
            <p>{getFullPokedexNumber(truePokedexNumber)}</p>
            <p>{pokemon}</p>
          </button>
        );
      })}
    </nav>
  );
}
