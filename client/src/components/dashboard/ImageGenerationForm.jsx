import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Coins } from 'lucide-react';

// Add array of random prompts
const randomPrompts = [
  "A magical treehouse in a bioluminescent forest at night",
  "A steampunk city floating in the clouds",
  "A cozy cafe on Mars with Earth visible through the window",
  "A library inhabited by ghostly readers",
  "An underwater palace made of crystal and coral",
  "A garden where musical instruments grow like plants",
  "A train station for time travelers",
  "A city where buildings are made of books",
  "A market in the clouds where stars are sold",
  "A laboratory where potions create different weather"
];

const ImageGenerationForm = ({ prompt, setPrompt, credits, generating, generatedImage, generationError, handleGenerateImage }) => {
  
  const handleSurpriseMe = (e) => {
    e.preventDefault();
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h3 className="text-2xl font-semibold text-white mb-4">
        Generate Image
      </h3>
      <form onSubmit={handleGenerateImage} className="space-y-4">
        <div className="flex gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full px-4 py-3 bg-white/5 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="3"
          />
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSurpriseMe}
            type="button"
            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg text-white/90 hover:text-white flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Surprise Me
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={generating || !prompt.trim() || credits <= 0}
            type="submit"
            className={`flex-1 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2
              ${generating || !prompt.trim() || credits <= 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
              }`}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Image ({credits} credit{credits !== 1 ? 's' : ''})
              </>
            )}
          </motion.button>
        </div>
      </form>

      {generationError && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-4 bg-red-500/10 backdrop-blur-md text-red-200 rounded-lg border border-red-500/20"
        >
          {generationError}
        </motion.div>
      )}

      {generatedImage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <h4 className="text-xl font-semibold text-white mb-4">
            Generated Image
          </h4>
          <div className="relative aspect-square max-w-2xl mx-auto">
            <img
              src={generatedImage}
              alt="Generated artwork"
              className="rounded-lg shadow-xl w-full h-full object-cover"
            />
          </div>
          <p className="mt-4 text-sm text-white/80 text-center">
            Prompt: "{prompt}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageGenerationForm;