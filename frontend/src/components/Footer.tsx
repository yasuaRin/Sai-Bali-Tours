export default function Footer() {
  return (
    <footer className="bg-brand-anchor text-white py-8 mt-24">
      <div className="container mx-auto px-4 text-center">
        <p>© {new Date().getFullYear()} PT. Bali Mertan Pertiwi</p>
        <p className="mt-1 text-brand-secondary/70 text-sm">Authentic Bali Experiences Since 2008</p>
      </div>
    </footer>
  );
}