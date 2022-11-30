import React from 'react';
import BlogPostCard from '@site/src/components/blogPostCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';


function PostCarousel({ blogPostData }) {
  return (
    <div>
      <Swiper
        spaceBetween={60}
        slidesPerView={1}
        navigation
        modules={[Navigation]}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 60,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
        }}
      >

        {blogPostData.map((item) => <SwiperSlide><BlogPostCard postMetaData={item} /></SwiperSlide>)}

      </Swiper>
    </div>
  );
}

export default PostCarousel;

