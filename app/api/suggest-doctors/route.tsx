import { openai } from "@/config/openai-model";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "system",
          content: JSON.stringify({ AIDoctorAgents }),
        },
        {
          role: "user",
          content:
            "User Notes/Symptoms: " +
            notes +
            ". Depends on user notes and symptons, Please suggest a list of doctors, Return object in json only",
        },
      ],
    });

    const result =
      completion.choices[0].message.content
        ?.replace("```json", "")
        .replace("```", "") || "";

    const response = JSON.parse(result);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(error);
  }
}
