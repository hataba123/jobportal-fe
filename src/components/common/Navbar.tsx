"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "@/i18n/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher"; // Import

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "All Jobs", href: "/job" },
    { name: "IT Companies", href: "/recruiter" },
  ];

  return (
    <nav className="bg-blue-400 border-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="hidden md:flex items-center space-x-6 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-blue-200"
            >
              {link.name}
            </Link>
          ))}

          {/* Dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="inline-flex items-center hover:text-blue-200">
              Services <ChevronDownIcon className="w-4 h-4 ml-1" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border rounded shadow-lg z-50 text-black">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/services/web"
                      className={`block px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Web Dev
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/services/mobile"
                      className={`block px-4 py-2 ${
                        active ? "bg-gray-100" : ""
                      }`}
                    >
                      Mobile Dev
                    </Link>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* 👉 Language Switcher ở desktop */}
          <div>
            <Link href="/auth/login">Sign in / Sign up</Link>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block hover:text-blue-200"
            >
              {link.name}
            </Link>
          ))}

          <div>
            <p className="font-medium">Services</p>
            <Link
              href="/services/web"
              className="block ml-4 hover:text-blue-200"
            >
              Web Dev
            </Link>
            <Link
              href="/services/mobile"
              className="block ml-4 hover:text-blue-200"
            >
              Mobile Dev
            </Link>
          </div>

          {/* 👉 Language Switcher ở mobile */}
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
