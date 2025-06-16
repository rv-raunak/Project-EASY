import React from "react";

import consultIcon from "../Categories/Images/consulting.png";
import reminderIcon from "./Images/notification.png";
import bpIcon from "./Images/arm.png";
import fallDataIcon from "./Images/fall.png";
import connectIcon from "./Images/link.png";
import medicinesIcon from "./Images/pill.png";
import hospitalsIcon from "./Images/hospital.png";
import locateIcon from "./Images/pointer.png";
import { useNavigate } from "react-router-dom";
function Categories() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-4 grid-rows-2  h-60 w-screen gap-y-4 p-2">
      <div className="  flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%] bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center pl-2">
          <img src={consultIcon} alt="" className=" h-[80%] w-[100%]" />
        </div>
        <div className="h-[10%] w-[90%] rounded-md flex items-center justify-center text-[#7E7D7D] ">
          Consult
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%]   bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center">
          <img src={reminderIcon} alt="" className="h-[80%] w-[80%]" />
        </div>
        <div className="h-[10%] w-[90%] rounded-md flex items-center justify-center text-[#7E7D7D]">
          Reminder
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%]  bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center">
          <img src={bpIcon} alt="" className="h-[80%] w-[80%]" />
        </div>
        <div className="h-[10%] w-[90%] rounded-md flex items-center justify-center text-[#7E7D7D]  ">
          BP
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%]  bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center">
          <img src={fallDataIcon} alt="" className="h-[80%] w-[80%]" />
        </div>
        <div className="h-[10%] w-[90%] rounded-md flex items-center justify-center text-[#7E7D7D]">
          Fall Data
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%] bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center">
          <img src={connectIcon} alt="" className="h-[70%] w-[70%]" />
        </div>
        <div className="h-[10%] w-[90%]rounded-md flex items-center justify-center text-[#7E7D7D]">
          Connect
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%]  bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center">
          <img src={medicinesIcon} alt="" className="h-[80%] w-[80%]" />
        </div>
        <div className="h-[10%] w-[90%]  rounded-md flex items-center justify-center text-[#7E7D7D]">
          Medicines
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className="h-[80%] w-[80%]  bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center">
          <img src={hospitalsIcon} alt="" className="h-[80%] w-[80%]" />
        </div>
        <div className="h-[10%] w-[90%]rounded-md flex items-center justify-center text-[#7E7D7D] ">
          Hospitals
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <div
          className="h-[80%] w-[80%]  bg-[#D9D7A9] rounded-md transition-all active:scale-90 flex items-center justify-center "
          onClick={() => navigate("/location")}
        >
          <img src={locateIcon} alt="" className="h-[80%] w-[80%]" />
        </div>
        <div className="h-[10%] w-[90%]  rounded-md  flex items-center justify-center text-[#7E7D7D] ">
          Track Me
        </div>
      </div>
    </div>
  );
}

export default Categories;
