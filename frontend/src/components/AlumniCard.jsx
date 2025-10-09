import React, { useRef, useState } from "react";
import { useMenuClose } from "../utils/closeMenuEffect";

function AlumniCard({ alum, index, authUser, onEditAlumni }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleContextMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEditAlumni = () => {
    onEditAlumni();
    setIsMenuOpen(false);
  };

  useMenuClose(menuRef, () => {
    setIsMenuOpen(false);
  });

  return (
    <div
      key={alum._id}
      className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
    >
      <div className="grid grid-cols-2">
      <div className="col-start-1 col-end-3">
        <h3 className="text-xl font-semibold text-[#13665b]">{alum.name}</h3>
      </div>
      {authUser?.role == "admin" && (
        <div className="col-span-2 col-end-7" ref={menuRef}>
          <div className="relative">
            <div className="flex flex-col space-y-1" role="button" onClick={() => handleContextMenuToggle()} tabIndex={index}>
            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
            </div>
            {isMenuOpen && (
              <ul tabIndex={index} className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <li><button onClick={handleEditAlumni} className="block w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden">Edit</button></li>
              </ul>
            )}
          </div>
        </div>
      )}
      </div>
      <p>Email: {alum.Email || "N/A"}</p>
      <p>Mobile: {alum.MobileNumber || "N/A"}</p>
      <p>Company: {alum.company || "N/A"}</p>
      <p>Batch: {alum.batch || "N/A"}</p>
      <p>Institute ID: {alum.InstituteId || "N/A"}</p>
      {alum.linkedin && (
        <a
          href={alum.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600  hover:underline"
        >
          LinkedIn Profile
        </a>
      )}
    </div>
  );
}

export default AlumniCard;
