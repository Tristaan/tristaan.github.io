---
layout: post
title: Sensor data collection
categories: [sensors, electronics]
tags: [arduino, monitoring]
---

This project started out as a small test if it's even possible to read sensor data into a MVC app like there are [ThingsBoard](https://thingsboard.io/), [ThingSpeak](https://thingspeak.com/) and many more. To tune this for your own station, you need to understand a bit about **Ruby on Rails** and **Arduino**.

Get the sauce here:
```
$ git clone git@bitbucket.org:Tristan_/tbox.git
```

So yeah, a simple implementation was not hard to make.

I created three models for data storage:
* Station (has_many sensors, has a location)
* Sensor (has a data type and has_many sensors)
* Measurement (value with belongs_to sensor)

The controllers and views are just for showing the data in a pretty way with graphs and tables. So for this to work you only need to add a create method for your station. You can find an example in the `scripts/` directory. The first payload sent from the station to the hosting pc is information about all the sensors on the station.

All the additional data sent from then on are snesor readings sent by whatever interval you set.

But as you'd expect I found many shortcomings from this kind of sensor access.
Watch that you have enough flash space on your microcontroller.
Then I needed to create a connection from the application which wasn't a seamless experience. The connection was breaking randomly, but it was once a week at most. To set up the connection I needed to time the script and arduino connection just right because it connected over bluetooth and there were some implications.
