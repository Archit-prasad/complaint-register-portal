export function VideoBackground() {
  return (
    <video
      src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      style={{ backgroundColor: '#0a0a0a' }}
    />
  )
}
