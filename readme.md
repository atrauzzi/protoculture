# ![protoculture](protoculture.png)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/protoculture.svg)](https://badge.fury.io/js/protoculture)
[![Build Status](https://travis-ci.org/atrauzzi/protoculture.svg?branch=master)](https://travis-ci.org/atrauzzi/protoculture) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## About
Protoculture is a _slightly opinionated_ application framework for creating ECMAScript applications.  It sits between
your chosen libraries and process managers, acting as a layer to organize your abstractions.  Everything protoculture does aims to 
help structure your TypeScript/ES codebase, make it easier for multiple people to work on and reduce cognitive overhead.

The best way to understand how Protoculture works is to think about its main pillars:

 - Service Providers
 - Suites
 - Platforms
 - Apps
 
The _slight_ opinionation of Protoculture comes from:

 - The powerful [inversify](http://inversify.io) dependency injection system
 - A bundled [Redux](http://redux.js.org) service provider for a popular and well documented set of conventions for data handling
 - Planned integrations with hosting and process management infrastructure like [PM2](http://pm2.keymetrics.io) and [ApplicationInsights](https://github.com/Microsoft/ApplicationInsights-node.js)

### In Detail
The layering Protoculture provides has similar if not identical siblings in other languages and runtimes, 
its big advantage is in how everything is tied together.  In that sense, Protoculture is not a full framework, but an 
application framework.

Protoculture builds upon the standard ES Promise APIs.  While Protoculture is authored in TypeScript, you can definitely 
use it from regular ES.

#### Service Providers
Service providers are responsible for telling the dependency injection system about new classes and functionality. All
`ServiceProvider` instances are created when a `Suite` is booted.  They are then asked to make registrations against the context.

If you've used [Laravel](http://laravel.com), these should be very familiar.

#### Suites
Suites represent the topmost entrypoint for a grouping of Apps.  Your entrypoint scripts should be able to instantiate 
a suite and call the `run` method on it with little fuss.  You configure your suite by way of the `Platform`, `App` 
and `ServiceProvider` types.

The final role of the `Suite` is to act as a language-level root for bundling an entire dependency graph.  This is most 
useful when authoring browser applications.
Because suites are the first thing run in a protoculture application, the suite module automatically includes 
popular fetch, promise and reflect-metadata polyfills.

#### Platforms
Platforms represent the means by which you wish to populate the environment that Protoculture will make available.
Platforms are free to do any kind of bootstrap you need and should be used to help make your app universal. 

#### Apps
Apps are probably the easiest level of encapsulation to think about.  If you were making a console application, you 
would treat the entrypoint in the `App` class as your `main`.  A `Suite` can also be made up of multiple applications.  
This is especially true when working in the browser as you may have multiple suites that get minified that wish to reuse apps!

Remember, Protoculture is asynchronous!  That means your apps can be too.  If a Protoculture suite detects that it 
contains any asynchronous apps, it will automatically set up a heartbeat.  This is extremely useful for when you have  
long running processes or are using a library that opens up sockets.  When all applications are done executing, Protoculture 
will ask every app to finish up.  You don't have to manage a thing!

## Meta

Protoculture is created by Alexander Trauzzi and is available under the [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0.html).

### Integrations

 - [Redux](src/Redux)
 - [hapi](https://github.com/atrauzzi/protoculture-hapi)
 - [Web Browsers](src/Web)
 - [Console](src/Console)

### Inspiration

 - Laravel
 - ASP.NET Core
 - Other cool things in the ES community
 - Maybe some Scala?

### Oh man, _not another javascript framework_

I get it, we all know about [JavaScript framework fatigue](http://www.commitstrip.com/wp-content/uploads/2015/09/Strip-Prendre-le-train-en-marche-650-finalenglish1.jpg).

Cynicism over JavaScript is a super hip joke; but this kind of negativity can get the better of us. Protoculture 
enters the slightly empty space of application frameworks.  It is not a middleware platform and is intended 
to be universal.  Simply put, the evolution of the JavaScript ecosystem has been _because_ of all the _yet anothers_.

Everything inside of protoculture has been distilled out of real production needs. I invite you to try it out and 
report any ideas or issues in a ticket.

### History

If you look at the history of this package for versions `1.0.15` and before, it probably will look quite different.

The original idea for protoculture was that it would bundle conventions for TypeScript, React, Redux applications.

The spirit of the library remains the same, however I've changed things quite a fair bit after learning even more 
about the ES ecosystem.  Particularly as it pertains to the various platforms it finds itself on.

### Other
The only answer you're probably looking for this far down is: _Macross_.
