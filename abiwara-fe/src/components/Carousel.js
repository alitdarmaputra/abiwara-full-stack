import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

export default function Carousel() {
    return (
        <Swiper
            spaceBetween={0}
            centeredSlides={true}
            autoplay={{
                delay: 10000,
                disableOnInteraction: false,
            }}
            pagination={{
                clickable: true,
            }}
            modules={[Autoplay]}
        >
            <SwiperSlide><img className="object-cover w-screen h-screen" src="/img/hero-1.png" /></SwiperSlide>
            <SwiperSlide><img className="object-cover w-screen h-screen" src="/img/hero-2.png" /></SwiperSlide>
            <SwiperSlide><img className="object-cover w-screen h-screen" src="/img/hero-3.png" /></SwiperSlide>
        </Swiper>
    )
}
