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
    return <img src={menugenie} className="h-14 w-auto" />;
  };

  const navBarItems = [
    { name: "About", href: "#" },
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <div className="pt-2 flex">
      <Navbar isBordered className="w-full  relative justify-between">
        <NavbarContent justify="start">
          <NavbarBrand className="flex items-center space-x-1 ml-0 pl-2.5">
            <MenuGenieLogo />
            <Button as={Link} to="/" className="hidden sm:block  text-[var(--text-main)] font-tagees">MenuGenie</Button>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex space-x-10 gap-4" justify="center">
          {navBarItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                href={item.href}
                className="text-[var(--text-main)] font-inter "
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end" className="pr-2.5">
          <NavbarItem className="hidden lg:flex">
            <Link href="#" className="text-[var(--text-main)] font-inter">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button radius="lg" as={Link} to="/signup" variant="flat" className="text-black font-inter bg-[var(--button)] hover:bg-[var(--button-hover)] transition-colors duration-300 py-2 px-4 rounded-full" >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default NavBar;
