import React from 'react';
import { GoogleMap,withGoogleMap,withScriptjs } from 'react-google-maps';

const GoogleMapsWrapper = withScriptjs(withGoogleMap(props => {
    return <GoogleMap {...props} onIdle={props._onIdleChanged}
                      ref={props._onMapMounted}>{props.children}</GoogleMap>
}));

export default GoogleMapsWrapper;