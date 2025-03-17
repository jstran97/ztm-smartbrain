import React from 'react';
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';

const Logo = () => {
    return(
        <div className='ma4 mt'>
            <Tilt className='Tilt' transitionSpeed='1000'>
                <div className='Tilt-inner br2 shadow-2 pa3' style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', height: '150px', width: '150px' }}>
                    <img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;



