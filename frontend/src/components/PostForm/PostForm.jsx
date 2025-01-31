import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Music, Smile, X, Loader2 } from 'lucide-react';

export default function PostForm({ onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [currentSong, setCurrentSong] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      setIsSubmitting(true);
      setError('');
      
      await onSubmit({
        content: postContent,
        currentSong: currentSong.trim()
      });
      
      setPostContent('');
      setCurrentSong('');
      setIsOpen(false);
    } catch (err) {
      setError(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mb-6">
      {!isOpen ? (
        <Button 
          onClick={() => setIsOpen(true)} 
          className="w-full bg-white/60 text-gray-800 hover:bg-white/80"
          variant="ghost"
        >
          Share something...
        </Button>
      ) : (
        <Card className="p-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="min-h-[120px] resize-none"
                  disabled={isSubmitting}
                />
              </div>

              {currentSong && (
                <div className="flex items-center gap-2 bg-emerald-50 p-2 rounded-lg">
                  <Music className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-800">{currentSong}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="ml-auto h-6 w-6"
                    onClick={() => setCurrentSong('')}
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <Input
                type="text"
                placeholder="What are you listening to?"
                value={currentSong}
                onChange={(e) => setCurrentSong(e.target.value)}
                className="flex-1"
                disabled={isSubmitting}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={!postContent.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}