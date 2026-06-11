// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Contact from './pages/Contact';
import Home from './pages/Home';
import ToursByCategory from './pages/ToursByCategory';
import TourDetail from './pages/TourDetail';
import Adventures from './pages/Adventures';
import Packages from './pages/Packages';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/tour" element={<Navigate to="/tour/category/all" replace />} />
              <Route path="/tour/category/:category" element={<ToursByCategory />} />
              <Route path="/tour/:id" element={<TourDetail />} />
              <Route path="/adventures" element={<Adventures />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
          <Chatbot />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;