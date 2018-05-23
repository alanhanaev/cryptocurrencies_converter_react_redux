import { SET_COURSES_LIST, SET_EXCHANGE_ITEMS, SET_FETCH, SET_UPDATE_COURSES_LIST } from '../constants/Page'

const initialState = {
    courses_list: [
        {
            id: "",
            name: "",
            price_usd: 1
        },
        {
            id: "",
            name: "",
            price_usd: 1
        }
    ],
    first_course_item: {
        id: "",
        name: "",
        price_usd: 0
    },
    second_course_item: {
        id: "",
        name: "",
        price_usd: 0
    },
    first_course_amount: 1,
    second_course_amount: 1,
    fetch: true
}

function get_updated_course_by_id(id, courses_list) {
    for (var i = 0; i < courses_list.length; i++) {
        if (courses_list[i].id === id)
            return courses_list[i]
    }
    return {
        id: "",
        name: "",
        price_usd: 0
    }
}

export default function courses(state = initialState, action) {
    switch (action.type) {
        case SET_EXCHANGE_ITEMS:
            return {
                ...state,
                first_course_item: action.payload.first_course_item,
                first_course_amount: action.payload.first_course_amount,
                second_course_item: action.payload.second_course_item,
                second_course_amount: action.payload.second_course_amount
            }
        case SET_COURSES_LIST:
            return {
                ...state,
                courses_list: action.payload,
                first_course_item: state.first_course_item.id !== "" ? state.first_course_item : (action.payload.length > 0 ? action.payload[0] : state.first_course_item),
                second_course_item: state.second_course_item.id !== "" ? state.second_course_item : (action.payload.length > 0 ? action.payload[0] : state.second_course_item)
            }
        case SET_UPDATE_COURSES_LIST: 
            return {
                ...state,
                courses_list: action.payload,
                first_course_item: get_updated_course_by_id(state.first_course_item.id, action.payload),
                second_course_item: get_updated_course_by_id(state.second_course_item.id, action.payload)
            }
        case SET_FETCH:
            return {
                ...state,
                fetch: action.payload
            }
        default:
            return state
    }

}