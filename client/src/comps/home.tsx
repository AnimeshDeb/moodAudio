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
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(0);
  const formSchema = z.object({
    prompt: z.string().max(550, {
      message: 'Prompt must be a max of 550 characaters.',
    }),
    script: z.string().max(5, {
      message: 'Voice must be of max 5 char ',
    }),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      script: '',
    },
  });

  return (
    <div className="bg-[#0A0F1C] w-screen min-w-[400px] min-h-screen flex justify-center items-center text-[#E2E8F0]">
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
              form.setValue('script', payloadRes.data)
              setStep(step + 1);

              console.log('Home data: ', data.prompt, " && ", payloadRes.data);
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
                  <Input placeholder="Enter an idea." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {step == 1 && (
            <FormField
              control={form.control}
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Script</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
