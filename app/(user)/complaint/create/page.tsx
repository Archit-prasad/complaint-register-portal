import { CreateComplaintForm } from '@/components/complaint/create-complaint-form'

export default function CreateComplaintPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Report an Issue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Describe the civic issue and we'll make sure it reaches the right authority.
        </p>
      </div>
      <CreateComplaintForm />
    </div>
  )
}
