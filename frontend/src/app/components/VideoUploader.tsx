import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from 'lucide-react'

export default function VideoUploader() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Video</h2>
      <div className="flex items-center">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="video">Video file</Label>
          <Input id="video" type="file" accept="video/*" className="file:mx-6 file:mt-1 file:border-0 file:bg-transparent file:text-sm file:font-medium cursor-pointer"/>
        </div>
        <Button className="mt-5 ml-2 bg-white text-black hover:bg-slate-200 ">
          <Upload className="mr-1 h-5 w-5 " /> Upload
        </Button>
      </div>
    </div>
  )
}

