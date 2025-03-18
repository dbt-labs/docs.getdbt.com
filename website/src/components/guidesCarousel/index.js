import React from 'react';
import QuickstartGuideCard from '@site/src/components/quickstartGuideCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './styles.module.css';

function GuidesCarousel({ guidesData, showNavigation, onFavoriteUpdate }) {
  return (
    <div className={styles.carouselContainer}>
      <Swiper
        navigation={showNavigation}
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={16}
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
        }}

      >
        {guidesData.map((frontMatter) => (
          <SwiperSlide key={frontMatter.id || frontMatter.index}>
            <QuickstartGuideCard 
              frontMatter={frontMatter} 
              onFavoriteUpdate={onFavoriteUpdate}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default GuidesCarousel;

