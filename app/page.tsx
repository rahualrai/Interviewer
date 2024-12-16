// app/page.tsx

"use client";

import React, { useState } from 'react'; // Import useState
import { LinkBar, MessageList, ConsentForm, InputForm, DemographicsForm, EndPage } from './components';
import { useChatState, useChatManager, useStartAssistant } from './hooks';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui';

export default function Chat() {
  const {
    assistantName, setAssistantName,
    assistantModel, setAssistantModel,
    assistantDescription, setAssistantDescription,
    inputmessage, setInputmessage,
    chatMessages, setChatMessages,
    isButtonDisabled, setIsButtonDisabled,
    files = [], setFiles,
    isStartLoading, setStartLoading,
    statusMessage, setStatusMessage,
    isSending, setIsSending,
    inputRef,
    formRef,
    initialThreadMessage, 
    setInitialThreadMessage,
    setChatStarted,
    chatStarted: chatHasStarted,
    chatManager, setChatManager,
    assistantId,
    isMessageLoading, setIsMessageLoading,
    progress, setProgress, 
    isLoadingFirstMessage,
    setIsLoadingFirstMessage,
    chatUploadedFiles = [], setChatUploadedFiles,
    chatFileDetails, setChatFileDetails,
    fileIds, setFileIds,
  } = useChatState();

  // Define the consentAccepted state
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useChatManager(setChatMessages, setStatusMessage, setChatManager, setIsMessageLoading, setProgress, setIsLoadingFirstMessage);
  useStartAssistant(assistantId, chatManager, initialThreadMessage);

  const handleEndChat = () => {
    setChatCompleted(true);
  };
  
  const handleSummaryGenerated = () => {
    setSummaryGenerated(true);
  };

  const handleDemographicsSubmit = (data: { age: number; phoneNumber: string }) => {
    console.log("Demographics Submitted:", data);
  };

  const startChatAssistant = async () => {
    setIsButtonDisabled(true);
    setStartLoading(true);
    if (chatManager) {
      try {
        console.log('Starting assistant with the following parameters:');
        console.log('Assistant Name:', assistantName);
        console.log('Assistant Model:', assistantModel);
        console.log('Assistant Description:', assistantDescription);
        console.log('File IDs:', fileIds);
        console.log('Initial Thread Message:', initialThreadMessage);
  
        await chatManager.startAssistant({ assistantName, assistantModel, assistantDescription }, fileIds, initialThreadMessage);
        
        console.log('Assistant started:', chatManager.getChatState());
        setChatStarted(true);
      } catch (error) {
        console.error('Error starting assistant:', error);
        if (error instanceof Error) setStatusMessage(`Error: ${error.message}`);
      } finally {
        setIsButtonDisabled(false);
        setStartLoading(false);
      }
    }
  };

  return (
    <main className="flex flex-col items-center justify-between pb-40 bg-space-grey-light">
      {!consentAccepted && (
        <ConsentForm onConsentAccepted={() => setConsentAccepted(true)} />
      )}
      
      {consentAccepted && !chatCompleted && (
        <>

        <LinkBar onEndChat={handleEndChat} />
        
        <MessageList 
          chatMessages={chatMessages} 
          statusMessage={statusMessage} 
          isSending={isSending} 
          progress={progress} 
          isFirstMessage={isLoadingFirstMessage} 
          fileDetails={chatFileDetails} 
        />

        <InputForm
          input={inputmessage}
          setInput={setInputmessage}
          inputRef={inputRef}
          formRef={formRef}
          disabled={isButtonDisabled || !chatManager}
          chatStarted={chatMessages.length > 0}
          isSending={isSending}
          isLoading={isMessageLoading}
          chatUploadedFiles={chatUploadedFiles}
          setChatUploadedFiles={setChatUploadedFiles}
          chatFileDetails={chatFileDetails}
          setChatFileDetails={setChatFileDetails}
          chatManager={chatManager}
          setChatStarted={setChatStarted}
          setChatMessages={setChatMessages}
          setStatusMessage={setStatusMessage}
          setIsSending={setIsSending}
          setProgress={setProgress}
          setIsLoadingFirstMessage={setIsLoadingFirstMessage}
        />

      </>
      )}
      
      {chatCompleted && !summaryGenerated && (
        <EndPage 
          chatMessages={chatMessages} 
          onSummaryGenerated={handleSummaryGenerated} 
        />
      )}

      {summaryGenerated && (
        <DemographicsForm onSubmit={handleDemographicsSubmit} />
      )}

    </main>
  );
}
