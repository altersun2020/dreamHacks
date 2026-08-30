"use client";

import { useState } from "react";
import { HandHelping, Ship, Users, X } from "lucide-react";
import { useFeed } from "@/contexts/FeedContext";
import type { FeedScope, PostAction, PostTag } from "@/lib/types";
import { POST_TAGS, cn, getTagStyles } from "@/lib/utils";

const ACTIONS: { id: PostAction; icon: typeof HandHelping }[] = [
  { id: "I Can Help", icon: HandHelping },
  { id: "Claim Allocation", icon: Users },
  { id: "Hop on Boat", icon: Ship },
];

/** A sensible default response for each tag, still overridable below. */
const DEFAULT_ACTION: Record<PostTag, PostAction> = {
  ResourceOffer: "I Can Help",
  RideShare: "Hop on Boat",
  HazardAlert: "I Can Help",
  LocalMarket: "I Can Help",
  FairShare: "Claim Allocation",
};

const IMAGES: { src: string; label: string }[] = [
  { src: "", label: "No photo" },
  { src: "/posts/diesel.png", label: "Fuel on the dock" },
  { src: "/posts/salmon.png", label: "Fresh catch" },
  { src: "/posts/supplies.png", label: "Supply crates" },
  { src: "/posts/boat.png", label: "Boat at the jetty" },
  { src: "/posts/hazard.png", label: "Storm damage" },
];

export function PostComposer({
  scope,
  onClose,
}: {
  scope: FeedScope;
  onClose: () => void;
}) {
  const { addPost } = useFeed();
  const [tag, setTag] = useState<PostTag>("ResourceOffer");
  const [action, setAction] = useState<PostAction>("I Can Help");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [postScope, setPostScope] = useState<FeedScope>(scope);
  const [saving, setSaving] = useState(false);

  const canPost = title.trim().length > 0 && body.trim().length > 0;

  function pickTag(next: PostTag) {
    setTag(next);
    setAction(DEFAULT_ACTION[next]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPost || saving) return;
    setSaving(true);
    await addPost({
      title: title.trim(),
      body: body.trim(),
      tag,
      action,
      scope: postScope,
      image: image || undefined,
    });
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share with your isle"
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
        className="animate-sheet-up relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border-t border-shell-200 bg-white p-5 pb-8 shadow-2xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-shell-300" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-lagoon-900">
            Share with your isle
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-shell-500 hover:bg-shell-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-shell-500">
            Tag
          </legend>
          <div className="flex flex-wrap gap-2">
            {POST_TAGS.map((t) => {
              const styles = getTagStyles(t);
              const active = tag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => pickTag(t)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    active
                      ? cn(styles.bg, styles.text, styles.border, "ring-2 ring-offset-1 ring-shell-300")
                      : "border-shell-200 text-shell-600 hover:bg-shell-50",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", styles.dot)} />
                  {styles.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-shell-500">
            Title
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={70}
            placeholder="Extra diesel — 20L available"
            className="w-full rounded-xl border border-shell-300 bg-white px-3 py-2.5 text-sm text-lagoon-800 placeholder:text-shell-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-shell-500">
            Details
          </span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={400}
            placeholder="Where it is, when, and who it is for."
            className="w-full resize-none rounded-xl border border-shell-300 bg-white px-3 py-2.5 text-sm text-lagoon-800 placeholder:text-shell-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
          />
        </label>

        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-shell-500">
            Photo
          </legend>
          <div className="flex flex-wrap gap-2">
            {IMAGES.map(({ src, label }) => (
              <button
                key={src || "none"}
                type="button"
                onClick={() => setImage(src)}
                aria-pressed={image === src}
                aria-label={label}
                title={label}
                className={cn(
                  "relative h-14 w-20 overflow-hidden rounded-xl border-2 transition-all",
                  image === src
                    ? "border-sky-500"
                    : "border-slate-200 hover:border-slate-300",
                )}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element -- local static asset
                  <img src={src} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-slate-50 text-[10px] font-semibold text-slate-500">
                    None
                  </span>
                )}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-shell-500">
            Response button
          </legend>
          <div className="flex gap-2">
            {ACTIONS.map(({ id, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setAction(id)}
                aria-pressed={action === id}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-[11px] font-semibold transition-colors",
                  action === id
                    ? "border-teal-300 bg-teal-50 text-teal-700"
                    : "border-shell-200 text-shell-600 hover:bg-shell-50",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {id}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-shell-500">
            Post to
          </legend>
          <div className="flex rounded-xl border border-shell-200 bg-shell-50 p-1">
            {(
              [
                { id: "my-isle", label: "My Isle" },
                { id: "archipelago", label: "Archipelago" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setPostScope(id)}
                aria-pressed={postScope === id}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
                  postScope === id
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-shell-600",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!canPost || saving}
          className="w-full rounded-2xl bg-teal-500 py-3 text-sm font-bold text-white shadow-sm shadow-teal-500/30 transition-colors hover:bg-teal-600 disabled:bg-shell-300 disabled:shadow-none"
        >
          {saving ? "Posting…" : "Post to the stream"}
        </button>
      </form>
    </div>
  );
}
