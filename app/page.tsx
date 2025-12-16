import prisma from "@/lib/prisma";
import {
  createPost,
  deletePost,
  togglePublish,
  updatePost,
} from "./actions/posts";

export const metadata = {
  title: "Shoe Store Admin",
  description: "Manage catalog items with Prisma + Next.js",
};

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { id: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Shoe Store</p>
            <h1 className="text-3xl font-bold text-slate-900">
              Catalog & content manager
            </h1>
            <p className="text-sm text-slate-600">
              Uses Prisma + Postgres, server actions, and API routes for CRUD.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Posts mirror products; toggle publish to feature them.
          </div>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Create a new item
          </h2>
          <form
            action={createPost}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Title *
              <input
                name="title"
                required
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                placeholder="Air Runner X"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Author email *
              <input
                name="email"
                type="email"
                required
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                placeholder="manager@shoestore.com"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700 sm:col-span-2">
              Description
              <textarea
                name="content"
                rows={3}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                placeholder="Lightweight trainer with responsive cushioning..."
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Author name
              <input
                name="name"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                placeholder="Catalog owner"
              />
            </label>
            <div className="flex items-end justify-end sm:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Save item
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Catalog</h2>
            <p className="text-xs text-slate-500">
              {posts.length} record{posts.length === 1 ? "" : "s"}
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
              No items yet. Create your first pair above.
            </p>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${
                            post.published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {post.published ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-slate-500">
                          #{post.id}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {post.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {post.content || "No description yet."}
                      </p>
                      <p className="text-xs text-slate-500">
                        Author:{" "}
                        {post.author
                          ? `${post.author.name || "Unnamed"} · ${post.author.email}`
                          : "Unknown"}
                      </p>
                    </div>

                    <form action={togglePublish} className="flex items-start">
                      <input type="hidden" name="id" value={post.id} />
                      <input
                        type="hidden"
                        name="nextPublished"
                        value={(!post.published).toString()}
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 lg:flex-row">
                    <form
                      action={updatePost}
                      className="flex flex-1 flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3"
                    >
                      <input type="hidden" name="id" value={post.id} />
                      <div className="grid gap-2 lg:grid-cols-2">
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                          Title
                          <input
                            name="title"
                            defaultValue={post.title}
                            required
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-medium text-slate-700 lg:col-span-2">
                          Description
                          <textarea
                            name="content"
                            defaultValue={post.content || ""}
                            rows={2}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-200 focus:ring"
                          />
                        </label>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>

                    <form action={deletePost} className="self-start">
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
