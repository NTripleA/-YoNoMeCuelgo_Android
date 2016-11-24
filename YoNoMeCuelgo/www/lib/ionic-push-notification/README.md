Ionic PushNotification Plugin
=======

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Code Climate][codeclimate-image]][codeclimate-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]


Provides a simple way to get the mobile API Key for Android and iOS. It's a wrapper for [cordova push Notification](https://github.com/phonegap/phonegap-plugin-push) Plugin.


Usage
------

#### In the browser

To use this plugin in the browser, include it in your HTML page:

```html
<script src="ionic-push-notification/dist/ionic-pushNotification.js"></script>
```

You can also download it from Bower:

```
bower install ionic-push-notification
```


API
-----

**Config**

* [`pushNotification.setConfig(config)`](#pushnotificationsetconfigconfig)

**Overview**
* [`pushNotification.register()`](#pushnotificationregister)
* [`pushNotification.getDeviceToken()`](#pushnotificationgetdevicetoken)


### pushNotification.setConfig(config)

Set Plugin configuration for push initialisation.

Example:

```js
myApp.config(function (pushNotificationProvider) {
  pushNotificationProvider
    .setConfig(config);
});
```

### pushNotification.register()

Register the device.
It call the classical push plugin init function.
It return the push instance.

Example:

```js
pushNotification.register().then(function (pushToken) {
  // Push token String
}).catch(function (err) {
  // an error
});
```

### pushNotification.getDeviceToken()

Get the device push token of user when is registred.

Example:

```js
pushNotification.getDeviceToken().then(function (pushToken) {
  // Push token String
}).catch(function (err) {
  // an error
});
```


[npm-image]: https://img.shields.io/npm/v/ionic-push-notification.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ionic-push-notification
[travis-image]: https://img.shields.io/travis/ArnaudSpanneut/ionic-push-notification.svg?style=flat-square
[travis-url]: https://travis-ci.org/ArnaudSpanneut/ionic-push-notification
[codeclimate-image]: https://img.shields.io/codeclimate/github/ArnaudSpanneut/ionic-pushNotification.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/ArnaudSpanneut/ionic-pushNotification
[coveralls-image]: https://img.shields.io/coveralls/ArnaudSpanneut/ionic-push-notification.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/ArnaudSpanneut/ionic-push-notification
[license-image]: http://img.shields.io/npm/l/ionic-push-notification.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/ionic-push-notification.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/ionic-push-notification
