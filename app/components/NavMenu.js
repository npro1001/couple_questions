"use client"

import React, { useState } from 'react';
import FontAwesomeIcon from '../fontawesome';
import { faHouse, faGear } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';


export default function NavMenu() {
  return (
      <ul className="flex-shrink-0 menu menu-sm menu-horizontal bg-base-100 rounded-box">
        <li>
          <a className="tooltip" data-tip="Home">
            <FontAwesomeIcon icon={faHouse} className="fas fa-house" />
          </a>
        </li>
        <li>
          <a className="tooltip" data-tip="Details">
            <FontAwesomeIcon icon={faGear} className="fas fa-gear" />
          </a>
        </li>
        <li>
          <a className="tooltip" data-tip="Stats">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </a>
        </li>
      </ul>
  )
}