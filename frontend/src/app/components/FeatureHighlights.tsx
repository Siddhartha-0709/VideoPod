import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2, Sparkles, Clapperboard } from 'lucide-react'

export default function FeatureHighlights() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Powered by AI</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wand2 className="mr-2 h-5 w-5 text-blue-400" />
              Whisper AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Generate accurate transcripts from your videos using state-of-the-art speech recognition.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-purple-400" />
              Gemini API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Analyze transcripts to identify key moments and important topics within your videos.</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clapperboard className="mr-2 h-5 w-5 text-green-400" />
              FFmpeg
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Extract and process video clips with high performance using the powerful FFmpeg library.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

