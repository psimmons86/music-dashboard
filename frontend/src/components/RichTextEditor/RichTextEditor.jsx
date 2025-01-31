import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react';

function MenuBar({ editor }) {
  if (!editor) return null;

  const setImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
      const file = event.target.files[0];

      try {
        const imageUrl = await uploadImage(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Failed to insert image:', error);
        alert('Failed to upload image. Please try again.');
      }
    };

    input.click();
  };

  const setLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  function MenuButton({ onClick, isActive, disabled, icon: Icon, title }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          p-2 rounded transition-colors
          ${isActive ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        title={title}
      >
        <Icon size={18} />
      </button>
    );
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        title="Bold"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        title="Italic"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={Strikethrough}
        title="Strike"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={Heading1}
        title="Heading 1"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={Heading2}
        title="Heading 2"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        title="Bullet List"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        title="Ordered List"
      />
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={Quote}
        title="Quote"
      />
      <MenuButton
        onClick={setLink}
        isActive={editor.isActive('link')}
        icon={LinkIcon}
        title="Add Link"
      />
      <label className="p-2 rounded hover:bg-gray-100 cursor-pointer flex items-center">
        <ImageIcon size={18} />
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const formData = new FormData();
              formData.append('image', file);
              try {
                const response = await fetch('/api/blog/upload-image', {
                  method: 'POST',
                  body: formData,
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                  },
                });
                if (!response.ok) {
                  throw new Error('Failed to upload image');
                }
                const data = await response.json();
                if (!data.url) {
                  throw new Error('Invalid response from server');
                }
                const imageUrl = data.url.startsWith('http')
                  ? data.url
                  : `${window.location.origin}${data.url}`;
                editor.chain().focus().setImage({ src: imageUrl }).run();
              } catch (error) {
                console.error('Failed to upload image:', error);
                alert('Failed to upload image. Please try again.');
              }
            }
          }}
        />
      </label>
      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        icon={Undo}
        title="Undo"
      />
      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        icon={Redo}
        title="Redo"
      />
    </div>
  );
}

function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'blog-image',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your blog post content here...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-lg overflow-hidden bg-white/80">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}

export default RichTextEditor;