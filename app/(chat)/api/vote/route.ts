import { auth } from "@/app/(auth)/auth";
import { getVotesByChatId, voteMessage } from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("chatId is required", { status: 400 });
  }

  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const votes = await getVotesByChatId({ id: chatId });

  return Response.json(votes, { status: 200 });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    chatId,
    messageId,
    type,
  }: { chatId: string; messageId: string; type: "up" | "down" } =
    await request.json();

  if (!chatId || !messageId || !type) {
    return Response.json(
      { error: "messageId and type are required" },
      { status: 400 }
    );
  }

  try {
    await voteMessage({
      chatId,
      messageId,
      userId: session.user.id,
      type: type,
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("API Vote Error:", error);
    return Response.json({ error: "Failed to record vote." }, { status: 500 });
  }
}
