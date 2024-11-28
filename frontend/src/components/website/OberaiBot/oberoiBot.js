import { styles } from "./assest.js";


export default class ElasticBot {
  constructor({ position, clientId, eventId, isExpand }) {
    //console.log("clientId-------", clientId, eventId);
    this.position = this.getPosition1(position);
    this.open = false;
    this.initialize1(clientId, isExpand);
    this.injectStyles1();
    this.clientId = clientId;
    this.eventId = eventId;
    this.isExpand = isExpand;
  }

  position = "";
  open = false;
  widgetContainer1 = null;

  getPosition1(position) {
    const [vertical, horizontal] = position.split("-");
    return {
      [vertical]: "30px",
      [horizontal]: "30px",
    };
  }

  async initialize1(clientId, isExpand) {


    const container1 = document.createElement("div");
    Object.keys(this.position).forEach(
      (key) => (container1.style[key] = this.position[key])
    );
    document.body.appendChild(container1);
    const buttonContainer1 = document.createElement("div");
    // buttonContainer1.classList.add("button__container");

    /**
     * Create a span element for the widget icon, give it a class of `widget__icon`, and update its innerHTML property to an icon that would serve as the widget icon.
     */
    const widgetIconElement = document.createElement("button");
    widgetIconElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="22" viewBox="0 0 39 37" class="conversations-visitor-open-icon"><defs><path id="conversations-visitor-open-icon-path-1:r0:" d="M31.4824242 24.6256121L31.4824242 0.501369697 0.476266667 0.501369697 0.476266667 24.6256121z"></path></defs><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g transform="translate(-1432 -977) translate(1415.723 959.455)"><g transform="translate(17 17)"><g transform="translate(6.333 .075)"><path fill="#ffffff" d="M30.594 4.773c-.314-1.943-1.486-3.113-3.374-3.38C27.174 1.382 22.576.5 15.36.5c-7.214 0-11.812.882-11.843.889-1.477.21-2.507.967-3.042 2.192a83.103 83.103 0 019.312-.503c6.994 0 11.647.804 12.33.93 3.079.462 5.22 2.598 5.738 5.728.224 1.02.932 4.606.932 8.887 0 2.292-.206 4.395-.428 6.002 1.22-.516 1.988-1.55 2.23-3.044.008-.037.893-3.814.893-8.415 0-4.6-.885-8.377-.89-8.394"></path></g><g fill="#ffffff" transform="translate(0 5.832)"><path d="M31.354 4.473c-.314-1.944-1.487-3.114-3.374-3.382-.046-.01-4.644-.89-11.859-.89-7.214 0-11.813.88-11.843.888-1.903.27-3.075 1.44-3.384 3.363C.884 4.489 0 8.266 0 12.867c0 4.6.884 8.377.889 8.393.314 1.944 1.486 3.114 3.374 3.382.037.007 3.02.578 7.933.801l2.928 5.072a1.151 1.151 0 001.994 0l2.929-5.071c4.913-.224 7.893-.794 7.918-.8 1.902-.27 3.075-1.44 3.384-3.363.01-.037.893-3.814.893-8.414 0-4.601-.884-8.378-.888-8.394"></path></g></g></g></g></svg>`;
    if (this.position.right == undefined) {
      widgetIconElement.classList.add("chatBtnCenterLeft");
    } else {
      widgetIconElement.classList.add("chatBtnSubmit1");
    }
    //console.log("------", this.position.left);

    //widgetIconElement.classList.add("button__container");
    this.widgetIcon = widgetIconElement;

    /**
     * Create a span element for the close icon, give it a class of `widget__icon` and `widget__hidden` which would be removed whenever the widget is closed, and update its innerHTML property to an icon that would serve as the widget icon during that state.
     */
    const closeIconElement = document.createElement("span");
    ////closeIconElement.innerHTML = CLOSE_ICON;
    closeIconElement.classList.add("widget__icon", "widget__hidden");
    this.closeIcon = closeIconElement;

    /**
     * Append both icons created to the button element and add a `click` event listener on the button to toggle the widget open and close.
     */

    buttonContainer1.appendChild(this.widgetIcon);
    //buttonContainer1.appendChild(this.closeIcon);
    buttonContainer1.addEventListener("click", this.toggleOpenGPT.bind(this));
    buttonContainer1.addEventListener(
      "onload",
      this.toggleOpenGPTOnload.bind(this)
    );

    /**
     * Create a container for the widget and add the following classes:- `widget__hidden`, `widget__container`
     */
    this.widgetContainer1 = document.createElement("div");
    this.widgetContainer1.classList.add("adjWidget");
    this.widgetContainer1.classList.add("widget__hidden");
    this.createWidgetContent1();

    container1.appendChild(this.widgetContainer1);
    container1.appendChild(buttonContainer1);
    // let widgetOpened = localStorage.getItem("widgetOpened");
    // if (isExpand == true && !widgetOpened) {
    //   this.toggleOpenGPT(this, clientId);
    // }

    let widgetOpened = getCookie("widgetOpened");
    if (isExpand == true && !widgetOpened) {
      this.toggleOpenGPT(this, clientId);

      // Replace localStorage.setItem with setCookie
      setCookie("widgetOpened", "true", 1); // Cookie will expire in 1 day
    }
    const messageTextarea = document.getElementById("message");
    const sendButton = document.getElementById("myBtnGPT");
    // console.log("----", clientId)
    sendButton.setAttribute("name", clientId);
    // Add an event listener for the Enter key
    messageTextarea.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        sendButton.setAttribute("name", clientId);
        sendButton.click(clientId); // Trigger the button click when Enter is pressed
      }
    });
  }

  createWidgetContent1() {
    var VosmosGPT = "";
    //chatBotGPTLeft
    var cls = "";
    console.log(this.position.left);
    if (this.position.right === undefined) {
      cls = `chatBotGPTLeft`;
    } else {
      cls = `chatBotGPT`;
    }
    // here
    VosmosGPT =
      `
      <div class="top-0  bottom-0 vh-100" style="width:400px">
          <div class="` +
      cls +
      ` borderRadius position-absolute d-flex flex-column" id="resizableGPT" >
              <div class="chatBotHeader  p-3">
                  <div class="d-flex">
                           <div class="chatUser me-2 mt-1 rounded-circle bg-white align-items-center">
            <img  src="/imgs/oberoiLogo.png" alt="Users Name">
          </div>
          <div class="chatWith text-white w-100 lh-1 mt-1">
            <div class="fs-5 chatBotName text-truncate mt-1 mb-0 font-weight-bold">Athithi</div>
            <div class="fs-6 chatBotName text-truncate mt-0">An AI Virtual Assistant</div>
         
          </div>  
                      <div class="chatClose">
                          <button id="chatCloseBtn" 
                              class="btn p-0 m-0 border-0 rounded-circle d-flex align-items-center justify-content-center chatBtnCircle text-light"
                              type="button" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 19 18" class="conversations-visitor-close-icon"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g fill="#ffffff" transform="translate(-927 -991) translate(900.277 962)"><g transform="translate(27 29)"><path d="M10.627 9.013l6.872 6.873.708.707-1.415 1.414-.707-.707-6.872-6.872L2.34 17.3l-.707.707L.22 16.593l.707-.707L7.8 9.013.946 2.161l-.707-.708L1.653.04l.707.707L9.213 7.6 16.066.746l.707-.707 1.414 1.414-.707.708-6.853 6.852z"></path></g></g></g></svg>
                          </button>
                      </div>
                  </div>
                 
              </div>
              <div class="chatBotBodyGPT px-4 pt-3 ">
                  <div class="chatBotMsg mb-3 userMsg ">
                      <div class="inrMsgBox border borderRadius overflow-hidden">
                          <div class="msgBox bg-light p-3">
                            Welcome! Let's make your visit awesome. How can I help you?
                          </div>
                          
                      </div>
                     
                      
                  </div>
              </div>
              <div class="chatBotFooter border-top px-4 py-3 bg-white">
                  <div class="d-flex justify-content-between align-items-center">
                      <div class="chatInput w-100 position-relative">
                          <textarea class="form-control adjInpt" id="message" rows="2"
                              placeholder="Enter your message..."></textarea>
                          <button  id="myBtnGPT"
                              class="btn p-0 m-0 border-0 rounded-circle d-flex align-items-center justify-content-center position-absolute chatBtnSubmit"
                              type="button">
                             <svg height="24" width="24" version="1.1" xmlns="http://www.w3.org/2000/svg"
                                  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.003 495.003"
                                  xml:space="preserve">
                                  <g id="XMLID_51_">
                                      <path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
                         l-67.6-32.22V456.687z" />
                                      <path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
                        c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
                        l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
                        L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z" />
                                  </g>
                              </svg>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>`;
    this.widgetContainer1.innerHTML = VosmosGPT;
    // Add an event listener to the button element
    const myBtn1 = this.widgetContainer1.querySelector("#myBtnGPT");
    myBtn1.setAttribute("name", this.clientId);
    myBtn1.addEventListener("click", () => {
      myBtn1.setAttribute("name", this.clientId);
      sendMessageq(undefined, this.clientId); // Replace 'onclickFunction' with your desired function
    });

    this.widgetContainer1.addEventListener("click", function (event) {
      const target = event.target;
      if (target.classList.contains("test")) {
        const optionValue = target.textContent;
        OptionCliked(
          optionValue,
          document.querySelector("#myBtnGPT").getAttribute("name")
        );
      }
    });

    const chatCloseBtn = this.widgetContainer1.querySelector("#chatCloseBtn");
    chatCloseBtn.addEventListener("click", () => {
      this.open = false;
      this.widgetIcon.classList.remove("widget__hidden");
      this.widgetContainer1.classList.add("widget__hidden");
    });
  }

  injectStyles1() {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styles.replace(/^\s+|\n/gm, "");
    document.head.appendChild(styleTag);
  }

  toggleOpenGPT() {
    //  console.log("check2", this.open);
    this.open = !this.open;
    // console.log("checkonload", this.open);
    let widgetOpened = localStorage.getItem("widgetOpened");
    if (!widgetOpened) {
      this.widgetIcon.classList.add("widget__hidden");
      this.closeIcon.classList.remove("widget__hidden");
      this.widgetContainer1.classList.remove("widget__hidden");
      // Mark as closed in localStorage
      localStorage.setItem("widgetOpened", true);
      return;
    }
    if (this.open) {
      this.widgetIcon.classList.add("widget__hidden");
      this.closeIcon.classList.remove("widget__hidden");
      this.widgetContainer1.classList.remove("widget__hidden");
    } else {
      this.createWidgetContent1();
      this.widgetIcon.classList.remove("widget__hidden");
      this.closeIcon.classList.add("widget__hidden");
      this.widgetContainer1.classList.add("widget__hidden");
    }
  }

  toggleOpenGPTOnload() { }
}
// Initialize on page load
// window.onload = function() {
//   const widget = new ChatWidget();
//  // const widgetOpened = localStorage.getItem("widgetOpened");

//   if (widgetOpened === null) {
//       // First time loading: Automatically open the widget and set localStorage to "false"
//       widget.toggleOpenGPT();
//       localStorage.setItem("widgetOpened", "false");
//       console.log("Widget opened for the first time, localStorage set to false");
//   }

//   // Otherwise, do nothing on load, widget will open on click
// };

// Call the initialization function on page load

//To intialize Chat
function IntializeChat111(clientId) {
  document.querySelector(
    ".chatBotBodyGPT"
  ).innerHTML = `<div class="chatBotMsg mb-3 userMsg  ">
      <div class="inrMsgBox border borderRadius overflow-hidden">
        <div class="msgBox bg-light p-3">
        Welcome! How can I be of service for virtual events needs on VOSMOS
        </div>
      <div class="actionBox p-3 text-center">
        <button class="test btn widget__containerbtnPrimary  widget__containerbtnPrimaryOutline me-2 p-2 mb-2">I can assist you in planning an event with a detailed agenda</button>
        <button class="test btn widget__containerbtnPrimary widget__containerbtnPrimaryOutline p-2 mb-2">I can help you in creating poll for your event</button>
        <button class="test btn widget__containerbtnPrimary widget__containerbtnPrimaryOutline me-2 mb-2">I can assist you drafting feedback for your event</button>
        <button class="test btn widget__containerbtnPrimary widget__containerbtnPrimaryOutline mb-2">I can script quiz for your event</button>
      </div>
      </div>
    </div>`;
  $.ajax({
    data: {
      clientId: clientId,
    },
    type: "POST",
    url: "https://aievents-api.vosmos.live/initialize",
  }).done(function (data) { });
  // var myElement = document.querySelector(".chatBotBodyGPT");
  // myElement.scrollTop = myElement.scrollHeight;
}
// function generateSixDigitNumber() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

// document.addEventListener('DOMContentLoaded', function() {
//   console.log("button1");
//   const element = document.querySelector('button1');
//   if (element) {
//       element.addEventListener('click', function() {
//           // Your code here
//           console.log("button112");

//           handleClick('List all services offered by Kestone');
//       });
//   }
// });

document.addEventListener("DOMContentLoaded", function () {
  const buttons = [
    { id: 'button1', message: 'List all services offered by Kestone' },
    { id: 'button2', message: 'Highlight the top case study in audience generation' },
    { id: 'button3', message: 'Assist me with marketing strategies' },
    { id: 'button4', message: 'History of Kestone' }
  ];

  buttons.forEach(button => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener('click', function () {
        // sendMessageq(button.message);
        sendMessageqButtonQuery(button.message);
      });
    } else {
      console.log(`Button with id ${button.id} not found`);
    }
  });
});




function removeToken() {
  localStorage.removeItem("tokenCL");
}

// Function to handle chat box closure
function handleChatBoxClosure() {
  // Remove token when chat box is closed
  removeToken();
}

// function generateRandomString(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   const charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }
// window.onload = function() {
//   let userIDCl = localStorage.getItem("userId");

//   if (!userIDCl) {
//     // Generate and store the userId only once on page load
//     userIDCl = generateRandomString(10);
//     localStorage.setItem("userId", userIDCl);
//   }
// };

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

window.onload = async function () {
  let userIDCl = localStorage.getItem("userId");

  if (!userIDCl) {
    // Generate and store the userId only once on page load
    userIDCl = generateRandomString(10);
    localStorage.setItem("userId", userIDCl);
  }

  try {
    // Fetch location based on IP address
    // const response = await fetch("https://ipapi.co/json/");
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) throw new Error("Failed to fetch IP location data.");

    const data = await response.json();
    const { city, country_name } = data;

    // console.log("User ID:", userIDCl);
    // console.log("IP Address:", ip);
    // console.log("Region:", region);
    // console.log("City:", city);

    // console.log("Country:", country_name);

    // Optionally store the data in localStorage
    //localStorage.setItem("ip", ip);
    localStorage.setItem("city", city);
    // localStorage.setItem("region", region);
    localStorage.setItem("country", country_name);
  } catch (error) {
    console.error("Error fetching IP location:", error.message);
  }
};
// function detectBrowser() {
//   const userAgent = navigator.userAgent;
//   let browserName = "Unknown Browser";

//   if (userAgent.includes("Firefox")) {
//     browserName = "Mozilla Firefox";
//   } else if (userAgent.includes("Edg")) {
//     browserName = "Microsoft Edge";
//   } else if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
//     browserName = "Google Chrome";
//   } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
//     browserName = "Apple Safari";
//   } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
//     browserName = "Opera";
//   } else if (userAgent.includes("Trident")) {
//     browserName = "Internet Explorer";
//   }

//   return browserName;
// }

// window.onload = function() {
//   const browser = detectBrowser();
//   console.log("Browser:", browser);

//   // Optional: Display the browser name on the page
//   const browserInfo = document.createElement("div");
//   browserInfo.textContent = `You are using: ${browser}`;
//   document.body.appendChild(browserInfo);
// };


function sendMessageq(value) {
  const myBtn = document.querySelector("#myBtnGPT");
  var html, data;

  if (value !== undefined) {
    data = value;
  } else {
    data = document.querySelector("#message").value; //textarea value
  }

  if (data != "") {
    document.querySelector("#message").value = "";
    html = `
      <div class="chatBotMsg mb-3">
        <div class="inrMsgBox border borderRadius overflow-hidden">
          <div class="msgBox bg-light p-3">${data}</div>
        </div>
      </div>
      <div class="chatBotMsg mb-3 userMsg">
        <div class="inrMsgBox border borderRadius overflow-hidden">
          <div class="msgBox bg-light px-4 py-1 test">
            <div class="loader"></div>
          </div>
        </div>
      </div>`;
    document.querySelector(".chatBotBodyGPT").insertAdjacentHTML('beforeend', html);
    const myElement = document.querySelector(".chatBotBodyGPT");
    myElement.scrollTop = myElement.scrollHeight;
    let userIDCl = localStorage.getItem("userId");
    let tokenCL = localStorage.getItem("tokenCL");
    let cityCl = localStorage.getItem("city") || "";
    let countryCl = localStorage.getItem("country") || "";

    if (!tokenCL) {
      tokenCL = ""; // Set token to empty initially
    }

    const raw = JSON.stringify({
      userId: userIDCl,
      text: data,
      city: cityCl || "",
      country: countryCl || ""
      //   token: tokenCL,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    };

    fetch("https://oberoihotels-botapi.vosmos.live/chatBot/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const newToken = data.token;
        if (newToken) {
          localStorage.setItem("tokenCL", newToken);
        }
        document.querySelectorAll(".loader").forEach(loader => loader.parentElement.remove());
        const responseHTML = `
          <div class="chatBotMsg mb-3 userMsg">
            <div class="inrMsgBox border borderRadius overflow-hidden">
              <div class="msgBox bg-light p-3">${data.response}</div>
            </div>
          </div>`;
        document.querySelector(".chatBotBodyGPT").insertAdjacentHTML('beforeend', responseHTML);
        document.querySelector(".chatBotBodyGPT").scrollTop = document.querySelector(".chatBotBodyGPT").scrollHeight;
        document.querySelector("#chatCloseBtn").addEventListener("click", handleChatBoxClosure);
      });
  }
}
function sendMessageqcopy(value) {
  const myBtn = document.querySelector("#myBtnGPT");
  var html, data;

  if (value !== undefined) {
    data = value;
  } else {
    data = document.querySelector("#message").value; //textarea value
  }

  if (data != "") {
    document.querySelector("#message").value = "";
    html = `
      <div class="chatBotMsg mb-3">
        <div class="inrMsgBox border borderRadius overflow-hidden">
          <div class="msgBox bg-light p-3">${data}</div>
        </div>
      </div>
      <div class="chatBotMsg mb-3 userMsg">
        <div class="inrMsgBox border borderRadius overflow-hidden">
          <div class="msgBox bg-light px-4 py-1 test">
            <div class="loader"></div>
          </div>
        </div>
      </div>`;
    document.querySelector(".chatBotBodyGPT").insertAdjacentHTML('beforeend', html);
    const myElement = document.querySelector(".chatBotBodyGPT");
    myElement.scrollTop = myElement.scrollHeight;
    let userIDCl = localStorage.getItem("userId");
    let tokenCL = localStorage.getItem("tokenCL");

    if (!userIDCl || !tokenCL) {
      //userIDCl = generateSixDigitNumber();
      userIDCl = generateRandomString(10);
      localStorage.setItem("userId", userIDCl);
      tokenCL = ""; // Set token to empty initially
    }

    const raw = JSON.stringify({
      userId: userIDCl,
      text: data,
      //token: tokenCL,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    };

    fetch("https://recommendations.vosmos.events:5000/chatBot/", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const newToken = data.token;
        if (newToken) {
          localStorage.setItem("tokenCL", newToken);
        }
        document.querySelectorAll(".loader").forEach(loader => loader.parentElement.remove());
        const responseHTML = `
          <div class="chatBotMsg mb-3 userMsg">
            <div class="inrMsgBox border borderRadius overflow-hidden">
              <div class="msgBox bg-light p-3">${data.response}</div>
            </div>
          </div>`;
        document.querySelector(".chatBotBodyGPT").insertAdjacentHTML('beforeend', responseHTML);
        document.querySelector(".chatBotBodyGPT").scrollTop = document.querySelector(".chatBotBodyGPT").scrollHeight;
        document.querySelector("#chatCloseBtn").addEventListener("click", handleChatBoxClosure);
      });
  }
}

function sendMessageqButtonQuery11(value) {
  const messageContainer = document.querySelector(".chatBotBodyGPT");
  const messageInput = document.querySelector("#message");
  let data;

  // Determine message content
  if (value !== undefined) {
    data = value;
  } else {
    data = messageInput.value; // textarea value
  }

  if (data.trim() !== "") {
    messageInput.value = ""; // Clear input field
    // Append user message and loader
    messageContainer.insertAdjacentHTML('beforeend', `

      <div class="chatBotMsg mb-3 userMsg">
        <div class="inrMsgBox border borderRadius overflow-hidden">
          <div class="msgBox bg-light px-4 py-1 test">
            <div class="loader"></div>
          </div>
        </div>
      </div>`);

    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Retrieve or generate userId and token
    let userIDCl = localStorage.getItem("userId");
    let tokenCL = localStorage.getItem("tokenCL");

    if (!userIDCl || !tokenCL) {
      userIDCl = generateSixDigitNumber();
      localStorage.setItem("userId", userIDCl);
      tokenCL = ""; // Set token to empty initially
    }

    const raw = JSON.stringify({
      userId: userIDCl,
      text: data,
      token: tokenCL,
    });

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: raw,
    };

    fetch("https://recommendations.vosmos.events:5000/chatBot/", requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        const newToken = data.token;
        if (newToken) {
          localStorage.setItem("tokenCL", newToken);
        }
        // Remove loader and append API response
        document.querySelectorAll(".loader").forEach(loader => loader.parentElement.remove());
        const responseHTML = `
          <div class="chatBotMsg mb-3 userMsg">
            <div class="inrMsgBox border borderRadius overflow-hidden">
              <div class="msgBox bg-light p-3">${data.response}</div>
            </div>
          </div>`;
        messageContainer.insertAdjacentHTML('beforeend', responseHTML);
        messageContainer.scrollTop = messageContainer.scrollHeight;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

// window.addEventListener('beforeunload', function () {
//   localStorage.clear();
// });

window.addEventListener('beforeunload', function () {
  const keysToClear = ['tokenCL', 'userId', 'widgetOpened', 'city', 'country'];

  keysToClear.forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log('Selected keys cleared from localStorage.');
});


function OptionCliked(value, clientId) {
  sendMessageq(value, clientId);
}

function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
// function setCookie(name, value, hours) {
//     const now = new Date();
//     now.setTime(now.getTime() + (hours * 60 * 60 * 1000)); // Convert hours to milliseconds
//     const expires = "expires=" + now.toUTCString();
//     document.cookie = name + "=" + value + ";" + expires + ";path=/";
// }


// Function to get a cookie by name
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}


let isMaximized = false;
function toggleMaximizeGPT() {
  const chatmaximize = document.getElementById("resizableGPT");
  const toggleButton1 = document.querySelector("#toggleButtonGPT");
  if (isMaximized) {
    chatmaximize.classList.remove("toggleCss1");
    isMaximized = false;
    toggleButton1.innerHTML = `
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 2H16.1429M22 2V7.85714M22 2L18.5 5.5M15 9L15.875 8.125" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 15L2 22M2 22H7.85714M2 22V16.1429" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;
  } else {
    chatmaximize.classList.add("toggleCss1");
    isMaximized = true;
    toggleButton1.innerHTML = `
          <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"/>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
          <g id="SVGRepo_iconCarrier"> <path d="M2 22L9 15M9 15H3.14286M9 15V20.8571" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M22 2L15 9M15 9H20.8571M15 9V3.14286" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </g>
          </svg>`;
  }
}

/**for tying effect */
function typeMessage(element, message) {
  let index = 0;
  const typingSpeed = 100; // Adjust typing speed (milliseconds per character)
  const typingInterval = setInterval(() => {
    element.innerHTML += message.charAt(index);
    index++;
    if (index === message.length) {
      clearInterval(typingInterval);
    }
  }, typingSpeed);
  var myElement = document.querySelector(".chatBotBodyGPT");
  myElement.scrollTop = myElement.scrollHeight;
}
