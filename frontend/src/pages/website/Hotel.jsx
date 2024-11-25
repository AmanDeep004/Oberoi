import { useGetHotelInfoByIdQuery } from "../../app/api/website/websiteHotelSlice";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import UIManager from "../../components/website/UIManager";
import { useRef } from "react";

const Hotel = () => {
  const { hotelId } = useParams();
  const { data, isLoading, isSuccess } = useGetHotelInfoByIdQuery(hotelId);
  const iframeRef = useRef();

  return data ? (
    <div className="royalOrchid overflow-hidden">
      <iframe
        ref={iframeRef}
        // src="/output/Udaipur/index.htm"
        // src="/output/NewDelhi/index.htm"
        src={data.data.urlName}
        className="myFrame"
        id="iFrame"
      />
      <UIManager hotelData={data.data} iframeRef={iframeRef} />
    </div>
  ) : (
    <></>
    // <div className="vh-100 w-100">
    //   <Loader />
    // </div>
  );
};

export default Hotel;
