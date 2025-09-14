// ScriptDisplay.tsx
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { useState } from 'react';

type ScriptDisplayProps = {
  script: string;
  voiceValue: string;
  themeValue: string;
  musicValue: string;
  audienceValue: string;
};

export default function ScriptDisplay({
  script,
  voiceValue,
  themeValue,
  musicValue,
  audienceValue,
}: ScriptDisplayProps) {
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formSchema = z.object({
    writtenScript: z.string().max(800, {
      message: 'Script must be of max 800 characters.',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      writtenScript: script,
    },
  });

  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          setLoading(true);
          setError('');
          try {
            const response = await fetch(
              'http://localhost:3000/generateVideo',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  script: data.writtenScript,
                  voiceValue,
                  themeValue,
                  musicValue,
                  audienceValue,
                  userEmail,
                }),
              }
            );

            if (!response.ok) {
              throw new Error('Failed to generate audio');
            }

            // Read response as ArrayBuffer
            const arrayBuffer = await response.arrayBuffer();
            const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
            const oldAudioUrl = audioUrl;
            const newAudioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(newAudioUrl);

            if (oldAudioUrl) {
              URL.revokeObjectURL(oldAudioUrl);
            }
          } catch (err) {
            console.error(err);
            setError(
              'Unable to create podcast due to high traffic. Please try again later.'
            );
          } finally {
            setLoading(false);
          }
        })}
        className="bg-[#1A2238] p-8 rounded-xl text-white shadow-lg space-y-6 w-full max-w-[800px]"
      >
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

        <div className="flex flex-col items-end">
          {!audioUrl ? (
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-md bg-[#6C63FF] hover:bg-[#5a54e6] transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? '...Generating Podcast Audio'
                : 'Generate Podcast Audio'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-md bg-[#6C63FF] hover:bg-[#5a54e6] transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              New Script
            </button>
          )}
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {loading && (
          <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-4">
            <p className="text-[#6C63FF] text-3xl font-semibold">
              ...Generating Podcast Audio
            </p>
          </div>
        )}
        {audioUrl && !loading && (
          <div className="flex items-center gap-x-4 mt-6">
            {/* Audio player */}
            <audio controls src={audioUrl} className="flex-1" />

            {/* Download link */}
            <a
              href={audioUrl}
              download="output.mp3"
              className="px-4 py-2 rounded-md bg-[#FF6B81] hover:bg-[#e55b70] transition text-white font-semibold"
            >
              Download Audio
            </a>
          </div>
        )}
      </form>
    </Form>
  );
}
