'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addComment } from '@/actions/complaints'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle } from 'lucide-react'

export function AddCommentForm({ complaintId }: { complaintId: string }) {
  const [state, action, pending] = useActionState(addComment, undefined)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (state?.success && textareaRef.current) {
      textareaRef.current.value = ''
    }
  }, [state?.success])

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="complaintId" value={complaintId} />
      <Textarea
        ref={textareaRef}
        name="content"
        placeholder="Write a comment…"
        rows={3}
        className="resize-none"
        required
      />
      {state?.errors?.content && (
        <p className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {state.errors.content[0]}
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={pending}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {pending ? 'Posting…' : 'Post comment'}
        </Button>
      </div>
    </form>
  )
}
