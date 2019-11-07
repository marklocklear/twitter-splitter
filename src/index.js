import React from 'react';
import ReactDOM from 'react-dom';

class TwitterSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      count: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  resetCount = () => {
    this.setState((state) => {
      return {count: 0}
    })
  }

  //delete paragraphs to update DOM
  deletePTags() {
    var p_list = document.getElementsByTagName("p");
    for(var i=p_list.length-1; i>=0; i--){
      var p = p_list[i];
      p.parentNode.removeChild(p);
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
    let text = this.state.value
    let characterCount = text.length
    let chunkedText = text.match(/.{1,256}/g)
	  let numParagraphs = Math.floor(characterCount/256) + 1

    //delete p tags each timse an onChange event occurs
    this.deletePTags() 

    //create a paragraph for each 256 char chunk of text
    if(numParagraphs){
      for (var i in chunkedText) {
        var root = document.getElementById('root')
        var paragraph = document.createElement("p");
        var node = document.createTextNode(Number(i) + 1 + '/' + chunkedText.length  + ' ' + chunkedText[i]);
        paragraph.appendChild(node);
        root.appendChild(paragraph); 
      }
    }
  }

  render() {
    return (
      <div>
    		<h1>Twitter Splitter</h1>
        <form>
          <label>
            <textarea
              placeholder="Begin typing your tweet here..."
              rows="14" cols="50" value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
        </form>
      </div>
    );
  }
}

ReactDOM.render(
	<TwitterSplitter propsCount={0}/>,
	document.getElementById('root')
)