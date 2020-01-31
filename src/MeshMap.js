import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty'; 
import moment from 'moment';
 
import GoogleMap from './components/GoogleMap';


const DEFAULT_CENTER =  [40.762064, -73.925428];

const getInfoWindowString = (event) => {
    
    moment.locale('en') 

    const description = isEmpty(event.description) ?"":  "<div>"+event.description+"</div>";
    const contact = isEmpty(event.contact) ? "" :   "<div style=\"font-size; 16px;color: black;\"><label style=\"color: grey;\">" +
      "<b>contact:</b></label>" + event.contact + "</div>";
    const email = isEmpty(event.email) ? "" :   "<div style=\"font-size; 16px;color: black;\">" +
      "<label style=\"color: grey;\"><b>email:</b></label>" + event.email + "</div>";
    const status = isEmpty(event.status) ? "" :   "<div style=\"font-size; 16px;color: black;\">" +
      "<label style=\"color: grey;\"><b>status:</b></label>" + event.status + "</div>";
    return `
      <div>
        <div style="font-size; 18pt;color: blue;">
            <b>${event.title}</b>
        </div>        
        ${description}
        ${contact}
        ${email} 
        ${status}        
      </div>
    `;
};    

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
            // console.log("+++++++++")
            // console.log(param); //infowindows[i]);

            // console.log("-----")
            // console.log(param.valueOf()); 

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
        fetch("https://vxahypeomd.execute-api.us-east-1.amazonaws.com/dev/event/query?category=mesh") 
        .then(response => {
            // console.log("++++ response")
            // console.log(response);
            return response.json() })
        .then((data) => {
            // console.log("++++ data,events")
            // console.log(data.events);
            if (typeof data.events == 'undefined' ) {
                return
            }
            data.events.forEach((result) => { 
               
                result.show = true // elint-disable-line no-param-reassign

                // console.log("----- pullData -----")
                // console.log(result)
            }); 
            // console.log(data.events);
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
                        defaultZoom={14}
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