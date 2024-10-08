import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import PokedexPage from './pages/PokedexPage';
import PokemonPage from './pages/PokemonPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/Pokedex" element={<PokedexPage />} />
          <Route path="/pokemon/:pokemon_name" element={<PokemonPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;