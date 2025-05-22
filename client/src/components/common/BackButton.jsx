import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="fixed top-3 sm:top-4 left-3 sm:left-4 p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors touch-manipulation z-50"
            aria-label="Go back"
        >
            <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </button>
    );
};

export default BackButton;
