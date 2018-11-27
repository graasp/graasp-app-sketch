import React, { Component } from 'react';
import { SketchField, Tools } from 'react-sketch';
import download from 'downloadjs';
import Header from './components/Header';
import './App.css';

// todo: remove once this is merged into a release
// https://github.com/tbolis/react-sketch/pull/34
const INITIAL_BACKGROUND_COLOR = 'transparent';
const BACKGROUND_COLOR = '#fff';

class App extends Component {
  state = {
    lineColor: 'black',
    backgroundColor: INITIAL_BACKGROUND_COLOR,
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
    // todo: remove once this is merged into a release
    // https://github.com/tbolis/react-sketch/pull/34
    this.setState({
      backgroundColor: BACKGROUND_COLOR,
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
      backgroundColor: BACKGROUND_COLOR,
    });
  };

  changeColor = (color) => {
    this.setState({
      lineColor: color,
    });
  };

  save = () => {
    const src = this.sketch.toDataURL();
    download(src, 'sketch.png', 'image/png');
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
          save={this.save}
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
          imageFormat="png"
        />
      </div>
    );
  }
}

export default App;
