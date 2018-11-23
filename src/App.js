import React, { Component } from 'react';
import { SketchField, Tools } from 'react-sketch';
import Header from './components/Header';
import './App.css';

class App extends Component {
  state = {
    lineColor: 'black',
    backgroundColor: 'transparent',
    data: null,
    tool: Tools.Pencil,
  };

  componentDidMount() {
    document.addEventListener('message', (event) => {
      const { data } = event;
      try {
        this.setState({ data: JSON.parse(data) });
      } catch (err) {
        console.error(err);
      }
    });
  }

  postMessage = (data) => {
    const message = JSON.stringify(data);
    if (document.postMessage) {
      document.postMessage(message, '*');
    } else if (window.postMessage) {
      window.postMessage(message, '*');
    } else {
      console.error('unable to find postMessage');
    }
  };

  clear = () => {
    this.sketch.clear();
    this.sketch.setBackgroundFromDataUrl('');
    this.setState({
      backgroundColor: 'transparent',
    });
  };

  changeColor = (color) => {
    this.setState({
      lineColor: color,
    });
  };

  render() {
    const {
      data,
      tool,
      lineColor,
      backgroundColor,
    } = this.state;
    return (
      <div className="App">
        <Header
          clear={this.clear}
          changeColor={this.changeColor}
          color={lineColor}
        />
        <SketchField
          ref={(sketch) => { this.sketch = sketch; }}
          width={window.innerWidth}
          height={window.innerHeight}
          backgroundColor={backgroundColor}
          tool={tool}
          lineColor={lineColor}
          lineWidth={3}
          onChange={() => this.postMessage(this.sketch.toJSON())}
          value={data}
        />
      </div>
    );
  }
}

export default App;
