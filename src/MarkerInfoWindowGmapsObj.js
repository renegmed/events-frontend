import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty'; 
 
import GoogleMap from './components/GoogleMap';


const DEFAULT_CENTER =  [40.745451, -73.909784];

const getInfoWindowString = event => `
    <div>
        <div style="font-size; 16px;">
            ${event.title}
        </div>
    </div>
`;

// Refer to https://github.com/google-map-react/google-map-react#use-google-maps-api
const handleApiLoaded = (map, maps, events) => {
    if (map == null) {
        return;
    }

    if (maps == null) {
        return;
    }

    if (events == null) {
        return;
    }
    const markers = [];
    const infowindows = [];

    events.forEach((event) => {
        // console.log("++++++++++")
        // console.log(event);
        markers.push(new maps.Marker({
            position: {
                lat: event.lat,
                lng: event.lon, 
            },
            map,
        }));

        infowindows.push(new maps.InfoWindow({
            content: getInfoWindowString(event),
        }));
    });

    markers.forEach((marker, i) => {
        marker.addListener('click', (param) => {
            infowindows[i].open(map, marker);
            console.log("+++++++++")
            console.log(param); //infowindows[i]);

            console.log("-----")
            console.log(param.valueOf()); 

        });
    });

    // console.log("....handle api loaded.")
};


class MarkerInfoWindowGmapsObj extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
        };
    }

    componentDidMount() {
        fetch("https://vxahypeomd.execute-api.us-east-1.amazonaws.com/dev/event/list") 
        .then(response => response.json())
        .then((data) => {
            // console.log("++++")
            // console.log(data.events);
            data.events.forEach((result) => { 
               
                result.show = true // elint-disable-line no-param-reassign

                // console.log("----- pullData -----")
                // console.log(result)
            }); 
            console.log(data.events);
            this.setState({ events: data.events });
        }).catch((e) => {
            console.log(e)
        });
    }
   
    render() {
        const { events } = this.state;
        // console.log(events);
        return (
            <Fragment>
                { !isEmpty(events ) && (
                    <GoogleMap 
                        defaultZoom={10}
                        defaultCenter={DEFAULT_CENTER}
                        bootstrapURLKeys={ { key: process.env.REACT_APP_MAP_KEY } }
                        yesIWantToUseGoogleMapApiInternals   
                        onGoogleApiLoaded={ ({ map, maps }) => handleApiLoaded(map, maps, events) }
                    />
                )}
            </Fragment>
        );
    }
}

export default MarkerInfoWindowGmapsObj;