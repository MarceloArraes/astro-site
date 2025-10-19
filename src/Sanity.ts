// import type { Slug } from "sanity"

export type Slug = { _type: string, current: string }

export type BlogPost = {
  _id: string
  _type: 'blogPost'
  _createdAt: string
  _updatedAt: string
  _rev: string
  title?: string
  slug?: Slug
  author?: string
  publishedAt?: string
  mdxContent?: string
}