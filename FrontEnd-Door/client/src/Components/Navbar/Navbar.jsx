import React from "react";
import { use } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Navbar() {
  let [active, setActive] = useState(false);
  let chaticon = "https://img.icons8.com/forma-light/30/chat.png";
  let chaticon2 = "https://img.icons8.com/forma-light-filled/30/chat.png";
  const handleClick = () => {
    setActive((prev) => !prev);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="w-screen h-15 shadow-[0px_1px_10px_rgba(0,0,0,0.2)] fixed top-0 z-10 p-2 flex bg-white ">
        <div
          className=" h-full flex-2 text-3xl flex items-center justify-center text-black font-bold"
          onClick={() => navigate("/")}
        >
          E A S Y
        </div>
        <div className="h-full flex-3"></div>
        <div
          className="h-full flex flex-1 items-center justify-end transition-all active:scale-95 cursor-pointer"
          onClick={handleClick}
        >
          <img src={active ? chaticon2 : chaticon} alt="Chat" />
          {/* when active is true ,show chaticon2 else show chaticon */}
        </div>
        <div className=" h-full flex  flex-1 items-center justify-center ">
          <div className=" h-[75%] w-[60%] rounded-md bg-[#537D5D] flex items-center justify-center transition-all active:scale-90 cursor-pointer">
            <img
              src="https://img.icons8.com/ios-filled/25/FFFFFF/menu--v6.png"
              alt="Hamburger Menu"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
