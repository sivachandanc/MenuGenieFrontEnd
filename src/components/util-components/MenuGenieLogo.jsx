import menugenie from "../../assets/menu_genie_logo.png";

function MenuGenieLogo() {
  return (
    <div className="h-14 w-14">
      <img
        src={menugenie}
        alt="MenuGenie Logo"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export default MenuGenieLogo;
