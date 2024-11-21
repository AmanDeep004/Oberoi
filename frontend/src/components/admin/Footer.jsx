import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer dasboar-footer DBLightBg py-3 border-top">
        <div className="container-fluid pl-90 pr-40">
          <div className="row pl-80">
            <p className="fs-13 m-0 text-end text-muted">
              Powered by{" "}
              {/* <Link
                href="https://vosmos.world/"
                className="brandColorTxt text-decoration-none"
              >
                Vosmos
              </Link> */}
              <a
                href="https://vosmos.world/"
                className="brandColorTxt text-decoration-none"
                target="_blank"
              >
                Vosmos
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
