import './App.css';
import { useEffect, useState } from 'react';

const COMMA_SEPARATOR = ', ';

function App() {
  const [suitsOrder, setSuitsOrder] = useState([]);
  const [ranksOrder, setRanksOrder] = useState([]);
  const [drawnCards, setDrawnCards] = useState([]);
  const [sortedDrawnCards, setSortedDrawnCards] = useState([]);

  const callAPI = async (url) => { 
    const response = await fetch(url);
    return response.json();
  };

  const shuffleDeck = async () => await fetch('/shuffle-deck', { method: 'POST' }); 
  
  const generateSuitsOrder = async () => callAPI('/generate-suits-order')
    .then(res => {
      setSuitsOrder(res);
      setSortedDrawnCards([]);
    }); 
  
    const generateRanksOrder = async () => callAPI('/generate-ranks-order')
    .then(res => {
      setRanksOrder(res);
      setSortedDrawnCards([]);
    }); 
  
  const drawCards = async () => callAPI('/draw-cards').then(res => {
    setDrawnCards(res);
    setSortedDrawnCards([]);
  }); 

  const sortDrawnCards = async () => callAPI('/sort-drawn-cards').then(res => setSortedDrawnCards(res)); 

  useEffect(() => {
    async function fetchDataFromAPI() {
      Promise.all([generateSuitsOrder(), generateRanksOrder(), shuffleDeck()]);
    }

    fetchDataFromAPI();
  }, []);

  return (
    <div className="App">
      <p>When you launch the app, by default, the deck is shuffled and the suits and ranks order are generated.<br/>
        In order to sort the cards, you have to at least draw them from the deck once.<br/>
        When you draw a card or generate a new rank or suit order, the list of sorted cards is being resetted.
      </p>
      <div className="buttons my-3 mb-5">
        <button type="button" className="btn btn-primary mx-2" onClick={generateSuitsOrder}>Generate new suit order</button>
        <button type="button" className="btn btn-primary mx-2" onClick={generateRanksOrder}>Generate new rank order</button>
        <button type="button" className="btn btn-primary mx-2" onClick={shuffleDeck}>Shuffle the deck</button>
        <button type="button" className="btn btn-primary mx-2" onClick={drawCards}>Draw cards</button>
        <button type="button" className="btn btn-primary mx-2" onClick={sortDrawnCards} 
          disabled={!drawnCards || drawnCards.length === 0}>Sort drawn cards</button>
      </div>
      <p><u>The order to follow for the suits is :</u> <br/> {suitsOrder.join(COMMA_SEPARATOR)}</p>
      <p><u>The order to follow for the ranks is :</u> <br/> {ranksOrder.join(COMMA_SEPARATOR)}</p>
      <p>
        <u>The drawn cards are :</u> <br/>
        <ul>
          {drawnCards.map(card => <li key={card}>{card}</li>)}
        </ul>
      </p>
      <p>
        <u>The drawn cards after being sorted :</u> <br/>
        <ul>
          {sortedDrawnCards.map(card => <li key={card}>{card}</li>)}
        </ul>
      </p>         
    </div>
  );
}

export default App;
