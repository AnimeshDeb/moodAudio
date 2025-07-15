export async function fetchAllVoices(apiKey: string): Promise<any[]> {
  const allVoices: any[] = [];
  let nextPageToken: string | null = null;


    type VoiceObject={
      voice_id: string;
      name: string;
      preview_url?:string;
      [key:string]:unknown;
    }


    //Because the api response will give us other fields besides voices{} we say that the response will 
    //give us a field known as voices of type voiceObject which we defined before and also other fields which
    //we don't care about.

    type DataResponse={
      voices:VoiceObject[];
      next_page_token?: string | null;
      [key:string]:unknown;
    }

  do {
    const url = new URL('https://api.elevenlabs.io/v2/voices');
    url.searchParams.append('page_size', '100'); // max per page
    if (nextPageToken) {
      url.searchParams.append('next_page_token', nextPageToken);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as DataResponse;
    allVoices.push(...data.voices);

    nextPageToken = data.next_page_token ?? null;
  } while (nextPageToken);

  return allVoices;
}
