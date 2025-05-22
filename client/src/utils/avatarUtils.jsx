export const getInitialAvatar = (name) => {
    const letter = name?.charAt(0)?.toUpperCase() || "?";
    const colors = [
        "bg-purple-500",
        "bg-indigo-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
    ];
    const colorIndex = name?.length % colors.length || 0;
    return { letter, bgColor: colors[colorIndex] };
};
