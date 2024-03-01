import 'swiper/css';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

export default function Carousel() {
    return (
		<div className="bg-black">
			<Swiper
				spaceBetween={0}
				centeredSlides={true}
				autoplay={{
					delay: 3000,
					disableOnInteraction: false,
				}}
				pagination={{
					clickable: true,
				}}
				modules={[Autoplay]}
			>
				<SwiperSlide><img alt="hero" className="object-cover w-screen h-screen" src="/img/hero-1.png" /></SwiperSlide>
				<SwiperSlide><img alt="hero" className="object-cover w-screen h-screen" src="/img/hero-2.png" /></SwiperSlide>
				<SwiperSlide><img alt="hero" className="object-cover w-screen h-screen" src="/img/hero-3.png" /></SwiperSlide>
			</Swiper>
		</div>
    )
}
