import React from 'react';
import ReactDOM from 'react-dom';

class TwitterSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      count: 0,
      length: 0
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
    this.handleText(event.target.value);
  }

  findPunctuation(text) {
    //get the first chunk of the text
    let chunk = text.substring(0,256);

    //get the last index of each type of punctuation and store them in an array
    let indexes = [];
    indexes.push(chunk.lastIndexOf('.'));
    indexes.push(chunk.lastIndexOf('?'));
    indexes.push(chunk.lastIndexOf('!'));

    //Return the largest value (the last character) from the array
    //The Spread operator (...) iterates through the array
    return Math.max(...indexes);
  }

  handleText(value) {
    let chunkedText = []
    this.setState({value: value});
    let text = value

    //set length to display total number of characters
    this.setState({length: text.length});

    //store the text in local storage with the key 'tweet'
    window.localStorage.setItem('tweet', text);

    while(text.length > 256) {
      //get first 256 chars from text and find index of last period
      //let indexOfLastPeriod = text.substring(0,256).lastIndexOf('.')

      //Changed to find the last index of . ! or ?
      let indexOfLastPeriod = this.findPunctuation(text);

      //based on the index we got above get the text from 0 up to that index/number
      let completeSentence = text.substring(0, indexOfLastPeriod + 1)
      //add completeSentence to chunckedText array
      chunkedText.push(completeSentence)
      //remove completeSentence from text
      text = text.slice(indexOfLastPeriod + 1)
    }

    //add the trailing text
    chunkedText.push(text)
    
    //Update the count for the number of tweets
    this.setState({count: chunkedText.length});

    //delete p tags each timse an onChange event occurs
    this.deletePTags() 

    //create a paragraph for each 256 char chunk of text
    for (var i in chunkedText) {
      var root = document.getElementById('root')
      var paragraph = document.createElement("p")
      var node = document.createTextNode(Number(i) + 1 + '/' + chunkedText.length  + ' ' + chunkedText[i]);
      paragraph.appendChild(node)
      root.appendChild(paragraph)
    }
  }

  componentDidMount() {
    //once the component loads check local storage and update the value if it exists
    if (window.localStorage.getItem('tweet')) {
        this.handleText(window.localStorage.getItem('tweet'))
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
        {this.state.length > 0 ? <span>{this.state.length} Chars || {this.state.count} Tweets</span> : ''}
      </div>
    );
  }
}

ReactDOM.render(
	<TwitterSplitter propsCount={0}/>,
	document.getElementById('root')
)