import * as fal from "@fal-ai/serverless-client";

// Configure fal.ai with your API key from environment variables
const API_KEY = process.env.REACT_APP_FAL_KEY || "846fb603-554e-4442-a171-4bdd7f6de8fd:65a992538f86663387f9eead639eb293";

if (!process.env.REACT_APP_FAL_KEY) {
  console.warn("⚠️ Using fallback API key. Environment variable not loaded from .env file.");
}

console.log("🔍 API Key being used:", API_KEY ? "EXISTS (length: " + API_KEY.length + ")" : "UNDEFINED");

fal.config({
  credentials: API_KEY
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
      // Validate inputs
      if (!personImageUrl || typeof personImageUrl !== 'string') {
        throw new Error("Invalid personImageUrl: " + personImageUrl);
      }
      
      if (!productImageUrl || typeof productImageUrl !== 'string') {
        throw new Error("Invalid productImageUrl: " + productImageUrl);
      }
      
      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        throw new Error("Invalid prompt: " + prompt);
      }
      
      // Log image URLs for debugging
      console.log("Person image URL:", personImageUrl.substring(0, 100) + "...");
      console.log("Product image URL:", productImageUrl);
      console.log("Person image type:", personImageUrl.startsWith('data:') ? 'base64' : 'URL');
      console.log("Product image type:", productImageUrl.startsWith('data:') ? 'base64' : 'URL');
      
      // Clean the prompt of any problematic characters
      const cleanPrompt = prompt.replace(/[""]/g, '"').replace(/[\n\r]/g, ' ').trim();
      
      // Try nano-banana/edit for image-to-image editing
      console.log("Attempting nano-banana/edit virtual try-on...");
      console.log("Input parameters:", {
        image_urls: [personImageUrl, productImageUrl],
        prompt: cleanPrompt
      });
      
      // Try with both images first, fallback to person image only if it fails
      let result;
      try {
        console.log("Trying with both person and product images...");
        result = await fal.subscribe("fal-ai/nano-banana/edit", {
          input: {
            prompt: cleanPrompt,
            image_urls: [personImageUrl, productImageUrl]
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              console.log("Nano-banana processing with both images...");
            }
          }
        });
      } catch (bothImagesError) {
        console.warn("Both images failed, trying with person image only:", bothImagesError.message);
        result = await fal.subscribe("fal-ai/nano-banana/edit", {
          input: {
            prompt: cleanPrompt,
            image_urls: [personImageUrl]
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS") {
              console.log("Nano-banana processing with person image only...");
            }
          }
        });
      }

      console.log("Nano-banana result:", result);
      
      // Handle nano-banana/edit response format
      let imageUrl;
      if (result.data && result.data.images && Array.isArray(result.data.images) && result.data.images.length > 0) {
        imageUrl = result.data.images[0].url;
      } else if (result.images && Array.isArray(result.images) && result.images.length > 0) {
        imageUrl = result.images[0].url;
      } else {
        console.error("Unexpected result format:", result);
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
      
      return {
        success: false,
        error: `Nano-banana/edit failed: ${error.message}`
      };
    }
  }

  /**
   * Create clothing try-on specifically for fashion items
   * @param {string} personImageUrl - Image of person
   * @param {string} clothingImageUrl - Image of clothing item
   * @param {string} clothingType - Type of clothing (shirt, shoes, hat, etc.)
   * @returns {Promise<Object>} Virtual try-on result
   */
  async tryOnClothing(personImageUrl, clothingImageUrl, clothingType = "clothing", productName = "") {
    // Create prompts that reference the clothing image for nano-banana/edit
    let finalPrompt = "";
    
    if (productName) {
      const productLower = productName.toLowerCase();
      if (productLower.includes('ed sheeran')) {
        if (productLower.includes('custom hoodie')) {
          finalPrompt = "put the exact Ed Sheeran custom hoodie from the reference image on this person, matching all text, graphics, and colors exactly";
        } else if (productLower.includes('leopard stamp')) {
          finalPrompt = "put the exact Ed Sheeran leopard stamp hoodie from the reference image on this person, matching the animal print design exactly";
        } else if (productLower.includes('signwriter')) {
          finalPrompt = "put the exact Ed Sheeran signwriter zip hoodie from the reference image on this person, matching all details exactly";
        } else {
          finalPrompt = "put the exact Ed Sheeran hoodie from the reference image on this person";
        }
      } else if (productLower.includes('kith')) {
        if (productLower.includes('vintage tee')) {
          finalPrompt = "put the exact Kith Jaws vintage t-shirt from the reference image on this person, matching all movie graphics exactly";
        } else if (productLower.includes('crewneck')) {
          finalPrompt = "put the exact Kith Jaws crewneck sweatshirt from the reference image on this person";
        } else if (productLower.includes('cap')) {
          finalPrompt = "put the exact Kith Jaws cap from the reference image on this person";
        } else {
          finalPrompt = "put the exact Kith Jaws item from the reference image on this person";
        }
      }
    }
    
    // Fallback to clothing type prompts if no specific product match
    if (!finalPrompt) {
      const prompts = {
        shirt: "put the exact t-shirt from the reference image on this person",
        hat: "put the exact hat from the reference image on this person", 
        jacket: "put the exact jacket from the reference image on this person",
        hoodie: "put the exact hoodie from the reference image on this person",
        pants: "put the exact pants from the reference image on this person",
        dress: "put the exact dress from the reference image on this person",
        default: "put the exact clothing item from the reference image on this person"
      };
      finalPrompt = prompts[clothingType.toLowerCase()] || prompts.default;
    }
    
    return this.createVirtualTryOn(personImageUrl, clothingImageUrl, finalPrompt);
  }
}

// Export singleton instance
export const falAI = new FalAIService();
export default falAI;
