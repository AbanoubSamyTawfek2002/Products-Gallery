"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Heart, Lock } from "lucide-react"
import Link from "next/link"

interface LoginPromptProps {
  action: "cart" | "favorites"
  onClose?: () => void
}

export function LoginPrompt({ action, onClose }: LoginPromptProps) {
  const actionText = action === "cart" ? "السلة" : "المفضلة"
  const actionIcon = action === "cart" ? <ShoppingCart className="h-8 w-8" /> : <Heart className="h-8 w-8" />

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>يجب تسجيل الدخول</CardTitle>
          <CardDescription>يجب تسجيل الدخول أولاً لإضافة المنتجات إلى {actionText}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            {actionIcon}
            <span>إضافة إلى {actionText}</span>
          </div>
          <div className="flex gap-2">
            <Link href="/login" className="flex-1">
              <Button className="w-full">تسجيل الدخول</Button>
            </Link>
            {onClose && (
              <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                إلغاء
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
