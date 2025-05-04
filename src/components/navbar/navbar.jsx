import { Navbar, NavbarBrand, NavbarContent } from "@heroui/react";
import menugenie from "../../assets/menu_genie_logo.png";

function NavBar() {
  const MenuGenieLogo = () => {
    return <img src={menugenie} className="h-15 w-auto" />;
  };
  return (
    <div className="pt-2 flex justify-center">
        
      <Navbar isBordered>
        <NavbarContent justify="start" className="w-full">
          <NavbarBrand className="flex items-center space-x-2 ml-0 pl-2.5">
            <MenuGenieLogo />
            <p className="hidden sm:block text-[var(--text-main)] font-(family-name:--text-font)">MenuGenie</p>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default NavBar;