import React, { useEffect, useState, useContext,useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios.js";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket.js";
import { UserContext } from "../context/UserContext.jsx";
import Markdown from "markdown-to-jsx";
import hljs from 'highlight.js';


const Project = () => {
  const location = useLocation();
  const [sidePanel, setSidePanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [projectData, setProjectData] = useState(location.state);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State for storing messages

  const { user } = useContext(UserContext);

  function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && hljs) {
            hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [ props.className, props.children ])

    return <code {...props} ref={ref} />
}




  const handleUserSelect = (id) => {
    setSelectedUserId((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((userId) => userId !== id)
        : [...prevSelected, id]
    );
  };

  const addCollaborators = async () => {
    try {
      const response = await axios.put("/projects/add-user", {
        projectId: location.state._id,
        users: selectedUserId,
      });
      console.log("Collaborators added successfully:", response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding collaborators:", error);
    }
  };

  const sendMessageToGroup = () => {
    if (message.trim() === "") return;

    const outgoingMessage = {
      message,
      sender: user,
    };

    sendMessage("project-message", outgoingMessage);
    setMessages((prevMessages) => [...prevMessages, outgoingMessage]); // Add outgoing message to state
    setMessage("");
  };

  function WriteAiMessage(message) {
    let messageObject;
  
    try {
      messageObject = JSON.parse(message); // Attempt to parse the message
      
    } catch (error) {
      console.error("Invalid JSON message:", message, error);
      return <p className="text-red-500">Invalid AI message format</p>; // Fallback for invalid JSON
    }
  
    return (
      <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
        <Markdown
          children={messageObject}
          options={{
            overrides: {
              code: SyntaxHighlightedCode,
            },
          }}
        />
      </div>
    );
  }



  useEffect(() => {
    if (projectData) {
      const fetchUsers = async () => {
        try {
          const response = await axios
            .get("/users/all")
            .then((res) => {
              const allUsers = res.data;
              if (projectData[0] && projectData[0].users) {
                const projectUserIds = projectData[0].users.map(
                  (user) => user._id
                );
                const filteredUsers = allUsers.filter(
                  (user) => !projectUserIds.includes(user._id)
                );
                setUsers(filteredUsers);
              } else {
                setUsers(allUsers);
              }
            })
            .catch((err) => console.log(err));
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [projectData]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios
          .get(`/projects/get-project/${location.state._id}`)
          .then((res) => {
            setProjectData(res.data);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log("Error fetching collaborators:", error);
      }
    };

    fetchProjectData();
  }, []);

  useEffect(() => {
    initializeSocket(projectData);

    receiveMessage("project-message", (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]); // Add incoming message to state
    });
  }, []);




  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight
}


  return (
    <main className="h-screen w-full flex bg-[#0d0e10]">
      <section className="left relative flex flex-col h-full min-w-[35%] bg-[#28282B]">
        <header className="flex items-center bg-[#1b1b1d] justify-between p-4 w-full">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white font-semibold hover:text-gray-400 cursor-pointer p-2 flex gap-2 items-center"
          >
            <i className="ri-add-fill"></i>
            <p>Add Collaborator</p>
          </button>
          <button
            onClick={() => setSidePanel(!sidePanel)}
            className="cursor-pointer p-2"
          >
            <i className="ri-group-fill text-white hover:text-gray-400 text-2xl"></i>
          </button>
        </header>

        <div className="conversation-area flex flex-grow flex-col">
          <div className="message-box p-4 mt-4 gap-4 flex flex-col flex-grow max-h-[calc(100vh-170px)] overflow-y-auto scroll-smooth scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${
                  msg.sender._id === "ai" || msg.sender._id !== user._id ? "incoming-message max-w-80 bg-[#1b1b1b]" : "ml-auto max-w-64"
                } flex flex-col text-white font-semibold p-2 w-fit rounded-lg ${
                  msg.sender._id === "ai" || msg.sender._id !== user._id ? "bg-[#1b1b1b]" : "bg-[#6E31D5]"
                }`}
              >
                <small className="text-gray-400">{msg.sender.email}</small>
                <div className="text-md">
                  {msg.sender._id === "ai" ? 
                    WriteAiMessage(msg.message)
                   : 
                    <p> {msg.message} </p>
                  }
                </div>
              </div>
            ))}
          </div>

          <div className="input-field w-full flex justify-between items-center p-4 bg-[#1b1b1d]">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-2 px-4 bg-[#000000] rounded-xl w-[90%] font-semibold text-white focus:outline-none"
              type="text"
              placeholder="Enter your message"
            />
            <button onClick={sendMessageToGroup} className="px-4 cursor-pointer">
              <i className="ri-send-plane-fill text-white hover:text-gray-400 text-2xl"></i>
            </button>
          </div>
        </div>

        <div
          className={`side-panel flex flex-col gap-2 w-full h-full absolute bg-[#1b1b1d] top-0 transition-transform duration-300 ${
            sidePanel ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-end p-4 bg-[#1b1b1d]">
            <button
              className="p-3 cursor-pointer"
              onClick={() => setSidePanel(!sidePanel)}
            >
              <i className="ri-close-large-line text-white font-semibold hover:text-gray-400"></i>
            </button>
          </header>

          <div className="users flex flex-col gap-2 p-4 overflow-y-auto scrollbar-hide">
            {projectData &&
              projectData[0] &&
              projectData[0].users &&
              projectData[0].users.map((pro) => (
                <div
                  key={pro._id}
                  className="user flex gap-2 items-center rounded-md bg-[#28282B] p-2 hover:bg-[#28282bda] text-white"
                >
                  <div className="aspect-square rounded-full relative p-6 w-fit h-fit flex items-center justify-center bg-black">
                    <i className="ri-user-fill absolute text-xl"></i>
                  </div>
                  <h1 className="font-semibold text-sm cursor-pointer overflow-y-hidden break-words">
                    {pro.email}
                  </h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000065] backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#1b1b1d] rounded-lg shadow-lg w-[90%] max-w-md p-6">
            <header className="flex justify-between z-10 items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Select a User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </header>
            <div className="flex flex-col gap-2 max-h-96 overflow-auto scrollbar-hide">
              {users &&
                users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user._id)}
                    className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${
                      selectedUserId.indexOf(user._id) !== -1
                        ? "border-2 border-green-500 text-white"
                        : "text-white hover:bg-[#3a3a3d]"
                    }`}
                  >
                    <div className="aspect-square rounded-full bg-black px-3 py-2 flex items-center justify-center">
                      <i
                        className={`ri-user-fill text-xl ${
                          selectedUserId.indexOf(user._id) !== -1
                            ? "text-white"
                            : ""
                        }`}
                      ></i>
                    </div>
                    <h1 className="font-semibold">{user.email}</h1>
                  </div>
                ))}
            </div>

            <div className="w-full flex items-center justify-center mt-2">
              <button
                className="bg-[#6E31D5] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#5a28a8] cursor-pointer"
                onClick={() => addCollaborators()}
              >
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
