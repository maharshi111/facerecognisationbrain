import React,{ Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Design from './components/Design/Design';
import FaceRecognisation from './components/FaceRecognisation/FaceRecognisation';
// start1
// import Clarifai from 'clarifai';
//end1

//start2
//You must add your own API key here from Clarifai.
// const app = new Clarifai.App({
//  apiKey: 'YOUR API KEY HERE'
// });
//end2

const returnClarifaiRequestOptions=(imageUrl)=>{
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '13355a7058ee4feb8eb53602deccb6db';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'maharshi111';       
    const APP_ID = 'test';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';    
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

 const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions
}

    

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id


class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:''
    }
  }
  onInputChange=(event)=>{
    //console.log(event.target.value);
    this.setState({input: event.target.value});
  }
  OnButtonSubmit=()=>{
   // console.log("click");
     this.setState({imageUrl: this.state.input});
   
    // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
    // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
    // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
    // If that isn't working, then that means you will have to wait until their servers are back up. 

    // app.models.predict('face-detection', this.state.input)

    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs",returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
      .then(response => {
        console.log('hi', response)
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }
 render() {
  return(
      <div className="App">

        <Navigation />
          <Logo />
          <Rank/>
          <ImageLinkForm
           onInputChange={this.onInputChange}
           OnButtonSubmit={this.OnButtonSubmit} />
          <Design/>
          <FaceRecognisation imageUrl={this.state.imageUrl} />
      </div>
    )
  };
}

export default App;
