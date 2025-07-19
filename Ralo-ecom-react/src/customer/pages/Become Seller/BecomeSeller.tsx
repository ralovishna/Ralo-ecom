import React from 'react'
import SellerAccountForm from './SellerAccountForm.tsx';
import SellerLoginForm from './SellerLoginForm.tsx';
import { Button } from '@mui/material';

const BecomeSeller = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const handleShowPage = () => {
        setIsLogin(!isLogin);
    }


    return (
        <div className='grid md:gap-10 grid-cols-3 min-h-screen'>
            <section className="lg:col-span-1 md:col-span-2 col-span-3 shadow-lg p-10 rounded-b-md">

                {
                    isLogin ? <SellerAccountForm /> : <SellerLoginForm />
                }
                <div className="mt-10 space-y-2">
                    <h1 className="text-center text-sm font-medium">have account</h1>
                    <Button
                        onClick={handleShowPage}
                        fullWidth
                        sx={{ py: '11px' }}
                        variant='outlined'
                    >
                        {!isLogin ? "Register" : "Login"}
                    </Button>
                </div>

            </section>

            <section className="hidden md:col-span-1 lg:col-span-2 md:flex justify-center items-center">
                <div className="px-5 space-y-10 lg:w-[70%]">
                    <div className="space-y-2 font-bold text-center">
                        <p className="text-2xl">Join the MarketPlace Revolution</p>
                        <p className="text-lg text-primary-color">Boost your Sales today</p>
                    </div>
                    <img
                        className='w-[100%] h-full'
                        src="https://images.all-free-download.com/images/graphiclarge/business_banners_template_vector_549448.jpg" alt="" />

                </div>
            </section>
        </div>
    )
}

export default BecomeSeller
