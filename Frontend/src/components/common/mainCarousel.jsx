import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

export default function MainCarousel(props) {
    let bannerItems = null;

    if (props.banners?.length > 0) {
        bannerItems = props.banners.map(banner => {
            return <div>
                <img src={process.env.REACT_APP_BACKEND_URL + banner.image} style={{
                    height: "450px",
                }}/>
                <p className="legend">{banner.tag}</p>
            </div>;
        });
    }

    return (
        <Carousel dynamicHeight={false} showThumbs={false}>
            {bannerItems}
        </Carousel>
    );
}