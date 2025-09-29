
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction, Goal } from '../types';

if (!process.env.API_KEY) {
  // In a real app, this would be handled more gracefully.
  // For this example, we'll alert the user and disable AI features.
  console.error("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;

const formatTransactionsForPrompt = (transactions: Transaction[]): string => {
  if (transactions.length === 0) {
    return "No transaction data for the last month.";
  }
  return transactions
    .map(t => `${t.date}: ${t.type === 'income' ? '+' : '-'}$${t.amount} for "${t.description}"`)
    .join('\n');
};

export const getFinancialAdvice = async (
  transactions: Transaction[],
  userPrompt: string
): Promise<string> => {
  if (!ai) {
    return "AI Service is not available. Please configure your API key.";
  }
  try {
    const transactionData = formatTransactionsForPrompt(transactions);

    const fullPrompt = `
      You are "Keuanganku AI", a friendly and expert personal finance assistant from Indonesia. Your goal is to help users manage their finances wisely. You MUST reply in Bahasa Indonesia.

      Here is the user's transaction data for the past month:
      ---
      ${transactionData}
      ---
      
      Here is the user's question or request:
      ---
      ${userPrompt}
      ---

      Based on the data and the user's request, provide a clear, concise, and actionable response. 
      If the user asks for an analysis of waste, identify potential wasteful spending by analyzing transaction descriptions (e.g. frequent coffee, dining out, subscriptions) and calculate how much they could have saved. Compare their current situation with a more efficient one.
      If the user asks for advice, give practical suggestions.
      If the user asks to prioritize needs and wants, create a prioritized list.
      Always maintain a supportive and encouraging tone.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti.";
  }
};

export const getGoalPrioritization = async (
  goals: Goal[],
  transactions: Transaction[],
): Promise<string> => {
  if (!ai) {
    return "AI Service is not available. Please configure your API key.";
  }
  try {
    const goalsString = goals.map(g => `- ${g.name} (Target: Rp${g.targetAmount.toLocaleString('id-ID')})`).join('\n');
    const transactionData = formatTransactionsForPrompt(transactions.slice(0, 30)); // Last 30 for context

    const fullPrompt = `
      You are "Keuanganku AI", a friendly and expert personal finance assistant from Indonesia. Your goal is to help users manage their finances wisely. You MUST reply in Bahasa Indonesia.

      Here is the user's list of financial goals or items they want to buy:
      ---
      ${goalsString}
      ---

      Here is the user's recent transaction data for context on their spending habits:
      ---
      ${transactionData}
      ---
      
      Based on the user's goals and their recent spending, please provide a prioritized list of which goals to save for first. 
      
      Your analysis should:
      1. Create a clear, ranked list (e.g., 1. Tujuan A, 2. Tujuan B, etc.).
      2. For each goal, provide a brief justification for its ranking.
      3. Differentiate between needs (e.g., an item for work), wants (e.g., luxury items, vacations), and investments (e.g., education).
      4. Consider the user's spending habits. If they have high spending on non-essentials, you can suggest reallocating that budget to their top-priority goal.
      5. Maintain a supportive and encouraging tone.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for prioritization:", error);
    return "Maaf, terjadi kesalahan saat menghubungi AI untuk saran prioritas. Silakan coba lagi nanti.";
  }
};
