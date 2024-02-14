export const getMonday = today => {
    var todayDay = today.day()
    var monday = today;
    monday.set('date', today.get('date') - ((todayDay - 1 % 7) % 7))
    return monday;
}

export const getSaturday = today => {
    var todayDay = today.day();
    var saturday = today;
    saturday.set('date', today.get('date') + (6 - todayDay));
    return saturday;
}
