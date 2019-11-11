import React, { Component } from "react";
import Slider from "react-slick";

class CustomSlide extends Component {
    render() {
      const { event, ...props } = this.props;
      return (
        <div {...props}>
          <h3>{event.title}</h3>
          <div>{event.description}</div>
          <div><label>Street: </label>{event.street}</div> 
          <div><label>City: </label>{event.city}</div> 
          <div><label>Contact: </label>{event.contact}</div> 
          <div><label>Email: </label>{event.email}</div> 
          <div><label>Start: </label>{event.startdatetime}</div> 
          <div><label>End: </label>{event.enddatetime}</div> 
          <div><label>Show: </label>{event.show?"true":"false"}</div>  
        </div>
      );
    }
}

export default class EventsDisplay extends Component {

  state = {
    oldSlide: 0,
    activeSlide: 0,
    activeSlide2: 0,
    events:[]
  };

  logSlide(n, i, sh) {
      console.log("----", n, "------");
      const events = this.state.events;
      events[i].show = sh;
      console.log(events[i].title);
  };
 
  pullData = () => {
    // console.log("start fetch and parsing json data")
    fetch("https://vxahypeomd.execute-api.us-east-1.amazonaws.com/dev/event/list")  
        .then(response => response.json())
        .then((data) => {
            // //console.log("++++")
            // //console.log(data.events);
            data.events.forEach((result) => {                
                result.show = false // elint-disable-line no-param-reassign 
            }); 
            this.setState({ events: data.events });
            //console.log(data.events);
        }).catch((e) => {
            console.log(e)
        });
        
       
    // console.log("End of parsing.")    
  }

  componentDidMount() {
    this.pullData()        
  }

  render() {

    const events  = this.state.events;
    // console.log("+++++++++++");
    // console.log(events);
    // console.log("------------")

    const settings = {
      dots: true,
      infinite: true,
      autoplay: true,
      speed: 1000,
      centerMode: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      beforeChange: (current, next) => {
        this.setState({ oldSlide: current, activeSlide: next });
        //this.logSlide("next change", next, false);
        this.logSlide("current change", current, false);
      },
      afterChange: current => {
            this.setState({ activeSlide2: current });
            this.logSlide("after change", current, true); 
      }
    };

    return (
      <div>
       
        <Slider {...settings}>
           { events.map((e, i) =>(
                <CustomSlide key={i} event ={e}></CustomSlide> 
           ))}  
        </Slider>
      </div>
    );
  }
}
