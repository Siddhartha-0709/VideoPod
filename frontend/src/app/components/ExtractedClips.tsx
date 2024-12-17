import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from 'lucide-react'

export default function ExtractedClips() {
  const clips = [
    { id: 1, title: "Key Moment 1", duration: "0:30" },
    { id: 2, title: "Key Moment 2", duration: "1:00" },
    { id: 3, title: "Key Moment 3", duration: "0:45" },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Extracted Clips</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clips.map((clip) => (
          <Card key={clip.id} className="bg-gray-950 border-2 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">{clip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-700 rounded-md mb-2"></div>
              <p className="text-white">Duration: {clip.duration}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

