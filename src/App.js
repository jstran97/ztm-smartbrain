import React from 'react';
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'sign-in',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          entries: data.entries,
          joined: data.joined
        }
    })
  }

  calculateFaceLocation = (data) => {
    console.log(data);

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
    this.setState({ imageUrl: this.state.input })

    fetch('https://ztm-smartbrain-api-fl94.onrender.com/imageUrl', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log('MADE IT INTO .then(count => ...)', response);

        if (response) {
          fetch('https://ztm-smartbrain-api-fl94.onrender.com/image', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log)
        }

        this.displayFaceBox(this.calculateFaceLocation(response));

      })
      .catch(err => console.log('Error with /image route', err));
  }

  onRouteChange = (route) => {

    console.log("From App.js:", route);

    // Update isSignedIn states.
    if (route === 'sign-out') {
      // this.setState({isSignedIn: false})
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }


  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    let config = {
      num: [3, 10],
      rps: 0.1,
      radius: [5, 40],
      life: [1.5, 3],
      v: [2, 3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [.1, 0.4],
      position: "all",
      color: ["random", "#FF0000"],
      cross: "dead",
      // emitter: "follow",
      random: 15
    };

    if (Math.random() > 0.85) {
      config = Object.assign(config, {
        onParticleUpdate: (ctx, particle) => {
          ctx.beginPath();
          ctx.rect(
            particle.p.x,
            particle.p.y,
            particle.radius * 4,
            particle.radius * 4
          );
          ctx.fillStyle = particle.color;
          ctx.fill();
          ctx.closePath();
        }
      });
    }

    return (
      <div className='App'>
        <ParticlesBg type="custom" config={config} bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}/>
        { route === 'home'
          ? <div>
              <Logo />

              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputBoxChange={this.onInputBoxChange}
                onButtonSubmit={this.onButtonSubmit}
                />
              <FaceRecognition
                box={box}
                imageUrl={imageUrl}
              />
            </div>
          : (
            route === 'sign-in'
            ? <Signin
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
            : <Register
                loadUser={this.loadUser}
                onRouteChange={this.onRouteChange}
              />
          )
        }

      </div>
    );
  }
}

export default App;