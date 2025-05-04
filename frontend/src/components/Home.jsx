import React, { useContext,useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { UserContext } from "../context/UserContext";
import axios from "../config/axios.js";

const Home = () => {
  const { user } = useContext(UserContext); // Destructure user from UserContext;
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [projectName, setProjectName] = useState(""); // State to manage project name


  const [project, setProject] = useState(null);




  function createProject(e) {
    e.preventDefault(); // Prevent default form submission behavior
    // Function to create a new project
    
    axios.post("/projects/create", {
      name: projectName,
    }).then((response) => {
      console.log("Project created successfully:", response.data); // Log success message
      setIsModalOpen(false); // Close the modal after submission
      setProjectName(""); // Reset project name state
    }).catch((error) => {
      console.error("Error creating project:", error); // Log error message
    });
    


  }


  useEffect(() => {
    // Function to fetch user data from the server
    const fetchAllProjects = async () => {
      try {
        const response = await axios.get("/projects/all"); // Fetch user data
        setProject(response.data); // Set user data to state
        // Log user data for debugging
        

        
      } catch (error) {
        console.error("Error fetching user data:", error); // Log error message
      }
    };

    fetchAllProjects(); // Call the function to fetch user data
  },[]);

  const navigate = useNavigate(); // Initialize useNavigate for navigation
  

  return (
    <main className="p-4 w-full h-screen bg-[#0d0e10]">
      <div className="projects">
        <button
          className="project px-4 py-2 border-2 text-gray-200 hover:text-black hover:bg-white transition-all ease-out border-slate-300 rounded-md cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="font-semibold mr-2">New Project</span>
          <i className="ri-link"></i>
        </button>
        <div className="project-list mt-4">
          {project ? (
            project.map((proj) => (
              <div
                key={proj._id}
                onClick={() =>
                  navigate(`/project`, {
                    state: proj,
                  })
                }
                className="project-item cursor-pointer bg-[#161718] hover:bg-white hover:text-black transition-all ease-in text-white p-4 rounded-md mb-2 flex items-center justify-between"
              >
                <span className="font-semibold">{proj.name}</span>
                <span className="font-semibold">
                  <i className="ri-group-line mr-2"></i>
                  {proj.users.length}
                </span>
              </div>
            ))
          ) : (
            <div className="loading-skeleton">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="skeleton-item bg-[#161718] animate-pulse p-4 rounded-md mb-2"
                >
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0d0e10] bg-opacity-50">
          <div className="bg-[#161718] text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label
                  htmlFor="projectName"
                  className="block text-sm mb-2 font-medium text-gray-300"
                >
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  className="mt-1 block w-full p-2 border font-semibold border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-200 text-gray-900 cursor-pointer rounded-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
