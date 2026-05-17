'use client'

import { useActionState, useState } from 'react'
import { createComplaint } from '@/actions/complaints'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, ImagePlus, X } from 'lucide-react'

export function CreateComplaintForm() {
  const [state, action, pending] = useActionState(createComplaint, undefined)
  const [preview, setPreview] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) { setPreview(null); return }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <form action={action} className="space-y-6">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title">Issue title <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Broken streetlight on Main Road"
          className="h-11"
          required
        />
        {state?.errors?.title && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />{state.errors.title[0]}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the issue in detail — what it is, how long it has been there, and any impact it has…"
          rows={5}
          className="resize-none"
          required
        />
        {state?.errors?.description && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />{state.errors.description[0]}
          </p>
        )}
      </div>

      {/* Location */}
      <div className="space-y-1.5">
        <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
        <Input
          id="location"
          name="location"
          placeholder="e.g. Main Road, near City Park, Ward 5"
          className="h-11"
          required
        />
        {state?.errors?.location && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />{state.errors.location[0]}
          </p>
        )}
      </div>

      {/* Image upload */}
      <div className="space-y-1.5">
        <Label htmlFor="image">Photo (optional)</Label>
        {preview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreview(null) }}
              className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center gap-3 w-full aspect-video rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-colors"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImagePlus className="h-10 w-10" />
              <span className="text-sm font-medium">Click to upload a photo</span>
              <span className="text-xs">JPEG, PNG, WebP, GIF · max 5 MB</span>
            </div>
          </label>
        )}
        <input
          id="image"
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleImageChange}
        />
        {state?.errors?.image && (
          <p className="flex items-center gap-1 text-sm text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />{state.errors.image[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
      >
        {pending ? 'Submitting complaint…' : 'Submit Complaint'}
      </Button>
    </form>
  )
}
