import React from "react";
import { Link, useLocation } from "react-router-dom";
import {Icon} from "@iconify/react/dist/iconify.js";
import { ROUTES } from "../utils/constants";

const PageBackButton = () => {
    const location = useLocation();
    const onBackClick = () => {
        if(!!location.state) {
            window.history.back();
        }
    };

    return (
        <Link id="page-back" to={!!location.state ? "" : ROUTES.home} onClick={onBackClick}>
            <Icon icon="mdi:arrow-back" color="#222222" width="24" height="24" />
        </Link>
    );
};

export default PageBackButton;
