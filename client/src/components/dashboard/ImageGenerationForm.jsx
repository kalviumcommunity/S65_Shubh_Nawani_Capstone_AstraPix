import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageGenerationForm = ({ 
  prompt, 
  setPrompt, 
  handleGenerateImage, 
  generating, 
  credits, 
  generationError,
  generatedImage 
}) => {
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
        <div>
          <label className="block text-white/80 mb-2">
            Enter your prompt
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-500 text-white placeholder-white/50 sm:text-base text-sm"
            placeholder="A beautiful space scene..."
            disabled={generating || credits <= 0}
          />
        </div>
        <button
          type="submit"
          disabled={generating || !prompt.trim() || credits <= 0}
          className={`w-full py-2 px-4 rounded-lg sm:text-base text-sm ${
            generating || !prompt.trim() || credits <= 0
              ? 'bg-gray-400/50 cursor-not-allowed'
              : 'bg-purple-600/90 hover:bg-purple-700/90'
          } text-white font-semibold transition-all duration-200`}
        >
          {generating ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2 h-5 w-5" />
              Generating...
            </span>
          ) : credits <= 0 ? (
            'No credits available'
          ) : (
            'Generate Image'
          )}
        </button>
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