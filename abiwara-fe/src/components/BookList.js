import Book from "./Book"
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useCallback, useRef } from "react";

export default function BookList({ books }) {
    return (
        <div className="flex gap-6 flex-wrap justify-between">
            {books.map((book) => (
                <Book key={book.id} book={book} />
            ))}
        </div>
    )
}

export function BookListScroll({ books }) {
    const sliderRef = useRef();

    const handlePrev = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slidePrev();
    }, []);

    const handleNext = useCallback(() => {
        if (!sliderRef.current) return;
        sliderRef.current.swiper.slideNext();
    }, []);

    return (
        <div className="group relative flex items-center">
            <button className="hidden md:block md:absolute left-0 p-4 z-10 rounded-full bg-white text-black shadow-md transition-all translate-x-3 group-hover:-translate-x-6 opacity-0 group-hover:opacity-100 ease-in dark:bg-gray-900 dark:text-gray-200" onClick={handlePrev}><FaChevronLeft /></button>
            <button className="hidden md:block md:absolute right-0 p-5 z-10 rounded-full bg-white text-black shadow-md transition-all -translate-x-3 group-hover:translate-x-6 opacity-0 group-hover:opacity-100 ease-in dark:bg-gray-900 dark:text-gray-200" onClick={handleNext}><FaChevronRight /></button>
            <Swiper
				id="swiper"
                slidesPerView={2}
                spaceBetween={30}
                breakpoints={{
                    640: {
                        slidesPerView: 5,
                    },
                }}
                ref={sliderRef}
            >
                {
                    books.map((book) => (
                        <SwiperSlide key={book.id}>
                            <Book book={book} />
                        </SwiperSlide>
                    ))
                }
            </Swiper >
        </div>
    )
}
