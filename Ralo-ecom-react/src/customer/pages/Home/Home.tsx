import React from 'react'
import ElectricCategory from './ElectricCategory/ElectricCategory.tsx'
import CategoryGrid from './CategoryGrid/CategoryGrid.tsx'
import Deal from './Deal/Deal.tsx'
import ShopByCategory from './ShopByCategory/ShopByCategory.tsx'
import { Button } from '@mui/material'
import { Storefront } from '@mui/icons-material'
import { useAppSelector } from '../../../State/Store.ts';

const Home = () => {
    // const { customer } = useAppSelector((state) => state.customer);
    return (
        <>
            <div className='space-y-5 lg:space-y-10 relative'>
                <ElectricCategory />

                <CategoryGrid />

                <div className='pt-20'>
                    <h1 className='text-lg lg:text-4xl font-bold text-primary-color pb-5 text-center lg:pb-20'>
                        Today's Deal
                    </h1>
                    <Deal />
                </div>

                <section className='pt-20'>
                    <h1 className='text-lg lg:text-4xl font-bold text-primary-color pb-5 text-center lg:pb-20'>
                        Shop By Category
                    </h1>
                    <ShopByCategory />
                </section>

                <section className='lg:px-20 relative h-[13rem] lg:h-[28rem] object-cover'>
                    <img className='w-full h-full' src="https://cdn3.invitereferrals.com/blog/wp-content/uploads/2020/11/19115701/2020-11-19-1-1024x341.jpg" alt="" />

                    <div className='absolute top-1/3 left-3 lg:left-[10rem] transform-translate-y-1/2 font-semibold lg:text-4xl space-x-3'>
                        <h1>Become a Seller & Sell</h1>
                        <p className='text-lg md:text-2xl'>with <span className='logo'>Ralo Ecom</span></p>


                        <div className='pt-6 flex justify-center'>
                            <Button startIcon={<Storefront />} variant='contained' color='primary' size='large' className='bg-primary-color hover:bg-purple-300' >
                                Become a Seller

                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home
