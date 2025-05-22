import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useContext,
    Suspense,
    lazy,
    useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

// Components
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import ImageGenerationForm from "./dashboard/ImageGenerationForm";

// Lazy load components
const PaymentModal = lazy(() => import("./modals/PaymentModal"));
const Gallery = lazy(() => import("./dashboard/Gallery"));
const StatsGrid = lazy(() => import("./dashboard/StatsGrid"));

// Assets
import BackgroundImage from "../assets/bg.jpg";

const CubeLoader = () => {
    // The animation spans approximately 210px (from -25px to 185px)
    const animationWidth = 210;

    return (
        <div className="flex justify-center items-center h-48 w-full">
            <div
                className="relative"
                style={{
                    width: `${animationWidth}px`,
                    height: "80px", // Enough height for the animation
                }}
            >
                {[...Array(5)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="absolute w-8 h-8 bg-purple-500 rounded-lg shadow-lg"
                        style={{
                            left: index * 40,
                            top: 0,
                            willChange: "transform",
                            transform: "translateZ(0)",
                        }}
                        animate={
                            index === 4
                                ? {
                                      top: [0, -40, -40, 0],
                                      left: [160, 185, -25, 0],
                                      zIndex: 10,
                                  }
                                : {
                                      left: [index * 40, (index + 1) * 40],
                                  }
                        }
                        transition={{
                            duration: 1.5,
                            times: index === 4 ? [0, 0.33, 0.67, 1] : [0, 1],
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const Dashboard = () => {
    // Add ref for image generation section
    const imageGenerationRef = useRef(null);

    // Auth and Theme Context
    const { user, logout } = useAuth();
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // State Management
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [credits, setCredits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [generationError, setGenerationError] = useState(null);
    const [userImages, setUserImages] = useState([]);
    const [loadingImages, setLoadingImages] = useState(true);
    const [isInitializing, setIsInitializing] = useState(true);
    const [galleryKey, setGalleryKey] = useState(0);

    // Memoized API headers
    const authHeaders = useMemo(
        () => ({
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }),
        [],
    );

    // Optimized data fetching with debounce
    const fetchUserData = useCallback(async () => {
        try {
            if (!user?.email) return;

            const controller = new AbortController();
            const { signal } = controller;

            Promise.all([
                axios.get(
                    `${import.meta.env.VITE_BASE_URI}/check/credits/${user.email}`,
                    { ...authHeaders, signal },
                ),
                axios.get(`${import.meta.env.VITE_BASE_URI}/generate/gallery`, {
                    ...authHeaders,
                    signal,
                }),
            ])
                .then(([creditResponse, imagesResponse]) => {
                    // Set credits to 0 if no creditModel exists
                    setCredits(creditResponse.data?.credit || 0);
                    setUserImages(imagesResponse.data?.images || []);
                    setLoading(false);
                    setLoadingImages(false);
                })
                .catch((err) => {
                    if (!signal.aborted) {
                        // Don't show error, just set defaults
                        setCredits(0);
                        setUserImages([]);
                        setLoading(false);
                        setLoadingImages(false);
                    }
                });

            return () => controller.abort();
        } catch (err) {
            // Don't show error, just set defaults
            setCredits(0);
            setUserImages([]);
            setLoading(false);
            setLoadingImages(false);
        }
    }, [user?.email, authHeaders]);

    // Add this new function after fetchUserData
    const fetchGalleryImages = useCallback(async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URI}/generate/gallery`,
                authHeaders,
            );
            setUserImages(response.data.images);
            setLoadingImages(false);
        } catch (err) {
            console.error("Failed to fetch gallery images");
        }
    }, [authHeaders]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Initial setup effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 2000); // Changed from 4000ms to 2000ms to show loader for 2 seconds
        return () => clearTimeout(timer);
    }, []);

    // Handlers
    const handleCreditUpdate = (newCredits) => {
        setCredits(newCredits);
        toast.success(`Credits updated! New balance: ${newCredits}`);
    };

    const handleLogout = () => {
        logout(); // Call auth context logout
        localStorage.removeItem("token");
        toast.success("Successfully logged out!", {
            duration: 2000,
            position: "top-center",
            style: {
                background: "#333",
                color: "#fff",
            },
        });

        // Use navigate instead of window.location
        navigate("/auth");
    };

    const handleDeleteImage = async (imageId) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URI}/generate/${imageId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
            );

            if (response.data.success) {
                setUserImages((images) =>
                    images.filter((img) => img._id !== imageId),
                );
                toast.success("Image deleted successfully", {
                    duration: 3000,
                    style: {
                        background: "#10B981",
                        color: "#fff",
                    },
                    icon: "🗑️",
                });
            }
        } catch (error) {
            toast.error("Failed to delete image", {
                duration: 3000,
                style: {
                    background: "#EF4444",
                    color: "#fff",
                },
            });
        }
    };

    // Optimized image generation
    const handleGenerateImage = useCallback(
        async (e) => {
            e.preventDefault();
            if (!prompt.trim() || credits <= 0 || generating) return;

            setGenerating(true);
            setGenerationError(null);
            setGeneratedImage(null);

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URI}/generate/generate`,
                    { prompt: prompt.trim(), userId: user._id },
                    authHeaders,
                );

                if (response.data.success) {
                    setGeneratedImage(response.data.cloudinaryUrl);
                    setCredits((prev) => prev - 1);
                    setPrompt("");
                    await fetchGalleryImages();
                    // Force gallery re-render by updating key
                    setGalleryKey((prev) => prev + 1);
                    toast.success("Image generated successfully!", {
                        duration: 3000,
                        position:
                            window.innerWidth < 640
                                ? "bottom-center"
                                : "top-right",
                        style: {
                            background: "#1F2937",
                            color: "#fff",
                            maxWidth: "90vw",
                            wordBreak: "break-word",
                        },
                    });
                }
            } catch (err) {
                toast.error("Failed to generate image", {
                    duration: 3000,
                    position:
                        window.innerWidth < 640 ? "bottom-center" : "top-right",
                    style: {
                        background: "#EF4444",
                        color: "#fff",
                        maxWidth: "90vw",
                    },
                });
                setGenerationError(
                    "Failed to generate image. Please try again.",
                );
            } finally {
                setGenerating(false);
            }
        },
        [
            prompt,
            credits,
            generating,
            user?._id,
            authHeaders,
            fetchGalleryImages,
        ],
    );

    const scrollToGeneration = useCallback(() => {
        if (!imageGenerationRef.current) return;
        const yOffset = -80; // Account for header
        const y =
            imageGenerationRef.current.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
    }, []);

    // Memoized components
    const memoizedNav = useMemo(
        () => (
            <Navbar
                user={user}
                credits={credits}
                loading={loading}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
                handleLogout={handleLogout}
                openPaymentModal={() => setIsPaymentModalOpen(true)}
            />
        ),
        [user, credits, loading, darkMode, handleLogout],
    );

    const memoizedImageForm = useMemo(
        () => (
            <ImageGenerationForm
                prompt={prompt}
                setPrompt={setPrompt}
                credits={credits}
                generating={generating}
                generatedImage={generatedImage}
                generationError={generationError}
                handleGenerateImage={handleGenerateImage}
            />
        ),
        [
            prompt,
            credits,
            generating,
            generatedImage,
            generationError,
            handleGenerateImage,
        ],
    );

    // Optimize recent images with aggressive quality reduction and caching
    const recentImagesMemo = useMemo(() => {
        const recentImages = userImages.slice(0, 3);
        return recentImages.map((img) => ({
            ...img,
            // More aggressive image optimization
            imageUrl: img.imageUrl.replace(
                "/upload/",
                "/upload/w_300,q_auto:eco,f_auto/",
            ),
            generatedAt: img.generatedAt
                ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                  }).format(new Date(img.generatedAt))
                : "Not available",
            createdAt: img.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                  }).format(new Date(img.createdAt))
                : "Not available",
        }));
    }, [userImages]);

    // Memoize the gallery component
    const MemoizedGallery = useMemo(
        () => (
            <Gallery
                key={galleryKey}
                images={recentImagesMemo}
                loading={loadingImages}
                onDelete={handleDeleteImage}
                showHeaderFooter={false}
                isMinimal={true}
                enableVirtualization={true}
                imageSizingHint={{ width: 300, height: 300 }}
            />
        ),
        [galleryKey, recentImagesMemo, loadingImages, handleDeleteImage],
    );

    if (isInitializing) {
        return (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gradient-to-br from-gray-900 to-purple-900 flex flex-col items-center justify-center"
            >
                <motion.div
                    className="space-y-8 text-center"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <CubeLoader />
                    <motion.p
                        className="text-white/80 text-lg font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Preparing your creative space...
                    </motion.p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-900 to-purple-900">
            <Toaster position="top-right" />

            <div
                className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 shadow-lg"
                style={{
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    willChange: "transform",
                    transform: "translateZ(0)",
                }}
            >
                {memoizedNav}
            </div>

            <main
                className="flex-grow relative z-10 pt-20"
                style={{
                    willChange: "transform",
                    transform: "translateZ(0)",
                    overscrollBehavior: "contain",
                }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px] overflow-x-hidden">
                    <div className="space-y-8">
                        <div
                            ref={imageGenerationRef}
                            className="bg-black/10 border border-white/10 p-4 sm:p-6 lg:p-8 rounded-xl"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
                                Image Generation
                            </h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 text-red-200 rounded-lg border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            {memoizedImageForm}

                            <Suspense
                                fallback={
                                    <div className="h-24 animate-pulse bg-white/5 rounded-lg" />
                                }
                            >
                                <StatsGrid
                                    loading={loading}
                                    credits={credits}
                                    generatedImages={userImages}
                                    openPaymentModal={() =>
                                        setIsPaymentModalOpen(true)
                                    }
                                />
                            </Suspense>
                        </div>

                        <div
                            className="bg-black/10 border border-white/10 p-6 sm:p-8 rounded-xl"
                            style={{
                                willChange: "transform, opacity",
                                transform: "translateZ(0)",
                                containIntrinsicSize: "0 500px", // Add size hint
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-white">
                                    Recent Creations
                                </h2>
                                {userImages.length === 0 ? (
                                    <button
                                        onClick={scrollToGeneration}
                                        className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
                                    >
                                        Create your first image
                                        <span aria-hidden="true">↑</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate("/gallery")}
                                        className="text-purple-400 hover:text-purple-300"
                                    >
                                        View All →
                                    </button>
                                )}
                            </div>
                            <div className="content-visibility-auto">
                                {" "}
                                {/* Add content-visibility optimization */}
                                <Suspense
                                    fallback={
                                        <div className="h-96 animate-pulse bg-white/5 rounded-lg" />
                                    }
                                >
                                    {MemoizedGallery}
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {isPaymentModalOpen && (
                <Suspense
                    fallback={<div className="fixed inset-0 bg-black/50" />}
                >
                    <PaymentModal
                        isOpen={isPaymentModalOpen}
                        onClose={() => setIsPaymentModalOpen(false)}
                        onSuccess={handleCreditUpdate}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default React.memo(Dashboard);
