import React, { useState } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

import SearchResultItem from "./search_result_item";
import { API_CALL_STATUSES, MAX_HISTORY_LENGTH, ROUTES, SearchResultType } from "../utils/constants";
import { CircleLoaderBlock } from "../components/circle_loader";

interface SearchResult {
  id: string;
  text: string;
  type: SearchResultType;
}

interface SearchResultsProps {
  apiStatus: typeof API_CALL_STATUSES[keyof typeof API_CALL_STATUSES];
  searchText: string;
  searchResults: SearchResult[];
}

interface LinkState {
  from: string;
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ apiStatus, searchText, searchResults }) => {
  const [historyItems] = useState<SearchResult[]>(
    JSON.parse(localStorage.getItem("bpt_history") || "[]")
  );
  const [favourites, setFavouritesItems] = useState<SearchResult[]>(
    JSON.parse(localStorage.getItem("bpt_favourites") || "[]")
  );

  const onFavouriteClick = (e: React.MouseEvent, info: SearchResult) => {
    e.stopPropagation();
    e.preventDefault();

    const { id, text, type } = info;
    let newFavourites: SearchResult[] = [];
    if (_.some(favourites, f => f.id === id && f.type === type)) {
      newFavourites = _.filter(favourites, f => !(f.id === id && f.type === type));
    } else {
      newFavourites = [
        { id, text, type },
        ...favourites
      ];
    }
    setFavouritesItems(newFavourites);
    localStorage.setItem("bpt_favourites", JSON.stringify(newFavourites));
  }

  if (apiStatus === API_CALL_STATUSES.PROGRESS) {
    return (
      <CircleLoaderBlock />
    );
  }

  if (!searchText && _.size(historyItems) > 0) {
    return (
      <div id="search-results">
        <h3 className="subheading">Recent</h3>
        {
          historyItems.map(i => {
            const isFavourite = _.some(favourites, f => f.id === i.id && f.type === i.type);
            return (
              <SearchResultItem
                key={`${i.id}-${i.text}`}
                info={i}
                linkState={{ from: ROUTES.search, query: searchText }}
                isFavourite={isFavourite}
                onFavouriteClick={onFavouriteClick}
              />
            );
          })
        }
      </div>
    );
  }

  if (!searchText) {
    return null;
  }

  if (_.size(searchResults) === 0) {
    return <div>No results found</div>;
  }

  return (
    <div id="search-results">
      {
        searchResults.map(i => (
          <SearchResultItem
            key={`${i.id}-${i.text}`}
            info={i}
            linkState={{ from: ROUTES.search, query: searchText }}
            onFavouriteClick={onFavouriteClick}
          />
        ))
      }
    </div>
  )
};

export default SearchResults; 