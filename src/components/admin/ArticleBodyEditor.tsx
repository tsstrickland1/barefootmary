"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { editorExtensions } from "@/lib/tiptap/extensions";
import { uploadArticleBodyImage } from "@/app/admin/_actions/articles";

interface ArticleBodyEditorProps {
  initialContent?: Record<string, unknown> | null;
  name?: string;
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`px-2.5 py-1 font-label text-[0.75rem] tracking-[0.1em] uppercase transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        active
          ? "bg-amber text-bg-deep"
          : "text-cream-dim hover:text-cream"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px bg-border mx-1 self-stretch" />;
}

export function ArticleBodyEditor({
  initialContent,
  name = "body_json",
}: ArticleBodyEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent ?? "",
    onUpdate({ editor }) {
      if (inputRef.current) {
        inputRef.current.value = JSON.stringify(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (inputRef.current && editor) {
      inputRef.current.value = JSON.stringify(editor.getJSON());
    }
  }, [editor]);

  function openLinkDialog() {
    const existing = editor?.getAttributes("link").href ?? "";
    setLinkUrl(existing);
    setLinkDialogOpen(true);
  }

  function applyLink() {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url) {
      editor.chain().focus().setLink({ href: url, target: "_blank" }).run();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
  }

  function removeLink() {
    editor?.chain().focus().unsetLink().run();
    setLinkDialogOpen(false);
    setLinkUrl("");
  }

  async function handleImageFile(file: File) {
    const fd = new FormData();
    fd.append("image", file);
    const result = await uploadArticleBodyImage(fd);
    if ("url" in result) {
      editor?.chain().focus().setImage({ src: result.url, alt: file.name }).run();
    } else {
      toast.error(result.error);
    }
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-border bg-[rgba(232,223,200,0.04)] focus-within:border-[rgba(196,154,60,0.4)] transition-colors">
        {editor && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border">
              {/* Headings */}
              <ToolbarButton
                title="Heading 2"
                active={editor.isActive("heading", { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              >
                H2
              </ToolbarButton>
              <ToolbarButton
                title="Heading 3"
                active={editor.isActive("heading", { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              >
                H3
              </ToolbarButton>

              <Divider />

              {/* Inline marks */}
              <ToolbarButton
                title="Bold"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <strong>B</strong>
              </ToolbarButton>
              <ToolbarButton
                title="Italic"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton
                title="Underline"
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <span className="underline">U</span>
              </ToolbarButton>
              <ToolbarButton
                title="Strikethrough"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <span className="line-through">S</span>
              </ToolbarButton>

              <Divider />

              {/* Block elements */}
              <ToolbarButton
                title="Blockquote"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                ❝
              </ToolbarButton>
              <ToolbarButton
                title="Inline Code"
                active={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >
                &lt;/&gt;
              </ToolbarButton>
              <ToolbarButton
                title="Horizontal Rule"
                active={false}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                —
              </ToolbarButton>

              <Divider />

              {/* Lists */}
              <ToolbarButton
                title="Bullet List"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                • —
              </ToolbarButton>
              <ToolbarButton
                title="Ordered List"
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                1.
              </ToolbarButton>

              <Divider />

              {/* Insert */}
              <ToolbarButton
                title="Insert Link"
                active={editor.isActive("link") || linkDialogOpen}
                onClick={openLinkDialog}
              >
                Link
              </ToolbarButton>
              <ToolbarButton
                title="Insert Image"
                active={false}
                onClick={() => imageInputRef.current?.click()}
              >
                Image
              </ToolbarButton>

              <Divider />

              {/* History */}
              <ToolbarButton
                title="Undo"
                disabled={!editor.can().undo()}
                onClick={() => editor.chain().focus().undo().run()}
              >
                ↩
              </ToolbarButton>
              <ToolbarButton
                title="Redo"
                disabled={!editor.can().redo()}
                onClick={() => editor.chain().focus().redo().run()}
              >
                ↪
              </ToolbarButton>
            </div>

            {/* Link dialog */}
            {linkDialogOpen && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-bg-raised">
                <input
                  autoFocus
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink();
                    }
                    if (e.key === "Escape") setLinkDialogOpen(false);
                  }}
                  placeholder="https://..."
                  className="form-input flex-1 text-sm py-1"
                />
                <button
                  type="button"
                  onClick={applyLink}
                  className="px-3 py-1 bg-amber text-bg-deep font-label text-[0.7rem] tracking-[0.1em] uppercase"
                >
                  Apply
                </button>
                {editor.isActive("link") && (
                  <button
                    type="button"
                    onClick={removeLink}
                    className="px-3 py-1 border border-border text-cream-dim font-label text-[0.7rem] tracking-[0.1em] uppercase hover:text-cream transition-colors"
                  >
                    Remove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setLinkDialogOpen(false)}
                  className="px-2 py-1 text-cream-dim hover:text-cream transition-colors font-label text-[0.75rem]"
                >
                  ✕
                </button>
              </div>
            )}
          </>
        )}

        <EditorContent
          editor={editor}
          className="tiptap-content px-4 py-3"
        />
      </div>

      <input ref={inputRef} type="hidden" name={name} />

      {/* Hidden file input for image upload */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
        }}
      />
    </div>
  );
}
