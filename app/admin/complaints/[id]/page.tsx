export default async function AdminComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-primary">Complaint #{id}</h1>
      <p className="text-muted-foreground">Admin resolution workflow — Step 5</p>
    </div>
  )
}
