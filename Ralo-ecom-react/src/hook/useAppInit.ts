import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../State/Store.ts";
import { fetchSellerProfile } from "../State/seller/sellerSlice.ts";
import { fetchUserProfile } from "../State/AuthSlice.ts";
import { fetchHomeCategories } from "../State/admin/AdminSlice.ts";
// import { jwtDecode } from "jwt-decode";
import { getRoleFromJwt } from "../Util/getRoleFromJwt.ts";

// hooks/useAppInit.ts
export const useAppInit = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(state => state.auth);
    const sellerProfile = useAppSelector(state => state.seller.profile);

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            dispatch(fetchHomeCategories());
            return;
        }

        try {
            const role = getRoleFromJwt(jwt);
            console.log("Decoded role from JWT:", role);

            if (role === "ROLE_SELLER" && !sellerProfile) {
                console.log("Fetching seller profile...");
                dispatch(fetchSellerProfile());
                console.log("Fetched seller profile:", sellerProfile);
            } else if (!auth.user && role !== "ROLE_SELLER") {
                console.log("Fetching user profile...", auth.user);
                dispatch(fetchUserProfile());
            }

            dispatch(fetchHomeCategories());
        } catch (error) {
            console.error("Invalid JWT:", error);
        }
    }, [dispatch, auth.user, sellerProfile]);
};
