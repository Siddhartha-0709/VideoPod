import { Progress } from "@/components/ui/progress"

export default function ProcessingStatus() {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Processing Status</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Generating transcript</span>
          <span>100%</span>
        </div>
        <Progress value={100} className="w-full " />
        <div className="flex justify-between">
          <span>Analyzing content</span>
          <span>65%</span>
        </div>
        <Progress value={65} className="w-full " />
        <div className="flex justify-between">
          <span>Extracting clips</span>
          <span>30%</span>
        </div>
        <Progress value={30} className="w-full " />
      </div>
    </div>
  )
}

