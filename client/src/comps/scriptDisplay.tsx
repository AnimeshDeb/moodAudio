// ScriptDisplay.tsx
import { Textarea } from "@/components/ui/textarea";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
type scriptDisplayProps={
    script:string;
    voiceValue: string;
    personaValue: string;
    musicValue: string;
    audienceValue: string;

}

export default function ScriptDisplay({ script, voiceValue, personaValue, musicValue, audienceValue}: scriptDisplayProps) {
  const formSchema=z.object({
    writtenScript: z.string().max(800,{
      message:'Script must be of max 800 characters.'
    }),
  });
  const form=useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver (formSchema),
    defaultValues:{
      writtenScript:script,
    },
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async(data)=>{
        const response=await fetch('http://localhost:3000/generateVideo',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify({script: data.writtenScript,voiceValue, personaValue, musicValue, audienceValue })
        })
        const resData=await response.json()
        console.log(resData)

      })} className="bg-[#1A2238] p-8 rounded-xl text-white shadow-lg space-y-6 w-full max-w-[800px]">
        <h2 className="text-2xl font-bold">Generated Script</h2>

        <FormField
          control={form.control}
          name="writtenScript"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Script</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            // onClick={onBack}
            className="px-4 py-2 rounded-md bg-[#0A0F1C] border border-gray-600 hover:bg-gray-800 transition"
          >
            Generate Video
          </button>
        </div>
      </form>
    </Form>
  );
}
