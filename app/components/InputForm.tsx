import React, { useState } from 'react';
import clsx from 'clsx';
import Textarea from 'react-textarea-autosize';
import { SendIcon, LoadingCircle, DocumentIcon, XIcon, ImageIcon } from '../icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui';

interface Props {
  input: string;
  setInput: (input: string) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  formRef: React.RefObject<HTMLFormElement>;
  disabled: boolean;
  chatStarted: boolean;
  isSending: boolean;
  isLoading: boolean;
  chatUploadedFiles: File[];
  setChatUploadedFiles: (files: File[]) => void;
  chatFileDetails: { name: string; type: string; size: number }[];
  setChatFileDetails: (details: { name: string; type: string; size: number }[]) => void;
  chatManager: any; 
  setChatStarted: (started: boolean) => void;
  setChatMessages: (messages: any[]) => void; 
  setStatusMessage: (message: string) => void;
  setIsSending: (sending: boolean) => void;
  setProgress: (progress: number) => void;
  setIsLoadingFirstMessage: (loading: boolean) => void;
  onEndChat: () => void;
}

const InputForm: React.FC<Props> = ({
  input,
  setInput,
  inputRef,
  formRef,
  disabled,
  chatStarted,
  isSending,
  isLoading,
  chatUploadedFiles,
  setChatUploadedFiles,
  chatFileDetails,
  setChatFileDetails,
  chatManager,
  setChatStarted,
  setChatMessages,
  setStatusMessage,
  setIsSending,
  setProgress,
  setIsLoadingFirstMessage,
  onEndChat,
}) => {
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;

    const message = input;
    setInput('');
    setIsSending(true);

    if (chatManager) {
      const currentFiles = chatUploadedFiles;
      setChatUploadedFiles([]);
      setChatFileDetails([]);
      try {
        await chatManager.sendMessage(message, currentFiles, chatFileDetails);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Moved state

  const confirmEndChat = () => {
    setIsDialogOpen(false);
    onEndChat();
  };

  const cancelEndChat = () => {
    setIsDialogOpen(false);
  };

  const handleEndChatClick = () => {
    setIsDialogOpen(true);
  };

  const handleChatFilesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (chatFileDetails.length + newFiles.length > 10) {
        alert('You can only upload up to 10 files.');
        return;
      }
      const fileArray = newFiles.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      setChatFileDetails([...chatFileDetails, ...fileArray]);
      setChatUploadedFiles([...chatUploadedFiles, ...newFiles]);
    }
    event.target.value = '';
  };

  const removeChatFile = (fileName: string) => {
    const updatedFileDetails = chatFileDetails.filter((file) => file.name !== fileName);
    setChatFileDetails(updatedFileDetails);

    const updatedUploadedFiles = chatUploadedFiles.filter((file) => file.name !== fileName);
    setChatUploadedFiles(updatedUploadedFiles);
  };

  return (
    <div className="fixed bottom-0 w-full flex flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
      <div className="w-full max-w-screen-md flex flex-col items-stretch">
        {/* Display file "chips" */}
        <div className="flex flex-wrap items-center space-x-2 mb-2">
          {chatFileDetails.map((file) => (
            <div key={file.name} className="flex items-center space-x-1">
              {file.type.startsWith('image') ? (
                <ImageIcon className="h-3 w-3" />
              ) : (
                <DocumentIcon className="h-3 w-3" />
              )}
              <span className="text-xs text-gray-500">{file.name}</span>
              <button
                type="button"
                onClick={() => removeChatFile(file.name)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSending}
              >
                <XIcon className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Flex row: EndChat button + Text input + Send button */}
        <div className="flex items-center space-x-2">
          
          {/* End Chat Button */}
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            End Chat
          </button>

          {/* Confirmation Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm End Chat</DialogTitle>
                <DialogDescription>
                  Are you sure you want to end the chat? Any unsaved information will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button
                  type="button"
                  onClick={confirmEndChat}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Yes, End Chat
                </button>
                <button
                  type="button"
                  onClick={cancelEndChat}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  No, Continue Chat
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <form
            ref={formRef}
            onSubmit={handleFormSubmit}
            className="flex items-center flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-lg space-x-2"
          >
            <Textarea
              ref={inputRef}
              tabIndex={0}
              required
              rows={1}
              autoFocus
              placeholder="Send a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && chatStarted) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}
              spellCheck={false}
              className="w-full h-8 resize-none p-1 focus:outline-none"
              disabled={disabled || !chatStarted}
            />

            <button
              className={clsx(
                'flex h-8 w-8 items-center justify-center rounded-md transition-all',
                disabled || !chatStarted || input.trim().length === 0 || isSending
                  ? 'cursor-not-allowed bg-gray-100'
                  : 'bg-green-500 hover:bg-green-600'
              )}
              disabled={disabled || !chatStarted || isLoading || isSending}
            >
              {isSending ? (
                <LoadingCircle />
              ) : (
                <SendIcon
                  className={clsx(
                    'h-4 w-4',
                    input.length === 0 ? 'text-gray-300' : 'text-white'
                  )}
                />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
