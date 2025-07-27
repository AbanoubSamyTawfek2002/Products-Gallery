export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
        <h2 className="text-xl font-semibold">جاري التحميل...</h2>
        <p className="text-muted-foreground">يرجى الانتظار بينما نقوم بتحميل البيانات</p>
      </div>
    </div>
  )
}
