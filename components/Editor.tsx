"use client";

import { useMemo, useState } from "react";

type EditorProps = {
  onSubmit: (payload: {
    content: string;
    media_url: string | null;
    is_public: boolean;
    pen_name: string;
    slug: string;
  }) => Promise<void>;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
}

export default function Editor({ onSubmit }: EditorProps) {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [penName, setPenName] = useState("Wandering Mind");
  const [saving, setSaving] = useState(false);

  const slug = useMemo(() => slugify(content.split("\n").find(Boolean) || "my-journal-entry"), [content]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        content,
        media_url: mediaUrl || null,
        is_public: isPublic,
        pen_name: penName,
        slug,
      });
      setContent("");
      setMediaUrl("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-[65ch] space-y-4 rounded-2xl border border-black/10 bg-[#F9F9F8] p-6 text-[#1A1A1A]"
    >
      <h2 className="font-playfair text-3xl">New Journal Entry</h2>

      <label className="block space-y-2 font-inter">
        <span className="text-sm">Pen name</span>
        <input
          value={penName}
          onChange={(e) => setPenName(e.target.value)}
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2"
          maxLength={50}
        />
      </label>

      <label className="block space-y-2 font-inter">
        <span className="text-sm">Markdown content</span>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2"
          placeholder="Write freely..."
          required
        />
      </label>

      <label className="block space-y-2 font-inter">
        <span className="text-sm">Media URL (Cloudinary optimized URL recommended)</span>
        <input
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2"
          placeholder="https://res.cloudinary.com/..."
        />
      </label>

      <div className="flex items-center justify-between rounded-xl border border-black/10 p-4 font-inter">
        <div>
          <p className="font-medium">Privacy Toggle</p>
          <p className="text-sm opacity-70">{isPublic ? "World = indexed and public" : "Private = only for me"}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsPublic((v) => !v)}
          className={`rounded-full px-4 py-2 text-sm ${isPublic ? "bg-black text-white" : "bg-white border border-black/20"}`}
        >
          {isPublic ? "World" : "Private"}
        </button>
      </div>

      <p className="font-inter text-xs opacity-70">Public URL preview: /world/{slug || "my-journal-entry"}</p>

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-black px-4 py-2 font-inter text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Publish"}
      </button>
    </form>
  );
}
