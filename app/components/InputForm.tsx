import { playVoiceResponse } from '../api/voiceResponse/route';
import { useEffect, useState, useRef } from 'react';
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
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    // Recording state and refs for the MediaRecorder
    const [isRecording, setIsRecording] = useState(false);
    const recordingDeleteRef = useRef<boolean>(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);  

    useEffect(() => {
      if (!chatManager || !isSpeakerOn) return;
      const messages = chatManager?.state?.messages || [];
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'assistant' && lastMessage.content) {
          (async () => {
            setIsSpeaking(true);
            await playVoiceResponse(lastMessage.content);
            setIsSpeaking(false);
          })();
        }
      }
    }, [chatManager?.state?.messages, isSpeakerOn]);

  

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (recordingDeleteRef.current) {
          // Discard recording
          recordedChunksRef.current = [];
          recordingDeleteRef.current = false;
        } else {
          const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          transcribeAudio(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  // Remove the old stopRecording as we now control stopping via approve/delete
  const approveRecording = () => {
    // Approve: stop and transcribe recording.
    recordingDeleteRef.current = false;
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const deleteRecording = () => {
    // Delete: stop recording and discard.
    recordingDeleteRef.current = true;
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Transcription failed");
      }
      const data = await response.json();
      // Set the transcribed text as input so user can edit or send
      setInput(data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
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
        {/* ...other UI elements... */}
        <div className="flex items-center space-x-2 relative">
          {/* End Chat Button */}
          <button
            type="button"
            onClick={() => {/* open dialog to end chat */}}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            End Chat
          </button>

          {/* Message Input Form */}
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

          {/* Speaker Toggle Button with indicator */}
          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-md relative transition-all',
              isSpeakerOn ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500 hover:bg-gray-600',
              'text-white'
            )}
            disabled={disabled || !chatStarted || isSending}
          >
            {isSpeakerOn ? (
              <span role="img" aria-label="Speaker On">🔊</span>
            ) : (
              <span role="img" aria-label="Speaker Off">🔇</span>
            )}
            {/* Show a small spinner or pulsing dot when voice is active */}
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-yellow-400 rounded-full animate-ping"></span>
            )}
          </button>

          {/* Microphone Button */}
          <button
            type="button"
            onClick={isRecording ? undefined : startRecording}
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-md transition-all',
              isRecording ? 'bg-gray-400 cursor-default' : 'bg-blue-500 hover:bg-blue-600',
              'text-white'
            )}
            disabled={disabled || !chatStarted || isSending}
          >
            {isRecording ? (
              <span className="text-white text-xs">Recording</span>
            ) : (
              <span className="text-white text-xs">Mic</span>
            )}
          </button>

          {/* Recording Options Overlay */}
          {isRecording && (
            <div className="absolute bottom-12 right-0 flex flex-col items-end bg-white p-3 rounded-lg shadow-lg border border-gray-200">
              <p className="mb-2 text-sm font-medium text-red-500">Recording...</p>
              <div className="flex space-x-2">
                <button
                  onClick={deleteRecording}
                  className="px-3 py-1 text-sm text-white bg-gray-500 rounded hover:bg-gray-600"
                >
                  Delete
                </button>
                <button
                  onClick={approveRecording}
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Approve
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;