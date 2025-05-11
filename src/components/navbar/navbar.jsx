import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";
import { Link } from "react-router-dom";
import menugenie from "../../assets/menu_genie_logo.png";

function NavBar() {
  const MenuGenieLogo = () => {
    return (
      <div className="group h-14 w-14 rounded-full overflow-hidden">
        <img
          src={menugenie}
          alt="MenuGenie Logo"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  };
  

  const navBarItems = [
    { name: "About", href: "#" },
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <div className="pt-2 flex">
      <Navbar isBordered className="w-full relative justify-between">
        <NavbarContent justify="start">
          <NavbarBrand className="flex items-center space-x-1 ml-0 pl-2.5">
            <MenuGenieLogo />
            <Button
              as={Link}
              to="/"
              className="hidden sm:block text-[var(--text-main)] font-tagees text-2xl"
            >
              MenuGenie
            </Button>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden sm:flex space-x-10 gap-4"
          justify="center"
        >
          {navBarItems.map((item) => (
            <NavbarItem key={item.name} className="relative group">
              <a
                href={item.href}
                className="text-[var(--text-main)] font-inter relative"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[var(--button)] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end" className="pr-2.5">
          <NavbarItem className="hidden lg:flex group relative overflow-hidden">
            <Link
              to="/login"
              className="relative z-10 px-3 py-1 font-inter text-[var(--text-main)] transition-colors duration-300"
            >
              Login
            </Link>
            <span className="absolute inset-0 bg-[var(--button)] scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-0 rounded-md"></span>
          </NavbarItem>
          <NavbarItem>
            <Button
              radius="lg"
              as={Link}
              to="/signup"
              variant="flat"
              className="text-black font-inter bg-[var(--button)] hover:bg-[var(--button-hover)] hover:shadow-lg hover:brightness-105 transition-colors duration-300 py-2 px-4 rounded-full"
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default NavBar;
