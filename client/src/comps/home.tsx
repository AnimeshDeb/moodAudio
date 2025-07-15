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

export default function Home() {
  const [step, setStep] = useState(0);
  const [script, setScript] = useState('');

  // Voice state
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [voiceValue, setVoiceValue] = useState('');

  // Persona state
  const [personaOpen, setPersonaOpen] = useState(false);
  const [personaValue, setPersonaValue] = useState('');

  const [musicOpen, setMusicOpen] = useState(false);
  const [musicValue, setMusicValue] = useState('');

  const [audienceOpen, setAudienceOpen] = useState(false);
  const [audienceValue, setAudienceValue] = useState('');

  const scriptRef = useRef<HTMLTextAreaElement>(null); //using it to dynamically resize textarea according to text
  // const voices = [
  //   {
  //     value: 'Voice1',
  //     label: 'label_voice1',
  //   },
  //   {
  //     value: 'Voice2',
  //     label: 'label_voice2',
  //   },
  //   {
  //     value: 'Voice3',
  //     label: 'label_voice3',
  //   },
  // ];

  //get all voices
  type Voice = {
    voice_id: string;
    name: string;
    preview_url?: string;
    [key: string]: unknown;
  };
  type VoiceListResponse = {
    payload: Voice[]; //multiple objects of type Voice
  };
  const [voices, setVoices] = useState<Voice[]>([]); //voices will contain different voices objects

  useEffect(() => {
    const fetchVoices = async () => {
      const response = await fetch('http://localhost:3000/getVoiceList');
      const data: VoiceListResponse = await response.json();
      console.log("Fetched voices: ", data)
      setVoices(data.payload);
    };
    fetchVoices();
  }, []);

  const personas = [
    {
      value: 'Dwayne Johnsen',
      label: 'label_dwayneJ',
    },
    {
      value: 'Chris Harris',
      label: 'label_chrisH',
    },
  ];

  const audiences = [
    {
      value: 'teenagers',
      label: 'label_teenagers',
    },
    {
      value: 'gym people',
      label: 'label_gympeople',
    },
  ];

  const musics = [
    {
      value: 'track1',
      label: 'label_track1',
    },
    {
      value: 'track2',
      label: 'label_track2',
    },
  ];

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
    <div className="bg-[#0A0F1C] w-screen min-h-screen flex justify-center items-center text-[#E2E8F0] p-4">
      {step === 0 ? (
        <div className="w-full max-w-[800px] p-10 rounded-xl bg-[#1A2238] shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                  e.stopPropagation(); // Prevent item select
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

            <div className="space-y-2 text-left">
              <p className="text-sm font-semibold text-left">Persona:</p>
              <Popover open={personaOpen} onOpenChange={setPersonaOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={personaOpen}
                    className="w-full justify-between bg-[#0A0F1C] text-white border-gray-600"
                  >
                    {personaValue
                      ? personas.find(
                          (persona) => persona.value === personaValue
                        )?.label
                      : 'Select persona...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-[#0A0F1C] text-white border border-gray-700">
                  <Command>
                    <CommandInput placeholder="Search personas..." />
                    <CommandList>
                      <CommandEmpty>No persona found.</CommandEmpty>
                      <CommandGroup>
                        {personas.map((persona) => (
                          <CommandItem
                            key={persona.value}
                            value={persona.value}
                            onSelect={(currentValue) => {
                              setPersonaValue(
                                currentValue === personaValue
                                  ? ''
                                  : currentValue
                              );
                              setPersonaOpen(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                personaValue === persona.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {persona.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

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
                  const response = await fetch(
                    'http://localhost:3000/generateScript',
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ prompt: data.prompt }),
                    }
                  );
                  const payloadRes = await response.json();
                  setScript(payloadRes.data); // Store script
                  setStep(1); // Switch to script component
                } catch (error) {
                  console.error(error);
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

              {/* {step === 1 && (
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
                          className="resize-none whitespace-pre-wrap overflow-hidden border border-gray-600 bg-[#0A0F1C] text-white p-4"
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )} */}

              <div className="flex justify-end">
                <Button type="submit" className="px-6 py-2 rounded-md">
                  {step === 0 && <div>Generate Script</div>}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <ScriptDisplay script={script} onBack={() => setStep(0)} />
      )}
    </div>
  );
}
