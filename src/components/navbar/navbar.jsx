import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import coffeeLogo from "../../assets/coffee_logo.webp";

function NavBar() {
  const MenuGenieLogo = () => {
    return <img src={coffeeLogo} className="h-12 w-auto" />;
  };
  return (
    <div className="pt-6 flex justify-center">
        
      <Navbar isBordered className="rounded-full max-w-6xl w-full bg-[#C0C0C0] shadow-md px-2">
        <NavbarContent justify="start" className="w-full">
          <NavbarBrand className="flex items-center space-x-2 ml-0">
            <MenuGenieLogo />
            <p className="hidden sm:block font-bold text-inherit">Menu Genie</p>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default NavBar;
