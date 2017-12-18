import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {LOGIN_REQUEST} from "../actions/opLogin";
import {CHANGE_MAP_CENTER, CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";

export function* MapFlow() {
}