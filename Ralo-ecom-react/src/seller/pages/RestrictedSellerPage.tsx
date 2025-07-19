import { useAppSelector } from "../../State/Store.ts";
import InfoBox from "../../components/InfoBox.tsx";
import ErrorBox from "../../components/ErrorBox.tsx";

export const RestrictedSellerPage = ({ children }) => {
    const { profile } = useAppSelector((state) => state.seller);

    if (!profile) return null;

    switch (profile.accountStatus) {
        case "ACTIVE":
            return children;
        case "PENDING_VERIFICATION":
            return (
                <div className="text-center p-4">
                    <InfoBox message="Your account is pending admin verification." />
                    <button
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => alert("Feature coming soon: Request re-verification")}
                    >
                        Request Re-Verification
                    </button>
                </div>
            );
        case "SUSPENDED":
            return <ErrorBox message="Your account has been suspended." />;
        case "DEACTIVATED":
            return <InfoBox message="This account is deactivated. Contact support to reactivate." />;
        case "BANNED":
            return <ErrorBox message="Your account has been banned permanently." />;
        case "CLOSED":
            return <InfoBox message="This account has been closed." />;
        default:
            return <ErrorBox message="Unknown account status." />;
    }
};
