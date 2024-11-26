export const styles = `
.adjWidget{position: fixed;
    right: 2px;
    z-index: 2147483009;
    bottom: 2px;}
.adjWidget.widget__hidden{
    visibility: hidden;
    opacity: 0;
    height: 0;
    overflow: hidden;
  
    width: 0px;
}
    .widget__container * {
        box-sizing: border-box;
        // z-index: 9999
    }        
    
    .widget__container {
        box-shadow: 0 0 18px 8px rgba(0, 0, 0, 0.1), 0 0 32px 32px rgba(0, 0, 0, 0.08);
        width: 400px;
        overflow: auto;
        right: -25px;
        bottom: 75px;
        position: absolute;
        transition: max-height .2s ease;
        font-family: Helvetica, Arial ,sans-serif;
        background-color: #e6e6e6a6;
        border-radius: 10px;
        box-sizing: border-box;
        //z-index: 9999


    }
    .widget__icon {
        cursor: pointer;
        width: 60%;
        position: absolute;
        top: 18px;
        left: 16px;
        transition: transform .3s ease;
    }
    .widget__hidden {
        transform: scale(0);
    }
    .button__container {
        // border: none;
        // background-color: #0f172a;
        // width: 60px;
        // height: 60px;
        border-radius: 50%;
        cursor: pointer;
    }
    .widget__container.hidden {
        max-height: 0px;
        // z-index: 9999
    }
    .widget__header {
        padding: 1rem 2rem 1.5rem;
        background-color: #000;
        color: #fff;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        text-align: center;
    }
    .widget__header h3 {
        font-size: 24px;
        font-weight: 400;
        margin-bottom: 8px;
    }
    
      img {
        max-width: 100%;
        vertical-align: middle;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        margin-left: -6px;
        -webkit-appearance: none;
        appearance: none;
      }
      
      ::-webkit-scrollbar-thumb {
        height: 30px;
        background-color: #00ccb3;
        background-clip: content-box;
        border-color: transparent;
        border-style: solid;
        border-width: 0;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background-color: #999;
      }
      
      ::-webkit-scrollbar-track {
        background-color: #ccc;
      }
      
      ::-webkit-scrollbar-track:hover {
        background-color: #bbb;
      }
      .chatBot {
  max-height: calc(100% - 50px);
  min-width: 360px;
  box-shadow: rgba(0, 18, 46, 0.16) 0px 8px 36px 0px;
  margin-right: 25px;
  right: 0px;
  bottom: 25px;
}
      
      .chatBotGPT {
      background-color: white;
    height: calc(100% - 130px);
    min-width: 400px;
    box-shadow: rgba(0, 18, 46, 0.16) 0px 8px 36px 0px;
    margin-right: 0px;
    right: 0px;
    bottom: 0px;
    max-height:600px;
      }
      .chatBotGPTLeft {
        background-color: white;
        height: calc(100% - 150px);
        min-width: 400px;
        box-shadow: rgba(0, 18, 46, 0.16) 0px 8px 36px 0px;
        margin-right: 25px;
        //right: 0px;
        bottom: 25px;
      }
      .chatBotHeader {
        // /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#00ccb3+0,80ffef+100 */
        // background: linear-gradient(
        //   to right,
        //   #00ccb3 0%,
        //   #80ffef 100%
        // ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    background: #d3b74f;
      }
      .chatBotHeader::before {
        content: "";
        position: absolute;
        width: 100%;
        bottom: -15px;
        left: 0px;
        border-image-source: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNzIgMTUiPgogIDxwYXRoIGQ9Ik0zNDkuOCAxLjRDMzM0LjUuNCAzMTguNSAwIDMwMiAwaC0yLjVjLTkuMSAwLTE4LjQuMS0yNy44LjQtMzQuNSAxLTY4LjMgMy0xMDIuMyA0LjctMTQgLjUtMjggMS4yLTQxLjUgMS42Qzg0IDcuNyA0MS42IDUuMyAwIDIuMnY4LjRjNDEuNiAzIDg0IDUuMyAxMjguMiA0LjEgMTMuNS0uNCAyNy41LTEuMSA0MS41LTEuNiAzMy45LTEuNyA2Ny44LTMuNiAxMDIuMy00LjcgOS40LS4zIDE4LjctLjQgMjcuOC0uNGgyLjVjMTYuNSAwIDMyLjQuNCA0Ny44IDEuNCA4LjQuMyAxNS42LjcgMjIgMS4yVjIuMmMtNi41LS41LTEzLjgtLjUtMjIuMy0uOHoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+Cg==);
        border-image-slice: 0 0 100%;
        border-image-width: 0 0 30px;
        border-image-repeat: stretch;
        border-width: 0px 0px 30px;
        border-bottom-style: solid;
        border-color: initial;
        border-top-style: initial;
        border-left-style: initial;
      }
      .chatUser {
       width: 32px;
  height: 46px;
  min-width: 46px;
  overflow: hidden;
      }
      .chatBtnCircle {
        width: 42px;
        height: 42px;
      }
      .chatBtnCircle > svg {
        fill: currentColor;
      }
      .chatBtnCircle:hover,
      .chatBtnCircle:focus {
        background-color: rgb(51 51 51 / 50%);
      }
      .chatBotName {
        max-width: 200px;
      }
      .onlineStatus {
        width: 10px;
        height: 10px;
      }
      .chatBotBody {
        background-color: white;
        height:100%;
        //max-height:200px;
        //min-height: 150px;
        flex: 0 1 auto;
        overflow-y: auto;
      }
      .chatBotBodyGPT {
        background-color: white;
        height:100%;
        //max-height:200px;
        //min-height: 150px;
        flex: 0 1 auto;
        overflow-y: auto;
      }
      .widget__containerbtnPrimary {
        background: #00ccb3;
        border-radius: 30px;
        color: #fff;
        padding: 8px 24px;
        -webkit-transition: all 0.3s ease-in-out;
        -moz-transition: all 0.3s ease-in-out;
        -o-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
        font-size: 14px;
        border: 2px solid #00ccb3;
      }
      .widget__containerbtnPrimary:hover,
      .widget__containerbtnPrimary:focus {
        background: rgb(5, 135, 120);
        color: #fff;
      }
      .widget__containerbtnPrimaryOutline {
        border: 2px solid #00ccb3;
        background: #fff;
        color: #058778;
      }
      .chatBotFooter {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
      }
      .borderRadius {
        border-radius: 12px;
      }
      .adjInpt {
        resize: none;
        font-size: 14px;
        padding-right: 30px;
        box-shadow: none !important;
      }
      
      .chatBtnSubmit {
        right: -20px;
  top: 12px;
  background: #d3b74f;
  width: 32px;
  height: 32px;
  color: #fff;
      }
      .chatBtnSubmit1 {
            // position: fixed;
            // height: 48px;
            // width: 145px;
            // //box-shadow: -2px -1px 8px rgba(58, 56, 52, 0.28);
            // background: #03CCB4;
            // top: 65%;
            // font-weight: 600;
            // right: -48px;
            // border-radius: 3px 3px 0 0;
            // //transform: rotate(270deg);
            // rotate:270deg;
            // //cursor: pointer;
            // color: #fff;
            // //line-height: 45px;
            // font-size: 18px;
            // z-index: 9999999;
            // text-align: center;
            // border:none;


                position: fixed;
    height: 48px;
    width: 48px;
    background: #d3b74f;
    bottom: 10px;
    right: 10px;
    border-radius: 40px;
    z-index: 9999999;
    border: 0;


      }
      .chatBtnSubmit1 > svg {
        fill: currentColor;
      }
      //.chatBtnSubmit1:hover,
      // .chatBtnSubmit1:focus {
      //   background:#d3b74f;
      //   color: #fff;
      //   box-shadow: inset 0px 0px 20px #444;
      // }
      .chatBtnCenterLeft {
        position: fixed;
        height: 48px;
        width: 145px;
        box-shadow: -2px -1px 8px rgba(58, 56, 52, 0.28);
        background: #03CCB4;
        top: 40%;
        font-weight: 600;
        left: -48px;
        border-radius: 3px 3px 0 0;
        transform: rotate(269deg);
        rotate:181deg;
        cursor: pointer;
        color: #fff;
        line-height: 45px;
        font-size: 18px;
        z-index: 9999999;
        text-align: center;
       
  }
      .chatBtnSubmit > svg {
        fill: currentColor;
      }
      
      
      .chatBtnCenterLeft > svg {
        fill: currentColor;
      }
      .chatBtnSubmit:hover,
      .chatBtnSubmit:focus {
        background: #d3b74f;
        color: #fff;
        box-shadow: inset 0px 0px 20px #444;
      }
     
      .chatBtnCenterLeft:hover,
      .chatBtnCenterLeft:focus {
        background: rgb(5, 135, 120);
        color: #fff;
        box-shadow: inset 0px 0px 20px #444;
      }
     
      .resz {
        position: absolute;
        left: 0;
        width: 10px;
        height: 40px;
        background: red;
      }
      .chatBotMsg {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .inrMsgBox {
        flex: none;
        max-width: 90%;
      }
      .userMsg {
        align-items: flex-end;
      }
      .toggleCss {
        width: 100%;
        min-width:90vw;      
      }
      .toggleCss1 {
        width: 100%;
        min-width:90vw;
      }
      
.loader {
  width: 15px;
  aspect-ratio: 1;
  border-radius: 50%;
  animation: l5 1s infinite linear alternate;
}
  @keyframes l5 {
    0%  {box-shadow: 20px 0 #000, -20px 0 #0002;background: #000 }
    33% {box-shadow: 20px 0 #000, -20px 0 #0002;background: #0002}
    66% {box-shadow: 20px 0 #0002,-20px 0 #000; background: #0002}
    100%{box-shadow: 20px 0 #0002,-20px 0 #000; background: #000 }
}
      
`;

export const MESSAGE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
`;

export const MESSAGE_ICON1 = `
<svg height="24" width="24" version="1.1" xmlns="http://www.w3.org/2000/svg"
xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.003 495.003" xml:space="preserve">
<g id="XMLID_51_">
  <path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
l-67.6-32.22V456.687z" />
  <path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z" />
</g>
</svg>
`;
export const MESSAGE_ICON2 = ` <button  id="myBtn" 
class="btn p-0 m-0 border-0 rounded-circle d-flex align-items-center justify-content-center position-absolute chatBtnSubmit"
type="button">

<svg height="24" width="24" version="1.1" xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 495.003 495.003" xml:space="preserve">
  <g id="XMLID_51_">
    <path id="XMLID_53_" d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616
l-67.6-32.22V456.687z" />
    <path id="XMLID_52_" d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422
c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414
l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956
L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z" />
  </g>
</svg>
</button>`;
export const CLOSE_ICON = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
`;

export const CHATICON = `<svg data-v-1dc5c933="" focusable="false" aria-hidden="true" viewBox="0 0 28 32" width="22.4" height="25.6"><path data-v-1dc5c933="" fill="white" d="M28,32 C28,32 23.2863266,30.1450667 19.4727818,28.6592 L3.43749107,28.6592 C1.53921989,28.6592
0,27.0272 0,25.0144 L0,3.6448 C0,1.632 1.53921989,0 3.43749107,0 L24.5615088,0 C26.45978,0
27.9989999,1.632 27.9989999,3.6448 L27.9989999,22.0490667 L28,22.0490667 L28,32 Z M23.8614088,20.0181333
C23.5309223,19.6105242 22.9540812,19.5633836 22.5692242,19.9125333 C22.5392199,19.9392 19.5537934,22.5941333
13.9989999,22.5941333 C8.51321617,22.5941333 5.48178311,19.9584 5.4277754,19.9104 C5.04295119,19.5629428
4.46760991,19.6105095 4.13759108,20.0170667 C3.97913051,20.2124916 3.9004494,20.4673395 3.91904357,20.7249415
C3.93763774,20.9825435 4.05196575,21.2215447 4.23660523,21.3888 C4.37862552,21.5168 7.77411059,24.5386667
13.9989999,24.5386667 C20.2248893,24.5386667 23.6203743,21.5168 23.7623946,21.3888 C23.9467342,21.2215726
24.0608642,20.9827905 24.0794539,20.7254507 C24.0980436,20.4681109 24.0195551,20.2135019 23.8614088,20.0181333 Z"></path></svg>`;

export const exam = ` 
  <img src="/aieventChat/VirsaAnimation.gif" alt="">
`;
