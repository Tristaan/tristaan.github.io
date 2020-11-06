---
layout: post
title: Linux mouse driver
categories: [linux, drivers, reverse-engineering]
tags: [linux, gaming, drivers, asus]
---

This is a nearly 3-year-old project of mine. It started out as a [libusb userspace driver](https://github.com/tristaan/strix-claw) just to make it work and keep it from crashing all the time. Now I'm revisiting this driver and rewriting it as a kernel module.


## The mouse
The mouse is an [ASUS Strix Claw](https://www.asus.com/Keyboards-Mice/STRIX_CLAW/) which has 3 special buttons for DPI settings.
It is configurable through a windows program, but the goal is to get this functionality working on linux.

## Reverse engineering the payload
So to get the device working on linux we first need to gather information on what data is even sent to/from the device.
I started monitoring the communication with [Wireshark](https://www.wireshark.org/) on a windows machine and found out that this device has 3 interfaces:
1. Mouse & Configuration
2. Keyboard Macros
3. DPI buttons

### Mouse & Configuration
On this interface (more precise endpoint1) the communication is like on any other mouse. The mouse sends movement & button data to the pc and works normally without any problems. it sends 8 bytes every change.
There is also a second endpoint0 which is used for configuration purposes and from what I read is default on most USB devices. The configuration program uses this endpoint to change the devices settings. It sends 8 bytes per transmission, which happens 14 times per configuration change.

I described all the configuration bytes, which you can see this in this photo. Please note that I skipped keyboard macro configuration because the payloads were really huge + I don't need keyboard macros on the mouse.
IMG IMG
```

```

### Keyboard Macros
Whenever a keyboard macro button is pressed the buttons presses come from interface1. It acts as a virtual keyboard and works perfectly fine as is.

### DPI buttons
Now this is the problematic interface (endpoint3). Every time a button is pressed from this interface the mouse just locks up. Even the other eps stop working. I'm not 100% sure why this happens, but it should be because the interrupt for the payload is never triggered on the host, this causes then the device to lock up because of filled buffer. (??)

The endpoint reports the current DPI level & Sniper mode status on every press of these 3 buttons.
This is really useful and can even be made as a widget if there is a proper underlying driver which reports this information to userspace. So this is what we will be working on.


## Current mouse status inside the kernel
All the interfaces from the mouse are registered as hid-generic devices. So I tried to use a simple skeleton driver to bind to the third interface but it was not working because the hidcore takes precedence. I could use udev rules to block hidcore, but then again this adds unnecessary installation steps, which I want to avoid. So what we'll do is write a hid device driver on top of hidcore and not a bare USB driver, because this interface has a hid descriptor but it is vendor defined.


So after reading countless source codes and a bit of kernel docs,
