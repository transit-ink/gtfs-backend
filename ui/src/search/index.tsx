import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { API_CALL_STATUSES, ROUTES, SEARCH_RESULT_TYPES } from "../utils/constants";
import { Link } from "react-router-dom";
import { getSearchResultsApi } from "../utils/api";
import { deleteUrlParameter, getUrlParameter, setUrlParameter, useDebouncedValue } from "../utils";
import SearchResults from "./search_results";

interface SearchResult {
  type: typeof SEARCH_RESULT_TYPES[keyof typeof SEARCH_RESULT_TYPES];
  text: string;
  id: string;
}

interface ApiSearchResult {
  type: string;
  name: string;
  id: string;
}

const SearchPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>(getUrlParameter("q") || "");
  const [apiStatus, setApiStatus] = useState<typeof API_CALL_STATUSES[keyof typeof API_CALL_STATUSES]>(API_CALL_STATUSES.INITIAL);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const debouncedSearchText = useDebouncedValue(searchText, 500);

  useEffect(() => {
    if (!searchText) {
      setSearchResults([]);
      return;
    }
    const apiCall = async () => {
      try {
        const results = await getSearchResultsApi(searchText);
        const mappedResults: SearchResult[] = results.data.data.map((r: ApiSearchResult) => ({
          type: r.type === "route" ? SEARCH_RESULT_TYPES.bus_number : SEARCH_RESULT_TYPES.bus_stop,
          text: r.name,
          id: r.id,
        }));
        setSearchResults(mappedResults);
        setApiStatus(API_CALL_STATUSES.SUCCESS);
      } catch (error) {
        setApiStatus(API_CALL_STATUSES.ERROR);
        setSearchResults([]);
      }
    }
    apiCall();
  }, [debouncedSearchText]);

  useEffect(() => {
    if (searchText) {
      const newParams = setUrlParameter("q", searchText);
      setApiStatus(API_CALL_STATUSES.PROGRESS);
      history.replaceState("", "", `?${newParams.toString()}`);
    } else {
      const newParams = deleteUrlParameter("q");
      setApiStatus(API_CALL_STATUSES.INITIAL);
      history.replaceState("", "", window.location.href.split("?")[0]);
    }
  }, [searchText]);

  return (
    <>
      <div id="page-header">
        <Link id="header-back" to={ROUTES.home}>
          <Icon icon="mdi:arrow-back" color="#FFFFFF" width="24" height="24" />
        </Link>
        <input
          id="search-input"
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
          placeholder="Search for a bus, or bus stop"
        />
      </div>
      <SearchResults
        apiStatus={apiStatus}
        searchText={searchText}
        searchResults={searchResults}
      />
    </>
  );
};

export default SearchPage; 