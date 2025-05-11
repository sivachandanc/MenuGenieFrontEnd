import menugenie from "../../assets/menu_genie_logo.png";
function MenuGenieLogo(){
    return (
      <div className="group h-10 w-10 rounded-full overflow-hidden bg-[#0a0f2c] shadow-[0_0_12px_#3b82f6] transition-shadow duration-300">
        <img
          src={menugenie}
          alt="MenuGenie Logo"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  };

export default MenuGenieLogo;