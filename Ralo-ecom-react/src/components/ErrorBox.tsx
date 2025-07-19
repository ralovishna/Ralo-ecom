// src/Components/Common/ErrorBox.tsx
import React from "react";

interface ErrorBoxProps {
    message: string;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
    return (
        <div style={{ padding: "1rem", backgroundColor: "#fdecea", border: "1px solid #f44336", color: "#a94442" }}>
            {message}
        </div>
    );
};

export default ErrorBox;
