import _ from 'lodash';
import mapboxgl from 'mapbox-gl';
import React from 'react';
import { useParams } from 'react-router-dom';
import { MAPBOX_TOKEN, SEARCH_RESULT_TYPES } from '../utils/constants.js';
import { afterMapLoad } from '../utils/index.js';

import IconBusNumber from '../assets/icon_bus_number.svg';

import { Icon } from '@iconify/react/dist/iconify.js';
import IconBusStop from '../assets/icon-bus-stop-new.svg';
import IconGreenCircle from '../assets/icon_green_circle.svg';
import IconLocation from '../assets/icon_location.svg';
import BottomTray from '../components/bottom_tray.js';
import PageBackButton from '../components/page_back_button.js';
import {
  getRouteApi,
  getShapesBulkApi,
  getStopTimesApi,
  getStopsBulkApi,
  getTripsApi,
} from '../utils/api.js';

mapboxgl.accessToken = MAPBOX_TOKEN;

const STOP_TYPES = {
  source: 'source',
  stop: 'stop',
  destination: 'destination',
};

const ICON_FOR_STOP_TYPE = {
  [STOP_TYPES.source]: IconGreenCircle,
  [STOP_TYPES.destination]: IconLocation,
  [STOP_TYPES.stop]: IconBusStop,
};

interface RoutePageProps {
  routeId: string;
}

interface RoutePageState {
  details: any;
  tripIndex: number;
  supported: boolean;
  isFavourited: boolean;
}

class RoutePage extends React.PureComponent<RoutePageProps, RoutePageState> {
  private mapContainer: React.RefObject<HTMLDivElement>;
  private map: mapboxgl.Map | null = null;

  constructor(props: RoutePageProps) {
    super(props);
    this.state = {
      details: null,
      // lat: 12.977529081680132,
      // lng: 77.57247169985196,
      // zoom: 11,
      tripIndex: 0,
      supported: mapboxgl.supported(),
      isFavourited: false,
    };
    this.mapContainer = React.createRef();
  }

  initMap = () => {
    if (!this.mapContainer.current) {
      return;
    }
    // const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.57247169985196, 12.977529081680132],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
    });
    map.resize();
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    // map.on("move", () => {
    //   this.setState({
    //     lng: map.getCenter().lng.toFixed(4),
    //     lat: map.getCenter().lat.toFixed(4),
    //     zoom: map.getZoom().toFixed(2),
    //   });
    // });
    this.map = map;
  };

  componentDidMount() {
    this.getRouteDetails();
    if (this.state.supported) {
      this.initMap();
      if (this.map) {
        afterMapLoad(this.map, () => {
          this.map?.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [],
              },
            },
          });
          this.map?.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#4264fb',
              'line-width': 6,
            },
          });
        });
      }
    }
  }

  componentWillUnmount() {
    this.map?.remove();
  }

  componentDidUpdate(prevProps: RoutePageProps) {
    if (prevProps.routeId !== this.props.routeId) {
      this.getRouteDetails();
    }
  }

  getRouteDetails = async () => {
    const { routeId } = this.props;

    const { data: route } = await getRouteApi(routeId);
    const {
      data: { data: trips },
    } = await getTripsApi(routeId);

    // Get all the data required in this page
    const shapeIds = _.compact(_.uniq(_.map(trips, t => t.shape_id as string)));
    const tripIds = _.compact(_.uniq(_.map(trips, t => t.trip_id as string)));
    const { data: shapes } = await getShapesBulkApi(shapeIds);
    const shapeMap = _.groupBy(shapes, 'shape_id');
    console.log(tripIds);
    const {
      data: { data: stopTimes },
    } = await getStopTimesApi({ tripIds });
    const stopTimesMap = _.groupBy(stopTimes, 'trip_id');
    const stopIds = _.compact(_.uniq(_.map(stopTimes, t => t.stop_id as string)));
    const { data: stops } = await getStopsBulkApi(stopIds);
    this.setState({
      details: {
        route,
        trips,
        stopTimes,
        stops,
        shapes,
        stopTimesMap,
        shapeMap,
      },
    });

    // const { data: { data: routeDetails }} = await getRouteDetailsApi(routeId);
    // const favourites = JSON.parse(localStorage.getItem("bpt_favourites") || "[]");
    // this.setState({
    //   routeDetails,
    //   isFavourited: _.some(favourites, f => f.type === 'bus_number' && f.id === routeDetails.route_id),
    // });

    // const tripWithTheMostStops = _.maxBy(routeDetails?.route_trips, t => t.timings.length);
    // const mapPadding = window.innerWidth > 768 ? ({ left: 50, right: 50, top: 50, bottom: 50 }) : ({ left: 30, right: 30, top: 30, bottom: 60 });

    // // Update route line data
    // const coordinates = _.find(routeDetails.shapeInformation, { shape_id: tripWithTheMostStops.shape_id })?.line;
    // afterMapLoad(this.map, () => {
    //   this.map.resize();
    //   this.map.getSource('route').setData({
    //       'type': 'Feature',
    //       'properties': {},
    //       'geometry': {
    //           'type': 'LineString',
    //           'coordinates': coordinates
    //       }
    //   });

    //   // Set map boundaries to the line
    //   const bounds = new mapboxgl.LngLatBounds(coordinates[0],coordinates[0]);
    //   for (const coord of coordinates) { bounds.extend(coord); }
    //   this.map.fitBounds(bounds, { padding: mapPadding});

    //   // Add start and end markers
    //   const sourceDetails = _.find(
    //     routeDetails.stopInformation,
    //     {
    //        stop_id: _.first(tripWithTheMostStops.timings).stop_id
    //     }
    //   );
    //   const sourceEl = document.createElement('div');
    //   sourceEl.className = 'source-marker';
    //   new mapboxgl.Marker(sourceEl).setLngLat(sourceDetails.stop_loc).addTo(this.map);

    //   const destinationDetails = _.find(
    //     routeDetails.stopInformation,
    //     {
    //        stop_id: _.last(tripWithTheMostStops.timings).stop_id
    //     }
    //   );
    //   const destinationEl = document.createElement('div');
    //   destinationEl.className = 'destination-marker';
    //   new mapboxgl.Marker(destinationEl).setLngLat(destinationDetails.stop_loc).addTo(this.map);
    // });

    // // Add this bus route to history
    // const historyItems = JSON.parse(localStorage.getItem("bpt_history") || "[]");
    // const newHistory = _.take(
    //   _.uniqBy(
    //       [
    //           { id: routeDetails.route_id, text: routeDetails.route_short_name, type: "bus_number" },
    //           ...historyItems
    //       ],
    //       s => `${s.type}-${s.id}`,
    //   ),
    //   MAX_HISTORY_LENGTH,
    // );
    // localStorage.setItem("bpt_history", JSON.stringify(newHistory));
  };

  toggleFavourite = () => {
    const { details, isFavourited } = this.state;
    const currentFavourites = JSON.parse(localStorage.getItem('bpt_favourites') || '[]');
    let newFavourites = [];
    if (isFavourited) {
      newFavourites = _.filter(
        currentFavourites,
        f => !(f.type === 'bus_number' && f.id === details.route.route_id)
      );
      this.setState({
        isFavourited: false,
      });
    } else {
      newFavourites = [
        {
          id: details.route.route_id,
          text: details.route.route_short_name,
          type: SEARCH_RESULT_TYPES.bus_number,
        },
        ...currentFavourites,
      ];
      this.setState({
        isFavourited: true,
      });
    }
    localStorage.setItem('bpt_favourites', JSON.stringify(newFavourites));
  };

  onContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // TODO;
    // const windowHeight = window.innerHeight;
    // const topHeight = windowHeight * 0.8 - 30;
    // const containerScrollTop = e.target.scrollTop;
    // const gapAtTop = topHeight - containerScrollTop;
    // if(gapAtTop < 0.2 * windowHeight) {
    //   e.target.animate({
    //     scrollTop: topHeight,
    //   });
    // }
  };

  render() {
    const { details, isFavourited } = this.state;
    // const tripWithTheMostStops = _.maxBy(routeDetails?.route_trips, t => t.timings.length);
    // let sourceDetails, destinationDetails;
    // if (tripWithTheMostStops) {
    //   sourceDetails = _.find(routeDetails.stopInformation, {
    //     stop_id: _.first(tripWithTheMostStops.timings).stop_id,
    //   });
    //   destinationDetails = _.find(routeDetails.stopInformation, {
    //     stop_id: _.last(tripWithTheMostStops.timings).stop_id,
    //   });
    // }

    return (
      <div id="tray-page-wrapper" onScroll={this.onContainerScroll}>
        <div id="map-wrapper">
          <div id="map" ref={this.mapContainer} className="map-container" />
        </div>
        {!!details && (
          <>
            <PageBackButton />
            <BottomTray
              headerContent={
                <div id="page-heading">
                  <img src={IconBusNumber} alt="" id="header-icon" />
                  <p>
                    <span className="bus_number">{details.route.route_short_name}</span>
                  </p>
                  <div className="flex-gap" />
                  <button className="search-result-favourite" onClick={this.toggleFavourite}>
                    {isFavourited ? (
                      <Icon icon="tabler:star-filled" color="#FFD027" width="16" height="16" />
                    ) : (
                      <Icon icon="tabler:star" color="#999999" width="16" height="16" />
                    )}
                  </button>
                </div>
              }
            >
              asdf
              {/* <div id="bus-route-page">
                <div id="bus-route-fromto">
                  <div>
                    <div className="bus-stop-item-row">
                      <div className="bus-stop-item-fromto">From </div>
                      {sourceDetails?.stop_name}
                    </div>
                    <div className="bus-stop-item-row">
                      <div className="bus-stop-item-fromto">To </div>
                      {destinationDetails?.stop_name}
                    </div>
                  </div>
                </div>

                <div id="bus-routes-stops-heading">
                  <h4>Stops on route</h4>
                </div>
                <div id="bus-route-stops-list">
                  {_.map(tripWithTheMostStops.timings, (s, index) => {
                    const stopDetails = _.find(routeDetails.stopInformation, {
                      stop_id: s.stop_id,
                    });
                    let stopType = STOP_TYPES.stop;
                    if (index === 0) {
                      stopType = STOP_TYPES.source;
                    } else if (index === _.size(tripWithTheMostStops.timings) - 1) {
                      stopType = STOP_TYPES.destination;
                    }
                    return (
                      <div key={s.stop_id} className="bus-route-stop-item">
                        <img
                          src={ICON_FOR_STOP_TYPE[stopType]}
                          alt=""
                          className="bus-route-stop-icon"
                        />
                        <Link
                          state={{ from: ROUTES.route }}
                          to={`/stop/${s.stop_id}`}
                          className="bus-route-stop-text"
                        >
                          {stopDetails.stop_name}
                        </Link>
                        <span className="bus-route-stop-time">
                          
                        </span>
                      </div>
                    );
                  })}
                  <div id="bus-route-stops-line" />
                </div>
              </div> */}
            </BottomTray>
          </>
        )}
      </div>
    );
  }
}

const RoutePageWithParams = () => {
  const { route_id: routeId } = useParams<{ route_id: string }>();
  if (!routeId) return null;
  return <RoutePage routeId={routeId} />;
};

export default RoutePageWithParams;
