import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css'
import 'owl.carousel/dist/assets/owl.theme.default.css'

const GalleryModal = ({ onClose, images }) => {
  return (
    <div
      className="modal modal-xl fade show"
      id="contactUs_modal"
      aria-labelledby="modalA"
      aria-hidden="true"
      data-bs-backdrop="static"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-xl modal-dialog-centered ">
        <div className="modal-content">
          <div className="modal-body">
            <div className="roBox bg-white">
              <div className="text-end">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    onClose()
                  }}
                ></button>
              </div>

              <OwlCarousel
                className="row mb-3 image-slider owl-carousel owl-theme px-2"
                loop={true}
                allowTransparency
                allowFullScreen={true}
                margin={20}
                nav
                dots={true}
                items={1}
                responsive={{
                  0: {
                    items: 1, // Display one item on small screens
                  },
                  600: {
                    items: 1, // Display two items on screens larger than 600px
                  },
                  1000: {
                    items: 1, // Display three items on screens larger than 1000px
                  },
                  // Add more breakpoints and items as needed
                }}
              >
                {images.map((image) => (
                  <img src={image} />
                ))}
              </OwlCarousel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GalleryModal
