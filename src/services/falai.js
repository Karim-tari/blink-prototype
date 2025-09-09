import * as fal from "@fal-ai/serverless-client";

// Configure fal.ai with your API key from environment variables
if (!process.env.REACT_APP_FAL_KEY) {
  console.error("❌ REACT_APP_FAL_KEY environment variable is not set. Please check your .env file.");
}

fal.config({
  credentials: process.env.REACT_APP_FAL_KEY
});

/**
 * FalAI Service - Handles all interactions with fal.ai API
 */
class FalAIService {
  constructor() {
    this.isConfigured = true;
  }

  /**
   * Generate image using fal.ai
   * @param {string} prompt - Text prompt for image generation
   * @param {Object} options - Additional options (model, size, etc.)
   * @returns {Promise<Object>} Generated image result
   */
  async generateImage(prompt, options = {}) {
    try {
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: prompt,
          image_size: options.imageSize || "landscape_4_3",
          num_inference_steps: options.steps || 4,
          num_images: options.numImages || 1,
          enable_safety_checker: true,
          ...options
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Image generation in progress...");
          }
        },
      });

      return {
        success: true,
        images: result.images,
        data: result
      };
    } catch (error) {
      console.error("FalAI Image Generation Error:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze image using fal.ai vision models
   * @param {string} imageUrl - URL or base64 of image to analyze
   * @param {string} prompt - Question or instruction about the image
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeImage(imageUrl, prompt = "Describe this image") {
    try {
      const result = await fal.subscribe("fal-ai/llava-next", {
        input: {
          image_url: imageUrl,
          prompt: prompt,
          max_tokens: 512,
        },
        logs: true,
      });

      return {
        success: true,
        description: result.output,
        data: result
      };
    } catch (error) {
      console.error("FalAI Image Analysis Error:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Remove background from image
   * @param {string} imageUrl - URL or base64 of image
   * @returns {Promise<Object>} Result with background removed
   */
  async removeBackground(imageUrl) {
    try {
      const result = await fal.subscribe("fal-ai/birefnet", {
        input: {
          image_url: imageUrl,
        },
        logs: true,
      });

      return {
        success: true,
        image: result.image,
        data: result
      };
    } catch (error) {
      console.error("FalAI Background Removal Error:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upscale image using fal.ai
   * @param {string} imageUrl - URL or base64 of image to upscale
   * @param {number} scale - Scale factor (2, 4, etc.)
   * @returns {Promise<Object>} Upscaled image result
   */
  async upscaleImage(imageUrl, scale = 2) {
    try {
      const result = await fal.subscribe("fal-ai/clarity-upscaler", {
        input: {
          image_url: imageUrl,
          scale_factor: scale,
        },
        logs: true,
      });

      return {
        success: true,
        image: result.image,
        data: result
      };
    } catch (error) {
      console.error("FalAI Image Upscaling Error:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate product images for e-commerce
   * @param {string} prompt - Product description
   * @param {Object} options - Style and format options
   * @returns {Promise<Object>} Generated product images
   */
  async generateProductImage(prompt, options = {}) {
    const enhancedPrompt = `Professional product photography, ${prompt}, clean white background, high quality, commercial photography, studio lighting, detailed, sharp focus`;
    
    return this.generateImage(enhancedPrompt, {
      imageSize: "square_hd",
      steps: 8,
      ...options
    });
  }

  /**
   * Create virtual try-on using nano-banana API
   * @param {string} personImageUrl - Image of person (base64 or URL)
   * @param {string} productImageUrl - Image of product to try on (base64 or URL)
   * @param {string} prompt - Description of how to apply the product
   * @returns {Promise<Object>} Virtual try-on result
   */
  async createVirtualTryOn(personImageUrl, productImageUrl, prompt = "wearing the clothing item naturally") {
    try {
      // Try nano-banana/edit for image-to-image editing
      console.log("Attempting nano-banana/edit virtual try-on...");
      const result = await fal.subscribe("fal-ai/nano-banana/edit", {
        input: {
          image_urls: [personImageUrl],
          prompt: `Keep the exact same person, face, and body from the original image. Only change the clothing: the person is now ${prompt}. Preserve all facial features, skin tone, hair, and body proportions exactly as they appear in the original image.`,
          num_images: 1,
          output_format: "jpeg",
          sync_mode: true
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log("Nano-banana virtual try-on in progress...");
          }
        },
      });

      console.log("Nano-banana result:", result);
      
      // Handle nano-banana/edit response format: {images: [{url: "..."}], description: "..."}
      let imageUrl;
      if (result.images && Array.isArray(result.images) && result.images.length > 0) {
        imageUrl = result.images[0].url;
      } else {
        throw new Error("No images returned from nano-banana/edit");
      }
      
      console.log("Extracted nano-banana image URL:", imageUrl);
      console.log("Nano-banana description:", result.description);
      
      return {
        success: true,
        image: imageUrl,
        data: result
      };
    } catch (error) {
      console.error("FalAI Nano-Banana Error:", error);
      
      // Fallback to flux/dev approach
      try {
        console.log("Falling back to flux/dev...");
        const fallbackResult = await fal.subscribe("fal-ai/flux/dev", {
          input: {
            prompt: `The exact same person from the reference image, now ${prompt}, keep face and body identical, realistic, high quality, natural lighting`,
            image_url: personImageUrl,
            strength: 0.5, // Lower strength to preserve more of original person
            num_inference_steps: 28,
            guidance_scale: 3.5,
            image_size: "landscape_4_3",
            enable_safety_checker: true,
          },
          logs: true,
        });

        return {
          success: true,
          image: fallbackResult.images[0],
          data: fallbackResult
        };
      } catch (fallbackError) {
        console.error("FalAI Flux Fallback Error:", fallbackError);
        return {
          success: false,
          error: `Both nano-banana and flux failed: ${error.message}, ${fallbackError.message}`
        };
      }
    }
  }

  /**
   * Create clothing try-on specifically for fashion items
   * @param {string} personImageUrl - Image of person
   * @param {string} clothingImageUrl - Image of clothing item
   * @param {string} clothingType - Type of clothing (shirt, shoes, hat, etc.)
   * @returns {Promise<Object>} Virtual try-on result
   */
  async tryOnClothing(personImageUrl, clothingImageUrl, clothingType = "clothing") {
    const prompts = {
      shirt: "wearing a Kith x Jaws vintage graphic t-shirt with shark movie design, white or gray cotton tee, casual streetwear style, relaxed fit, same person same face",
      hat: "wearing a Kith x Jaws baseball cap with shark logo, adjustable snapback or fitted cap, streetwear style, same person same face",
      jacket: "wearing a Kith x Jaws crewneck sweatshirt with movie graphics, pullover hoodie style, comfortable oversized fit, same person same face",
      pants: "wearing Kith x Jaws sweatpants or joggers, casual streetwear bottoms with movie branding, relaxed fit, same person same face",
      dress: "wearing a Kith x Jaws dress with movie graphics, casual streetwear style dress, comfortable fit, same person same face",
      default: "wearing Kith x Jaws streetwear clothing with shark movie graphics and branding, casual urban style, same person same face"
    };

    const prompt = prompts[clothingType.toLowerCase()] || prompts.default;
    
    return this.createVirtualTryOn(personImageUrl, clothingImageUrl, prompt);
  }
}

// Export singleton instance
export const falAI = new FalAIService();
export default falAI;
