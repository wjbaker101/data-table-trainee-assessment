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

const getMonth = (index) =>
{
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

const dataGraph = (() =>
{
    const graph = document.querySelector('.graph-canvas');
    const graphics = graph.getContext('2d');
    
    const axisOffset = 40;
    
    const graphMin = 400;
    const graphMax = 1500;
    
    const drawLine = (x1, y1, x2, y2) =>
    {
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.stroke();
    };
    
    const drawAxes = () =>
    {
        graphics.strokeStyle = '#222';

        drawAxisY();
        
        drawAxisX();
    };
    
    const drawAxisX = () =>
    {
        drawLine(axisOffset, graph.height - axisOffset, graph.width - axisOffset, graph.height - axisOffset);
        
        const width = (graph.width - axisOffset) - axisOffset;
        
        for (let i = 0; i < months.length; ++i)
        {
            graphics.fillText(months[i].substr(0, 3), axisOffset + (width / 12 * i), graph.height - axisOffset + 15);
        }
    };
    
    const drawAxisY = () =>
    {
        drawLine(axisOffset, axisOffset, axisOffset, graph.height - axisOffset);
        
        const height = (graph.height - axisOffset) - axisOffset;
        
        const intervals = 20;
        
        const step = (graphMax - graphMin) / 20;
        const stepSize = height / intervals;
        
        for (let i = 0; i < intervals + 1; ++i)
        {
            graphics.fillText(graphMax - (step * i), 20 - 15, axisOffset + (height / stepSize * i));
        }
    };
    
    const drawGraph = () =>
    {
        drawAxes();
    };
    
    return { draw: drawGraph }
})();

window.addEventListener('load', dataGraph.draw);