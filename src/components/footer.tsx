import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white font-['Urbanist'] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4">Shredded</h3>
          <p className="text-gray-400">
            Performance-driven apparel for athletes. Minimalist design, maximum impact.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/shop/men" className="hover:text-white transition">Men</a>
            </li>
            <li>
              <a href="/shop/women" className="hover:text-white transition">Women</a>
            </li>
            <li>
              <a href="/shop/accessories" className="hover:text-white transition">Accessories</a>
            </li>
            <li>
              <a href="/shop/new" className="hover:text-white transition">New Arrivals</a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <ul className="flex gap-4 text-gray-400">
            <li>
              <a href="https://instagram.com" className="hover:text-white transition">Instagram</a>
            </li>
            <li>
              <a href="https://facebook.com" className="hover:text-white transition">Facebook</a>
            </li>
            <li>
              <a href="https://linkedin.com" className="hover:text-white transition">LinkedIn</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="hidden">
          <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
          <p className="text-gray-400 mb-4">
            Get the latest updates and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-lg text-black flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Shredded. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
