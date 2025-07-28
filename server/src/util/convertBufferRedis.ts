
export async function convertBufferRedis(buffer: Buffer ): Promise<string>{
const base64=buffer.toString('base64');
return base64;
}