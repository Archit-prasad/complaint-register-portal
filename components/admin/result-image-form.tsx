'use client'

import { useActionState, useState } from 'react'
import { uploadResultImage } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, ImagePlus, X } from 'lucide-react'

export function ResultImageForm({
  complaintId,
  existingUrl,
}: {
  complaintId: string
  existingUrl: string | null
}) {
  const [state, action, pending] = useActionState(uploadResultImage, undefined)
  const [preview, setPreview] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) { setPreview(null); return }
    const reader = new FileReader()
    reader.onload = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="complaintId" value={complaintId} />

      <p className="text-sm font-medium text-foreground">Upload Result Photo</p>

      {existingUrl && !preview && (
        <div className="rounded-lg overflow-hidden border aspect-video bg-muted mb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={existingUrl} alt="Current result" className="h-full w-full object-cover" />
        </div>
      )}

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="resultImage"
          className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:bg-muted/50 hover:border-primary/40 transition-colors"
        >
          <ImagePlus className="h-7 w-7 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            {existingUrl ? 'Replace result photo' : 'Click to upload result photo'}
          </span>
        </label>
      )}

      <input
        id="resultImage"
        name="resultImage"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
      />

      {state?.errors?.resultImage && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {state.errors.resultImage[0]}
        </p>
      )}

      <Button type="submit" disabled={pending || !preview} variant="outline" className="w-full">
        {pending ? 'Uploading…' : existingUrl ? 'Replace Result Photo' : 'Upload Result Photo'}
      </Button>

      {state?.success && (
        <p className="flex items-center gap-1.5 text-sm text-secondary">
          <CheckCircle2 className="h-4 w-4" />
          Result photo uploaded successfully.
        </p>
      )}
    </form>
  )
}
