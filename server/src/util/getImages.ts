import dotenv from 'dotenv'
dotenv.config()
export default async function getImages(theme: string){
const imgKey=process.env.PIXABAY_API;
const imageArr: string[]=[]
interface pixabayHit{//in hits, we only care about the pageURL, which is of type string
    pageURL: string,
    largeImageURL: string,
    previewURL: string,
}
interface pixabayData{//entire data thats returned, we only care about the hits, which is an array of object
    hits:pixabayHit[],
}

if(!theme){
    throw new Error('Missing field.')
}
if(!imgKey){
    throw new Error('Img key not found.')
}
const response=await fetch(`https://pixabay.com/api/?key=${imgKey}&q=${theme}&image_type=photo&per_page=3`)

const data =(await response.json())as pixabayData 
for(let hits of data.hits){
    imageArr.push(hits.previewURL)

}

return imageArr
//missing first pixabay cdn img url
}