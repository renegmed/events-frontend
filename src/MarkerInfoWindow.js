import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import GoogleMap from './components/GoogleMap';

const DEFAULT_CENTER =  [40.745451, -73.909784];

const InfoWindow = ( props ) => {
    const { event }  = props;
    const infoWindowStyle = {
        position: 'relative',
        bottom: 150,
        left: '-45px',
        width: 220,
        backgroundColor: 'white',
        boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
        padding: 10,
        fontSize: 14,
        zIndex: 100,
    };

    console.log("... InfoMarker event.title ...", event.title);
    //console.log(props.event.show);

    return  (
        <div style={infoWindowStyle}>
            <div style={{ fontSize: 16 }}>
                Title: { props.event.title }
            </div>
        </div>
    );
};

const Marker = ( props ) => {
    const markerStyle = {
        border: '1px solid white',
        borderRadius: '50%',
        height: 10,
        width: 10,
        backgroundColor: props.show ? 'red' : 'blue',
        cursor: 'pointer',
        zindex: 10,
    };

    //console.log("... Marker props ...", props.event.title); 

    return (
        <Fragment>
            <div style={markerStyle} />
            { props.show && <InfoWindow event={props.event}/>}
        </Fragment>
    );
};


class MarkerInfoWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
        };
    }

    pullData = () => {
        // console.log("start fetch and parsing json data")
        fetch("https://vxahypeomd.execute-api.us-east-1.amazonaws.com/dev/event/list") 
            .then(response => response.json())
            .then((data) => {
                //console.log("++++")
                //console.log(data.events);
                data.events.forEach((result) => { 
                   
                    result.show = false // elint-disable-line no-param-reassign

                    // console.log("----- pullData -----")
                    // console.log(result)
                }); 
                this.setState({ events: data.events });
            }).catch((e) => {
                console.log(e)
            });
            
        // console.log("End of parsing.")    
    }
    componentDidMount() {
        this.pullData()        
    }

    onChildClickCallback = ( key ) => {
        // console.log(".... on click key....")
        // console.log(key)
        this.setState( (state) => {
            //console.log(state.events)
            const index = state.events.findIndex( e => e.id === key);

            // console.log(".... on click - before ....", state.events[index].title)
            // console.log(state.events[index].show)
            state.events[index].show = !state.events[index].show; 
            // console.log(".... on click - after ....")
            // console.log(state.events[index].show)
            return { events: state.events };
        });
    };

    render() {
        const { events } = this.state;
        return (
           <Fragment> 

               { !isEmpty( events ) && (                   
                   <GoogleMap
                        defaultZoom={10}
                        defaultCenter={DEFAULT_CENTER}
                        bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
                        onChildClick={this.onChildClickCallback}

                   >
                       {
                           events.map(event => (
                               <Marker
                                    key={event.id}
                                    lat={event.lat}
                                    lng={event.lon}                                    
                                    show={event.show}
                                    event={event}
                               />
                           ))
                       }
                   </GoogleMap>
                )

               }
           
           </Fragment>          
        );
    }
}
 
InfoWindow.propTypes = {
    event: PropTypes.shape({
        title: PropTypes.string, 
    }).isRequired,
}

Marker.propTypes = {
    show: PropTypes.bool.isRequired,
    event: PropTypes.shape(
        {        title: PropTypes.string 
    }).isRequired,
};
export default MarkerInfoWindow;

