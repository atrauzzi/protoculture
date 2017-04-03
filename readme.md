# Protoculture

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

 - The powerful inversify dependency injection system, used to facilitate better organization of applications
 - Redux, fully integrated at a low level to offer a popular and well documented set of conventions for data handling

Beyond that, Protoculture assumes nothing about your situation.

### In Detail
The concepts expressed by this layering should be fairly familiar and have very similar if not identical siblings 
across other languages and frameworks.

#### Service Providers
Service providers are responsible for telling the dependency injection system about new classes and functionality. All
`ServiceProvider` instances are gathered together when a `Suite` is booted and asked to make registrations against the context.

If you're at all familiar with Laravel, these should be very familiar.

#### Suites
Suites represent the topmost entrypoint for a grouping of Apps.  Your entrypoint scripts should be able to instantiate 
a suite and call the `run` method on it with little fuss.  You configure your suite by way of the `Platform`, `Apps` 
and `ServiceProvider` types.

Another role of the `Suite` is to act as a language-level root for bundling an entire dependency graph.  This is most 
useful when authoring browser applications.

#### Platforms
Platforms represent the means by which you wish to populate the environment that Protoculture will make available.
Platforms are also free to do any kind of bootstrap and are also free to register `ServiceProviders`! 

#### Apps
Apps are probably the easiest level of encapsulation to think about.  If you were making a console application, you 
would treat the entrypoint in the `App` class as your `main`.  A `Suite` can also be made up of multiple applications.  
This is especially true when working in the browser as you may have multiple suites that get minified that wish to reuse apps!

## Author

Protoculture is created by Alexander Trauzzi.

## Meta

_I bet you were hoping for a full readme..._

_Soon, but not quite yet!_

### Inspiration

 - Laravel
 - ASP.NET Core
 - Other cool things in the ES community
 - Maybe some Scala?

### History

If you look at the history of this package for versions `1.0.15` and before, it probably will look a fair bit different.

The original idea for protoculture was that it would bundle conventions for TypeScript, React, Redux applications.

The spirit of the library remains the same, however I've changed things quite a fair bit after learning even more 
about the ES ecosystem.  Particularly as it pertains to the various platforms it finds itself on.