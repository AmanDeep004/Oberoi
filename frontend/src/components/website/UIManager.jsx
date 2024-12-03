import { useEffect, useState } from "react";
import CustomerKYC from "../../components/website/CustomerKYC";
import InquiryModal from "../../components/website/InquiryModal";
import InquiryForBanquets from "../../components/website/InquiryForBanquets";
import EventSelection from "../../components/website/EventSelection";
import CurateEvent from "../../components/website/CurateEvent";
import Success from "./Success";
import "react-toastify/dist/ReactToastify.css";
import ContactUs from "./ContactUs";
import FacilityDetailer from "./FacilityDetailer";
import GalleryModal from "./GalleryModal";
import { useGetUserInfoMutation } from "../../app/api/authSlice";
import VenueVisualizer from "./VenueVisualizer";
import { useSaveInteractionMutation } from "../../app/api/website/interactionSlice";
import BanquetModal from "./BanquetModal";
import Toast from "../../helpers/Toast";
import BookaMeeting from "./BookaMeeting";
const UIManager = ({ hotelData, iframeRef }) => {
  const [state, setState] = useState();
  const [getUserInfo] = useGetUserInfoMutation();
  const [user, setUser] = useState();
  const [roomData, setRoomData] = useState();
  const [start, setStart] = useState(false);
  const [saveInteraction] = useSaveInteractionMutation();
  const [callback] = useState(hotelData?.callback ? hotelData?.callback : {});
  const [location, setLocation] = useState();

  const token = localStorage.getItem("token");
  // console.log(hotelData?._id, "hotelId");

  console.log(hotelData?.planMyEvent, "amandeep");

  const updateRoomData = (roomId) => {
    var rd = hotelData.roomInfo.find((el) => el.roomId == roomId);
    console.log(rd, "rd");
    // if (rd?.virtualSittingArrangement.enable) {
    //    setState("venueVisualizer");
    // }
    setRoomData(rd);
  };

  async function getIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip || "Unknown";
    } catch (error) {
      return "Unknown";
    }
  }

  const getBroswerData = () => {
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    // In Opera, the true version is after "OPR" or after "Version"
    if ((verOffset = nAgt.indexOf("OPR")) != -1) {
      browserName = "Opera";
      fullVersion = nAgt.substring(verOffset + 4);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In MS Edge, the true version is after "Edg" in userAgent
    else if ((verOffset = nAgt.indexOf("Edg")) != -1) {
      browserName = "Microsoft Edge";
      fullVersion = nAgt.substring(verOffset + 4);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
      browserName = "Microsoft Internet Explorer";
      fullVersion = nAgt.substring(verOffset + 5);
    }
    // In Chrome, the true version is after "Chrome"
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    }
    // In Safari, the true version is after "Safari" or after "Version"
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) != -1)
        fullVersion = nAgt.substring(verOffset + 8);
    }
    // In Firefox, the true version is after "Firefox"
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if (
      (nameOffset = nAgt.lastIndexOf(" ") + 1) <
      (verOffset = nAgt.lastIndexOf("/"))
    ) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) != -1)
      fullVersion = fullVersion.substring(0, ix);
    if ((ix = fullVersion.indexOf(" ")) != -1)
      fullVersion = fullVersion.substring(0, ix);

    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion)) {
      fullVersion = "" + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }

    return `${browserName} ${fullVersion}`;
  };

  const getOSName = () => {
    var OSName = "Unknown OS";
    console.log(navigator.userAgent);
    if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
    if (navigator.userAgent.indexOf("Mac") != -1) OSName = "MacOS";
    if (navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
    if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
    return OSName;
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude, "loc");
          setLocation({ latitude: latitude, longitude: longitude });
        },
        (error) => {}
      );
    } else {
    }
  };

  const getNav = async () => {
    const browser = await getBroswerData();
    const ip = await getIP();
    const os = getOSName();
    const data = await { browser: browser, os: os, location: location, ip: ip };
    console.log(data, "data_browser");
    saveUserInteraction("Login", data);
  };

  const inqueryRedirect = (values) => {
    if (!changeRoom) return;
    if (values?.inquiry == "stay" && callback?.stay) {
      // hideMenu();
      changeRoom(callback?.stay);
    }
    return;
  };

  const banquetRedirect = () => {
    console.log(callback?.banquet, "console");
    if (callback?.banquet) {
      // hideMenu();
      changeRoom(callback?.banquet);
    }
    setTimeout(() => {
      setState("banquet");
      document.getElementsByTagName("iFrame")[0].contentWindow.pauseTour();
    }, 700);

    return;
  };

  const changeRoom = (name) => {
    console.log(name, "pano Name");
    document
      .getElementsByTagName("iFrame")[0]
      .contentWindow.setMediaByName(name);
  };

  const hideMenu = () => {
    // hide
    document
      .getElementsByTagName("iFrame")[0]
      .contentWindow.tour._getRootPlayer()
      .setComponentVisibility(
        document
          .getElementsByTagName("iFrame")[0]
          .contentWindow.tour._getRootPlayer()
          .getComponentByName("- EXPANDED"),
        false,
        0,
        null,
        "hideEffect",
        false
      );

    //show expand Arrow
    document
      .getElementsByTagName("iFrame")[0]
      .contentWindow.tour._getRootPlayer()
      .setComponentVisibility(
        document
          .getElementsByTagName("iFrame")[0]
          .contentWindow.tour._getRootPlayer()
          .getComponentByName("- COLLAPSE"),
        true,
        0,
        null,
        "showEffect",
        false
      );
  };

  const handleMessage = (event) => {
    if (event?.data && event.data.type === "UPDATE") {
      if (!start) setStart(true);
      // console.log(event?.data,"data here")
      console.log(event.data, "data1..EventData");
      console.log(hotelData, "apexx");

      const filtered1 = hotelData?.roomInfo?.filter(
        (room) => room?.roomId === event?.data?.roomId
      );

      // console.log(filtered1, "reqData");
      // console.log(filtered1[0].facilityDetailer.data.title, "reqData1");

      if (event?.data?.roomId)
        saveUserInteraction(
          "Room change",
          filtered1[0]?.facilityDetailer?.data?.title || event?.data?.roomId
        );
      updateRoomData(event.data.roomId);
    }
    if (event?.data && event.data.type === "INIT") {
      console.log("INIT");
      console.log(event?.data, "event");
      //   setState('kyc')
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [hotelData]);

  const getuserData = async () => {
    try {
      const response = await getUserInfo();
      console.log(response);
      if (response?.data?.status === 200) {
        console.log("inside", response?.data?.data.UserInfo?.name);
        setUser({
          name: response?.data?.data.UserInfo?.name,
          email: response?.data?.data.UserInfo?.email,
          mobile: response?.data?.data.UserInfo?.mobile,
          eventSelection: {
            event: "corporate",
            isWedding: true,
            other: "",
            community: "",
            programs: [],
            eventType: "Lunch",
            stDate: "",
            enDate: "",
            guest: "",
            sitArrangement: "theatre",
          },
          id: response?.data?.data.UserInfo?.id,
        });
        setState("inquiry");
      } else {
        setState("kyc");
        setUser({
          name: "",
          email: "",
          mobile: "",
          eventSelection: {
            event: "corporate",
            isWedding: true,
            other: "",
            community: "",
            programs: [],
            eventType: "Lunch",
            stDate: "",
            enDate: "",
            guest: "",
            sitArrangement: "theatre",
          },
        });
      }
    } catch (e) {
      console.log("exception", e);
      setState("kyc");
      setUser({
        name: "",
        email: "",
        mobile: "",
        id: "",
        eventSelection: {
          event: "corporate",
          isWedding: true,
          other: "",
          community: "",
          programs: [],
          eventType: "Lunch",
          stDate: "",
          enDate: "",
          guest: "",
          sitArrangement: "theatre",
        },
      });
    }
  };
  useEffect(() => {
    getuserData();
    getLocation();
  }, []);
  // console.log(user,"user");
  const saveUserInteraction = async (action, value) => {
    try {
      const data = { action: action, value: value, hotelId: hotelData?._id };
      // console.log(data, "Interaction data");
      const response = await saveInteraction(data);
      // console.log(response, "response");
    } catch (error) {
      console.log(error, "error");
    }
  };

  const shareURL = () => {
    var copyText = window.location.href;
    navigator.clipboard.writeText(copyText);
    saveUserInteraction("Button Clicked", "ShareURL");
    Toast("Copied to clipboard", "success");
  };

  const changeStatus = async (action) => {
    try {
      await saveUserInteraction("Button Clicked", action);
      setState(action);
    } catch (error) {
      console.log(error, "error");
    }
  };

  console.log(roomData, state);

  return (
    start && (
      <>
        {state === "none" && (
          <>
            <div className="position-fixed bottom-icon end-0 bottom-0 mb-90 p-4">
              {/* glb */}
              {roomData?.glb.enable && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    onClick={() => {
                      changeStatus("glb");
                      console.log("glb_data");
                    }}
                  >
                    <span className="icon menu">
                      <img src="/assets/img/icons/chair.png" alt="" />
                    </span>
                    <span className="tooltipUI fs-12">3D Configurator</span>
                  </button>
                </div>
              )}

              {/* room booking*/}
              {roomData?.bookingLink?.enable && roomData?.bookingLink?.link && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    onClick={() => {
                      saveUserInteraction("Room Booking");
                      window.open(roomData?.bookingLink?.link, "_blank");
                    }}
                  >
                    <span className="icon menu">
                      {/* <img src="/assets/img/icons/image-icn.png" alt="" /> */}
                      <img src="/assets/img/icons/booking.svg" alt="" />
                    </span>
                    <span className="tooltipUI fs-12">Room Booking</span>
                  </button>
                </div>
              )}

              {/* book a meeting */}
              {roomData?.bookAMeeting && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    onClick={() => {
                      changeStatus("bookaMeeting");
                    }}
                  >
                    <span className="icon menu">
                      {/* <img src="/assets/img/icons/image-icn.png" alt="" /> */}
                      <img src="/assets/img/icons/booking.svg" alt="" />
                    </span>
                    <span className="tooltipUI fs-12">Book a meeting</span>
                  </button>
                </div>
              )}

              {/* Venue Visualizer Button */}
              {roomData?.virtualSittingArrangement.enable && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    onClick={() => {
                      changeStatus("venueVisualizer");
                    }}
                  >
                    <span className="icon menu">
                      <img src="/assets/img/icons/chair.png" alt="" />
                    </span>
                    <span className="tooltipUI fs-12">Venue Visualiser</span>
                  </button>
                </div>
              )}
              {/* Gallery */}
              {roomData?.imageGallery.enable && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    // title="Gallery"
                    onClick={() => {
                      changeStatus("gallery");
                    }}
                  >
                    <span className="icon menu">
                      <img src="/assets/img/icons/image-icn.png" alt="" />
                    </span>
                    <span className="tooltipUI fs-12">Gallery</span>
                  </button>
                </div>
              )}
              {/* Facility Detailer */}
              {roomData?.facilityDetailer.enable && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    // title="Facility Detailer"
                    onClick={() => {
                      changeStatus("facilityDetailer");
                    }}
                  >
                    <span className="icon menu">
                      <img src="/assets/img/icons/info.png" alt="" />
                    </span>
                    <span className="tooltipUI fs-12">Facility Detailer</span>
                  </button>
                </div>
              )}
              {/* Day Night Toggle */}
              {roomData?.dayNightToggle?.enable && (
                <div id="bottomMsgMenu" className="mt-1 position-relative">
                  <button
                    className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                    // title={
                    //   roomData?.dayNightToggle?.data?.type == "day"
                    //     ? "Night View"
                    //     : "Day View"
                    // }
                    onClick={() => {
                      if (roomData?.dayNightToggle?.data.type == "day") {
                        const nigntSceneName = hotelData?.roomInfo?.find(
                          (item) =>
                            item.roomId ==
                            roomData?.dayNightToggle?.data.nightPanoId
                        ); //findRoomNameFromId(roomData?.dayNightToggle?.data.nightPanoId);
                        console.log(nigntSceneName);
                        document
                          .getElementById("iFrame")
                          .contentWindow.setMediaByName(
                            nigntSceneName.roomName
                          );
                      } else {
                        const daySceneName = hotelData?.roomInfo?.find(
                          (item) =>
                            item.roomId ==
                            roomData?.dayNightToggle?.data.dayPanoId
                        ); //findRoomNameFromId(roomData?.dayNightToggle?.data.dayPanoId);
                        document
                          .getElementById("iFrame")
                          .contentWindow.setMediaByName(daySceneName.roomName);
                      }
                      saveUserInteraction("Button Clicked", "Day Night Toggle");
                    }}
                  >
                    <span className="icon menu">
                      {roomData?.dayNightToggle?.data?.type === "night" ? (
                        <i
                          className="fa fa-sun"
                          style={{ color: "#b60aa6" }}
                          // data-feather="night"
                          width="14"
                          height="14"
                        ></i>
                      ) : (
                        <i
                          className="fa fa-moon"
                          style={{ color: "#b60aa6" }}
                          // data-feather="day"
                          width="14"
                          height="14"
                        ></i>
                      )}
                    </span>
                    <span className="tooltipUI fs-12">
                      {" "}
                      {roomData?.dayNightToggle?.data?.type === "night"
                        ? "Day"
                        : "Night"}
                    </span>
                  </button>
                </div>
              )}
              {/* Contact */}
              <div id="bottomMsgMenu" className="mt-1 position-relative">
                <button
                  className="btn rOiconBtn rounded-circle position-relative opnMsgJq"
                  onClick={() => changeStatus("contact")}
                >
                  <span className="icon menu">
                    {/* <img src="/assets/img/icons/envelope_gold.png" alt="" /> */}
                    <img src="/assets/img/icons/envelope.png" alt="" />
                  </span>
                  <span className="tooltipUI fs-12">Contact</span>
                </button>
              </div>
              {/* Share */}
              <div id="bottomShareMenu" className="mt-1 position-relative">
                <button
                  className="btn rOiconBtn rounded-circle position-relative opnShareJq"
                  onClick={() => {
                    shareURL();
                  }}
                >
                  <span className="icon menu">
                    <img src="/assets/img/icons/send.png" alt="" />
                  </span>
                  <span className="tooltipUI fs-12">Share</span>
                </button>
              </div>
            </div>
            {roomData?.virtualSittingArrangement.enable &&
              hotelData?.planMyEvent && (
                <div className="bottom-center mb-3">
                  <button
                    type="button"
                    className="siteBtnGreen fw-700 text-white border-0 px-70 py-15 rounded-5 text-uppercase brandColorGradiend text-decoration-none "
                    onClick={() => {
                      changeStatus("curateEvent");
                    }}
                  >
                    Plan my event
                  </button>
                </div>
              )}
          </>
        )}

        {state === "kyc" && (
          <CustomerKYC
            onSuccess={(user) => {
              setUser(user);
              setState("inquiry");
              getNav();
            }}
            // here
            onNext={(user) => {
              setUser(user);
              // setState("none");
              setState("inquiry");
            }}
            hotelId={hotelData._id}
          />
        )}

        {state === "inquiry" && (
          <InquiryModal
            onSuccess={(state) => {
              setState(state);
            }}
            saveInteraction={(action, value) =>
              saveUserInteraction(value, action)
            }
            inqueryRedirect={inqueryRedirect}
          />
        )}

        {state === "banquetInquiry" && (
          <InquiryForBanquets
            onSuccess={(state, value) => {
              setState(state);
              saveUserInteraction(value, state);
            }}
          />
        )}

        {(state === "social" || state === "corporate") && (
          <EventSelection
            eventType={state}
            onSuccess={(values) => {
              setUser((user) => ({ ...user, eventSelection: values }));
              saveUserInteraction("Event Form Submitted", values);
              banquetRedirect();
              //setState("none")
            }}
          />
        )}

        {state === "curateEvent" && (
          <CurateEvent
            user={user}
            hotelData={hotelData}
            roomInfo={roomData}
            onSuccess={() => {
              // setUser((user) => ({ ...user, eventSelection: values }))
              setState("success");
              saveUserInteraction("Form Final Submission");
            }}
            onClose={() => setState("none")}
            changePano={(roomId) => {
              var roomName = hotelData.roomInfo.find(
                (x) => x.roomId == roomId
              ).roomName;
              console.log("roomName", roomName);
              document
                .getElementsByTagName("iframe")[0]
                .contentWindow.postMessage(
                  { data: roomName, type: "UPDATE_PANO" },
                  "*"
                );
            }}
          />
        )}

        {state === "success" && <Success onClose={() => setState("none")} />}

        {state === "contact" && (
          <ContactUs onClose={() => setState("none")} hotelData={hotelData} />
        )}
        {state === "facilityDetailer" && (
          <FacilityDetailer
            onClose={() => setState("none")}
            roomData={roomData}
            openGallery={() => changeStatus("gallery")}
          />
        )}

        {state === "gallery" && (
          <GalleryModal
            onClose={() => setState("none")}
            images={roomData?.imageGallery.images}
          />
        )}

        {state == "venueVisualizer" && (
          <VenueVisualizer
            onClose={() => {
              setState("none");
            }}
            VenueVisualizer={roomData?.virtualSittingArrangement.data}
            findRoomNameFromId={(id) => {
              return hotelData?.roomInfo?.find((item) => item.roomId == id);
            }}
            changeScene={(room) => {
              // iframeRef.current.contentWindow.setMediaByName(roomName)
              console.log("Change Scene", room);
              document
                .getElementById("iFrame")
                .contentWindow.setMediaByName(room.roomName);
            }}
          />
        )}
        {state === "glb" && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  zIndex: 10000,
                  backgroundColor: "transparent", // Transparent background
                  color: "#fff",
                  border: "2px solid #fff",
                  padding: "12px 25px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  transition: "background-color 0.3s ease, color 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"; // Slight white transparency on hover
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "transparent"; // Revert to transparent
                }}
                onClick={() => setState("none")}
              >
                Close
              </button>
              <iframe
                id="iFrame"
                src={`${roomData?.glb?.link}&token=${token}`}
                width="100%"
                height="100%"
                frameBorder="0"
                // crossorigin="anonymous"
                allowFullScreen
                title="Venue Visualizer"
                allow="xr-spatial-tracking"
              />
            </div>
          </div>
        )}

        {state == "banquet" && (
          <BanquetModal
            onClose={() => {
              document
                .getElementsByTagName("iFrame")[0]
                .contentWindow.resumeTour();
              document
                .getElementsByTagName("iFrame")[0]
                .contentWindow.resumeTour();
              setState("none");
            }}
            hotelData={hotelData}
            changeRoom={(name) => {
              document
                .getElementsByTagName("iFrame")[0]
                .contentWindow.resumeTour();
              document
                .getElementsByTagName("iFrame")[0]
                .contentWindow.resumeTour();

              changeRoom(name);
              setState("none");
            }}

            // changeScene={(room) => {
            //   // iframeRef.current.contentWindow.setMediaByName(roomName)
            //   console.log("Change Scene", room);
            //   document
            //     .getElementById("iFrame")
            //     .contentWindow.setMediaByName(room.roomName);
            // }}
          />
        )}

        {state == "bookaMeeting" && (
          <BookaMeeting
            hotelData={hotelData}
            onSuccess={() => {
              setState("none");
            }}
            onClose={() => {
              setState("none");
            }}
          />
        )}
      </>
    )
  );
};

export default UIManager;
