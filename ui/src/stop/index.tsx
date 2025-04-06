import { Icon } from '@iconify/react/dist/iconify.js';
import axios from 'axios';
import _ from 'lodash';
import mapboxgl from 'mapbox-gl';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Trip } from '../types/gtfs';
import { getRoutesBulkApi, getStopApi, getStopTimesApi, getTripsBulkApi } from '../utils/api';
import { MAPBOX_TOKEN } from '../utils/constants.js';

import IconBusStop from '../assets/icon-bus-stop-new.svg';
import BottomTray from '../components/bottom_tray';
import PageBackButton from '../components/page_back_button';
import { afterMapLoad } from '../utils/index.js';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface StopPageProps {
  stopId: string;
}

interface StopPageState {
  stopDetails: any;
  supported: boolean;
  isFavourited: boolean;
}

class StopPage extends React.PureComponent<StopPageProps, StopPageState> {
  private mapContainer: React.RefObject<HTMLDivElement>;
  private map: mapboxgl.Map | null = null;

  constructor(props: StopPageProps) {
    super(props);
    this.state = {
      stopDetails: null,
      supported: mapboxgl.supported(),
      isFavourited: false,
    };
    this.mapContainer = React.createRef();
  }

  initMap = () => {
    if (!this.mapContainer.current) {
      return;
    }
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.57247169985196, 12.977529081680132],
      zoom: 11,
      minZoom: 10,
      maxZoom: 18,
    });
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    this.map = map;
  };

  componentDidMount() {
    this.getStopDetails();
    if (this.state.supported) {
      this.initMap();
      if (this.map) {
        afterMapLoad(this.map, () => {
          this.map?.resize();
        });
      }
    }
  }

  componentWillUnmount() {
    this.map?.remove();
  }

  componentDidUpdate(prevProps: StopPageProps) {
    if (prevProps.stopId !== this.props.stopId) {
      this.getStopDetails();
    }
  }

  getStopDetails = async () => {
    try {
      const { stopId } = this.props;
      const { data: stop } = await getStopApi(stopId);
      const {
        data: { data: stopTimes },
      } = await getStopTimesApi({ stopIds: [stopId] });

      const tripIds = _.compact(_.uniq(_.map(stopTimes, t => t.trip_id)));
      const { data: trips } = await getTripsBulkApi(tripIds);
      const routeIds = _.compact(_.uniq(_.map(trips as any, (t: Trip) => t.route_id)));
      const { data: routes } = await getRoutesBulkApi(routeIds);
      this.setState({
        stopDetails: {
          stop,
          stopTimes,
          trips,
          routes,
        },
      });

      // const favourites = JSON.parse(localStorage.getItem('bpt_favourites') || '[]');
      // this.setState({
      //   stopDetails,
      //   isFavourited: _.some(
      //     favourites,
      //     f => f.type === 'bus_stop' && f.id === stopDetails.stop_id
      //   ),
      // });

      // // Add marker for the stop on the map
      // if (this.map && stopDetails.stop_loc) {
      //   afterMapLoad(this.map, () => {
      //     const sourceEl = document.createElement('div');
      //     sourceEl.className = 'destination-marker';
      //     new mapboxgl.Marker(sourceEl).setLngLat(stopDetails.stop_loc).addTo(this.map!);
      //     this.map?.flyTo({
      //       center: stopDetails.stop_loc,
      //       zoom: 17,
      //     });
      //   });
      // }

      // // Add this bus stop to history
      // const historyItems = JSON.parse(localStorage.getItem('bpt_history') || '[]');
      // const newHistory = _.take(
      //   _.uniqBy(
      //     [
      //       {
      //         id: stopDetails.stop_id,
      //         text: stopDetails.stop_name,
      //         type: SEARCH_RESULT_TYPES.bus_stop,
      //       },
      //       ...historyItems,
      //     ],
      //     s => `${s.type}-${s.id}`
      //   ),
      //   MAX_HISTORY_LENGTH
      // );
      // localStorage.setItem('bpt_history', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error fetching stop details:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
    }
  };

  toggleFavourite = () => {
    const { stopDetails, isFavourited } = this.state;
    if (!stopDetails) return;

    const currentFavourites = JSON.parse(localStorage.getItem('bpt_favourites') || '[]');
    let newFavourites = [];
    if (isFavourited) {
      newFavourites = _.filter(
        currentFavourites,
        f => !(f.type === 'bus_stop' && f.id === stopDetails.stop_id)
      );
      this.setState({
        isFavourited: false,
      });
    } else {
      newFavourites = [
        { id: stopDetails.stop_id, text: stopDetails.stop_name, type: 'bus_stop' },
        ...currentFavourites,
      ];
      this.setState({
        isFavourited: true,
      });
    }
    localStorage.setItem('bpt_favourites', JSON.stringify(newFavourites));
  };

  onContainerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Handle scroll if needed
  };

  render() {
    const { stopDetails, isFavourited } = this.state;

    return (
      <div id="tray-page-wrapper" onScroll={this.onContainerScroll}>
        <div id="map-wrapper">
          <div id="map" ref={this.mapContainer} className="map-container" />
        </div>
        {!!stopDetails && (
          <>
            <PageBackButton />
            <BottomTray
              headerContent={
                <div id="page-heading">
                  <img src={IconBusStop} alt="" id="header-icon" />
                  <p>{stopDetails.stop_name}</p>
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
              {/* <div className="bus-stop-page-list">
                <h3 className="subheading">Buses through this stop</h3>
                {stopDetails.trips?.map(b => <BusStopRouteItem info={b} key={b.route_id} />)}
              </div> */}
            </BottomTray>
          </>
        )}
      </div>
    );
  }
}

const StopPageWithParams: React.FC = () => {
  const { stop_id: stopId } = useParams<{ stop_id: string }>();
  return stopId ? <StopPage stopId={stopId} /> : null;
};

export default StopPageWithParams;
