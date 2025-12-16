import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { id: 'desc' },
  })

  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { title?: string; content?: string | null; email?: string; name?: string | null }
    | null

  if (!body?.title || !body?.email) {
    return NextResponse.json({ error: 'title and email are required' }, { status: 400 })
  }

  const author = await prisma.user.upsert({
    where: { email: body.email },
    update: { name: body.name || undefined },
    create: { email: body.email, name: body.name || undefined },
  })

  const post = await prisma.post.create({
    data: {
      title: body.title.trim(),
      content: body.content?.trim() || null,
      authorId: author.id,
    },
  })

  return NextResponse.json(post, { status: 201 })
}

