import React from "react";
import mapboxgl from "mapbox-gl";
import _ from "lodash";
import {MAPBOX_TOKEN, MAX_HISTORY_LENGTH, ROUTES} from "../utils/constants.js";

import { Icon } from "@iconify/react/dist/iconify.js";
import Sidebar from "./sidebar";
import { Link } from "react-router-dom";
import SearchResultItem from "../search/search_result_item";

mapboxgl.accessToken = MAPBOX_TOKEN;

class LandingPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      historyItems: _.take(JSON.parse(localStorage.getItem("bpt_history") || "[]"), 3),
      favourites: JSON.parse(localStorage.getItem("bpt_favourites") || "[]"),
    };
  }
  
  onFavouriteClick = (e, info) => {
    e.stopPropagation();
    e.preventDefault();

    const { favourites } = this.state;
    const { id, text, type } = info;
    let newFavourites =[];
    if(_.some(favourites, f => f.id === id && f.type === type)) {
        newFavourites = _.filter(favourites, f => !(f.id === id && f.type === type));
    } else {
        newFavourites = [
            { id, text, type },
            ...favourites
        ];
    }
    this.setState({
      favourites: newFavourites
    });
    localStorage.setItem("bpt_favourites", JSON.stringify(newFavourites));
  }

  render() {
    const { historyItems, favourites } = this.state;
    return (
      <div id="landing-contents">
        <Sidebar />
          <Link id="landing-input" to={ROUTES.search}>
            <Icon icon="iconamoon:search-bold" color="#FFFFFF" width="16" height="16" />
            Search for a bus route or bus stop
          </Link>
          {
            _.size(historyItems) > 0 && (
              <div className="landing-section">
                <h3 className="subheading">Recent</h3>
                {
                  historyItems.map(i => {
                      const isFavourite = _.some(favourites, f => f.id === i.id && f.type === i.type);
                      return (
                          <SearchResultItem
                              key={`${i.id}-${i.text}`}
                              info={i}
                              isFavourite={isFavourite}
                              onFavouriteClick={this.onFavouriteClick}
                          />
                      );
                  })
                }
              </div>
            )
          }
          {
            _.size(favourites) > 0 && (
              <div className="landing-section">
                <h3 className="subheading">Favourites</h3>
                {
                  favourites.map(i => (
                    <SearchResultItem
                      isFavourite
                      key={`${i.id}-${i.text}`}
                      info={i}
                      onFavouriteClick={this.onFavouriteClick}
                    />
                  ))
                }
              </div>
            )
          }
        </div>
    );
  }
}

export default LandingPage;
