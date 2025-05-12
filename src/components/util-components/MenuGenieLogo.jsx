import menugenie from "../../assets/menu_genie_logo.png";

function MenuGenieLogo() {
  return (
    <div className="group h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
      <div className="bg-[#0a0f2c] rounded-full h-full w-full flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_12px_#8b5cf6]">
        <img
          src={menugenie}
          alt="MenuGenie Logo"
          className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-110"
        />
      </div>
    </div>
  );
}

export default MenuGenieLogo;
