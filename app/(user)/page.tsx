import { redirect } from 'next/navigation'

// The feed lives at /feed. Middleware sends authenticated users there directly,
// but this redirect is a safety net in case someone reaches this route group page.
export default function UserIndexPage() {
  redirect('/feed')
}
