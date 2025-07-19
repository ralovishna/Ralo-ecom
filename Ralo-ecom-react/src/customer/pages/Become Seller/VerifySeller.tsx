import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store.ts";
import { verifySellerEmail } from "../../../State/seller/sellerSlice.ts";

const VerifySellerPage = () => {
    const { otp } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, profile } = useAppSelector(state => state.seller);

    useEffect(() => {
        if (otp) {
            dispatch(verifySellerEmail(otp));
        }
    }, [otp, dispatch]);

    useEffect(() => {
        if (profile?.isEmailVerified) {
            setTimeout(() => {
                navigate("/seller/login");
            }, 3000);
        }
    }, [profile, navigate]);

    const handleResendOtp = () => {
        alert("Resend OTP functionality is not implemented yet.");
        // You can implement resend-otp API like:
        // dispatch(resendSellerOtp(profile?.email))
    };

    return (
        <div className="p-6 text-center">
            {loading && (
                <p className="text-blue-500">Verifying your account...</p>
            )}

            {!loading && profile?.isEmailVerified && (
                <p className="text-green-600 font-semibold">
                    ✅ Email verified successfully! Redirecting to login...
                </p>
            )}

            {!loading && error && (
                <>
                    <p className="text-red-500 font-semibold">❌ {error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={handleResendOtp}
                    >
                        Resend OTP
                    </button>
                </>
            )}
        </div>
    );
};

export default VerifySellerPage;
