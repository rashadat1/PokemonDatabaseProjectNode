import axios from 'axios';

// fetches list of types and urls
export const fetchTypeList = async() => {
    const response = await axios.get(`https://pokeapi.co/api/v2/type`);
    return response.data.results;
}

export const fetchTypeDetails = async(typeurl) => {
    // takes the url to the type as an argument and gets the picture for this located in the JSON
    // returned at the request endpoint
    const parts = typeurl.split('/');
    const type_id = parts[parts.length-2];
    const spriteURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-vii/ultra-sun-ultra-moon/${type_id}.png`
    return spriteURL;
}

