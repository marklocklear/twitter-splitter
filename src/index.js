import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { TwitterShareButton } from 'react-twitter-embed';
import './App.css';
import { lightTheme, darkTheme } from './Themes';
import github from './github.png'
import logo from './logo.png'

class TwitterSplitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      count: 0,
      length: 0,
      theme: 'light',
      styles: lightTheme,
    };

    this.handleChange = this.handleChange.bind(this);
    this.swapTheme = this.swapTheme.bind(this);
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
      //get first 256 chars from text and find index of last valid punctuation 
      let indexOfLastPunctuation = this.findPunctuation(text);

      //based on the index we got above get the text from 0 up to that index/number
      let completeSentence = text.substring(0, indexOfLastPunctuation + 1)
      //add completeSentence to chunckedText array
      chunkedText.push(completeSentence)
      //remove completeSentence from text
      text = text.slice(indexOfLastPunctuation + 1)
    }

    //add the trailing text
    chunkedText.push(text)
    
    //Update the count for the number of tweets
    this.setState({count: chunkedText.length});

    //delete p tags each timse an onChange event occurs
    this.deletePTags() 

    //create a paragraph for each 256 char chunk of text
    for (var i in chunkedText) {
      var root = document.getElementById('output')
      var paragraph = document.createElement("p")
      var node = document.createTextNode(Number(i) + 1 + '/' + chunkedText.length  + ' ' + chunkedText[i]);
      paragraph.appendChild(node)
      root.appendChild(paragraph)
    }
  }

  swapTheme() {
    if(this.state.theme == 'light') {
      this.setState({theme: 'dark', styles: darkTheme});
    } else {
      this.setState({theme: 'light', styles: lightTheme});
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
      <div style={this.state.styles.body}>
        <Grid container wrap="nowrap" align="center">
          <Grid item className="github">
            <a href="https://github.com/marklocklear/twitter-splitter" target="_blank">
              <img src={github} alt="Github" width="50" height="50" />
            </a>
          </Grid>
          <Grid item className="title"> 
            <Typography variant="h2" component="h1" >
              Twitter
            </Typography>
          </Grid>
          <Grid item className="logo">
            <img src={logo} alt="Logo" width="100" height="100" />
          </Grid>
          <Grid item className="title"> 
            <Typography variant="h2" component="h1" >
              Splitter
            </Typography>
          </Grid>
          <Grid item className="twitter"> 
          <div className="centerContent">
            <div className="selfCenter">
            <TwitterShareButton url="https://twittersplitter.com/" options={{
                text: 'I just split my tweet with #twitterSplitter',
                via: 'marklocklear',
                size: 'large'
              }} placeholder="Loading" />
            </div>
          </div>
          </Grid>
        </Grid>
        <Grid container spacing={2} justify="center" wrap="nowrap">
          <Grid item className="main-box"> 
            <Paper className="paper" square elevation={3} style={this.state.styles.mainBox}>
              <form>
                <label>
                  <textarea
                    placeholder="Begin typing your tweet here..."
                    rows="14" cols="75" value={this.state.value}
                    onChange={this.handleChange}
                  />
                </label>
              </form>
            </Paper>
            
            {this.state.length > 0 && 
              <Typography variant="body1" align="center">
                {this.state.length} Chars || {this.state.count} Tweets
              </Typography>}
          </Grid>
          <Grid item className="main-box">
            <Paper id="output" className="paper" square elevation={3} style={this.state.styles.mainBox} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

ReactDOM.render(
	<TwitterSplitter propsCount={0}/>,
	document.getElementById('root')
)