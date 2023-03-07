import React from "react";
import { Link } from "react-router-dom";
import "./css/navbar.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGear, faRepeat, faHouse } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faGear, faRepeat, faHouse);

function AppNavbar() {
    const navigation_items_elms = document.querySelectorAll(
        ".navigation-bar .list-items .item"
      );
    const navigation_pointer = document.querySelector(".navigation-bar .pointer");
      
    navigation_items_elms.forEach((item, index) => {
        item.addEventListener("click", (e) => {
          //e.preventDefault();
          navigation_items_elms.forEach((itm) => itm.classList.remove("active"));
          item.classList.add("active");
      
          const parentWidth = item.parentElement.clientWidth;
          const lefPercent = (parentWidth / navigation_items_elms.length) * index;
          navigation_pointer.style.left = lefPercent + "px";
        });
    });
    

  return (
    <nav class="navigation-bar">
        <ul class="list-items">
            <span class="pointer"></span>
            <li class="item active">
                <Link class="link" to="/">
                    <FontAwesomeIcon icon="house" size="xl" />
                </Link>
            </li>
            <li class="item">
                <Link class="link" to="/automations">
                    <FontAwesomeIcon icon="repeat" size="xl" />
                </Link>
            </li>
            <li class="item">
                <Link class="link" to="/account">
                    <FontAwesomeIcon icon="user" size="xl" />
                </Link>
            </li>
            <li class="item">
                <Link class="link" to="/settings">
                    <FontAwesomeIcon icon="gear" size="xl" />
                </Link>
            </li>
        </ul>
    </nav>
  );
}
export default AppNavbar;

