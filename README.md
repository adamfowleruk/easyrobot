# easyrobot

Easy to learn and use Node.js based and Rosbridge Suite compatible Robot API.

## Introduction

Inspired by ROS but designed to be simple to run, easyrobot provides a fast Robot Operating System
controller instance in Node.js. One of these instances should be run per robot, with sensors, 
services, AI code or controllers, all communicating through messages to this node.

## Design

Easy Robot is designed to be compatible with the Rosbridge Suite JSON protocol, and draws inspiration
from the services and topic publish/subscribe paradigm of the Robot Operating System (ROS).

Easy Robot, though, is designed for beginners to use, whilst allowing services built on it to be used
with ROS also.

Easy Robot should serve to encourage a new generation of Robot makers and AI developers to get used to
their craft.

## Background

In Dec 2013 I decided to get a Raspberry Pi (lovingly bought by my wife for Christmas!). Amongst other
projects I wanted to get back in to AI programming with neural nets, and to learn a bit about electronics
(which I have always sucked at).

I decided to create Raspberry Ralph which you can read about here: http://raspberryralph.wordpress.com/

I have a background in writing Websockets situational awareness code, and using node.js for message passing
between nodes via a database. (MarkLogic Enterprise NoSQL database, who I work for). Node.js seemed a good
place to start, and it gives new JavaScript coders something proper to do (because web coding isn't proper
coding, is it? 8o) )

