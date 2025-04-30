import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="container-custom py-4">
        <div className="flex flex-col items-center justify-center">
          <Link to="/" className="mb-2">
            <span className="text-lg font-semibold bg-gradient-to-r from-primary-600 to-secondary-500 text-transparent bg-clip-text">
              ChronoSpace
            </span>
          </Link>
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {currentYear} ChronoSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
