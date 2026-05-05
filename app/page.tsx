import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Post = {
  id: string;
  content: string;
  media_url: string | null;
  is_public: boolean;
  pen_name: string | null;
  created_at: string;
  slug: string | null;
};

function excerpt(markdown: string, max = 220) {
  const stripped = markdown.replace(/[#*_`>\-\[\]()]/g, "").replace(/\s+/g, " ").trim();
  return stripped.length <= max ? stripped : `${stripped.slice(0, max)}...`;
}

function isVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(url);
}

export default async function TimelinePage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, content, media_url, is_public, pen_name, created_at, slug")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] px-6 py-16">
        <div className="mx-auto max-w-[65ch] font-inter">
          <p>Failed to load timeline.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A] px-6 py-12">
      <section className="mx-auto max-w-[65ch] space-y-12">
        {(posts as Post[]).map((post) => {
          const date = new Date(post.created_at);
          return (
            <article key={post.id} className="border-b border-black/10 pb-10">
              <div className="md:sticky md:top-4">
                <time className="font-playfair text-2xl tracking-wide">
                  {date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>

              <div className="mt-4 space-y-4 font-inter leading-8">
                <p className="text-sm opacity-70">{post.pen_name || "Anonymous"}</p>
                <p>{excerpt(post.content)}</p>

                {post.media_url && (
                  <div className="overflow-hidden rounded-xl border border-black/10 bg-white/70">
                    {isVideo(post.media_url) ? (
                      <video
                        className="aspect-video w-full"
                        controls
                        preload="metadata"
                        src={post.media_url}
                      />
                    ) : (
                      <Image
                        src={post.media_url}
                        alt="Journal media"
                        width={1280}
                        height={720}
                        quality={75}
                        className="h-auto w-full object-cover"
                      />
                    )}
                  </div>
                )}

                {post.is_public && post.slug && (
                  <Link
                    href={`/world/${post.slug}`}
                    className="inline-block text-sm underline underline-offset-4"
                  >
                    Reader mode
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
