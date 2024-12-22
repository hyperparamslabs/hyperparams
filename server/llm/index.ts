import { OpenAI } from "openai"
import Replicate from "replicate"
import { Groq } from "groq-sdk"
import Anthropic from "@anthropic-ai/sdk"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
  useFileOutput: false,
})

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})
