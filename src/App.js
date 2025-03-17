import React from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';


// const app = new Clarifai.App({
//   apiKey: '7b2a567388704aeaa71ab2be3f1489ab'
// });
// console.log(app);

// const PAT = '65932f832bc947a2953fd5f434062c34';
// const USER_ID = 'jtran2168';
// const APP_ID = 'my-first-application-ufu7u';


const PAT = '65932f832bc947a2953fd5f434062c34';
const USER_ID = 'clarifai';
const APP_ID = 'main';

const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

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
                    // "base64": IMAGE_BYTES_STRING
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




class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'sign-in',
      isSignedIn: false
    }
  }


  calculateFaceLocation = (data) => {
    const personsFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width); // 500 px
    const height = Number(image.height); // auto-scaled so it's in proportion

    return {
      leftCol: personsFace.left_col * width,
      topRow: personsFace.top_row * height,
      rightCol: width - (personsFace.right_col * width),
      bottomRow: height - (personsFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box })
  }

  onInputBoxChange = (event) => {
    console.log(event.target.value);
    this.setState({ input: event.target.value })
  }
  
  onButtonSubmit = () => { 
    this.setState({ imageUrl: this.state.input})

    // app.models.predict('face-detection', this.state.input)
    // .then(response => { 
    //   console.log('hi', response)
    //   // if (response) {
    //   //   fetch('http://localhost:3000/image', {
    //   //     method: 'put',
    //   //     headers: {'Content-Type': 'application/json'},
    //   //     body: JSON.stringify({
    //   //       id: this.state.user.id
    //   //     })
    //   //   })
    //   //     .then(response => response.json())
    //   //     .then(count => {
    //   //       this.setState(Object.assign(this.state.user, { entries: count}))
    //   //     })

    //   // }


    // })

    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/outputs/", requestOptions)
    // .then((response) => {
    //   response.text();
    //   console.log(response.text());
    // })
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));



    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    // .then(response => response.json())
    // .then(result => {

    //     const regions = result.outputs[0].data.regions;

    //     regions.forEach(region => {
    //         // Accessing and rounding the bounding box values
    //         const boundingBox = region.region_info.bounding_box;
    //         const topRow = boundingBox.top_row.toFixed(3);
    //         const leftCol = boundingBox.left_col.toFixed(3);
    //         const bottomRow = boundingBox.bottom_row.toFixed(3);
    //         const rightCol = boundingBox.right_col.toFixed(3);

    //         region.data.concepts.forEach(concept => {
    //             // Accessing and rounding the concept value
    //             const name = concept.name;
    //             const value = concept.value.toFixed(4);

    //             console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
    //         });
    //     });

    // })
    // .catch(error => console.log('error', error));

    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", requestOptions)
    .then(response => response.json())
    .then((response) => {
      console.log('hi', response);
      console.log(response.text());
    })
    // .catch(error => console.log('error', error));

  }

  onRouteChange = (route) => {
    // Update isSignedIn states.
    if (route === 'sign-out') {
      this.setState({ isSignedIn: false})
    } else if (route === 'home') {
      this.setState({ isSignedIn: true})
    }
    this.setState({ route: route });
  }     


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    return (
      <div className='App'>
        <ParticlesBg color='#ff0000' type='cobweb' bg={true} />
        <Navigation 
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />

              <Rank />
              <ImageLinkForm 
                onInputBoxChange={box} 
                onButtonSubmit={this.onButtonSubmit}
                />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
            route === 'sign-in'
            ? <Signin onRouteChange={this.onRouteChange}/>  
            : <Register onRouteChange={this.onRouteChange}/>
          )
        }

      </div>
    );
  }
}

export default App;