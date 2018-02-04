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

/*
 * Gets the month from the given index.
 * Index must be 1 to 12 inclusive.
 */
const getMonth = (index) =>
{
    // Make sure index is valid
    if (index < 1) throw new Error('Month cannot be less than 1');
    
    if (index > 12) throw new Error('Month cannot be more than 12');
    
    return months[index - 1];
};

/*
 * Formats the date from the JSON file.
 */
const formatDate = (date) =>
{
    // Separate the month and year
    const [month, year] = date.split('-');
    
    // Construct a string to display on the table
    return `${getMonth(year)} ${month}`;
};

/*
 * Gets HTML corresponding to data from the JSON file that will be displayed in the table.
 */
const getTableRow = (rowData) =>
{
    // Get the date and channel from the data given
    const [date, channel] = rowData;
    
    // Creates a row and adds cells
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

/*
 * Constructs a table from the given data.
 */
const getTableHTML = (data) =>
{
    let html = '';
    
    Object.entries(data).forEach((rowData) =>
    {
        html += getTableRow(rowData);
    });
    
    return html;
};

/*
 * Displays the table onto the webpage.
 */
const displayTable = (data) =>
{
    document.querySelector('.data-table').innerHTML = getTableHTML(data);
};

/*
 * Sends a request to get the data from the JSON file.
 */
const init = () =>
{
    $.getJSON('data.json', displayTable);
};

// Initialises the table
window.addEventListener('load', init);

// Constructs the graph with the data from the JSON file
const dataGraph = (() =>
{
    // Stores the canvas element
    const graph = document.querySelector('.graph-canvas');
    
    // Stores the graphics object
    const graphics = graph.getContext('2d');
    
    // How far from the edge the axes should be
    const axisOffset = 40;
    
    // Minimum and maximum value of the graph (on the Y axis)
    const graphMin = 400;
    const graphMax = 1500;
    
    // How many values should be displayed on the Y axis
    const intervals = 20;
    
    // Colours of the different BBC channels
    const channelColours =
    [
        '#ea2923',
        '#005761',
        '#d41c6f',
        '#900',
        '#9fe600',
        '#2cade6',
    ];
    
    /*
     * Draws a line from one point to another.
     */
    const drawLine = (x1, y1, x2, y2) =>
    {
        graphics.moveTo(x1, y1);
        graphics.lineTo(x2, y2);
        graphics.stroke();
    };
    
    /*
     * Draws a circle at a point with a radius.
     */
    const drawCircle = (x, y, radius) =>
    {
        graphics.beginPath();
        graphics.arc(x, y, radius, 0, 2 * Math.PI);
        graphics.stroke(); 
    };
    /*
     * Draws the axes of the graph.
     */
    const drawAxes = () =>
    {
        graphics.strokeStyle = '#222';

        drawAxisY();
        
        drawAxisX();
    };
    
    /*
     * Draws the X axis of the graph.
     */
    const drawAxisX = () =>
    {
        drawLine(axisOffset, graph.height - axisOffset, graph.width - axisOffset, graph.height - axisOffset);
        
        const width = (graph.width - axisOffset) - axisOffset;
        
        // Draw labels on X axis for each month
        for (let i = 0; i < months.length; ++i)
        {
            graphics.fillText(months[i].substr(0, 3), axisOffset + (width / 12 * i), graph.height - axisOffset + 15);
        }
    };
    
    /*
     * Draws the Y axis of the graph.
     */
    const drawAxisY = () =>
    {
        drawLine(axisOffset, axisOffset, axisOffset, graph.height - axisOffset);
        
        // Calculates the height of the axis
        const height = (graph.height - axisOffset) - axisOffset;
        
        // Calculates the difference in values for each step on the Y axis
        const step = (graphMax - graphMin) / intervals;
        
        // Calculates the height of each step
        const stepSize = height / intervals;
        
        // Draws the labels on the Y axis
        for (let i = 0; i < intervals + 1; ++i)
        {
            graphics.fillText(graphMax - (step * i), 20 - 15, axisOffset + (stepSize * i));
        }
    };
    
    /*
     * Gets the values of each of the channels and stores them in an object.
     */
    const getChannelValues = (data) =>
    {
        // Create the object to store values       
        const channels =
        {
            bbcone: [],
            bbctwo: [],
            bbcthree: [],
            bbcnews24: [],
            cbbc: [],
            cbeebies: [],
        };
        
        // Adds the values into the arrays
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
    
    /*
     * Calculates the point for each of the values.
     * Translates where on the canvas to draw the point.
     */
    const translatePoint = (index, value) =>
    {
        // Calculate width and height of the axes
        const width = (graph.width - axisOffset) - axisOffset;
        const height = (graph.height - axisOffset) - axisOffset;
        
        // Calculates how far the value should be drawn on the Y axis
        const valueRatio = (value - graphMin) / (graphMax - graphMin);
        
        // Creates a point
        const point =
        {
            x: axisOffset + (width / 12 * index),
            y: graph.height - axisOffset - (height * valueRatio),
        };
        
        return point;
    };
    
    /*
     * Draws the lines for each of the channels.
     */
    const drawChannelValues = (data) =>
    {
        const channels = getChannelValues(data);
        
        Object.entries(channels).forEach(([channel, values], index) =>
        {
            // Moves the stroke position to the first point
            const initialPoint = translatePoint(0, values[0]);
            
            // Sets the line colour to the channel colour
            graphics.strokeStyle = channelColours[index];
            
            // Draws a line between each value
            graphics.beginPath();
            graphics.moveTo(initialPoint.x, initialPoint.y);
            
            for (let i = 0; i < values.length; ++i)
            {
                const point = translatePoint(i, values[i]);
                
                graphics.lineTo(point.x, point.y);
            }
            
            graphics.stroke();
            
            // Draws a circle at each new point
            for (let i = 0; i < values.length; ++i)
            {
                const point = translatePoint(i, values[i]);

                drawCircle(point.x, point.y, 2);
            }
        });
    };
    
    /*
     * Draws the graph with the data from the JSON file.
     */
    const drawGraph = () =>
    {
        $.getJSON('data.json', drawChannelValues);
        
        drawAxes();
    };
    
    return { draw: drawGraph }
})();

// Initialises the graph
window.addEventListener('load', dataGraph.draw);

/*
 * Initialises the buttons for switching between the table and graph.
 */
const initButtons = () =>
{
    // Store the elements
    const showTableButton = document.querySelector('.show-table-button');
    const showGraphButton = document.querySelector('.show-graph-button');
    
    // Shows the table, hides the graph
    showTableButton.addEventListener('click', () =>
    {
        document.querySelector('.table-container').classList.remove('hidden');
        document.querySelector('.graph-container').classList.add('hidden');
    });
    
    // Shows the graph, hides the table
    showGraphButton.addEventListener('click', () =>
    {
        document.querySelector('.table-container').classList.add('hidden');
        document.querySelector('.graph-container').classList.remove('hidden');
    });
};

// Initialise the buttons
window.addEventListener('load', initButtons);