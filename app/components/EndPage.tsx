// app/components/EndPage.tsx
import React, { useEffect, useState } from "react";
import ChatManager from "@/app/services/ChatManager";

interface EndPageProps {
  chatMessages: Array<{ role: string; content: string }>;
  onSummaryGenerated: () => void;
}

const EndPage: React.FC<EndPageProps> = ({ chatMessages, onSummaryGenerated }) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSummary = async () => {
      try {
        const chatContent = chatMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n");
        const response = await ChatManager.generateChatSummary(chatContent);
        setSummary(response);
      } catch (err) {
        setError("Failed to generate summary. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, [chatMessages]);

  return (
    <div className="border-gray-500 bg-gray-200 mx-5 mt-20 max-w-screen-md rounded-md border-2 w-full">
      <div className="flex flex-col space-y-4 p-7">
        <h1 className="text-lg font-semibold text-black">Chat Summary</h1>
        {isLoading && <p className="text-sm text-gray-700">Generating summary...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!isLoading && !error && (
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-gray-700">{summary}</p>
          </div>
        )}
        {!isLoading && !error && (
          <button
            type="button"
            onClick={onSummaryGenerated}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Proceed to Demographics
          </button>
        )}
      </div>
    </div>
  );
};

export default EndPage;