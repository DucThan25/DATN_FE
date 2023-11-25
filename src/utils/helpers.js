import moment from 'moment'
import {VALIDATE_EMAIL_REGEX} from "./constants";

export const postingTime = (date) => {
    return moment(date).lang('vi').fromNow();
}

export const dateFormat = (date) => {
    return moment(date).format("DD/MM/YYYY");
}

export const isValidEmail = (email) => {
    let result =  false
    if (email && typeof email === 'string') {
        const regex = RegExp(VALIDATE_EMAIL_REGEX);
        result = regex.test(email.trim())
    }
    return result
}