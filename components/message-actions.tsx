import type { Message } from "ai";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { useCopyToClipboard } from "usehooks-ts";

import type { Vote } from "@/lib/db/schema";
import { getMessageIdFromAnnotations } from "@/lib/utils";

import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from "./icons";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { memo } from "react";
import equal from "fast-deep-equal";

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: string;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const { mutate } = useSWRConfig();
  const [_, copyToClipboard] = useCopyToClipboard();

  if (
    isLoading ||
    message.role === "user" ||
    (message.toolInvocations && message.toolInvocations.length > 0)
  ) {
    return null;
  }

  const handleVote = async (type: "up" | "down") => {
    const messageId = getMessageIdFromAnnotations(message);
    if (!messageId) {
      toast.error("Could not find message ID to vote.");
      return;
    }

    const votePromise = fetch("/api/vote", {
      method: "PATCH",
      body: JSON.stringify({ chatId, messageId, type }),
    });

    toast.promise(votePromise, {
      loading: "Saving feedback...",
      success: () => {
        mutate<Array<Vote>>(
          `/api/vote?chatId=${chatId}`,
          (currentVotes = []) => {
            const existingVoteIndex = currentVotes.findIndex(
              (v) => v.messageId === messageId
            );
            const isTogglingOff =
              existingVoteIndex > -1 &&
              currentVotes[existingVoteIndex].isUpvoted === (type === "up");

            if (isTogglingOff) {
              return currentVotes.filter((v) => v.messageId !== messageId);
            } else {
              const newVote: Vote = {
                chatId,
                messageId,
                isUpvoted: type === "up",
                userId: "",
              };
              if (existingVoteIndex > -1) {
                const updatedVotes = [...currentVotes];
                updatedVotes[existingVoteIndex] = newVote;
                return updatedVotes;
              } else {
                return [...currentVotes, newVote];
              }
            }
          },
          { revalidate: false }
        );
        return "Feedback saved!";
      },
      error: "Failed to save feedback.",
    });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={`py-1 px-2 h-fit text-muted-foreground ${
                vote?.isUpvoted ? "bg-muted text-primary" : ""
              }`}
              variant="outline"
              onClick={() => handleVote("up")}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote Response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className={`py-1 px-2 h-fit text-muted-foreground ${
                vote && !vote.isUpvoted ? "bg-muted text-primary" : ""
              }`}
              variant="outline"
              onClick={() => handleVote("down")}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote Response</TooltipContent>
        </Tooltip> */}
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(
  PureMessageActions,
  (prevProps, nextProps) => {
    if (!equal(prevProps.vote, nextProps.vote)) return false;
    if (prevProps.isLoading !== nextProps.isLoading) return false;

    return true;
  }
);
