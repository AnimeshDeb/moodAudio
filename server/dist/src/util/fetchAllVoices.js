export async function fetchAllVoices(apiKey) {
    const allVoices = [];
    let nextPageToken = null;
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
        const data = await response.json();
        allVoices.push(...data.voices);
        nextPageToken = data.next_page_token ?? null;
    } while (nextPageToken);
    return allVoices;
}
