import { jwtDecode } from "jwt-decode";

export const getRoleFromJwt = (token: string): string | null => {
    try {
        const decoded: any = jwtDecode(token);
        return decoded?.authorities || decoded?.role || null;
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.error("JWT Decode failed", err);
        }
        console.error("JWT Decode failed", err);
        return null;
    }
};