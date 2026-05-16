'use client'

import { useState, useEffect } from 'react'
import type { User } from '@/types'

export function useCurrentUser() {
  const [user, setUser] = useState<Omit<User, 'createdAt'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
