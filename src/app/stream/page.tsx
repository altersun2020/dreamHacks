"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { FeedToggle } from "@/components/FeedToggle";
import { PostCard } from "@/components/PostCard";
import { TideLogs } from "@/components/TideLogs";
import { useOnlineStatus } from "@/components/OfflineProvider";
import { posts, tideLogs, HOME_ISLAND } from "@/lib/mock-data";
import type { FeedScope } from "@/lib/types";

export default function StreamPage() {
  const [scope, setScope] = useState<FeedScope>("my-isle");
  const isOnline = useOnlineStatus();

  const filtered = posts.filter((p) => p.scope === scope);

  return (
    <>
      <Header
        title="Island Stream"
        subtitle={`${HOME_ISLAND} · Tide Logs & community updates`}
        isOnline={isOnline}
      />
      <main className="mx-auto max-w-lg flex-1 space-y-5 px-4 py-4 pb-24">
        <TideLogs logs={tideLogs} />
        <FeedToggle scope={scope} onChange={setScope} />
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
