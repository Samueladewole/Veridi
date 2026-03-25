import { LiveFeed } from "@/components/live-feed";

export default function LiveFeedPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-[20px] font-extrabold tracking-[-0.02em] text-text1">
          Live Feed
        </h1>
        <p className="mt-1 font-mono text-[11px] text-text2">
          Real-time API call monitoring across all clients. View verification requests,
          response times, and error rates as they happen.
        </p>
      </div>
      <LiveFeed />
    </div>
  );
}
