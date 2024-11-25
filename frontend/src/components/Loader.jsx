import React from "react";

const Loader = () => {
  const loaderStyle = {
    border: "4px solid #f3f3f3", // Light gray
    borderTop: "4px solid #d3b74f", // Golden color
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  };

  return (
    <div className="row h-100 align-items-center justify-content-center">
      <div style={loaderStyle}></div>
      <style>
        {`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;

// import React from 'react'

// const Loader = () => {
//   return (
//     <div className='row h-100 align-items-center justify-content-center' >
//         <img src='/imgs/loader.gif' style={{width:"150px", height:"150px"}}/>
//     </div>
//   )
// }

// export default Loader
