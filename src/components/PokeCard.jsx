import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import TypeCard from "./TypeCard";
import Modal from "./Modal";

export default function PokeCard({ selectedPokemon }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skill, setSkill] = useState(null);

  const [loadingSkill, setLoadingSkill] = useState(false);
  const { name, height, abilities, stats, types, moves, sprites } = data || {};

  const imgList = Object.keys(sprites || {}).filter((val) => {
    if (!sprites[val]) {
      return false;
    }
    if (["versions", "other"].includes(val)) {
      return false;
    }
    return true;
  });

  async function fetchMoveData(move, moveUrl) {
    if (loadingSkill || !localStorage || !moveUrl) return;

    let c = {};
    if (localStorage.getItem("pokemon-moves")) {
      c = JSON.parse(localStorage.getItem("pokemon-moves"));
    }
    if (move in c) {
      setSkill(c[move]);
      console.log("Found Move in caches");
      return;
    }

    try {
      setLoadingSkill(true);
      const res = await fetch(moveUrl);
      const moveData = await res.json();
      console.log("Fetched Move from an Api " + moveData);
      const description = moveData?.flavor_text_entries.filter((val) => {
        return val.version_group.name === "firered-leafgreen";
      })[0]?.flavor_text;
      const skillData = { name: move, description };
      setSkill(skillData);
      c[move] = skillData;
      localStorage.setItem("pokemon-moves", JSON.stringify(c));
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoadingSkill(false);
    }
  }
  useEffect(() => {
    //if loading,exit logic
    if (loading || !localStorage) return;
    //check if the selected pokemon informations available in the cache
    //1.define the cache
    let cache = {};
    if (localStorage.getItem("pokemon")) {
      cache = JSON.parse(localStorage.getItem("pokemon"));
    }
    //2.check if the selected pokemon is in the cache,otherwise fetch from the api

    if (selectedPokemon in cache) {
      //read from the cache
      setData(cache[selectedPokemon]);
      return;
    }

    //we passed all the cache stuffo no availnd and now need to fetch the data from the api

    async function fetchPokemon() {
      try {
        setLoading(true);
        const baseUrl = "https://pokeapi.co/api/v2/";
        const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
        const finalUrl = baseUrl + suffix;
        const res = await fetch(finalUrl);
        const pokemondata = await res.json();
        setData(pokemondata);
        cache[selectedPokemon] = pokemondata;
        localStorage.setItem("pokemon", JSON.stringify(cache));
        console.log(pokemondata);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPokemon();

    //3.if we fetch from the api,make sure to save the information to the cache for the next time
  }, [selectedPokemon]);

  if (loading || !data) {
    return (
      <div>
        <h4>Loading...</h4>
      </div>
    );
  }
  return (
    <div className="poke-card">
      {skill && (
        <Modal
          handleCloseModal={() => {
            setSkill(null);
          }}
        >
          <div>
            <h6>Name</h6>

            <h2 className="skill-name">{skill.name.replaceAll("-", " ")}</h2>
          </div>
          <div>
            <h6>Description</h6>
            <p>{skill.description} </p>
          </div>
        </Modal>
      )}

      <div>
        <h4>{getFullPokedexNumber(selectedPokemon)}</h4>
        <h2>{name}</h2>
      </div>
      <div className="type-container">
        {types.map((typeObj, typeIndex) => {
          return <TypeCard key={typeIndex} type={typeObj?.type?.name} />;
        })}
      </div>

      <img
        className="default-img"
        src={`/pokemon/${getFullPokedexNumber(selectedPokemon)}.png`}
        alt={`${name}-large-img`}
      />
      <div className="mg-container">
        {imgList.map((spriteUrl, spriteIndex) => {
          const imgUrl = sprites[spriteUrl];
          return (
            <img
              key={spriteIndex}
              src={imgUrl}
              alt={`${name}-img-${spriteUrl}`}
            />
          );
        })}
      </div>
      <h3>Stats</h3>
      <div className="stats-card">
        {stats.map((statObj, statsIndex) => {
          const { stat, base_stat } = statObj;
          return (
            <div key={statsIndex} className="stat-item">
              <p>{stat?.name.replaceAll("-", " ")}</p>
              <h4>{base_stat}</h4>
            </div>
          );
        })}
      </div>
      <h3>Moves</h3>
      <div className="pokemon-move-grid">
        {moves.map((moveObj, moveIndex) => {
          return (
            <button
              key={moveIndex}
              className="button-card pokemon-move"
              onClick={() => {
                fetchMoveData(moveObj?.move?.name, moveObj?.move?.url);
              }}
            >
              <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
