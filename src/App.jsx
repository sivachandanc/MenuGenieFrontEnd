import NavBar from "./components/navbar/navbar.jsx";
import HeroSection from "./components/hero-section/HeroSection.jsx";

function App() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <NavBar />
      <HeroSection/>
    </div>
  );
}

export default App;
