import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from("posts")
    .select("content, pen_name")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!data) return { title: "Not found" };

  const title = data.content.split("\n")[0].slice(0, 60) || "Zen World Entry";
  const description = data.content.replace(/[#*_`>\-\[\]()]/g, " ").slice(0, 150);

  return {
    title,
    description,
    alternates: { canonical: `/world/${params.slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function WorldPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from("posts")
    .select("id, content, pen_name, created_at")
    .eq("slug", params.slug)
    .eq("is_public", true)
    .single();

  if (!post) notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select("id, body, created_at")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  return (
    <main className="min-h-screen bg-[#F9F9F8] text-[#1A1A1A]">
      <div className="fixed left-0 top-0 h-1 w-full bg-black/10">
        <div className="h-full w-1/3 bg-black" />
      </div>

      <article className="mx-auto max-w-[65ch] px-6 py-16">
        <header className="mb-8">
          <p className="font-inter text-sm opacity-70">{post.pen_name || "Anonymous"}</p>
          <time className="font-playfair text-xl">
            {new Date(post.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        </header>

        <div className="prose prose-neutral max-w-none font-inter">
          {post.content}
        </div>

        <section className="mt-14 border-t border-black/10 pt-8">
          <h2 className="font-playfair text-2xl">Comments</h2>
          <div className="mt-4 space-y-4 font-inter">
            {comments?.map((c) => (
              <div key={c.id} className="rounded-lg border border-black/10 p-3">
                <p>{c.body}</p>
              </div>
            ))}
            {!comments?.length && <p className="opacity-70">No comments yet.</p>}
          </div>
        </section>
      </article>
    </main>
  );
}
