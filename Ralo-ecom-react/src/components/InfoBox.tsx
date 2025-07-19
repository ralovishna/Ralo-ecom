// src/Components/Common/InfoBox.tsx
import React from "react";

interface InfoBoxProps {
    message: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ message }) => {
    return (
        <div style={{ padding: "1rem", backgroundColor: "#e7f3fe", border: "1px solid #2196f3", color: "#0b5394" }}>
            {message}
        </div>
    );
};

export default InfoBox;
