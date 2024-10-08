import axios from 'axios';

// fetches list of types and urls
export const fetchTypeList = async() => {
    const response = await axios.get(`https://pokeapi.co/api/v2/type`);
    return response.data.results;
}

export const fetchTypeDetails = async(typeurl) => {
    // takes the url to the type as an argument and gets the picture for this located in the JSON
    // returned at the request endpoint
    const response = await axios.get(`${typeurl}`);
    const spriteURL = response.data.sprites['generation-vii']['ultra-sun-ultra-moon'].name_icon;
    return spriteURL;
}

