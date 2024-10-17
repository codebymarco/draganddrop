import React, { useState, useEffect } from "react";

const App = () => {
  const [text, setText] = useState("");

  const [layout, setLayout] = useState("one");

  const [leftItems] = useState([
    "heading",
    "subheading",
    "button",
    "textarea",
    "input",
  ]);
  const [rightItems, setRightItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [draggedItemValue, setDraggedItemValue] = useState(null);
  const [selectedItemInfo, setSelectedItemInfo] = useState({
    index: null,
    value: null,
  });
  const [rightDivBgColor, setRightDivBgColor] = useState("#c0c0c0");
  const [showRightDivInfo, setShowRightDivInfo] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("rightItems"));
    const savedBgColor = localStorage.getItem("rightDivBgColor");

    if (savedItems) {
      setRightItems(savedItems);
    }

    if (savedBgColor) {
      setRightDivBgColor(savedBgColor);
    }
  }, []);

  const handleDragStart = (e, item, source, index = null) => {
    e.dataTransfer.effectAllowed = "move";

    if (source === "left") {
      setDraggedItemValue(item);
      setDraggedItemIndex(null); // No index from the left div
    } else if (source === "right") {
      setDraggedItemIndex(index);
      setDraggedItemValue(item); // Store item and index when dragging from right
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedItemIndex === null && draggedItemValue) {
      const added = {
        value: draggedItemValue,
        req: false,
        text: draggedItemValue,
      };

      setRightItems((prevItems) => [...prevItems, added]);
    }
    setDraggedItemValue(null);
    setDraggedItemIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSortDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItemIndex !== null && draggedItemValue) {
      // It's a reorder operation within the right div
      setRightItems((prevItems) => {
        const updatedItems = [...prevItems];
        const [removedItem] = updatedItems.splice(draggedItemIndex, 1);
        updatedItems.splice(targetIndex, 0, removedItem); // Insert at new index
        return updatedItems;
      });
    } else if (draggedItemValue) {
      // It's an item from the left div being added
      setRightItems((prevItems) => {
        const updatedItems = [...prevItems];
        updatedItems.splice(targetIndex, 0, draggedItemValue);
        return updatedItems;
      });
    }

    setDraggedItemValue(null);
    setDraggedItemIndex(null);
  };

  const handleDelete = (index) => {
    setRightItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    localStorage.setItem("rightItems", JSON.stringify(rightItems));
    localStorage.setItem("rightDivBgColor", rightDivBgColor);
    alert("Items and background color saved to localStorage!");
  };

  const handleRevert = () => {
    localStorage.setItem("rightItems", JSON.stringify(rightItems));
    localStorage.setItem("rightDivBgColor", rightDivBgColor);
    alert("Items and background color saved to localStorage!");
  };

  const handleItemClick = (e, index, item) => {
    e.stopPropagation(); // Stop event from bubbling up to the right div
    setSelectedItemInfo({ index, value: item });
    setText(item.text);
    setShowRightDivInfo(false); // Hide right div info when item is clicked
  };

  const handleRightDivClick = () => {
    setShowRightDivInfo(true);
  };

  const handleBgColorChange = (e) => {
    const newColor = e.target.value;
    setRightDivBgColor(newColor);
    localStorage.setItem("rightDivBgColor", newColor); // Save the new background color
  };

  const saveText = () => {
    console.log("selected", selectedItemInfo);
    console.log("text value", text);

    // Use map to create a new array where only the item with the matching index is updated
    const updatedRightItems = rightItems.map((item, index) => {
      if (index === selectedItemInfo.index) {
        // Update the text value of the selected item
        return { ...item, text: text };
      }
      // Return the unchanged item for other indices
      return item;
    });

    // Set the updated array to state or perform necessary actions
    setRightItems(updatedRightItems); // Assuming you are using React state
  };

  return (
    <div className="page">
      <div className="top">
        <h1>form builder</h1>
        <div>
          {layout}
          <select
            name=""
            id=""
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            <option value="one">layout1</option>
            <option value="two">layout2</option>
          </select>
          <button onClick={handleRevert} style={{ marginTop: "20px" }}>
            Revert
          </button>
          <button onClick={handleSave} style={{ marginTop: "20px" }}>
            Save
          </button>
        </div>
      </div>

      <div className="container">
        <div
          style={{
            width: "200px",
            height: "400px",
            border: "1px solid black",
            padding: "10px",
            overflowY: "scroll",
            height: "100%",
          }}
        >
          <h3>Components(drag)</h3>
          {leftItems.map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "left")}
              style={{
                padding: "5px",
                margin: "5px",
                backgroundColor: "#e0e0e0",
                cursor: "grab",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div
          style={{
            width: "500px",
            height: "100%",
            border: "1px solid black",
            display: "flex",
            flexDirection:
              layout === "one" ? "column" : layout === "two" ? "row" : "row",
            flexGrow: "1",
            padding: "10px",
            overflowY: "scroll",
            backgroundColor: rightDivBgColor, // Background color is dynamic
          }}
          onClick={handleRightDivClick} // Click handler for the right div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h3>Form</h3>
          {rightItems.map((item, index) => (
            <div
              className={`right-item ${
                item.value === "heading"
                  ? `right-item-type-one`
                  :
                  item.value === "subheading"
                  ? `right-item-type-one`
                  :
                  item.value === "button"
                  ? `right-item-type-one`
                  :
                   `right-item-type-two`
              }`}
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, item, "right", index)}
              onDrop={(e) => handleSortDrop(e, index)}
              onDragOver={handleDragOver}
              onClick={(e) => handleItemClick(e, index, item)} // Click handler for items
              style={{
                border:
                  selectedItemInfo.index === index
                    ? "2px solid dodgerblue"
                    : "none",
              }}
            >
              {item.text}
              <button
                onClick={() => handleDelete(index)}
                style={{ marginLeft: "10px" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            width: "300px",
            height: "100%",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <h3>Component Info</h3>
          {showRightDivInfo ? (
            <div>
              <p>Background Color: {rightDivBgColor}</p>
              <input
                type="color"
                value={rightDivBgColor}
                onChange={handleBgColorChange}
                style={{ marginTop: "10px" }}
              />
            </div>
          ) : selectedItemInfo.index !== null ? (
            <div>
              <p>Index: {selectedItemInfo.index}</p>
              <p>Type: {selectedItemInfo.value.value}</p>

              <input
                placeholder="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={saveText}>save</button>
            </div>
          ) : (
            <p>No item selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
