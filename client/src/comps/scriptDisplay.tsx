// ScriptDisplay.tsx

type scriptDisplayProps={
    script:string;
    onBack:()=>void;
}
export default function ScriptDisplay({ script, onBack }: scriptDisplayProps) {
  return (
    <div className="bg-[#1A2238] p-8 rounded-xl text-white shadow-lg space-y-6 w-full max-w-[800px]">
      <h2 className="text-2xl font-bold">Generated Script</h2>
      <div className="whitespace-pre-wrap border border-gray-600 p-4 bg-[#0A0F1C] rounded-md">
        {script}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-md bg-[#0A0F1C] border border-gray-600 hover:bg-gray-800 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
