const getMonth = (index) =>
{
    const months =
    [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    
    if (index < 1) throw new Error('Month cannot be less than 1');
    
    if (index > 12) throw new Error('Month cannot be more than 12');
    
    return months[index - 1];
};

const formatDate = (date) =>
{
    const [month, year] = date.split('-');
    
    return `${getMonth(year)} ${month}`;
};