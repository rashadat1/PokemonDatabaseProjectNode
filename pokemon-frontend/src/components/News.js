import React from 'react';
import '../App.css';

const LatestNews = ({ news }) => {
    const { titles, urls, dates, descriptions } = news;

    return (
        <div className="latest-news">
            <h2>Latest News</h2>
            <ul>
                {titles.map((title,index) => (
                    <li key={index} className="news-item">
                        <h3><a href={urls[index]} target="_blank" rel="noopener noreferrer">{title}</a></h3>
                        <p className="news-date">{dates[index]}</p>
                        <p className="news-description">{descriptions[index]}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LatestNews;