'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'

async function ensureAuthor(email: string, name?: string | null) {
  return prisma.user.upsert({
    where: { email },
    update: { name: name || undefined },
    create: { email, name: name || undefined },
  })
}

export async function createPost(formData: FormData) {
  const title = formData.get('title')?.toString().trim()
  const content = formData.get('content')?.toString().trim() || null
  const email = formData.get('email')?.toString().trim()
  const name = formData.get('name')?.toString().trim() || null

  if (!title || !email) {
    throw new Error('Title and author email are required')
  }

  const author = await ensureAuthor(email, name)

  await prisma.post.create({
    data: {
      title,
      content,
      authorId: author.id,
    },
  })

  revalidatePath('/')
}

export async function updatePost(formData: FormData) {
  const id = Number(formData.get('id'))
  const title = formData.get('title')?.toString().trim()
  const content = formData.get('content')?.toString().trim() || null

  if (!id || !title) {
    throw new Error('Post id and title are required')
  }

  await prisma.post.update({
    where: { id },
    data: { title, content },
  })

  revalidatePath('/')
}

export async function togglePublish(formData: FormData) {
  const id = Number(formData.get('id'))
  const nextPublished = formData.get('nextPublished') === 'true'

  if (!id) {
    throw new Error('Post id is required')
  }

  await prisma.post.update({
    where: { id },
    data: { published: nextPublished },
  })

  revalidatePath('/')
}

export async function deletePost(formData: FormData) {
  const id = Number(formData.get('id'))

  if (!id) {
    throw new Error('Post id is required')
  }

  await prisma.post.delete({ where: { id } })

  revalidatePath('/')
}

