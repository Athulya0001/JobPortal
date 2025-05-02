import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../../Context/ThemeContext";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaPlus,
  FaMinus,
} from "react-icons/fa";
import Logo from "../Logo/Logo";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  const footerLinks = [
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Press"],
    },
    {
      title: "Features",
      links: ["Browse Jobs", "Post a Job", "Resume Builder", "Saved Jobs"],
    },
    {
      title: "Support",
      links: ["Help Center", "Contact Us", "Privacy Policy", "Terms"],
    },
  ];

  return (
    <footer
      className={`pt-4 px-4 md:px-6 pb-2 ${
        darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {isHome ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pt-8 pb-2">
              <div className="space-y-4 text-center md:text-left">
                <Logo />
                <p className="text-sm">
                  Nexthire is your smart gateway to the future of hiring and
                  getting hired.
                </p>
                <div className="flex justify-center md:justify-start gap-4 mt-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0096ff] transition"
                  >
                    <FaFacebookF />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0096ff] transition"
                  >
                    <FaLinkedinIn />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0096ff] transition"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#0096ff] transition"
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>

              {footerLinks.map((section, idx) => {
                const [isOpen, setIsOpen] = useState(false);

                return (
                  <div key={idx} className="w-full">
                    <div
                      className="flex items-center justify-between md:block cursor-pointer mb-3"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <h3 className="text-lg font-semibold text-left md:text-center">
                        {section.title}
                      </h3>
                      <div className="md:hidden text-[#0096ff] text-sm">
                        {isOpen ? <FaMinus /> : <FaPlus />}
                      </div>
                    </div>

                    <ul
                      className={`space-y-2 text-sm text-left md:text-center transition-all duration-300 ease-in-out ${
                        isOpen ? "block" : "hidden"
                      } md:block`}
                    >
                      {section.links.map((link, i) => (
                        <li
                          key={i}
                          className="cursor-pointer hover:text-[#0096ff] transition"
                        >
                          {link}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t dark:border-gray-700 border-gray-300 text-xs gap-3 text-center">
              <p>
                &copy; {new Date().getFullYear()} Nexthire. All rights reserved.
              </p>
              <p>
                Nexthire bridges talent and opportunity — empowering candidates
                and recruiters to connect with purpose.
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between text-center gap-3 py-4">
            <Logo />
            <p className="text-xs">
              &copy; {new Date().getFullYear()} Nexthire. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0096ff] transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0096ff] transition"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0096ff] transition"
              >
                <FaTwitter />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0096ff] transition"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
