import React, { useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGooglePlay,
  FaAppStore,
} from "react-icons/fa";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const socialLinks = [
  { icon: FaFacebook, label: "Facebook", href: "#" },
  { icon: FaTwitter, label: "Twitter", href: "#" },
  { icon: FaInstagram, label: "Instagram", href: "#" },
  { icon: FaLinkedin, label: "LinkedIn", href: "#" },
];

const LandingPage = () => {
  useLayoutEffect(() => {
    // save whatever was there before (in case you need to restore it)
    const previous = document.documentElement.style.fontSize;
    // set <html> to 16px (browser default) or whatever you need
    document.documentElement.style.fontSize = "16px";

    return () => {
      // restore the old value when this component unmounts
      document.documentElement.style.fontSize = previous;
    };
  }, []);
  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      {/* Navbar */}
      <header className="py-6 px-4 md:px-8 lg:px-28">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                Y
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                YankApp
              </span>
            </div>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link
              to="/features"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Features
            </Link>
            <Link
              to="/community"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Community
            </Link>
            <Link
              to="/download"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Download
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-16 py-12 md:py-14 max-w-7xl mx-auto">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 lg:leading-tight">
              Your World, Connected.
              <span className="block text-indigo-600">Instantly.</span>
            </h1>
            <p className="text-lg text-gray-600">
              Lugacity App is where moments become memories. <span className="lg:block"> Share your life,
              discover new interests, and connect.</span>
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link
                to="/login"
                className="px-6 py-3 text-white bg-indigo-600 rounded-full shadow hover:bg-indigo-700 transition"
              >
                Join Lugacity Today!
              </Link>
              <Link
                to="/features"
                className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img
              className="w-full max-w-md rounded-2xl shadow-xl mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="People connecting"
            />

            {/* <img
              src="https://images.unsplash.com/photo-1543269825-7d5267035764?q=80&w=2940&auto=format&fit=crop"
              alt="Users interacting"
              className="w-full max-w-md rounded-2xl shadow-xl mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500"
            /> */}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
              Empower Your Social Experience
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              Lugacity App gives you powerful tools to connect and engage with
              the world around you.
            </p>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: "👋",
                  title: "Connect Effortlessly",
                  desc: "Find and connect with people who share your passions.",
                },
                {
                  icon: "📸",
                  title: "Share Moments",
                  desc: "Post photos and updates to share your journey.",
                },
                {
                  icon: "💡",
                  title: "Discover Interests",
                  desc: "Explore trends and join communities.",
                },
                {
                  icon: "💬",
                  title: "Engage & Interact",
                  desc: "Like, comment and chat in real-time.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-md transition transform hover:-translate-y-1"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section
          id="community"
          className="py-16 px-4 md:px-8 lg:px-16 bg-blue-50"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=2938&auto=format&fit=crop"
                alt="Community"
                className="rounded-2xl shadow-xl w-full max-w-md mx-auto transform -rotate-3 hover:rotate-0 transition-transform duration-500"
              />
            </div>
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl font-extrabold text-gray-900">
                A Thriving Community Awaits
              </h2>
              <p className="text-gray-600">
                Join millions sharing stories and building meaningful
                connections every day.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Real-time interactions</li>
                <li>Smart content recommendations</li>
                <li>Privacy-first experience</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          id="download"
          className="py-16 bg-indigo-600 text-white text-center"
        >
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Connect?
            </h2>
            <p className="text-lg mb-8">
              Download Lugacity App today and start building your ultimate
              social experience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/download/google-play"
                className="bg-white text-indigo-600 px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
              >
                Get on Google Play
              </Link>
              <Link
                to="/download/app-store"
                className="bg-white text-indigo-600 px-6 py-3 rounded-full shadow hover:bg-gray-100 transition"
              >
                Get on App Store
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 via-gray-900 to-black text-gray-300">
        <div className="max-w-7xl mx-auto py-14 px-6 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-8 sm:gap-0">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-extrabold text-2xl select-none shadow-lg">
               Y
              </div>
              <span className="text-white font-extrabold text-3xl tracking-widest select-none">
                YankApp
              </span>
            </div>
            
          </div>

          {/* Tagline */}

          {/* Social Icons */}
          <nav className="flex space-x-8">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={`Follow us on ${label}`}
                className="group text-gray-400 hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                tabIndex={0}
              >
                <Icon
                  className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t  border-indigo-800">
          <p className="font-[600] text-center  text-gray-400 text-md tracking-wide leading-relaxed">
              Connecting the world with authentic shared experiences.
            </p>
          <p className="text-center text-gray-500 text-sm pt-4 pb-6 select-none">
            &copy; {new Date().getFullYear()} Lugacity App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
