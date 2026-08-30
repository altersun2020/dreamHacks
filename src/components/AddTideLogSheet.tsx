"use client";

import { useState } from "react";
import { Camera, Timer, Video, Type as TypeIcon, X } from "lucide-react";
import { useFeed } from "@/contexts/FeedContext";
import type { TideLog } from "@/lib/types";
import { cn } from "@/lib/utils";

const PREVIEWS = ["🐟", "🌊", "⚠️", "🚢", "🛒", "⛵", "🏖️", "🌦️", "🦀", "🪸", "🔥", "🧰"];

const MEDIA: { id: TideLog["mediaType"]; label: string; icon: typeof Camera }[] =
  [
    { id: "photo", label: "Photo", icon: Camera },
    { id: "video", label: "Video", icon: Video },
    { id: "text", label: "Text", icon: TypeIcon },
  ];

export function AddTideLogSheet({ onClose }: { onClose: () => void }) {
  const { addTideLog } = useFeed();
  const [preview, setPreview] = useState(PREVIEWS[0]);
  const [mediaType, setMediaType] = useState<TideLog["mediaType"]>("photo");
  const [label, setLabel] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);

  const canPost = label.trim().length > 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPost || saving) return;
    setSaving(true);
    await addTideLog({
      label: label.trim(),
      caption: caption.trim(),
      preview,
      mediaType,
    });
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Post a Tide Log"
      className="fixed inset-0 z-[65] flex items-end justify-center"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-lagoon-900/40 backdrop-blur-sm"
      />

      <form
        onSubmit={submit}
        className="animate-sheet-up relative w-full max-w-lg rounded-t-3xl border-t border-shell-200 bg-white p-5 pb-8 shadow-2xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-shell-300" />

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-lagoon-900">
              Post a Tide Log
            </h2>
            <p className="flex items-center gap-1 text-xs text-shell-500">
              <Timer className="h-3 w-3" />
              Disappears after 24 hours
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-shell-500 hover:bg-shell-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {MEDIA.map(({ id, label: mediaLabel, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMediaType(id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-colors",
                mediaType === id
                  ? "border-teal-300 bg-teal-50 text-teal-700"
                  : "border-shell-200 text-shell-600 hover:bg-shell-50",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {mediaLabel}
            </button>
          ))}
        </div>

        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-shell-500">
            Cover
          </legend>
          <div className="flex flex-wrap gap-2">
            {PREVIEWS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setPreview(emoji)}
                aria-pressed={preview === emoji}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition-all",
                  preview === emoji
                    ? "border-teal-400 bg-teal-50 scale-105"
                    : "border-shell-200 hover:bg-shell-50",
                )}
              >
                {emoji}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-shell-500">
            Label
          </span>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            maxLength={24}
            placeholder="Morning catch"
            className="w-full rounded-xl border border-shell-300 bg-white px-3 py-2.5 text-sm text-lagoon-800 placeholder:text-shell-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="mb-5 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-shell-500">
            Caption
          </span>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            maxLength={160}
            placeholder="Forty kilos landed at Dock 2 — first come from 07:00."
            className="w-full resize-none rounded-xl border border-shell-300 bg-white px-3 py-2.5 text-sm text-lagoon-800 placeholder:text-shell-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <button
          type="submit"
          disabled={!canPost || saving}
          className="w-full rounded-2xl bg-teal-500 py-3 text-sm font-bold text-white shadow-sm shadow-teal-500/30 transition-colors hover:bg-teal-600 disabled:bg-shell-300 disabled:shadow-none"
        >
          {saving ? "Posting…" : "Post to Tide Logs"}
        </button>
      </form>
    </div>
  );
}
