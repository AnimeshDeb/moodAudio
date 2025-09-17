import dotenv from 'dotenv';
dotenv.config();
export default async function getImages(theme) {
    const imgKey = process.env.PIXABAY_API;
    const imageArr = [];
    if (!theme) {
        throw new Error('Missing field.');
    }
    if (!imgKey) {
        throw new Error('Img key not found.');
    }
    const response = await fetch(`https://pixabay.com/api/?key=${imgKey}&q=${theme}&image_type=photo&per_page=3`);
    const data = (await response.json());
    for (let hits of data.hits) {
        imageArr.push(hits.previewURL);
    }
    return imageArr;
    //missing first pixabay cdn img url
}
