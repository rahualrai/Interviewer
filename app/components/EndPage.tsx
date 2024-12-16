import React, { useEffect, useRef, useState } from 'react';
import ChatManager from '../services/ChatManager'; // Ensure the correct path to ChatManager

interface EndPageProps {
  chatMessages: { role: string; content: string }[];
  onSummaryGenerated: () => void;
}

const EndPage: React.FC<EndPageProps> = ({ chatMessages, onSummaryGenerated }) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasGeneratedSummary = useRef<boolean>(false); // Ref to prevent multiple summaries

  useEffect(() => {
    const generateSummary = async () => {
      try {
        console.log('Starting the chat summary generation API call');
        
        const chatContent = chatMessages
          .map(msg => `${msg.role}: ${msg.content}`)
          .join("\n");

        // Call the ChatManager to generate the summary
        const response = await ChatManager.generateChatSummary(chatContent);
        console.log('Received response from ChatManager.generateChatSummary');
        
        setSummary(response);
      } catch (err) {
        console.error('Error generating summary:', err);
        setError("Failed to generate summary. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Check if summary has already been generated to prevent duplicate calls
    if (chatMessages.length > 0 && !hasGeneratedSummary.current) {
      generateSummary();
      hasGeneratedSummary.current = true; // Set the flag to true after generating summary
    }
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