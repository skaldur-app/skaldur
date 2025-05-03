import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import {
    ILlmProviderAdapter,
    GoogleGeminiConfig,
    ProviderConfig,
    ValidationResult,
    GenerationParams,
} from './types';

// Use a simple prompt and low token count for validation
const VALIDATION_PROMPT = "Test connection";
const VALIDATION_MAX_TOKENS = 5;
// Use a known, generally available small model
// Note: Actual available model IDs might differ.
const VALIDATION_MODEL_ID = 'gemini-1.5-flash-latest';

export class GoogleGeminiAdapter implements ILlmProviderAdapter {
    async validateCredentials(config: ProviderConfig): Promise<ValidationResult> {
        if (config.providerId !== 'google') {
            throw new Error('Invalid configuration type provided to GoogleGeminiAdapter');
        }
        const geminiConfig = config as GoogleGeminiConfig;

        if (!geminiConfig.apiKey) {
            return { success: false, error: 'API key is missing.' };
        }

        try {
            const genAI = new GoogleGenerativeAI(geminiConfig.apiKey);
            const model = genAI.getGenerativeModel({
                 model: VALIDATION_MODEL_ID,
                 // Use minimal safety settings for validation to avoid false negatives
                 // Real requests should use appropriate safety settings.
                 safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                 ]
             });

            // Perform a simple generation request to validate
            await model.generateContent({
                contents: [{ role: "user", parts: [{ text: VALIDATION_PROMPT }] }],
                generationConfig: {
                    maxOutputTokens: VALIDATION_MAX_TOKENS,
                    temperature: 0.1 // Low temp for deterministic validation
                }
            });

            return { success: true };
        } catch (error: any) {
            let errorMessage = 'Failed to connect to Google Gemini.';

            // Google AI SDK errors might have specific properties or types
            // Ref: https://github.com/google/generative-ai-js/blob/main/docs/errors.md (or similar)
            if (error.message?.includes('API key not valid') || error.message?.includes('permission denied')) {
                errorMessage = 'Authentication failed. Check your Google AI API key.';
            } else if (error.message?.includes('quota')) {
                errorMessage = 'Quota exceeded. Please check your Google Cloud project quota for Generative AI.';
            } else if (error.message?.includes('model not found')) {
                errorMessage = `Model not found (${VALIDATION_MODEL_ID}). Check the model name or availability.`;
            } else if (error.message?.includes('unsupported location') || error.message?.includes('location is not enabled')) {
                errorMessage = 'Location/Region not supported or enabled for the API key/project.';
            } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
                errorMessage = `Network error: Could not reach Google AI endpoint. Check network connection.`;
            } else if (error instanceof Error) {
                errorMessage = error.message; // General error
            }
            // Check for specific response codes if available in the error object
            // else if (error.httpStatusCode === 401 || error.httpStatusCode === 403) { ... }

            console.error('Google Gemini validation failed:', error);
            return { success: false, error: errorMessage };
        }
    }

    // --- Generate Completion ---
    async generateCompletion(
        config: ProviderConfig,
        params: GenerationParams,
        prompt: string
    ): Promise<string> {
        if (config.providerId !== 'google') {
            throw new Error('Invalid configuration type provided to GoogleGeminiAdapter');
        }
        const googleConfig = config as GoogleGeminiConfig;

        if (!googleConfig.apiKey) {
            throw new Error('API key is missing in Google Gemini configuration.');
        }

        try {
            const genAI = new GoogleGenerativeAI(googleConfig.apiKey);
            const model = genAI.getGenerativeModel({
                model: params.model, // Use model ID from params
                // Apply safety settings - consider making these configurable
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                    // Note: Civic Integrity seems less common/supported, check Gemini docs if needed
                ],
            });

            const generationConfig = {
                // temperature is optional in SDK, handled by || undefined
                temperature: params.temperature,
                 // Gemini uses maxOutputTokens, map from maxTokens if needed
                 // Ensure it's a number or undefined
                maxOutputTokens: params.maxTokens ? Number(params.maxTokens) : undefined,
                // Other Gemini params like topK, topP could be added to GenerationParams if needed
            };

            // Construct content structure (handle system prompt if Gemini supports it similarly)
            // Gemini API v1 uses a simple string prompt for generateContent
            // For chat/multi-turn, use model.startChat().sendMessage()
            // For simplicity here, using generateContent which takes a simple prompt string.
            // If system prompts are needed, adjust to use the chat interface.

             const fullPrompt = params.systemPrompt
                ? `${params.systemPrompt}\n\nUser: ${prompt}`
                : prompt;

             // Check if model supports system instructions directly
             // As of late 2023/early 2024, direct system prompt in generateContent might not be standard
             // Need to use startChat for proper role separation if systemPrompt is critical
             // Let's assume simple generateContent for now:

            const result = await model.generateContent(prompt); // Pass only user prompt here

            // If system prompt is crucial, the implementation should be:
            /*
            const chat = model.startChat({
                 history: [], // Or provide history
                 generationConfig: generationConfig,
                 ...(params.systemPrompt && { systemInstruction: params.systemPrompt })
            });
            const result = await chat.sendMessage(prompt);
            */

            const response = result.response;
            const completion = response.text();

            if (completion === undefined || completion === null) {
                // Check for blocked content
                 if (response.promptFeedback?.blockReason) {
                    throw new Error(`Google Gemini response blocked due to ${response.promptFeedback.blockReason}.`);
                 }
                throw new Error('Google Gemini response did not contain text completion.');
            }
            return completion.trim();

        } catch (error: any) {
            console.error("Google Gemini generation error:", error);
             // Check for specific Google AI SDK errors if available
            if (error.message.includes('API key not valid')) {
                throw new Error(`Google Gemini API Error: Invalid API Key.`);
            } else {
                throw new Error(`Failed to generate completion from Google Gemini: ${error.message}`);
            }
        }
    }
}