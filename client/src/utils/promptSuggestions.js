export const prompts = [
    "A cosmic butterfly in a nebula garden",
    "Steampunk city floating in the clouds",
    "Crystal forest under northern lights",
    "Ancient temple with futuristic elements",
    "Underwater metropolis with bioluminescent buildings",
    "Dragon made of constellation stars",
    "Cyberpunk samurai in neon rain",
    "Floating islands with waterfalls to space",
    "Time-traveling train through dimensions",
    "Desert oasis with holographic palm trees",
    "Mechanical phoenix rising from digital flames",
    "Library where books come alive",
    "Garden of glowing mushrooms at midnight",
    "City inside a giant tree",
    "Portal between winter and summer",
    "Orchestra conducting the aurora borealis",
    "Robot learning to paint sunrise",
    "Dimensional rifts in a peaceful meadow",
    "Lost city emerging from morning mist",
    "Space station shaped like mandala",
    "Ancient ruins with alien technology",
    "Wind spirits dancing in autumn leaves",
    "Crystalline mountains at sunset",
    "Lighthouse beaming rainbow light",
    "Mirror world where shadows are colorful",
];

export const getRandomPrompt = (currentPrompt) => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    if (randomPrompt === currentPrompt) return getRandomPrompt(currentPrompt);
    return randomPrompt;
};
