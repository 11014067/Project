# Report

![](doc/site1.png)
![](doc/site2.png)

My visualization shows a map of the US, a calendar and a bar chart to show information about population, GDP, income, weather and cost of living.

To make all these visualizations there are different functions: loading and checking data, making the visualization, updating visualizations and information buttons.
So firstly the data is loaded after which there is a function to check and manipulate the data to make it work the best way possible.
Secondly there are functions to make the map, calendar and bar chart each including their own tooltip. 
Then come the update functions, starting with the map for if you choose to see a different year or dataset. 
The next update function is for if you click on one of the states, which will change the site's title to that state, start to remake the bar chart and it will start to call the update functions for the calendar.
The calendar update function follows.
Lastly there are two functions to show or hide the story or help information.

The challenges started the first day for me, because I last programmed 5 months ago just starting up my old data projects took some time.
After some time I was able to start a server again and successfully work with notepad++. This was hard because nobody did it like I used to and it was hard for me to understand their ways and programs.
Also the calendar was something I never made before, this was a great challenge because the standard d3 calendar is for multiple years.
Getting the weather data was a struggle on its own, I tried multiple sites but none worked well. 
After a lot of searching I finally found a site from which you could search data from a custom timeline in order to get data from every day of the year from a hole year.
Coloring the each of the squares and getting the data in a well usable format was a struggle. 
Also the bar chart would not update, this eventually was fixed by just making a new one, because the bar chart doesn't take much computer power to make.
Working with bootstrap grid also was a huge challenge for me, most information on the internet helps you make the rows and columns but none help you with wat to load.
This gave me the impression I did not need to load anything, after some help from Tim I finally found the files and it worked.

In a world with a lot of time I would have most definitely wanted to add natural disaster data to for instance the map or another visualization.
If you are going to choose where to live you want to be save, I think natural disasters would have been the right way to show. 
Maybe adding crime rates or something similar as well. But I am happy with the visualization I have now. 
It took me a lot of work to get these visualizations done and I loved to be able to program again. 
Though it was hard to start up again, I made the best of what I knew and the time I had. 
My proposal the population, GDP and income data where originally changeable with checkboxes but a dropdown made it easier to see that you can only choose one.
The dropdown also looks nice next to the slider because the slider only works for 5 years so otherwise the slider would have been really long or awkwardly alone.
By having the dropdown and the slider next to each other the hole row is a row to change the visualization.
Which I really like and think looks a lot better than only having the slider or having the slider next to 3 checkboxes.
