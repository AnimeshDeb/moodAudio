import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react'; // add this at the top with other imports

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState, useEffect, useRef } from 'react';
import { ChevronsUpDownIcon, CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import ScriptDisplay from './scriptDisplay';
import { useClerk } from '@clerk/clerk-react'; // Clerk hook

export default function Home() {
  const { signOut } = useClerk(); // Sign out method

  const [step, setStep] = useState(0);
  const [script, setScript] = useState('');

  // Voice state
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceValue, setVoiceValue] = useState('');

  // Persona state
  const [personaOpen, setPersonaOpen] = useState(false);
  const [themeValue, setThemeValue] = useState('');

  const [musicOpen, setMusicOpen] = useState(false);
  const [musicValue, setMusicValue] = useState('');

  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audienceValue, setAudienceValue] = useState('');

  const [loading, setLoading] = useState(false);

  const scriptRef = useRef<HTMLTextAreaElement>(null);

  type Voice = {
    voice_id: string;
    name: string;
    preview_url?: string;
    [key: string]: unknown;
  };
  type VoiceListResponse = {
    payload: Voice[];
  };
  const [voices, setVoices] = useState<Voice[]>([]);

  useEffect(() => {
    const fetchVoices = async () => {
      const response = await fetch('http://localhost:3000/getVoiceList');
      const data: VoiceListResponse = await response.json();
      setVoices(data.payload);
    };
    fetchVoices();
  }, []);

  const themes = [
    { value: 'Strength', label: 'Strength' },
    { value: 'Perseverence', label: 'Perseverence' },
    { value: 'Courage', label: 'Courage' },
    { value: 'Discipline', label: 'Discipline' },
    { value: 'Growth', label: 'Growth' },
    { value: 'Determination', label: 'Determination' },
    { value: 'Hope', label: 'Hope' },
    { value: 'Overcoming Adversity', label: 'Overcoming Adversity' },
    { value: 'Mindset Shift', label: 'Mindset Shift' },
  ];

  const audiences = [
    { value: 'Students and Graduates', label: 'Students and Graduates' },
    {
      value: 'Athletes and Fitness Enthusiasts',
      label: 'Athletes and Fitness Enthusiasts',
    },
    { value: 'Corporate Professionals', label: 'Corporate Professionals' },
    { value: 'Artists and Creatives', label: 'Artists and Creatives' },
    {
      value: 'People Recovering from Illness or Injury',
      label: 'People Recovering from Illness or Injury',
    },
    { value: 'Job Seekers', label: 'Job Seekers' },
    {
      value: 'Military Personnel and Veterans',
      label: 'Military Personnel and Veterans',
    },
    { value: 'Parents and Caregivers', label: 'Parents and Caregivers' },
    { value: 'Teenagers', label: 'Teenagers' },
    { value: 'Adults', label: 'Adults' },
    {
      value: 'General Self-Improvement Seekers',
      label: 'General Self-Improvement Seekers',
    },
  ];

  const musics = [
    { value: 'epic', label: 'epic' },
    { value: 'uplifting', label: 'uplifting' },
    { value: 'ambient', label: 'ambient' },
    { value: 'emotional', label: 'emotional' },
  ];

  const formSchema = z.object({
    prompt: z
      .string()
      .max(550, { message: 'Prompt must be a max of 550 characaters.' }),
    script: z
      .string()
      .max(1600, { message: 'Script must be of max 1600 char ' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: '', script: '' },
  });

  const watchedScript = form.watch('script');
  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.style.height = 'auto';
      scriptRef.current.style.height = scriptRef.current.scrollHeight + 'px';
    }
  }, [watchedScript]);

  return (
    <div className="bg-[#0A0F1C] w-screen min-h-screen flex justify-center items-center text-[#E2E8F0] p-4 relative">
      <button
        onClick={() => signOut()}
        className="absolute top-4 right-4 px-4 py-2 flex items-center gap-2 rounded-md text-[#0A0F1C] border border-[#2D3748] bg-[#3DDC97] hover:bg-[#33c780] transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>

      {step === 0 ? (
        <div className="w-full max-w-[800px] p-10 rounded-xl bg-[#1A2238] shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Voice Dropdown */}
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-left">Voice:</p>
              <Popover open={voiceOpen} onOpenChange={setVoiceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={voiceOpen}
                    className="w-full justify-between bg-[#0A0F1C] text-white border-gray-600"
                  >
                    {voiceValue
                      ? voices.find((voice) => voice.voice_id === voiceValue)
                          ?.name
                      : 'Select voice...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-[#0A0F1C] text-white border border-gray-700">
                  <Command>
                    <CommandInput placeholder="Search voices..." />
                    <CommandList>
                      <CommandEmpty>No voice found.</CommandEmpty>
                      <CommandGroup>
                        {voices.map((voice) => (
                          <CommandItem
                            key={voice.voice_id}
                            value={voice.voice_id}
                            onSelect={(currentValue) => {
                              setVoiceValue(
                                currentValue === voiceValue ? '' : currentValue
                              );
                              setVoiceOpen(false);
                            }}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <CheckIcon
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  voiceValue === voice.voice_id
                                    ? 'opacity-100'
                                    : 'opacity-0'
                                )}
                              />
                              <span>{voice.name}</span>
                            </div>
                            {voice.preview_url && (
                              <button
                                type="button"
                                className="ml-4 text-xs underline hover:text-blue-400"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const audio = new Audio(voice.preview_url);
                                  audio.play();
                                }}
                              >
                                Play
                              </button>
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Themes Dropdown */}
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-left">Themes:</p>
              <Popover open={personaOpen} onOpenChange={setPersonaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={personaOpen}
                    className="w-full justify-between bg-[#0A0F1C] text-white border-gray-600"
                  >
                    {themeValue
                      ? themes.find((theme) => theme.value === themeValue)
                          ?.label
                      : 'Select podcast theme...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-[#0A0F1C] text-white border border-gray-700">
                  <Command>
                    <CommandInput placeholder="Search personas..." />
                    <CommandList>
                      <CommandEmpty>No theme found.</CommandEmpty>
                      <CommandGroup>
                        {themes.map((theme) => (
                          <CommandItem
                            key={theme.value}
                            value={theme.value}
                            onSelect={(currentValue) => {
                              setThemeValue(
                                currentValue === themeValue ? '' : currentValue
                              );
                              setPersonaOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                themeValue === theme.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {theme.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Music Dropdown */}
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-left">Music:</p>
              <Popover open={musicOpen} onOpenChange={setMusicOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={musicOpen}
                    className="w-full justify-between bg-[#0A0F1C] text-white border-gray-600"
                  >
                    {musicValue
                      ? musics.find((music) => music.value === musicValue)
                          ?.label
                      : 'Select music track...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-[#0A0F1C] text-white border border-gray-700">
                  <Command>
                    <CommandInput placeholder="Search music tracks..." />
                    <CommandList>
                      <CommandEmpty>No music found.</CommandEmpty>
                      <CommandGroup>
                        {musics.map((music) => (
                          <CommandItem
                            key={music.value}
                            value={music.value}
                            onSelect={(currentValue) => {
                              setMusicValue(
                                currentValue === musicValue ? '' : currentValue
                              );
                              setMusicOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                musicValue === music.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {music.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Audience Dropdown */}
            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-left">Audience:</p>
              <Popover open={audienceOpen} onOpenChange={setAudienceOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={audienceOpen}
                    className="w-full justify-between bg-[#0A0F1C] text-white border-gray-600"
                  >
                    {audienceValue
                      ? audiences.find(
                          (audience) => audience.value === audienceValue
                        )?.label
                      : 'Select audience...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-[#0A0F1C] text-white border border-gray-700">
                  <Command>
                    <CommandInput placeholder="Search audiences..." />
                    <CommandList>
                      <CommandEmpty>No audience found.</CommandEmpty>
                      <CommandGroup>
                        {audiences.map((audience) => (
                          <CommandItem
                            key={audience.value}
                            value={audience.value}
                            onSelect={(currentValue) => {
                              setAudienceValue(
                                currentValue === audienceValue
                                  ? ''
                                  : currentValue
                              );
                              setAudienceOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                audienceValue === audience.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {audience.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (data) => {
                try {
                  setLoading(true);
                  const response = await fetch(
                    'http://localhost:3000/generateScript',
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        prompt: data.prompt,
                        audience: audienceValue,
                        theme: themeValue,
                      }),
                    }
                  );
                  const payloadRes = await response.json();
                  setScript(payloadRes.data);
                  setStep(1);
                  // console.log('persona value: ', themeValue);
                  // console.log('music value: ', musicValue);
                  // console.log('voice value: ', voiceValue);
                  // console.log('audience value: ', audienceValue);
                } catch (error) {
                  console.error(error);
                } finally {
                  setLoading(false);
                }
              })}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Prompt
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[150px] resize-none whitespace-pre-wrap rounded-md border border-gray-600 bg-[#0A0F1C] text-white p-4 placeholder:text-gray-400"
                        placeholder="Enter an idea prompt..."
                        maxLength={550}
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-400 text-right">
                      550 characters max
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {loading && (
                <div className="absolute inset-0 bg-black/30 flex items-start justify-center z-10 pt-4">
                  <p className="text-[#6C63FF] text-3xl font-semibold flex items-center leading-none">
                    <span className="animate-pulse ml-1 text-[#6C63FF] text-3xl leading-none">
                      .
                    </span>
                    <span className="animate-pulse ml-1 text-[#3DDC97] text-3xl leading-none [animation-delay:200ms]">
                      .
                    </span>
                    <span className="animate-pulse ml-1 text-[#FF6B81] text-3xl leading-none [animation-delay:400ms]">
                      .
                    </span>
                    <span className="ml-3">Generating Script</span>
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-[#6C63FF] hover:bg-[#5a54e6] transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? '...Generating Script' : 'Generate Script'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <ScriptDisplay
          script={script}
          voiceValue={voiceValue}
          themeValue={themeValue}
          musicValue={musicValue}
          audienceValue={audienceValue}
        />
      )}
    </div>
  );
}
