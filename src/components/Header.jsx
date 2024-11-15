export default function Header({ handleToggleMenu }) {
  return (
    <header>
      <button onClick={handleToggleMenu}>
        <i className="fa-solid fa-bars"></i>
      </button>
      <h1 className="text-gradient">Pokèdex</h1>
    </header>
  );
}
