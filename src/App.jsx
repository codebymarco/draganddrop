import React, { useState, useEffect } from 'react';

const App = () => {
  const [leftItems, setLeftItems] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [rightItems, setRightItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [selectedItemInfo, setSelectedItemInfo] = useState({ index: null, value: null });
  const [rightDivBgColor, setRightDivBgColor] = useState('#c0c0c0');
  const [showRightDivInfo, setShowRightDivInfo] = useState(false);

  useEffect(() => {
    // Load saved items and background color from localStorage when the component mounts
    const savedItems = JSON.parse(localStorage.getItem('rightItems'));
    const savedBgColor = localStorage.getItem('rightDivBgColor');

    if (savedItems) {
      setRightItems(savedItems);
    }

    if (savedBgColor) {
      setRightDivBgColor(savedBgColor);
    }
  }, []);

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (!rightItems.includes(item)) {
      setRightItems((prev) => [...prev, item]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSortDrop = (e, index) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');

    // Rearrange the items
    setRightItems((prev) => {
      const newItems = prev.filter((i) => i !== item);
      newItems.splice(index, 0, item);
      return newItems;
    });
  };

  const handleDelete = (index) => {
    setRightItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    localStorage.setItem('rightItems', JSON.stringify(rightItems));
    localStorage.setItem('rightDivBgColor', rightDivBgColor); // Save background color
    alert('Items and background color saved to localStorage!');
  };

  // Handle item click, preventing it from triggering the right div click
  const handleItemClick = (e, index, item) => {
    e.stopPropagation(); // Stop event from bubbling up to the right div
    setSelectedItemInfo({ index, value: item });
    setShowRightDivInfo(false); // Hide right div info when item is clicked
  };

  const handleRightDivClick = () => {
    setShowRightDivInfo(true); // Show right div info when right div is clicked
  };

  const handleBgColorChange = (e) => {
    const newColor = e.target.value;
    setRightDivBgColor(newColor);
    localStorage.setItem('rightDivBgColor', newColor); // Save the new background color
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
          display:'flex',
          flexDirection:'column',
          padding: '10px',
          overflowY: 'scroll',
          backgroundColor: rightDivBgColor, // Background color is dynamic
        }}
        onClick={handleRightDivClick} // Click handler for the right div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3>Right Div (Dropped Items)</h3>
        {rightItems.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, item, index)}
            onDrop={(e) => handleSortDrop(e, index)}
            onDragOver={handleDragOver}
            onClick={(e) => handleItemClick(e, index, item)} // Click handler for items
            style={{
              padding: '5px',
              margin: '5px',
              backgroundColor: '#c0c0c0',
              cursor: 'grab',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {item}
            <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          width: '200px',
          height: '400px',
          border: '1px solid black',
          padding: '10px',
        }}
      >
        <h3>Selected Info</h3>
        {showRightDivInfo ? (
          <div>
            <p>Right Div Background Color: {rightDivBgColor}</p>
            <input
              type="color"
              value={rightDivBgColor}
              onChange={handleBgColorChange}
              style={{ marginTop: '10px' }}
            />
          </div>
        ) : selectedItemInfo.index !== null ? (
          <div>
            <p>Index: {selectedItemInfo.index}</p>
            <p>Value: {selectedItemInfo.value}</p>
          </div>
        ) : (
          <p>No item selected</p>
        )}
      </div>

      <button onClick={handleSave} style={{ marginTop: '20px' }}>
        Save
      </button>
    </div>
  );
};

export default App;
