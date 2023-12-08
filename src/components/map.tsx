import { Vendors } from "@/api/types";
import { Status, Wrapper } from "@googlemaps/react-wrapper";
import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
import mapStyle from "./styles";
import { Vendor } from "@/api/types";
import {cloneDeep } from 'lodash'
import mapboxgl from "mapbox-gl";
import ReactMapGl from 'react-map-gl';
import {Map,MapProvider} from 'react-map-gl';
import type {MapRef} from 'react-map-gl';
const deepCompareVendorTweets = (a: Vendor[] | undefined, b: Vendor[] | undefined) => {
    if (a && b && a.length === b.length) {
        return a.every((vendor: Vendor, i: number) => {
            return vendor.tweets.length === b[i].tweets.length;
        })
    }
    return false;
}

 const useDeepCompareVendorTweets = (vendors: Vendor[] | undefined) => {
    const ref = React.useRef<Vendor[] | undefined>();
    if (!deepCompareVendorTweets(vendors, ref.current)) {
        ref.current = cloneDeep(vendors);
    }
    return ref.current;
}

const MapContainer = styled.div`
    height: 100%;
    width: 100%;
`;


interface MapProps    //mapboxgl.MapboxOptions {
{
   // style?: {[key: string]: string};
    vendors: Vendors;
    
    markers: {[key: string]: mapboxgl.Marker}
    setMarkers: React.Dispatch<React.SetStateAction<{[key: string]: mapboxgl.Marker}>>
}


const MapComponent: React.FC<MapProps> = ({
   // style,
    vendors,
    markers,
    setMarkers,
    ...options
}) => {
    const reassignedMarkersMap = useRef(false);
    const ref = useRef<MapRef>(null);
    const [map, setMap] = useState<mapboxgl.Map>();

    useEffect(() => {

        if (ref.current && !map) {

            
            setMap(ref.current.getMap());
            console.log("map has been set");
        }
    }, [ref, map])

    useEffect(() => {
        if (map) {
            if (!reassignedMarkersMap.current && Object.keys(markers).length) {
                Object.values(markers).forEach(marker => {

                    console.log("adding to map");
                    marker.addTo(map);
                })
                reassignedMarkersMap.current = true;
            }

            vendors.Items.forEach(vendor => {
                console.log(vendor.name);
                if (vendor.tweets.length) {
                    const newLat = vendor.tweets[vendor.tweets.length -1].geo.coordinates.lat;
                    const newLong = vendor.tweets[vendor.tweets.length - 1].geo.coordinates.long;
                  console.log(newLat+":"+newLong+":"+vendor.name);
                    if(markers[vendor.twitterId]) {
                        // Update an existing marker  
                        if (
                            markers[vendor.twitterId]?.getLngLat()?.lat !== newLat &&
                            markers[vendor.twitterId]?.getLngLat()?.lng !== newLong
                        ) {
                            markers[vendor.twitterId].setLngLat ({
                                lat: newLat,
                                lng: newLong
                            });
                        }
                    } else {
                        // Create a new marker if no marker exists

                        //
                       // const marker = new google.maps.Marker({
                         //   position: {lat: newLat, lng: newLong},
                          //  title: vendor.twitterId,
                           // map,
//                        })
    
console.log("adding marker to map");
                        const marker =   new mapboxgl.Marker()
  .setLngLat([newLat, newLong])
  .addTo(map);
  const popup = new mapboxgl.Popup({
    offset: 25, // Offset the popup from the marker
  });
  popup.setLngLat([newLat,newLong]).setHTML(`<h1>${vendor.twitterId}</h1>`).addTo(map);
  marker.setPopup(popup);



                        setMarkers((prev) => {
                            return {
                                ...prev,
                                [vendor.twitterId]: marker
                            }
                        })
                    }

                }
            })
        }
    }, [map, useDeepCompareVendorTweets(vendors.Items)])

    const onMapLoad = useCallback(() => {
        console.log("map loaded")
        if(ref.current)
        {
        console.log("setting map")
            setMap(ref.current.getMap());
        }
    if(ref.current)
        ref.current.on('move', () => {
          // do something
          console.log("moved");
        });
      }, []);


    return (
        <Map
        ref={ref}
        onLoad={onMapLoad}
        mapboxAccessToken= {process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_TOKEN}
     //   initialViewState={{
       //     latitude: 38.9072,
         //   longitude: -77.036,
         // zoom: 13
       // }}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      />
    )
}


interface MapWrapperProps {
    vendors: Vendors;
    markers: {[key: string]:mapboxgl.Marker}
    setMarkers: React.Dispatch<React.SetStateAction<{[key: string]: mapboxgl.Marker}>>
}

export default function MapWrapper({ vendors, markers, setMarkers}: MapWrapperProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''


    
    const [viewport, setViewport] = useState({
        
            latitude: 38.9072,
            longitude: -77.036,
         zoom: 13
      });
    
      console.log(process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_TOKEN);
      return (
        <MapComponent
          setMarkers={setMarkers}
          markers={markers}
          vendors={vendors}
         
        /> )
   /*
    return (
        <Wrapper apiKey={apiKey} render={(status: Status) => {
            switch (status) {
                case Status.LOADING:
                    return <p>loading</p>;
                case Status.FAILURE:
                    return <p>failed</p>;
                case Status.SUCCESS:
                    return (
                        <MapContainer>
                            <Map 
                                styles={mapStyle}
                                style={{ height: '100%'}}
                                zoom={13}
                                center={{
                                    lat: 38.9072,
                                    lng: -77.036
                                }}
                                disableDefaultUI
                                vendors={vendors}
                                markers={markers}
                                setMarkers={setMarkers}
                            />
                        </MapContainer>
                    )
            }
        }}/>
    )
    */
}