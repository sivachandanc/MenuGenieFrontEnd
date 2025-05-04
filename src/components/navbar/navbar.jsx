import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
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
          <NavbarBrand className="flex items-center space-x-2 ml-0 pl-2.5">
            <MenuGenieLogo />
            <p className="hidden sm:block  text-[var(--text-main)] font-tagees">
              MenuGenie
            </p>
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
            <Button radius="lg" as={Link} href="#" variant="flat" className="text-[var(--text-main)] font-inter bg-[var(--primary)]" >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}

export default NavBar;
