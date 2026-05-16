export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary">Complaint #{id}</h1>
      <p className="text-muted-foreground">Complaint detail view — Step 4</p>
    </div>
  )
}
