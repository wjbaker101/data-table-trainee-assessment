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

const getTableRow = (rowData) =>
{
    const [date, channel] = rowData;
    
    return `
        <tr>
            <td>${formatDate(date)}</td>
            <td>${channel.bbcone}</td>
            <td>${channel.bbctwo}</td>
            <td>${channel.bbcthree}</td>
            <td>${channel.bbcnews24}</td>
            <td>${channel.cbbc}</td>
            <td>${channel.cbeebies}</td>
        </tr>
    `;
};

const getTableHTML = (data) =>
{
    let html = '';
    
    Object.entries(data).forEach((rowData) =>
    {
        html += getTableRow(rowData);
    });
    
    return html;
};

const displayTable = (data) =>
{
    document.querySelector('.data-table').innerHTML = getTableHTML(data);
};

const init = () =>
{
    $.getJSON('data.json', displayTable);
};

window.addEventListener('load', init);