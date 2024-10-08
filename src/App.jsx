import React, { useState, useEffect } from 'react';

const App = () => {
  const [leftItems, setLeftItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [rightItems, setRightItems] = useState([]);

  useEffect(() => {
    // Load saved items from localStorage when the component mounts
    const savedItems = JSON.parse(localStorage.getItem('rightItems'));
    if (savedItems) {
      setRightItems(savedItems);
    }
  }, []);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    setRightItems((prev) => [...prev, item]);
    setLeftItems((prev) => prev.filter((i) => i !== item));
  };

  const handleSave = () => {
    localStorage.setItem('rightItems', JSON.stringify(rightItems));
    alert('Items saved to localStorage!');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <div
        style={{
          width: '200px',
          height: '400px',
          border: '1px solid black',
          padding: '10px',
          overflowY: 'scroll',
        }}
      >
        <h3>Left Div (Draggable Items)</h3>
        {leftItems.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            style={{
              padding: '5px',
              margin: '5px',
              backgroundColor: '#e0e0e0',
              cursor: 'grab',
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div
        style={{
          width: '200px',
          height: '400px',
          border: '1px solid black',
          padding: '10px',
          overflowY: 'scroll',
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h3>Right Div (Dropped Items)</h3>
        {rightItems.map((item, index) => (
          <div key={index} style={{ padding: '5px', margin: '5px', backgroundColor: '#c0c0c0' }}>
            {item}
          </div>
        ))}
      </div>
      <button onClick={handleSave} style={{ marginTop: '20px' }}>
        Save
      </button>
    </div>
  );
};

export default App;
