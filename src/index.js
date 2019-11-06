import React from 'react';
import ReactDOM from 'react-dom';

class TwitterSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.',
      count: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resetCount = () => {
    this.setState((state) => {
      return {count: 0}
    })
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    let wordCount = this.state.value.length
    if (wordCount > 150) {
    	console.log("word count is: ", wordCount)
    	this.setState((state) => {
				return {value: "New p tag here"}
			})
      var root = document.getElementById('root')
      var para = document.createElement("p");
      var node = document.createTextNode(this.state.value);
      para.appendChild(node);
      root.appendChild(para);
    }
  }

  render() {
    return (
      <div>
        <form>
          <label>
            Text:
            <textarea rows="14" cols="50" value={this.state.value} onChange={this.handleChange} />
          </label>
        </form>
         <div>{this.state.value}</div>
      </div>
    );
  }
}

ReactDOM.render(
	<TwitterSplitter propsCount={0}/>,
	document.getElementById('root')
)