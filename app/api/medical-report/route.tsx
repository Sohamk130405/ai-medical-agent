import { db } from "@/config/db";
import { openai } from "@/config/openai-model";
import { sessionChatTable } from "@/config/schema";
import { AIDoctorAgents } from "@/shared/list";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GENERATION_PROMPT = `
You are an Al Medical Voice Agent that just finished a voice conversation with a user. Based on AI Doctor Agent info and Conversation between them , generate a structured report with the following fields:
1. sessionld: a unique session identifier  
2. agent: the medical specialist name (e.g., "General Physician Al")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of Al suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
"sessionld": "string",
"agent": "string".
"user": "string",
"timestamp": "ISO Date string",
"chief Complaint": "string",
"summary": "string",
"symptoms": ["symptom1", "symptom2"],
"duration": "string",
"severity": "string",
"medicationsMentioned": ["med1", "med2"],
"recommendations": ["rec1", "rec2"],
} 
Only include valid fields. Respond with nothing else.
`;

export async function POST(req: NextRequest) {
  const { messages, sessionDetails } = await req.json();

  const userInput = `Ai Doctor Agent Info: ${JSON.stringify(
    sessionDetails
  )} , Conversation Transcript: ${JSON.stringify(messages)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: userInput,
        },
        {
          role: "user",
          content: REPORT_GENERATION_PROMPT,
        },
      ],
    });

    const response =
      completion.choices[0].message.content
        ?.trim()
        .replace("```json", "")
        .replace("```", "") || "";

    const result = JSON.parse(response);

    await db
      .update(sessionChatTable)
      .set({ report: result, conversation: messages })
      .where(eq(sessionChatTable.sessionId, sessionDetails.sessionId));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating medical report:", error);
    return NextResponse.json(error);
  }
}
