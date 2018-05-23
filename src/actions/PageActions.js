import { SET_COURSES_LIST, SET_EXCHANGE_ITEMS, SET_FETCH , SET_UPDATE_COURSES_LIST} from '../constants/Page'
import $ from "jquery";

export function setCoursesList(courses_list) {

    return {
        type: SET_COURSES_LIST,
        payload: courses_list
    }

}

export function setExchangeItems(first_course_item, first_course_amount, second_course_item, second_course_amount) {

    return {
        type: SET_EXCHANGE_ITEMS,
        payload: { first_course_item, first_course_amount, second_course_item, second_course_amount }
    }
}


export function getCoursesFromSite() {
    return (dispatch) => {
        dispatch({
            type: SET_FETCH,
            payload: true
        })
        $.get("https://api.coinmarketcap.com/v1/ticker/?limit=0")
        .then((val) => {
            if (val) {
                dispatch({
                    type: SET_COURSES_LIST,
                    payload: val.slice(0, 25).map((item, index) => { item.price_usd=parseFloat(item.price_usd); return item})
                })
                dispatch({
                    type: SET_FETCH,
                    payload: false
                })
            }
        })
        .catch((e)=> {
            console.log(e);
        })
    }
}


export function updateCoursesFromSite(cb) {
    return (dispatch) => {
        dispatch({
            type: SET_FETCH,
            payload: true
        })
        $.get("https://api.coinmarketcap.com/v1/ticker/?limit=0")
        .then((val) => {
            if (val) {
                dispatch({
                    type: SET_UPDATE_COURSES_LIST,
                    payload: val.slice(0, 25).map((item, index) => { item.price_usd=parseFloat(item.price_usd); return item})
                })
                dispatch({
                    type: SET_FETCH,
                    payload: false
                })
                cb();
            }
        })
        .catch((e)=> {
            console.log(e);
        })
    }
}
