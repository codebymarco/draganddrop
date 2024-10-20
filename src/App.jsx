import React from 'react';

const DynamicForm = ({ data }) => {
  return (
    <form>
      {data.map((item, index) => {
        switch (item.value) {
          case 'heading':
            return <h1 key={index}>{item.text}</h1>;
          case 'subheading':
            return <p key={index}>{item.text}</p>;
          case 'input':
            return <input key={index} type="text" placeholder={item.text} />;
          case 'textarea':
            return <textarea key={index} placeholder={item.text}></textarea>;
          case 'button':
            return <button key={index}>{item.text}</button>;
          default:
            return null;
        }
      })}
    </form>
  );
};

// Sample data passed as props
const dataFromBackend = [
  {
    value: "heading",
    req: false,
    text: "heading"
  },
  {
    value: "heading",
    req: false,
    text: "heading"
  },
  {
    value: "subheading",
    req: false,
    text: "subheading"
  },
  {
    value: "input",
    req: false,
    text: "input"
  },
  {
    value: "textarea",
    req: false,
    text: "textarea"
  },
  {
    value: "button",
    req: false,
    text: "button"
  }
];

function App() {
  return (
    <div className="App">
      <DynamicForm data={dataFromBackend} />
    </div>
  );
}

export default App;
