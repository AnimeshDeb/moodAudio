import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect, useRef } from 'react';
import { mergeRefs } from '@/utils/util';

export default function Home() {
  const [step, setStep] = useState(0);
  const scriptRef = useRef<HTMLTextAreaElement>(null);//using it to dynamically resize textarea according to text

  const formSchema = z.object({
    prompt: z.string().max(550, {
      message: 'Prompt must be a max of 550 characaters.',
    }),
    script: z.string().max(800, {
      message: 'Voice must be of max 800 char ',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      script: '',
    },
  });

  const watchedScript = form.watch('script');
  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.style.height = 'auto';
      scriptRef.current.style.height = scriptRef.current.scrollHeight + 'px';
    }
  }, [watchedScript]);

  return (
    <div className="bg-[#0A0F1C] w-screen min-w-[400px] min-h-screen flex justify-center items-center text-[#E2E8F0]">
      <div className="w-[50%] ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              try {
                const response = await fetch(
                  'http://localhost:3000/generateScript',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: data.prompt }),
                  }
                );
                const payloadRes = await response.json();
                form.setValue('script', payloadRes.data);
                setStep(step + 1);

                console.log(
                  'Home data: ',
                  data.prompt,
                  ' && ',
                  payloadRes.data
                );
              } catch (error) {
                console.error(error);
              }
            })}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-[200px] resize-none whitespace-pre-wrap"
                      placeholder="Enter an idea."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {step == 1 && (
              <FormField
                control={form.control}
                name="script"
                render={({ field }) => {
                  const { ref, ...rest } = field; 
                  return (
                    <FormItem>
                      <FormLabel>Script</FormLabel>
                      <FormControl>
                        <Textarea
                          ref={mergeRefs(ref, scriptRef)} 
                          className="resize-none whitespace-pre-wrap overflow-hidden"
                          {...rest} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            <Button type="submit">
              {step==0 && <div>Generate Script</div>}
              {step==1 && <div>Generate Audio</div>}
              {step==2 && <div> Generate Visuals</div>}
              
              </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
