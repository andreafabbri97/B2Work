import GigDetailClient from './GigDetailClient'

export const dynamicParams = false

export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function GigDetailPage() {
  return <GigDetailClient />
}
