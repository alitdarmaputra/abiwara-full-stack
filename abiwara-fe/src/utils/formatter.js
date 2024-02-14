import moment from "moment";
import 'moment/locale/id';

export function numToIDR(strNum) {
    strNum = strNum.replace("Rp. ", "");
    strNum = strNum.replace(/\./g, "");

    if (isNaN(strNum))
        return "Rp. 0";

    return "Rp. " + new Intl.NumberFormat("id-ID").format(strNum);
}

export function IDRToNum(idrNum) {
    idrNum = idrNum.replace("Rp. ", "");
    idrNum = idrNum.replace(/\./g, "");
    return parseInt(idrNum, 10);
}

export function formatDateTime(datetime) {
    moment.locale("id")
    return moment(datetime).format("LLLL")
}

export function formatDate(datetime) {
    moment.locale("id");
    return moment(datetime).format("LL");
}
