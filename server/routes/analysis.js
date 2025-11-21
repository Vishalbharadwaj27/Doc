import express from 'express'

const router = express.Router()

/**
 * POST /api/analysis/symptoms
 * Analyze symptoms (STUBBED - returns placeholder analysis)
 * 
 * TODO: To integrate real AI:
 * 1. Set environment variables: OPENAI_API_KEY or GOOGLE_API_KEY
 * 2. Install required package: npm install openai (or @google/generative-ai)
 * 3. Replace this endpoint with real AI logic
 * 
 * Example with OpenAI:
 * import { Configuration, OpenAIApi } from 'openai'
 * const openai = new OpenAIApi(new Configuration({
 *   apiKey: process.env.OPENAI_API_KEY
 * }))
 */
router.post('/symptoms', async (req, res) => {
  try {
    const { patientId, symptoms } = req.body

    // STUBBED RESPONSE
    const analysis = {
      patientId,
      analysis: 'This is a placeholder analysis. To enable real AI-powered symptom analysis, configure an AI provider (OpenAI, Google Gen AI, or similar) in your backend and replace this endpoint.',
      confidence: 0,
      recommendations: [
        'Further medical evaluation recommended',
        'Consult with a specialist',
      ],
      generatedAt: new Date().toISOString(),
    }

    res.json(analysis)
  } catch (err) {
    res.status(500).json({ message: 'Analysis failed' })
  }
})

export default router
