import React from "react";
import { useGetAllHotelQuery } from "../../app/api/website/websiteHotelSlice";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HotelList = () => {
  const { data, isLoading, isSuccess } = useGetAllHotelQuery();

  const nav = useNavigate();

  const handleCardClick = (urlName) => {
    nav("/hotel/635913e4687c5bf65c4c1dbf");
  };
  const handleButtonClick = (id) => {
    // nav("/hotel/635913e4687c5bf65c4c1dbf");
    nav(`/hotel/${id}`);
  };

  return (
    <Container
      className="mt-5"
      style={{ height: "100%", width: "100%", overflowY: "auto" }}
    >
      <Row style={{ height: "90vh", width: "100%" }}>
        {isSuccess &&
          data?.data?.map((hotel) => (
            <Col key={hotel._id} sm={12} md={6} lg={4} className="mb-4">
              <Card
                className="h-100"
                // onClick={() => handleCardClick(hotel?._id)}
                style={{
                  cursor: "pointer",
                  maxHeight: "100%",
                  minHeight: "100%",
                }}
              >
                <Card.Img
                  variant="top"
                  src={hotel.imageUrl || "https://via.placeholder.com/150"}
                  alt={hotel.hotelName}
                  style={{ height: "50%", minHeight: "50%" }}
                />
                <Card.Body style={{ height: "30%", minHeight: "30%" }}>
                  <div style={{ height: "70%", minHeight: "70%" }}>
                    <Card.Title
                      style={{ fontWeight: "bold" }}
                      className="fw-10"
                    >
                      {hotel?.hotelName}
                    </Card.Title>
                    <Card.Text>{hotel?.address}</Card.Text>
                    <Card.Text>{hotel?.location}</Card.Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      className="siteBtnGreen fw-700 text-white border-0 px-60 py-15 rounded-5 text-uppercase brandColorGradiend"
                      variant="primary"
                      // onClick={() => handleButtonClick(hotel?._id)}
                      onClick={() => handleButtonClick(hotel?.friendlyName)}
                    >
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default HotelList;
