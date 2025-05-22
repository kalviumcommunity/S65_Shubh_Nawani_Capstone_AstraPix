import React, { useId } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { getRandomPrompt } from "../../utils/promptSuggestions";

// Simplified animation
const formVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const ImageGenerationForm = ({
  prompt,
  setPrompt,
  credits,
  generating,
  generatedImage,
  generationError,
  handleGenerateImage,
}) => {
  const formId = useId();

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(prompt);
    setPrompt(randomPrompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerateImage(e);
    }
  };

  // Simple onChange handler instead of debounce
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 sm:mb-8 w-full"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">
        Generate Image
      </h3>
      <form
        onSubmit={handleGenerateImage}
        className="space-y-3 sm:space-y-4"
        id={`${formId}-generation-form`}
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <label htmlFor={`${formId}-prompt`} className="sr-only">
            Image description
          </label>
          <textarea
            id={`${formId}-prompt`}
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the image you want to generate..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base resize-none"
            rows="3"
            disabled={generating}
            aria-label="Image description prompt"
            aria-describedby={generationError ? `${formId}-error` : undefined}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleSurpriseMe}
            disabled={generating}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors text-sm sm:text-base whitespace-nowrap touch-manipulation"
            aria-label="Get a random prompt suggestion"
          >
            Surprise Me
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!prompt.trim() || credits <= 0 || generating}
            className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white flex items-center justify-center gap-1 sm:gap-2 transition-colors text-sm sm:text-base touch-manipulation ${
              !prompt.trim() || credits <= 0
                ? "bg-gray-600 cursor-not-allowed opacity-70"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            }`}
            aria-label={generating ? "Generating image..." : "Generate image"}
            aria-busy={generating}
          >
            {generating ? (
              <>
                <Loader2
                  className="w-3 h-3 sm:w-4 sm:h-4 animate-spin"
                  aria-hidden="true"
                />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  aria-hidden="true"
                />
                <span>
                  Generate Image ({credits} credit{credits !== 1 ? "s" : ""})
                </span>
              </>
            )}
          </motion.button>
        </div>
      </form>

      {generationError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-500/10 backdrop-blur-md text-red-200 rounded-lg border border-red-500/20 text-sm"
          id={`${formId}-error`}
          role="alert"
        >
          {generationError}
        </motion.div>
      )}

      {generatedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6"
        >
          <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
            Generated Image
          </h4>
          <div className="relative aspect-square max-w-sm sm:max-w-2xl mx-auto">
            <img
              src={generatedImage}
              alt={`AI generated artwork based on: ${prompt}`}
              className="rounded-lg shadow-xl w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                e.currentTarget.classList.add("opacity-70");
                e.currentTarget.alt = "Failed to load image";
              }}
            />
          </div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/80 text-center">
            Prompt: "{prompt}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageGenerationForm;
