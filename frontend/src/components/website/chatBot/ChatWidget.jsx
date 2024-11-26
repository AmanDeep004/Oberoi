import React, { useState, useEffect } from "react";
import "./styles/chatStyles.css";

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Initialize user ID
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = generateRandomString(12);
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    // Fetch location details
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem("city", data.city);
        localStorage.setItem("country", data.country_name);
      })
      .catch((err) => console.error("Error fetching location details:", err));
  }, []);

  const generateRandomString = (length) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // API Call
    const payload = {
      userId,
      text: inputValue,
      city: localStorage.getItem("city"),
      country: localStorage.getItem("country"),
    };

    fetch("https://recommendations.vosmos.events:5000/chatBot/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const botMessage = { text: data.response, isUser: false };
        setMessages((prev) => [...prev, botMessage]);
      })
      .catch((err) => console.error("Error sending message:", err));
  };

  return (
    <div
      className={`chatBotGPT borderRadius position-absolute d-flex flex-column ${
        isOpen ? "" : "chatWidgetClosed"
      }`}
      id="resizableGPT"
    >
      {isOpen && (
        <>
          <div className="chatBotHeader p-3">
            <div className="d-flex">
              <div className="chatUser me-2 mt-1 rounded-circle bg-white align-items-center">
                <img src="/imgs/oberoiLogo.png" alt="User" />
              </div>
              <div className="chatWith text-white w-100 lh-1 mt-1">
                <div className="fs-5 chatBotName text-truncate mt-1 mb-0 font-weight-bold">
                  Athithi
                </div>
                <div className="fs-6 chatBotName text-truncate mt-0">
                  An AI Virtual Assistant
                </div>
              </div>
              <div className="chatClose">
                <button
                  id="chatCloseBtn"
                  className="btn p-0 m-0 border-0 rounded-circle d-flex align-items-center justify-content-center chatBtnCircle text-light"
                  onClick={toggleChat}
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
          <div className="chatBotBodyGPT px-4 pt-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatBotMsg mb-3 ${msg.isUser ? "userMsg" : ""}`}
              >
                <div className="inrMsgBox border borderRadius overflow-hidden">
                  <div className="msgBox bg-light p-3">{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="chatBotFooter border-top px-4 py-3 bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="chatInput w-100 position-relative">
                <textarea
                  className="form-control adjInpt"
                  rows="2"
                  placeholder="Enter your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                {/* <button
                  id="myBtnGPT"
                  className="btn p-0 m-0 border-0 rounded-circle d-flex align-items-center justify-content-center position-absolute chatBtnSubmit"
                  onClick={sendMessage}
                >
                  📨send
                </button> */}
                <button
                  id="myBtnGPT"
                  class="btn p-0 m-0 border-0 rounded-circle d-flex align-items-center justify-content-center position-absolute chatBtnSubmit"
                  type="button"
                  name="804493"
                  onClick={sendMessage}
                >
                  <svg
                    height="24"
                    width="24"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 495.003 495.003"
                    xml:space="preserve"
                  >
                    <g id="XMLID_51_">
                      <path
                        id="XMLID_53_"
                        d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
                         l-67.6-32.22V456.687z"
                      ></path>
                      <path
                        id="XMLID_52_"
                        d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
                        c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
                        l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
                        L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"
                      ></path>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {!isOpen && (
        // <button className="btn openChatButton" onClick={toggleChat}>
        //   Open Chat
        // </button>
        <button className="chatBtnSubmit1" onClick={toggleChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="24"
            height="22"
            viewBox="0 0 39 37"
            class="conversations-visitor-open-icon"
          >
            <defs>
              <path
                id="conversations-visitor-open-icon-path-1:r0:"
                d="M31.4824242 24.6256121L31.4824242 0.501369697 0.476266667 0.501369697 0.476266667 24.6256121z"
              ></path>
            </defs>
            <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
              <g transform="translate(-1432 -977) translate(1415.723 959.455)">
                <g transform="translate(17 17)">
                  <g transform="translate(6.333 .075)">
                    <path
                      fill="#ffffff"
                      d="M30.594 4.773c-.314-1.943-1.486-3.113-3.374-3.38C27.174 1.382 22.576.5 15.36.5c-7.214 0-11.812.882-11.843.889-1.477.21-2.507.967-3.042 2.192a83.103 83.103 0 019.312-.503c6.994 0 11.647.804 12.33.93 3.079.462 5.22 2.598 5.738 5.728.224 1.02.932 4.606.932 8.887 0 2.292-.206 4.395-.428 6.002 1.22-.516 1.988-1.55 2.23-3.044.008-.037.893-3.814.893-8.415 0-4.6-.885-8.377-.89-8.394"
                    ></path>
                  </g>
                  <g fill="#ffffff" transform="translate(0 5.832)">
                    <path d="M31.354 4.473c-.314-1.944-1.487-3.114-3.374-3.382-.046-.01-4.644-.89-11.859-.89-7.214 0-11.813.88-11.843.888-1.903.27-3.075 1.44-3.384 3.363C.884 4.489 0 8.266 0 12.867c0 4.6.884 8.377.889 8.393.314 1.944 1.486 3.114 3.374 3.382.037.007 3.02.578 7.933.801l2.928 5.072a1.151 1.151 0 001.994 0l2.929-5.071c4.913-.224 7.893-.794 7.918-.8 1.902-.27 3.075-1.44 3.384-3.363.01-.037.893-3.814.893-8.414 0-4.601-.884-8.378-.888-8.394"></path>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </button>
      )}
    </div>
  );
}

export default ChatWidget;

// import React, { useState, useEffect } from "react";
// import "./styles/chatStyles.css";

// function ChatWidget() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [userId, setUserId] = useState("");

//   useEffect(() => {
//     // Check for existing userId or generate a new one
//     let storedUserId = localStorage.getItem("userId");
//     if (!storedUserId) {
//       storedUserId = generateRandomString(12);
//       localStorage.setItem("userId", storedUserId);
//     }
//     setUserId(storedUserId);

//     // Fetch user location details
//     fetch("https://ipapi.co/json/")
//       .then((response) => response.json())
//       .then((data) => {
//         localStorage.setItem("city", data.city);
//         localStorage.setItem("country", data.country_name);
//       })
//       .catch((err) => console.error("Error fetching location details:", err));
//   }, []);

//   const toggleChat = () => setIsOpen((prev) => !prev);

//   const sendMessage = () => {
//     if (inputValue.trim() === "") return;

//     const userMessage = { text: inputValue, isUser: true };
//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");

//     // API Call
//     const payload = {
//       userId,
//       text: inputValue,
//       city: localStorage.getItem("city"),
//       country: localStorage.getItem("country"),
//     };

//     fetch("https://recommendations.vosmos.events:5000/chatBot/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const botMessage = { text: data.response, isUser: false };
//         setMessages((prev) => [...prev, botMessage]);
//       })
//       .catch((err) => console.error("Error sending message:", err));
//   };

//   const generateRandomString = (length) => {
//     const characters =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     return Array.from({ length }, () =>
//       characters.charAt(Math.floor(Math.random() * characters.length))
//     ).join("");
//   };

//   return (
//     <div className="chat-widget-container">
//       {!isOpen && (
//         <button className="chat-widget-button" onClick={toggleChat}>
//           {/* Chat button SVG */}
//           <svg viewBox="0 0 39 37" className="chat-icon">
//             <circle cx="18" cy="18" r="16" fill="#007bff" />
//             <text x="12" y="22" fill="#fff" fontSize="12">
//               Chat
//             </text>
//           </svg>
//         </button>
//       )}

//       {isOpen && (
//         <div className="chat-widget">
//           <div className="chat-header">
//             <span>Chat with Athithi</span>
//             <button className="close-btn" onClick={toggleChat}>
//               ✖
//             </button>
//           </div>
//           <div className="chat-body">
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`chat-message ${msg.isUser ? "user" : "bot"}`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//           </div>
//           <div className="chat-footer">
//             <textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder="Type your message..."
//               rows="2"
//             />
//             <button onClick={sendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ChatWidget;
