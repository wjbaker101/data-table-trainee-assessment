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
    
    const intervals = 20;
    
    const channelColours =
    [
        '#ea2923',
        '#005761',
        '#d41c6f',
        '#900',
        '#9fe600',
        '#2cade6',
    ];
    
    const drawLine = (x1, y1, x2, y2) =>
    {
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.stroke();
    };
    
    const drawCircle = (x, y, radius) =>
    {
        graphics.beginPath();
        graphics.arc(x, y, radius, 0, 2 * Math.PI);
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
        
        const step = (graphMax - graphMin) / intervals;
        const stepSize = height / intervals;
        
        for (let i = 0; i < intervals + 1; ++i)
        {
            graphics.fillText(graphMax - (step * i), 20 - 15, axisOffset + (stepSize * i));
        }
    };
    
    const getChannelValues = (data) =>
    {
        const channels =
        {
            bbcone: [],
            bbctwo: [],
            bbcthree: [],
            bbcnews24: [],
            cbbc: [],
            cbeebies: [],
        };
        
        Object.entries(data).forEach(([date, channel]) =>
        {
            channels.bbcone.push(channel.bbcone);
            channels.bbctwo.push(channel.bbctwo);
            channels.bbcthree.push(channel.bbcthree);
            channels.bbcnews24.push(channel.bbcnews24);
            channels.cbbc.push(channel.cbbc);
            channels.cbeebies.push(channel.cbeebies);
        });
        
        return channels;
    };
    
    const translatePoint = (index, value) =>
    {
        const width = (graph.width - axisOffset) - axisOffset;
        const height = (graph.height - axisOffset) - axisOffset;
        
        const valueRatio = (value - graphMin) / (graphMax - graphMin);
        
        const point =
        {
            x: axisOffset + (width / 12 * index),
            y: graph.height - axisOffset - (height * valueRatio),
        };
        
        return point;
    };
    
    const drawChannelValues = (data) =>
    {
        const channels = getChannelValues(data);
        
        Object.entries(channels).forEach(([channel, values], index) =>
        {
            const initialPoint = translatePoint(0, values[0]);
            
            graphics.strokeStyle = channelColours[index];
            
            graphics.beginPath();
            graphics.moveTo(initialPoint.x, initialPoint.y);
            
            for (let i = 0; i < values.length; ++i)
            {
                const point = translatePoint(i, values[i]);
                
                graphics.lineTo(point.x, point.y);
            }
            
            graphics.stroke();
            
            for (let i = 0; i < values.length; ++i)
            {
                const point = translatePoint(i, values[i]);

                drawCircle(point.x, point.y, 2);
            }
        });
    };
    
    const drawGraph = () =>
    {
        $.getJSON('data.json', drawChannelValues);
        
        drawAxes();
    };
    
    return { draw: drawGraph }
})();

window.addEventListener('load', dataGraph.draw);

const initButtons = () =>
{
    const showTableButton = document.querySelector('.show-table-button');
    const showGraphButton = document.querySelector('.show-graph-button');
    
    showTableButton.addEventListener('click', () =>
    {
        document.querySelector('.table-container').classList.remove('hidden');
        document.querySelector('.graph-container').classList.add('hidden');
    });
    
    showGraphButton.addEventListener('click', () =>
    {
        document.querySelector('.table-container').classList.add('hidden');
        document.querySelector('.graph-container').classList.remove('hidden');
    });
};

window.addEventListener('load', initButtons);