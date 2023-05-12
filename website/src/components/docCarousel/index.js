import React from 'react';
import { Children } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper';
import 'swiper/css/navigation';

function DocCarousel({ children }) {
    if ( !children?.length > 0 ){      
        return false
    }
    return (
        <div className='docswiper'>
            <Swiper
                spaceBetween={30}
                slidesPerView={1}
                effect="fade"
                navigation
                modules={[Navigation]}

                breakpoints={{
                    640: {
                        slidesPerView: 2,
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

