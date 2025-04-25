"use client"

import { useState } from "react"
import { KeetloSmartEditor } from "@/components/keetlo-smart-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [content, setContent] = useState("<p>Welcome to the enhanced Keetlo Text Editor!</p>")

  return (
    <main className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Keetlo Smart Text Editor</CardTitle>
          <CardDescription>A beautiful and user-friendly TipTap editor with improved UI/UX</CardDescription>
        </CardHeader>
        <CardContent>
          <KeetloSmartEditor
           defaultValue={content} 
           onChange={setContent} 
           placeholder="Start writing something amazing..." c
           lassName={undefined} 
            uploadUrl="/api/upload"
           />
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2">Editor Output:</h3>
            <div className="p-4 border rounded-md bg-muted/50">
              <pre className="text-sm whitespace-pre-wrap overflow-auto">{content}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
