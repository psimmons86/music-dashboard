import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Music, Smile, X } from "lucide-react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function PostForm({ onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [currentSong, setCurrentSong] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      content: postContent,
      currentSong: currentSong
    });
    setPostContent('');
    setCurrentSong('');
    setIsOpen(false);
  };

  const addEmoji = (emoji) => {
    setPostContent(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="w-full mb-6">
      <Button 
        onClick={() => setIsOpen(true)} 
        className="w-full bg-[#d4e7aa] text-gray-800 hover:bg-[#c3d69b]"
        variant="ghost"
      >
        Share something...
      </Button>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <Card className="mt-4 p-4">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[120px] resize-none"
                />
                
                <div className="absolute right-2 bottom-2 flex gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setCurrentSong('')}
                  >
                    <Music className="h-5 w-5" />
                  </Button>
                </div>

                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-12 z-50">
                    <div className="relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute -right-2 -top-2 z-10"
                        onClick={() => setShowEmojiPicker(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Picker 
                        data={data} 
                        onEmojiSelect={addEmoji}
                        theme="light"
                        previewPosition="none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-4">
                {currentSong && (
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                    <Music className="h-4 w-4" />
                    <span className="text-sm">{currentSong}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="ml-auto"
                      onClick={() => setCurrentSong('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add the song you're listening to..."
                    value={currentSong}
                    onChange={(e) => setCurrentSong(e.target.value)}
                    className="flex-1"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#98e4d3] text-gray-800 hover:bg-[#7fcebe]"
                    disabled={!postContent.trim()}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}