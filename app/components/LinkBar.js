// app/components/LinkBar.js

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui';

const LinkBar = ({ onEndChat }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEndChat = () => {
    setIsDialogOpen(true);
  };

  const confirmEndChat = () => {
    setIsDialogOpen(false);
    onEndChat();
  };

  const cancelEndChat = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="absolute top-5 hidden w-full justify-between px-5 sm:flex">
      <button
        type="button"
        onClick={handleEndChat}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        End Chat
      </button>

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
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
    </div>
  );
};

export default LinkBar;