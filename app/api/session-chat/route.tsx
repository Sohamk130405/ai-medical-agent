import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { notes, selectedDoctor } = await req.json();

  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(sessionChatTable)
      // @ts-ignore
      .values({
        createdBy: user.primaryEmailAddress?.emailAddress,
        sessionId,
        selectedDoctor,
        notes,
        createdOn: new Date().toISOString(),
      })
      // @ts-ignore
      .returning({ sessionChatTable });

    return NextResponse.json(result[0]?.sessionChatTable);
  } catch (error) {
    console.error("Error creating session chat:", error);
    return NextResponse.json(error);
  }
}

export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const result = await db
    .select()
    .from(sessionChatTable)
    .where(
      // @ts-ignore
      eq(sessionChatTable.createdBy, user.primaryEmailAddress?.emailAddress)
    )
    // @ts-ignore
    .where(eq(sessionChatTable.sessionId, sessionId));

  return NextResponse.json(result[0]);
}
