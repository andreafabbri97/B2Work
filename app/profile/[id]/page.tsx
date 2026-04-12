import ProfileClient from './ProfileClient'

export const dynamicParams = false

export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default function PublicProfilePage() {
  return <ProfileClient />
}
