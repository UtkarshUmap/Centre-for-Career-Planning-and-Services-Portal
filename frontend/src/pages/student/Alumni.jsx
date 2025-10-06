import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import useGetAlumni from "../../api/alumni/useGetAlumni";
import useGetAllAlumni from "../../api/alumni/useGetAllAlumni";
import { useAuthContext } from '../../context/AuthContext';
import useAlumniAdmin from "../../api/alumni/useAlumniAdmin";
import toast from "react-hot-toast";

const Alumni = () => {
  const { authUser } = useAuthContext();
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("company");
  const [alumniList, setAlumniList] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAlumniIndex, setActiveAlumniIndex] = useState(-1);

  const { loading: loadingAll, alumni } = useGetAllAlumni();
  const { loading: loadingSearch, getAlumni } = useGetAlumni();
  const { deleteAlumni } = useAlumniAdmin();

  useEffect(() => {
    setAlumniList(alumni);
  }, [alumni]);

  const handleSearch = async () => {
    const data = await getAlumni(searchType, search);
    setAlumniList(data.length > 0 ? data : []);
  };

  const handleReset = () => {
    setSearch("");
    setSearchType("company");
    setAlumniList(alumni);
  };

  const handleContextMenuToggle = (index) => {
    setIsMenuOpen(!isMenuOpen);
    setActiveAlumniIndex(isMenuOpen ? -1 : index);
  };

  const handleDeleteAlumni = (id) => async () => {
    const token = localStorage.getItem("ccps-token");
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this alumni?")) {
      try {
        await deleteAlumni(id, token);
        setAlumniList((prev) => prev.filter((alum) => alum._id !== id));
        setIsMenuOpen(false);
      } catch (error) {
        toast.error("Failed to delete alumni");
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  const labelMap = {
    company: "Company Name",
    jobRole: "Job Role",
    jobId: "Job ID",
    batch: "Batch (e.g., 2022 or 2022-2025)",
    name: "Name",
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <section className="flex-1 overflow-y-auto pt-16 bg-gray-100 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mt-6 md:mt-0 font-bold text-center text-[#13665b] mb-4">
            Welcome to the Alumni Portal 🎓
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Search for alumni by company, job role, job ID, batch or name
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-2 mb-8">
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md"
            >
              <option value="company">Company</option>
              <option value="jobRole">Job Role</option>
              <option value="jobId">Job ID</option>
              <option value="batch">Batch</option>
              <option value="name">Name</option>
            </select>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Enter ${labelMap[searchType]}`}
              className="px-4 py-2 border border-gray-300 rounded-md w-72"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-[#13665b] "
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-[#13665b] "
            >
              Reset Search
            </button>
          </div>

          {(loadingAll || loadingSearch) ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : alumniList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {alumniList.map((alum, index) => (
                <div
                  key={alum._id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
                >
                  <div className="grid grid-cols-2">
                    <div className="col-start-1 col-end-3">
                      <h3 className="text-xl font-semibold text-[#13665b]">{alum.name}</h3>
                    </div>
                    {authUser?.role == "admin" && (
                      <div className="col-span-2 col-end-7">
                        <div className="relative">
                          <div className="flex flex-col space-y-1" role="button" onClick={() => handleContextMenuToggle(index)} tabIndex={index}>
                            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="block w-1 h-1 bg-gray-600 rounded-full"></span>
                          </div>
                          {isMenuOpen && activeAlumniIndex === index && (
                            <ul tabIndex={index} className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                              <li><button onClick={handleDeleteAlumni(alum._id)} className="block w-full px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100 focus:outline-hidden">Delete</button></li>
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
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No alumni found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Alumni;