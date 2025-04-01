import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImageIcon, DocumentIcon } from "../icons";

const Message = React.forwardRef(
  ({ message, progress, isFirstMessage }, ref) => {
    const isAssistant = message.role === "assistant";
    const isUser = message.role === "user";

    return (
      <div
        ref={ref}
        className={clsx(
          "flex w-full items-start space-x-4 px-5 sm:px-0 py-4",
          isUser ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar */}
        {isAssistant && (
          <div className="flex-shrink-0 mt-1 p-1.5 bg-green-500 text-white rounded-full overflow-hidden aspect-square">
            <Bot width={20} height={20} />
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={clsx(
            "relative flex flex-col space-y-0 max-w-[75%] rounded-lg px-3 py-2",
            "bg-gray-100 text-black"
          )}
        >
          {/* Bubble Arrow */}
          {isAssistant && (
            <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-gray-100"></div>
          )}
          {isUser && (
            <div className="absolute -right-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-100"></div>
          )}

          {/* Message Content */}
          {message.isLoading ? (
            <>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    "h-full bg-green-500",
                    isFirstMessage ? "animate-spin-slow" : ""
                  )}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-xs text-green-500">{message.statusMessage}</div>
            </>
          ) : (
            <ReactMarkdown
              className="prose break-words prose-p:leading-relaxed m-0"
              remarkPlugins={[remarkGfm]}
              components={{
                a: (props) => (
                  <a {...props} target="_blank" rel="noopener noreferrer" />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}

          {/* File Attachments */}
          {message.fileDetails && (
            <div className="grid grid-cols-4 gap-2 mt-2">
              {message.fileDetails.map((file) => (
                <div key={file.name} className="flex items-center space-x-1">
                  {file.type.startsWith("image") ? (
                    <ImageIcon className="h-3 w-3" />
                  ) : (
                    <DocumentIcon className="h-3 w-3" />
                  )}
                  <span className="text-xs text-gray-500 truncate w-28 block">
                    {file.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Avatar */}
        {isUser && (
          <div className="flex-shrink-0 mt-1 p-1.5 bg-black text-white rounded-full overflow-hidden aspect-square">
            <User width={20} height={20} />
          </div>
        )}
      </div>
    );
  }
);

Message.displayName = "Message";

const MessageList = ({
  chatMessages,
  statusMessage,
  isSending,
  progress,
  isFirstMessage,
}) => {
  const latestMessageRef = useRef(null);

  useEffect(() => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [chatMessages]);

  // Clone the chatMessages array to avoid mutating the original state
  const messages = [...chatMessages];

  if (isFirstMessage && !messages.some((m) => m.isLoading)) {
    messages.unshift({
      role: "assistant",
      isLoading: true,
      statusMessage: "Thinking...",
      content: "",
    });
  }

  const loadingMessageIndex = messages.findIndex(
    (m) => m.role === "assistant" && m.isLoading
  );

  if (isSending) {
    if (loadingMessageIndex !== -1) {
      messages[loadingMessageIndex].statusMessage = statusMessage;
    } else {
      messages.push({
        role: "assistant",
        isLoading: true,
        statusMessage,
      });
    }
  } else if (loadingMessageIndex !== -1) {
    messages.splice(loadingMessageIndex, 1);
  }

  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg, i) => (
        <Message
          key={i}
          ref={i === messages.length - 1 ? latestMessageRef : null}
          message={msg}
          progress={progress}
          isFirstMessage={isFirstMessage && i === 0}
        />
      ))}
    </div>
  );
};

export default MessageList;