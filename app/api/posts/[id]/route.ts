import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function toId(value: string | string[]) {
  const num = Number(Array.isArray(value) ? value[0] : value)
  return Number.isFinite(num) ? num : null
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const id = toId(params.id)
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  })

  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json(post)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = toId(params.id)
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

  const body = (await request.json().catch(() => null)) as
    | { title?: string; content?: string | null; published?: boolean }
    | null

  if (!body) return NextResponse.json({ error: 'invalid payload' }, { status: 400 })

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: body.title?.trim(),
      content: body.content?.trim() ?? undefined,
      published: body.published ?? undefined,
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const id = toId(params.id)
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 })

  await prisma.post.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}

