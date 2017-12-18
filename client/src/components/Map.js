import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow, OverlayView, GroundOverlay, Polyline} from "react-google-maps"
import GoogleMapsWrapper from "../util/GoogleMapsWrapper";
import '../style/Map.css';
import dateFormat from "dateformat";
import { OVERLAY_LAYER } from 'react-google-maps/lib/constants';
import * as url from "url";
import {transition} from "../actions/opCanvas";
const LOCATION_ICON = "http://maps.google.com/mapfiles/ms/micons/blue-dot.png";
const PINPOINT_ICON = "http://maps.google.com/mapfiles/ms/micons/yellow-dot.png";
const MEMBER_ICON = "http://maps.google.com/mapfiles/kml/paddle/";

class Map extends Component {

    constructor(props) {
        super(props);
        this._onClickMap = this._onClickMap.bind(this);
        this._handleClicMarker = this._handleClicMarker.bind(this);
    }

    _convertDate(dateString) {
        var date = new Date(dateString);
        date = dateFormat(date, "yyyy-mm-dd hh:MM:ss");
        return date;
    }

    _handleClicMarker(marker) {
        var index = this.props.markersPinPoint.indexOf(marker);
        let newState;
        if (index !== -1) {
            newState = this.props.markersPinPoint;
            marker.showInfo = !marker.showInfo;
            newState[index] = marker;
            this.props.changePinPoints(newState);
        } else {
            index = this.props.markersMembers.indexOf(marker);
            if (index !== -1) {
                newState = this.props.markersMembers;
                marker.showInfo = !marker.showInfo;
                newState[index] = marker;
                this.props.updateMarkerMembers(newState);
            }
        }

    }

    _onClickMap(event) {
        let coordinates = event.latLng;
        let lat = coordinates.lat();
        let lng = coordinates.lng();
        let marker = {
            lat: lat,
            lng: lng
        };
        this.props.updateMarkerSelect(marker);
    }

    render() {
        let id = 0;
        let markerSelect = this.props.markerSelect;
        return (
            <div className="center">
                <GoogleMapsWrapper
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz09vuKBf8P3_7nXx_DNSKwzY0toXGxYw&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{height: '100%'}}/>}
                    containerElement={<div style={{height: '100%'}}/>}
                    mapElement={<div style={{height: '100%'}}/>}
                    _onMapMounted={this.props._onMapMounted}
                    _onIdleChanged={this.props._onIdleChanged}
                    zoom={this.props.zoom}
                    center={this.props.mapCenter}
                    onClick={this._onClickMap}>
                    {this.props.markersGeoLocation.map(marker => (
                        <Marker
                            key={id++}
                            position={{lat: marker.lat, lng: marker.lng}}
                            icon={LOCATION_ICON}
                        />
                    ))}
                    <Marker
                        key={id++}
                        position={{lat: markerSelect.lat, lng: markerSelect.lng}}
                    />
                    {this.props.isPinPointShown && this.props.markersPinPoint.map(marker => (
                        <Marker
                            key={id++}
                            position={{lat: marker.pos.lt, lng: marker.pos.lg}}
                            icon={PINPOINT_ICON}
                            onClick={this._handleClicMarker.bind(this, marker)}
                        >
                            {marker.showInfo && <InfoWindow onCloseClick={this._handleClicMarker.bind(this, marker)}>
                                <div className="divMarker">
                                    {marker.desc}
                                    <br/>
                                    {this._convertDate(marker.date)}
                                </div>
                            </InfoWindow>}
                        </Marker>
                    ))}

                    {this.props.isMarkerShown && this.props.markersMembers.map(marker => (
                        <Marker
                            key={id++}
                            position={{lat: marker.pos.lt, lng: marker.pos.lg}}
                            icon={{
                                url: MEMBER_ICON + marker.firstname.substring(0, 1).toUpperCase() + '.png',
                                scaledSize: new window.google.maps.Size(43, 43)
                            }}
                            onClick={this._handleClicMarker.bind(this, marker)}
                        >
                            {marker.showInfo && <InfoWindow onCloseClick={this._handleClicMarker.bind(this, marker)}>
                                <div className='divMarker'>
                                    {marker.desc}
                                </div>
                            </InfoWindow>}
                        </Marker>
                    ))}
                    {
                        this.props.drawingsToShow.map((drawing, index) => {
                            return <GroundOverlay
                                key={index}
                                url={"data:image/png;base64,"+drawing.img}
                                bounds={new window.google.maps.LatLngBounds(
                                    new window.google.maps.LatLng(parseFloat(drawing.swlt), parseFloat(drawing.swlg)),
                                    new window.google.maps.LatLng(parseFloat(drawing.nelt), parseFloat(drawing.nelg))
                                )}
                                defaultOpacity={1}
                            />
                        })
                    }

                    {this.props.isMarkerShown &&
                        this.props.trackings.map((tracking, index) => {
                            return <Polyline
                                path={tracking.path}
                                geodesic={true}
                                options={{
                                    strokeColor: '#ff2527',
                                    strokeOpacity: 0.0,
                                    strokeWeight: 2
                                }}
                            />
                        })
                    }

                </GoogleMapsWrapper>
            </div>
        )
    }
}

export default Map;