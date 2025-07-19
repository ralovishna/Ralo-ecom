// import { Button, Step, StepLabel, Stepper } from '@mui/material';
// import React from 'react'
// import BecomeSeller from './BecomeSeller';
// import BSFStep1 from './BSFStep1.tsx';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import BSFStep2 from './BSFStep2.tsx';
// import BSFStep3 from './BSFStep3.tsx';
// import BSFStep4 from './BSFStep4.tsx';

// const steps = [
//     "Tax Information & Mobile",
//     "Pickup Address",
//     "Bank Information",
//     "Supplier Information",
// ]

// const SellerAccountForm = () => {
//     const [activeStep, setActiveStep] = React.useState(0);

//     const handleStep = (stepValue: number) => () => {

//         (activeStep < steps.length - 1 || (activeStep > 0 && stepValue === -1)) && setActiveStep(activeStep + stepValue);

//         steps.length - 1 === activeStep && handleSubmitAccount();
//     };

//     const handleSubmitAccount = () => {

//     };

//     const formik = useFormik({
//         initialValues: {
//             mobile: "",
//             otp: "",
//             gstin: "",
//             pickupAddress: {
//                 name: "",
//                 mobile: "",
//                 pincode: "",
//                 address: "",
//                 locality: "",
//                 city: "",
//                 state: "",
//             },
//             bankDetails: {
//                 accountNumber: "",
//                 ifscCode: "",
//                 accountHolderName: "",
//             },
//             sellerName: "",
//             email: "",
//             businessDetails: {
//                 businessName: "",
//                 businessEmail: "",
//                 businessMobile: "",
//                 logo: "",
//                 banner: "",
//                 businessAddress: ""
//             },
//             password: ""
//         },
//         // validationSchema: getValidationSchema(activeStep),
//         onSubmit: (values) => {
//             console.log("Final Submit:", values);
//             // Handle final form submission
//         },
//         validateOnChange: false,
//         validateOnBlur: false,
//     });
//     return (
//         <div>
//             <Stepper
//                 activeStep={activeStep}
//                 alternativeLabel
//             >
//                 {steps.map((label, index) => (
//                     <Step key={label}>
//                         <StepLabel>{label}</StepLabel>
//                     </Step>
//                 ))}
//             </Stepper>
//             <section className="mt-20 space-y-10 ">
//                 <div className="">
//                     {activeStep === 0 ? <BSFStep1 formik={formik} /> : activeStep === 1 ? <BSFStep2 formik={formik} /> : activeStep === 2 ? <BSFStep3 formik={formik} /> : <BSFStep4 formik={formik} />}
//                 </div>
//                 <div className="flex items-center justify-between">
//                     <Button
//                         variant='contained'
//                         disabled={activeStep === 0}
//                         onClick={handleStep(-1)}
//                     >
//                         Back
//                     </Button>
//                     <Button
//                         variant='contained'
//                         onClick={handleStep(1)}
//                     >
//                         {steps.length - 1 === activeStep ? "Create Account" : "Next"}
//                     </Button>
//                 </div>

//             </section>
//         </div>
//     )
// }

// export default SellerAccountForm
import React, { useState } from 'react';
import { Box, Button, Stepper, Step, StepLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import BSFStep1 from './BSFStep1.tsx';
import BSFStep2 from './BSFStep2.tsx';
import BSFStep3 from './BSFStep3.tsx';
import BSFStep4 from './BSFStep4.tsx';
import { useAppDispatch } from '../../../State/Store.ts';
import { createSeller } from '../../../State/seller/sellerSlice.ts';

const steps = ['GST & Mobile', 'Address Info', 'Bank Details', 'Business & Login'];

const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useAppDispatch(); // Assuming you have a Redux store and a dispatch function

    const formik = useFormik({
        initialValues: {
            gstin: "",
            sellerName: "",
            email: "",
            password: "",
            pickupAddress: {
                name: "",
                mobile: "",
                pinCode: "",
                address: "",
                locality: "",
                city: "",
                state: ""
            },
            bankDetails: {
                accountNumber: "",
                ifscCode: "",
                accountHolderName: ""
            },
            businessDetails: {
                businessName: '',
                businessEmail: '',
                businessMobile: '',
                businessAddress: ''
            }
        },
        validationSchema: Yup.object({
            // You can extend validation for each field here if needed
        }),
        onSubmit: (values) => {
            console.log('FINAL SELLER FORM SUBMITTED ✅', values);
            dispatch(createSeller(values));
        },
    });

    const renderStep = () => {
        switch (activeStep) {
            case 0: return <BSFStep1 formik={formik} />;
            case 1: return <BSFStep2 formik={formik} />;
            case 2: return <BSFStep3 formik={formik} />;
            case 3: return <BSFStep4 formik={formik} />;
            default: return null;
        }
    };

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prev) => prev + 1);
        } else {
            formik.handleSubmit(); // Final submit
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prev) => prev - 1);
        }
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {renderStep()}

            <Box mt={4} display="flex" justifyContent="space-between">
                <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                <Button variant="contained" onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
            </Box>
        </form>
    );
};

export default SellerAccountForm;
