import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import MenuGenieLogo from "../util-components/MenuGenieLogo";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navBarItems = [
    { name: "About", href: "#about" },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <div className="pt-4 px-6 sticky top-0 z-50">
      <Navbar
        isBordered
        className="w-full relative justify-between shadow-sm backdrop-blur-md bg-[var(--button)] text-black rounded-xl py-2 px-4 pl-0"
      >
        {/* Left - Brand */}
        <NavbarContent justify="start">
          <NavbarBrand className="flex items-center space-x-1 ml-0">
            <MenuGenieLogo />
            <Button
              as={Link}
              to="/"
              className=" text-[var(--text-main)] font-tagees text-2xl tracking-tight pl-0"
              variant="light"
            >
              MenuGenie
            </Button>
          </NavbarBrand>
        </NavbarContent>

        {/* Center - Desktop Menu */}
        <NavbarContent
          className="hidden sm:flex gap-6 font-inter"
          justify="center"
        >
          {navBarItems.map((item) => (
            <NavbarItem key={item.name} className="relative group">
              <a
                href={item.href}
                className="text-[var(--text-main)] text-lg font-medium transition-colors duration-300 hover:text-black"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#fff7ec]/90 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right - Auth Buttons (Desktop) */}
        <NavbarContent justify="end" className="gap-2 hidden sm:flex">
          <NavbarItem className="group relative overflow-hidden">
            <Link
              to="/login"
              className="relative z-10 px-4 py-2 text-lg font-medium text-[var(--text-main)] transition-colors duration-100 hover:text-black"
            >
              Login
            </Link>
            <span className="absolute inset-0 bg-[#fff7ec]/90 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-0 rounded-md"></span>
          </NavbarItem>
          <NavbarItem>
            <Button
              radius="lg"
              as={Link}
              to="/signup"
              variant="flat"
              className="text-black font-inter bg-[#fff7ec]/90 hover:bg-[var(--button-hover)] hover:shadow-lg hover:brightness-105 transition-all duration-200 py-2 px-5 rounded-full"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>

        {/* Right - Mobile Toggle */}
        <div className="sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-[var(--text-main)] focus:outline-none"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Navbar>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-2 p-4 rounded-xl shadow-md bg-[var(--button)] text-black space-y-3 font-inter">
          {navBarItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block text-lg font-medium transition-colors duration-300 hover:text-black"
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <hr />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-center text-lg font-medium text-[var(--text-main)] hover:text-black"
            >
              Login
            </Link>
            <Button
              as={Link}
              to="/signup"
              variant="flat"
              radius="lg"
              className="text-black font-inter bg-[#fff7ec]/90 hover:bg-[var(--button-hover)] hover:shadow-lg hover:brightness-105 transition-all duration-200 py-2 px-5 rounded-full"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
