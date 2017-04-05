# ![protoculture](protoculture.png)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![npm version](https://badge.fury.io/js/protoculture.svg)](https://badge.fury.io/js/protoculture)
[![Build Status](https://travis-ci.org/atrauzzi/protoculture.svg?branch=master)](https://travis-ci.org/atrauzzi/protoculture) 
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## About
Protoculture is a _slightly opinionated_ framework for creating ECMAScript applications.

The best way to understand how Protoculture works is to think about its main pillars:

 - Suites
 - Platforms
 - Apps
 - Service Providers
 
The slight opinionation of Protoculture comes from:

 - The powerful [inversify](http://inversify.io) dependency injection system, used to facilitate better organization of applications
 - A [Redux](http://redux.js.org), service provider for a popular and well documented set of conventions for data handling

Beyond that, Protoculture assumes nothing about your situation.

### In Detail
While the layering Protoculture provides has similar if not identical siblings across other languages and frameworks, 
its big advantage is in how everything is tied together.  In that sense, Protoculture is not a full framework, but an 
application framework.

Protoculture builds upon the standard ES Promise APIs.  While Protoculture is authored in TypeScript, you can definitely 
use it from regular ES.

#### Service Providers
Service providers are responsible for telling the dependency injection system about new classes and functionality. All
`ServiceProvider` insteances are created when a `Suite` is booted.  They are then asked to make registrations against the context.

If you've used Laravel, these should be very familiar.

#### Suites
Suites represent the topmost entrypoint for a grouping of Apps.  Your entrypoint scripts should be able to instantiate 
a suite and call the `run` method on it with little fuss.  You configure your suite by way of the `Platform`, `App` 
and `ServiceProvider` types.

Another role of the `Suite` is to act as a language-level root for bundling an entire dependency graph.  This is most 
useful when authoring browser applications.

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

### Inspiration

 - Laravel
 - ASP.NET Core
 - Other cool things in the ES community
 - Maybe some Scala?

## Meta

Protoculture is created by Alexander Trauzzi and is available under the Apache 2.0 license.

### History

If you look at the history of this package for versions `1.0.15` and before, it probably will look a fair bit different.

The original idea for protoculture was that it would bundle conventions for TypeScript, React, Redux applications.

The spirit of the library remains the same, however I've changed things quite a fair bit after learning even more 
about the ES ecosystem.  Particularly as it pertains to the various platforms it finds itself on.

### Other
The only answer you're probably looking for this far down is: _Macross_.
