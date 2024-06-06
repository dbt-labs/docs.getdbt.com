import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function DocCarousel({ slidesPerView = 3, children }) {
    if ( !children?.length > 0 ){      
        return false
    }

    // Limit slidesPerView to max of 4
    if(slidesPerView > 4) {
      slidesPerView = 4
    }

    return (
        <div className='docswiper'>
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                effect="fade"
                navigation
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  996: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                  1200: {
                    slidesPerView: slidesPerView,
                    spaceBetween: 30,
                  },
                }}
            >
                {children.map((item) => <SwiperSlide>{item}</SwiperSlide>)}
            </Swiper>
        </div>
    );
}

export default DocCarousel;

