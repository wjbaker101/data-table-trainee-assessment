data-table-trainee-assessment
==============================

This test is designed to demostrate your front end development skills.  You should be prepared to spend at least four hours on it.

We are looking for:

* Semantic HTML markup
* An understanding of JavaScript
* The ability to write CSS

The file `data.json` includes the monthly number of broadcasts per BBC channel for the year 2009.  Using the `index.html` file, we would like you to convert the data in the variable `data` into a HTML table, listing all the content into the page.

```
$.getJSON('data.json', function (data) {
    console.log(data); // start here
});
```

Within approximately three to four hours we would expect:

* JavaScript code that takes the data and renders out a HTML table into the body of the HTML document.
* Human readable date formats

Here's an example of what we'd like you to generate:

| Date         | BBC One | BBC Two | BBC Three | BBC News 24 | CBBC | Cbeebies |
| ------------ | ------- | ------- | --------- | ----------- | ---- | -------- |
| January 2009 | 940     | 1040    | 441       | 1075        | 898  | 1343     |

If you really want to impress us you could improve the table by making it sortable via each column, or providing some kind of visualisation of the data with a chart below the table.