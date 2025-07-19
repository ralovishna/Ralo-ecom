// Deal.tsx
import React from 'react';
import DealCard from './DealCard.tsx';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';
import { fetchHomeCategories, selectCategoriesBySection } from '../../../../State/admin/AdminSlice.ts';
import { useAppDispatch, useAppSelector } from '../../../../State/Store.ts';

const Deal = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,  // Changed from 3 to 1 for smoother scrolling
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };
    const dispatch = useAppDispatch();

    const dealCategories = useAppSelector(selectCategoriesBySection('DEALS', 10));
    const loading = useAppSelector((state) => state.admin.loading);
    const error = useAppSelector((state) => state.admin.error);
    const categories = useAppSelector((state) => state.admin.categories);

    useEffect(() => {
        if (categories.length === 0) {
            dispatch(fetchHomeCategories());
        }
    }, [dispatch, categories.length]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className='py-5 lg:px-20 mx-auto max-w-7xl'> {/* Added max-width */}
            {/* <h2 className='text-2xl font-bold mb-6 px-4'>Hot Deals</h2> */}
            <div className='px-4'> {/* Added padding */}
                <Slider {...settings}>
                    {dealCategories.map((item) => (
                        <div key={item.id} className='px-2'>
                            <DealCard item={item} />
                        </div>
                    ))}

                </Slider>
            </div>
        </div>
    );
};

export default Deal;