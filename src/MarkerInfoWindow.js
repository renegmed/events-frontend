import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import GoogleMap from './components/GoogleMap';
import moment from 'moment';
import Slider from "react-slick";
import { Container, Row, Col } from 'reactstrap';

const DEFAULT_CENTER =  [40.745451, -73.909784];

const InfoWindow = ( event ) => { 
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
    
    return  (        
        <div style={infoWindowStyle}>
            <div style={{ fontSize: 16 }}>
                { event.event.title }
            </div>
            { !isEmpty( event.event.description ) && (
                 <div style={{ fontSize: 12 }}>
                    { event.event.description }
                 </div>
              ) 
            }
            <div style={{ fontSize: 10 }}>
                { event.event.street }, { event.event.city }
            </div>
        </div>
    );
};

const Marker = ( props ) => {
    const markerStyle = {
        border: '1px solid white',         
        borderRadius: '50%', 
        height: props.show ? 15 : 10, 
        width: props.show ? 15 : 10,
        backgroundColor: props.show ? 'red' : 'blue',
        cursor: 'pointer',
        zindex: 10,
    };

    return (
        <Fragment>
            <div style={markerStyle} />
            { props.show  && <InfoWindow event={props.event}/> }
        </Fragment>
    );
};

class CustomSlide extends Component {
    render() {
      const { event, ...props } = this.props;
      const startdate = event.startdatetime;
      const enddate = event.enddatetime;  
      const startdatetime = moment(startdate).format('LLLL');
      const enddatetime = moment(enddate).format('LLLL');
      return (
        <div {...props}>
          <h3>{event.title}</h3>
          <div>{event.description}</div>
          <div><label>Street: </label>{event.street}</div> 
          <div><label>City: </label>{event.city}</div> 
          <div><label>Contact: </label>{event.contact}</div> 
          <div><label>Email: </label>{event.email}</div> 
          <div><label>Start: </label>{startdatetime}</div> 
          <div><label>End: </label>{enddatetime}</div> 
          <div><label>Show: </label>{event.show?"true":"false"}</div>  
        </div>
      );
    }
}


class MarkerInfoWindow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
        };
    }
  
    logSlide(n, i, sh) {
        //console.log("----", n, "------");
        const events = this.state.events;
        events[i].show = sh;
        this.setState({events: events}); 
    };

    pullData = () => {
        // console.log("start fetch and parsing json data")
        fetch("https://vxahypeomd.execute-api.us-east-1.amazonaws.com/dev/event/list")  
            .then(response => response.json())
            .then((data) => {
              
                data.events.forEach((result) => {                    
                    result.show = false // elint-disable-line no-param-reassign
                }); 
                this.setState({ events: data.events });
            }).catch((e) => {
                console.log(e)
            });
       
    }
    componentDidMount() {
        this.pullData()        
    }

    onChildClickCallback = ( key ) => {    
        this.setState( (state) => {          
            const index = state.events.findIndex( e => e.id === key); 
            state.events[index].show = !state.events[index].show;            
            return { events: state.events };
        });
      
    };
 

    render() {
        const { events } = this.state;

        const settings = {
            dots: true,
            infinite: true,
            autoplay: true,
            speed: 1500,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            beforeChange: (current, next) => {
                //this.setState({ oldSlide: current, activeSlide: next });
                //this.logSlide("next change", next, false);
                this.logSlide("current change", current, false);
            },
            afterChange: current => {
                //this.setState({ activeSlide2: current });
                this.logSlide("after change", current, true); 
            }
        };

        return (
           <Container> 
               <Row>
                   <Col sm={6}>
                    
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
                
                       
                   </Col>
           
                   <Col sm={6}>
                        <Slider {...settings}>
                            { events.map((e, i) =>(
                                <CustomSlide key={i} event ={e}></CustomSlide> 
                            ))}  
                        </Slider>
                   </Col>
               </Row> 

           </Container>          
        );
    }
}
 
// InfoWindow.propTypes = {
//     event: PropTypes.shape({
//         title: PropTypes.string, 
//     }).isRequired,
// }

Marker.propTypes = {
    show: PropTypes.bool.isRequired,
    event: PropTypes.shape(
        {        title: PropTypes.string 
    }).isRequired,
};
export default MarkerInfoWindow;

