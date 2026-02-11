import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-orange">Sai Bali</Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-brand-text hover:text-brand-orange">Home</Link>
          <Link to="/tours" className="text-brand-text hover:text-brand-orange">Tours</Link>
          <Link to="/about" className="text-brand-text hover:text-brand-orange">About</Link>
          <button className="bg-brand-orange text-white px-5 py-2 rounded-lg hover:bg-brand-accent transition">
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
}