---
order: 0
title: //这里写主标题
---

//这里写示例demo描述


````jsx
import { {__name__} } from 'comby_library_commons';

class App extends React.Component {

  render() {
    return (
      <div>
        <{__name__}>
        </{__name__}>
      </div>
    );
  }
}

ReactDOM.render(<App />, mountNode);
````