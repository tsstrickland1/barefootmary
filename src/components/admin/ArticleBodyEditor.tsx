"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";

interface ArticleBodyEditorProps {
  initialContent?: Record<string, unknown> | null;
  name?: string;
}

export function ArticleBodyEditor({
  initialContent,
  name = "body_json",
}: ArticleBodyEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
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

  return (
    <div className="flex flex-col gap-2">
      <div className="border border-border bg-[rgba(232,223,200,0.04)] focus-within:border-[rgba(196,154,60,0.4)] transition-colors">
        {editor && (
          <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-border">
            {[
              {
                label: "B",
                action: () => editor.chain().focus().toggleBold().run(),
                active: editor.isActive("bold"),
                title: "Bold",
              },
              {
                label: "I",
                action: () => editor.chain().focus().toggleItalic().run(),
                active: editor.isActive("italic"),
                title: "Italic",
              },
              {
                label: "H2",
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run(),
                active: editor.isActive("heading", { level: 2 }),
                title: "Heading 2",
              },
              {
                label: "H3",
                action: () =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run(),
                active: editor.isActive("heading", { level: 3 }),
                title: "Heading 3",
              },
              {
                label: "UL",
                action: () =>
                  editor.chain().focus().toggleBulletList().run(),
                active: editor.isActive("bulletList"),
                title: "Bullet List",
              },
              {
                label: "OL",
                action: () =>
                  editor.chain().focus().toggleOrderedList().run(),
                active: editor.isActive("orderedList"),
                title: "Ordered List",
              },
              {
                label: '❝',
                action: () =>
                  editor.chain().focus().toggleBlockquote().run(),
                active: editor.isActive("blockquote"),
                title: "Blockquote",
              },
              {
                label: "—",
                action: () =>
                  editor.chain().focus().setHorizontalRule().run(),
                active: false,
                title: "Horizontal Rule",
              },
            ].map((btn) => (
              <button
                key={btn.label}
                type="button"
                title={btn.title}
                onClick={btn.action}
                className={`px-2.5 py-1 font-label text-[0.65rem] tracking-[0.1em] uppercase transition-colors ${
                  btn.active
                    ? "bg-amber text-bg-deep"
                    : "text-cream-dim hover:text-cream"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
        <EditorContent
          editor={editor}
          className="prose prose-invert prose-sm max-w-none px-4 py-3 min-h-[200px] text-cream font-body focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]"
        />
      </div>
      <input ref={inputRef} type="hidden" name={name} />
    </div>
  );
}
