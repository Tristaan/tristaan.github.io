---
layout: post
title: Rails appointment engine Pt.1
categories: [sensors, electronics]
tags: [ruby]
---

Before you start I recommend you read [Rails engine guide](https://guides.rubyonrails.org/engines.html)
In this guide you will get insights on building your own engine from start to finish. This engine is going to accept some settings from the main application, implement it's own appointment specific settings and allow users to book appointments.


# How-to Rails appointments engine
First let's create a checklist of what the engine should receive from the main app, what settings it should have, what (and where) it should have the outputs available.

It receives:
* Appoinment provider model
* Appoinment receiver model (or models)

It sets:
* Available times
* Appoitment length

It outputs:
* Booking links
* Available appointments list
* Occupied appointments

## The appointment
The appointment model should store information about itself:
* id:integer
* start_date:datetime
* length:time
* provider_id:integer
* receiver_id:integer
* comment:text
* status:enum (accepted|declined|unset)

### Generate the base engine
We will use the rails generator to create a plugin with the --mountable option:
`$ rails plugin new <directory> --mountable`

Then we generate the appointment model:

`$ rails g model appointment start_date:datetime length:time provider_id:integer receiver_id:integer provider_type:string receiver_type:string comment:text status:integer`

We also generate a settings model for storing appointment providers' settings:

`$ rails g model setting name:string value:string provider_id:integer provider_type:string`

Stay tuned for Pt.2...
