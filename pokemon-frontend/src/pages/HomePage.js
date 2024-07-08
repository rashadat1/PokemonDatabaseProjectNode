import React, { useEffect, useState } from 'react';
import Searchbar from '../components/Searchbar';
import axios from 'axios';
import FeaturedPokemon from '../components/FeaturedPokemon';
import LatestNews from '../components/News';
import Footer from '../components/Footer';


const HomePage = () => {
    const [news, setNews] = useState({
        titles: [],
        urls: [],
        dates: [],
        descriptions: []
    });

    useEffect(() => {
        console.log('Sending request')
        axios.get('http://localhost:3000/api/news')
            .then(response => {
                console.log(response.data);
                setNews(response.data);
            })
            .catch(error => console.error('Error fetching news:',error))

    }, []);
            
    return (
        <div className="home-page">
            <Searchbar />
            <FeaturedPokemon />
            <LatestNews news={news} />
            <Footer />
        </div>
    );
};

export default HomePage;