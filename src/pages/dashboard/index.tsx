import { useState } from "react";
import Logo from "../../assets/logo"
import NavigationOption from "../../modules/dashboard/NavigationOption"
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { faUser, faBellConcierge, faObjectGroup, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Menu from '../../modules/menu/Menu';
import Combos from "../../modules/combos/Combos";
import Users from "../../modules/users/Users";
import dynamic from "next/dynamic";

const DashboardPage = dynamic(() => import("../../modules/dashboard/Dashboard"), {
    ssr: false,
})

export default DashboardPage

