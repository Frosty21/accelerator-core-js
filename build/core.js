"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccCore = void 0;
var sdkWrapper_1 = require("./sdk-wrapper/sdkWrapper");
var analytics_1 = require("./analytics");
var communication_1 = require("./communication");
var enums_1 = require("./enums");
var models_1 = require("./models");
var utils_1 = require("./utils");
var errors_1 = require("./sdk-wrapper/errors");
var AccCore = /** @class */ (function () {
    function AccCore(options) {
        var _this = this;
        /**
         * Connect to the session
         */
        this.connect = function () { return __awaiter(_this, void 0, void 0, function () {
            var session, credentials, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analytics.log(enums_1.LogAction.connect, enums_1.LogVariation.attempt);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.OpenTokSDK.connect()];
                    case 2:
                        _a.sent();
                        // Create internal event listeners
                        this.createEventListeners();
                        session = this.getSession();
                        credentials = this.getCredentials();
                        this.analytics.update(credentials.sessionId, session.connection.connectionId, credentials.apiKey);
                        this.analytics.log(enums_1.LogAction.connect, enums_1.LogVariation.success);
                        this.initPackages();
                        this.triggerEvent(enums_1.CoreEvents.Connected, session);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        utils_1.message(error_1);
                        this.analytics.log(enums_1.LogAction.connect, enums_1.LogVariation.fail);
                        throw new Error(error_1);
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Gets the current session
         */
        this.getSession = function () { return _this.OpenTokSDK.getSession(); };
        /**
         * Gets the current credentials
         */
        this.getCredentials = function () { return _this.OpenTokSDK.getCredentials(); };
        /**
         * Gets the current options
         */
        this.getOptions = function () { return _this.OpenTokSDK.getOptions(); };
        /**
         * Register a callback for a specific event or pass an object with
         * with event => callback key/value pairs to register listeners for
         * multiple events.
         * @param event The name of the event
         * @param callback
         */
        this.on = function (event, callback) {
            if (typeof event !== 'string') {
                Object.keys(event).forEach(function (eventName) {
                    _this.on(eventName, event[eventName]);
                });
                return;
            }
            if (!_this.eventListeners[event]) {
                utils_1.message(event + " is not a registered event.");
            }
            else {
                _this.eventListeners[event].add(callback);
            }
        };
        /**
         * Remove a callback for a specific event.  If no parameters are passed,
         * all event listeners will be removed.
         * @param event - The name of the event
         * @param callback
         */
        this.off = function (event, callback) {
            if (!event && !callback) {
                Object.keys(_this.eventListeners).forEach(function (eventType) {
                    _this.eventListeners[eventType].clear();
                });
            }
            else {
                if (!_this.eventListeners[event]) {
                    utils_1.message(event + " is not a registered event.");
                }
                else {
                    _this.eventListeners[event].delete(callback);
                }
            }
        };
        /**
         * Establishes all events we could be listening to and
         * any callbacks that should occur.
         */
        this.createEventListeners = function () {
            _this.eventListeners = {};
            _this.registerEvents(enums_1.CoreEvents);
            _this.registerEvents(enums_1.CommunicationEvents);
            _this.registerEvents(enums_1.SessionEvents);
            var options = _this.OpenTokSDK.getOptions();
            var session = _this.OpenTokSDK.getSession();
            /**
             * If using screen sharing + annotation in an external window, the screen sharing
             * package will take care of calling annotation.start() and annotation.linkCanvas()
             */
            var usingAnnotation = options.screenSharing && options.screenSharing.annotation;
            // const internalAnnotation: boolean =
            //   usingAnnotation && options.screenSharing.externalWindow;
            /**
             * Wrap session events and update internalState when streams are created
             * or destroyed
             */
            Object.values(enums_1.SessionEvents).forEach(function (eventName) {
                _this.OpenTokSDK.on(eventName, function (data) {
                    _this.triggerEvent(eventName, data);
                });
            });
            /**
             *
             */
            if (usingAnnotation) {
                _this.on(enums_1.CoreEvents.StartScreenShare, function (subscribeToScreenEvent) {
                    _this.annotation.start(session).then(function () {
                        if (options.annotation &&
                            options.annotation.absoluteParent &&
                            options.annotation.absoluteParent.subscriber) {
                            var absoluteParent = utils_1.dom.query(options.annotation.absoluteParent.subscriber);
                            var linkOptions = absoluteParent ? { absoluteParent: absoluteParent } : null;
                            var subscriber = subscribeToScreenEvent.subscriber;
                            _this.annotation.linkCanvas(subscriber, subscriber.element.parentElement, linkOptions);
                        }
                    });
                });
                _this.on(enums_1.CoreEvents.EndScreenShare, function () {
                    _this.annotation.end();
                });
            }
            // this.on(
            //   ScreenSharingEvents.StartScreensharing,
            //   (publisher: OT.Publisher) => {
            //     this.OpenTokSDK.addPublisher(StreamType.Screen, publisher);
            //     this.triggerEvent(
            //       CoreEvents.StartScreenShare,
            //       new StartScreenShareEvent(publisher, this.OpenTokSDK.getPubSub())
            //     );
            //     if (internalAnnotation) {
            //       this.annotation.start(session).then(() => {
            //         if (
            //           options.annotation &&
            //           options.annotation.absoluteParent &&
            //           options.annotation.absoluteParent.publisher
            //         ) {
            //           const absoluteParent = dom.query(
            //             options.annotation.absoluteParent.publisher
            //           ) as HTMLElement | undefined;
            //           const linkOptions = absoluteParent ? { absoluteParent } : null;
            //           this.annotation.linkCanvas(
            //             publisher,
            //             publisher.element.parentElement,
            //             linkOptions
            //           );
            //         }
            //       });
            //     }
            //   }
            // );
            // this.on(ScreenSharingEvents.EndScreenSharing, (publisher: OT.Publisher) => {
            //   this.OpenTokSDK.removePublisher(StreamType.Screen, publisher);
            //   this.triggerEvent(
            //     CoreEvents.EndScreenShare,
            //     new EndScreenShareEvent(this.OpenTokSDK.getPubSub())
            //   );
            //   if (usingAnnotation) {
            //     this.annotation.end();
            //   }
            // });
        };
        /**
         * Register events that can be listened to be other components/modules
         * @param events An enum containing events
         */
        this.registerEvents = function (events) {
            Object.values(events).forEach(function (event) {
                if (!_this.eventListeners[event]) {
                    _this.eventListeners[event] = new Set();
                }
            });
        };
        /**
         * Trigger an event and fire all registered callbacks
         * @param event The name of the event
         * @param data Data to be passed to callback functions
         */
        this.triggerEvent = function (event, data) {
            var eventCallbacks = _this.eventListeners[event];
            if (!eventCallbacks) {
                _this.registerEvents(event);
                utils_1.message(event + " has been registered as a new event.");
            }
            else {
                eventCallbacks.forEach(function (callback) { return callback(data); });
            }
        };
        this.initPackages = function () {
            _this.analytics.log(enums_1.LogAction.initPackages, enums_1.LogVariation.attempt);
            var session = _this.getSession();
            var options = _this.getOptions();
            /**
             * Try to require a package.  If 'require' is unavailable, look for
             * the package in global scope.  A switch statement is used because
             * webpack and Browserify aren't able to resolve require statements
             * that use variable names.
             * @param packageName The name of the npm package
             * @param globalName The name of the package if exposed on global/window
             */
            var optionalRequire = function (packageName, globalName) {
                var result;
                try {
                    switch (packageName) {
                        case 'opentok-text-chat':
                            result = require('opentok-text-chat');
                            break;
                        // case 'opentok-screen-sharing':
                        //   result = require('opentok-screen-sharing');
                        //   break;
                        // case 'opentok-annotation':
                        //   result = require('opentok-annotation');
                        //   break;
                        // case 'opentok-archiving':
                        //   result = require('opentok-archiving');
                        //   break;
                        default:
                            break;
                    }
                }
                catch (error) {
                    result = window[globalName];
                }
                if (!result) {
                    _this.analytics.log(enums_1.LogAction.initPackages, enums_1.LogVariation.fail);
                    throw new errors_1.SDKError('otAccCore', "Could not load " + packageName, 'missingDependency');
                }
                return result;
            };
            var availablePackages = {
                textChat: function () {
                    return optionalRequire('opentok-text-chat', 'TextChatAccPack');
                }
                // screenSharing() {
                //   return optionalRequire(
                //     'opentok-screen-sharing',
                //     'ScreenSharingAccPack'
                //   );
                // },
                // annotation() {
                //   return optionalRequire('opentok-annotation', 'AnnotationAccPack');
                // },
                // archiving() {
                //   return optionalRequire('opentok-archiving', 'ArchivingAccPack');
                // }
            };
            var packages = new models_1.AcceleratorPackages();
            (options.packages || []).forEach(function (acceleratorPack) {
                if (availablePackages[acceleratorPack]) {
                    var accPack = availablePackages[acceleratorPack];
                    packages[utils_1.properCase(acceleratorPack)] = accPack();
                }
                else {
                    utils_1.message(acceleratorPack + " is not a valid accelerator pack");
                }
            });
            /**
             * Get containers for streams, controls, and the chat widget
             */
            var getDefaultContainer = function (pubSub) {
                return document.getElementById(pubSub + "Container");
            };
            var getContainerElements = function () {
                // Need to use path to check for null values
                var controls = options.controlsContainer || '#videoControls';
                var chat = (options.textChat && options.textChat.container) || '#chat';
                var stream = options.streamContainers || getDefaultContainer;
                return { stream: stream, controls: controls, chat: chat };
            };
            /**
             * Return options for the specified package
             * @param packageName
             */
            var packageOptions = function (packageName) {
                /**
                 * If options.controlsContainer/containers.controls is null,
                 * accelerator packs should not append their controls.
                 */
                var containers = getContainerElements();
                var appendControl = !!containers.controls;
                var controlsContainer = containers.controls; // Legacy option
                var streamContainers = containers.stream;
                var baseOptions = {
                    session: session,
                    core: _this,
                    controlsContainer: controlsContainer,
                    appendControl: appendControl,
                    streamContainers: streamContainers
                };
                switch (packageName) {
                    case enums_1.Packages.Annotation: {
                        return Object.assign({}, baseOptions, options.annotation);
                    }
                    case enums_1.Packages.Archiving: {
                        return Object.assign({}, baseOptions, options.archiving);
                    }
                    case enums_1.Packages.Communication: {
                        return new models_1.CommunicationOptions(_this.analytics, _this, session, appendControl, controlsContainer, options.communication, streamContainers);
                    }
                    case enums_1.Packages.ScreenSharing: {
                        var screenSharingContainer = {
                            screenSharingContainer: streamContainers
                        };
                        return Object.assign({}, baseOptions, screenSharingContainer, options.screenSharing);
                    }
                    case enums_1.Packages.TextChat: {
                        var textChatOptions = {
                            textChatContainer: options.textChat && options.textChat.container
                                ? options.textChat.container
                                : undefined,
                            waitingMessage: options.textChat && options.textChat.waitingMessage
                                ? options.textChat.waitingMessage
                                : undefined,
                            sender: {
                                alias: options.textChat && options.textChat.name
                                    ? options.textChat.name
                                    : undefined
                            },
                            alwaysOpen: options.textChat && options.textChat.alwaysOpen
                                ? options.textChat.alwaysOpen
                                : undefined
                        };
                        return Object.assign({}, baseOptions, textChatOptions);
                    }
                    default:
                        return {};
                }
            };
            /** Create instances of each package */
            _this.communication = new communication_1.Communication(packageOptions('communication'));
            _this.textChat = packages.TextChat
                ? packages.TextChat(packageOptions('textChat'))
                : null;
            // this.screenSharing = packages.ScreenSharing
            //   ? packages.ScreenSharing(packageOptions('screenSharing'))
            //   : null;
            // this.annotation = packages.Annotation
            //   ? packages.Annotation(packageOptions('annotation'))
            //   : null;
            // this.archiving = packages.Archiving
            //   ? packages.Archiving(packageOptions('archiving'))
            //   : null;
            _this.analytics.log(enums_1.LogAction.initPackages, enums_1.LogVariation.success);
        };
        this.setupExternalAnnotation = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.annotation.start(this.OpenTokSDK.getSession(), {
                            screensharing: true
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.linkAnnotation = function (pubSub, annotationContainer, externalWindow) {
            // this.annotation.linkCanvas(
            //   pubSub,
            //   annotationContainer,
            //   new LinkCanvasOptions(externalWindow)
            // );
            if (externalWindow) {
                // Add subscribers to the external window
                var streams_1 = _this.OpenTokSDK.getStreams();
                var cameraStreams = Object.keys(streams_1).reduce(function (acc, streamId) {
                    var stream = streams_1[streamId];
                    return stream.videoType === models_1.StreamType.Camera ||
                        stream.videoType === models_1.StreamType.SIP
                        ? acc.concat(stream)
                        : acc;
                }, []);
                cameraStreams.forEach(_this.annotation.addSubscriberToExternalWindow);
            }
        };
        /**
         * Get access to an accelerator pack
         * @param packageName textChat, screenSharing, annotation, or archiving
         */
        this.getAccPack = function (packageName) {
            _this.analytics.log(enums_1.LogAction.getAccPack, enums_1.LogVariation.attempt);
            var packages = {
                textChat: _this.textChat,
                screenSharing: _this.screenSharing,
                annotation: _this.annotation,
                archiving: _this.archiving
            };
            _this.analytics.log(enums_1.LogAction.getAccPack, enums_1.LogVariation.success);
            return packages[packageName];
        };
        /**
         * Disconnect from the session
         * @returns {Promise} <resolve: -, reject: Error>
         */
        this.disconnect = function () {
            _this.analytics.log(enums_1.LogAction.disconnect, enums_1.LogVariation.attempt);
            _this.OpenTokSDK.disconnect();
            _this.analytics.log(enums_1.LogAction.disconnect, enums_1.LogVariation.success);
        };
        /**
         * Force a remote connection to leave the session
         * @param connection
         */
        this.forceDisconnect = function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analytics.log(enums_1.LogAction.forceDisconnect, enums_1.LogVariation.attempt);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.OpenTokSDK.forceDisconnect(connection)];
                    case 2:
                        _a.sent();
                        this.analytics.log(enums_1.LogAction.forceDisconnect, enums_1.LogVariation.success);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        this.analytics.log(enums_1.LogAction.forceDisconnect, enums_1.LogVariation.fail);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Start publishing video and subscribing to streams
         * @param publisherProperties
         * @see https://tokbox.com/developer/sdks/js/reference/OT.html#initPublisher
         */
        this.startCall = function (publisherProperties) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.communication.startCall(publisherProperties)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); };
        /**
         * Stop all publishing un unsubscribe from all streams
         */
        this.endCall = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.communication.endCall()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); };
        /**
         * Retrieve current state of session
         */
        this.state = function () { return _this.OpenTokSDK.all(); };
        /**
         * Manually subscribe to a stream
         * @param stream An OpenTok stream
         * @param subscriberProperties
         * @param networkTest Subscribing to our own publisher as part of a network test?
         * @see https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe
         */
        this.subscribe = function (stream, subscriberProperties, networkTest) {
            if (networkTest === void 0) { networkTest = false; }
            return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.communication.subscribe(stream, subscriberProperties, networkTest)];
            }); });
        };
        /**
         * Manually unsubscribe from a stream
         * @param subscriber An OpenTok subscriber object
         */
        this.unsubscribe = function (subscriber) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.communication.unsubscribe(subscriber)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        }); }); };
        /**
         * Force the publisher of a stream to stop publishing the stream
         * @param stream An OpenTok stream object
         */
        this.forceUnpublish = function (stream) { return __awaiter(_this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analytics.log(enums_1.LogAction.forceUnpublish, enums_1.LogVariation.attempt);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.OpenTokSDK.forceUnpublish(stream)];
                    case 2:
                        _a.sent();
                        this.analytics.log(enums_1.LogAction.forceUnpublish, enums_1.LogVariation.success);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        this.analytics.log(enums_1.LogAction.forceUnpublish, enums_1.LogVariation.fail);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Get the local publisher object for a stream
         * @param stream An OpenTok stream object
         */
        this.getPublisherForStream = function (stream) {
            return _this.getSession().getPublisherForStream(stream);
        };
        /**
         * Get the local subscriber objects for a stream
         * @param stream An OpenTok stream object
         */
        this.getSubscribersForStream = function (stream) {
            return _this.getSession().getSubscribersForStream(stream);
        };
        /**
         * Send a signal using the OpenTok signaling apiKey
         * @param type
         * @param data
         * @param to An OpenTok connection object
         */
        this.signal = function (type, data, to) { return __awaiter(_this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.analytics.log(enums_1.LogAction.signal, enums_1.LogVariation.attempt);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.OpenTokSDK.signal(type, data, to)];
                    case 2:
                        _a.sent();
                        this.analytics.log(enums_1.LogAction.signal, enums_1.LogVariation.success);
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        this.analytics.log(enums_1.LogAction.signal, enums_1.LogVariation.fail);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Enable or disable local audio
         * @param enable
         */
        this.toggleLocalAudio = function (enable) {
            _this.analytics.log(enums_1.LogAction.toggleLocalAudio, enums_1.LogVariation.attempt);
            var publishers = _this.OpenTokSDK.getPubSub().publishers;
            var toggleAudio = function (id) {
                return _this.communication.enableLocalAV(id, 'audio', enable);
            };
            Object.keys(publishers.camera).forEach(toggleAudio);
            Object.keys(publishers.screen).forEach(toggleAudio);
            Object.keys(publishers.sip).forEach(toggleAudio);
            _this.analytics.log(enums_1.LogAction.toggleLocalAudio, enums_1.LogVariation.success);
        };
        /**
         * Enable or disable local video
         * @param enable
         */
        this.toggleLocalVideo = function (enable) {
            _this.analytics.log(enums_1.LogAction.toggleLocalVideo, enums_1.LogVariation.attempt);
            var publishers = _this.OpenTokSDK.getPubSub().publishers;
            var toggleVideo = function (id) {
                return _this.communication.enableLocalAV(id, 'video', enable);
            };
            Object.keys(publishers.camera).forEach(toggleVideo);
            Object.keys(publishers.screen).forEach(toggleVideo);
            Object.keys(publishers.sip).forEach(toggleVideo);
            _this.analytics.log(enums_1.LogAction.toggleLocalVideo, enums_1.LogVariation.success);
        };
        /**
         * Enable or disable remote audio
         * @param subscriberId Subscriber id
         * @param enable
         */
        this.toggleRemoteAudio = function (subscriberId, enable) {
            _this.analytics.log(enums_1.LogAction.toggleRemoteAudio, enums_1.LogVariation.attempt);
            _this.communication.enableRemoteAV(subscriberId, 'audio', enable);
            _this.analytics.log(enums_1.LogAction.toggleRemoteAudio, enums_1.LogVariation.success);
        };
        /**
         * Enable or disable remote video
         * @param subscriberId Subscriber id
         * @param enable
         */
        this.toggleRemoteVideo = function (subscriberId, enable) {
            _this.analytics.log(enums_1.LogAction.toggleRemoteVideo, enums_1.LogVariation.attempt);
            _this.communication.enableRemoteAV(subscriberId, 'video', enable);
            _this.analytics.log(enums_1.LogAction.toggleRemoteVideo, enums_1.LogVariation.success);
        };
        this.OpenTokSDK = new sdkWrapper_1.OpenTokSDK(options ? options.credentials : null, options.largeScale ? { connectionEventsSuppressed: true } : undefined);
        // Initialize analytics
        this.analytics = new analytics_1.Analytics(window.location.origin, options.credentials.sessionId, null, options.credentials.apiKey, options.applicationName);
        this.analytics.log(enums_1.LogAction.init, enums_1.LogVariation.attempt);
        // save options
        this.OpenTokSDK.setOptions(options);
        this.analytics.log(enums_1.LogAction.init, enums_1.LogVariation.success);
    }
    AccCore.utils = { dom: utils_1.dom, message: utils_1.message, path: utils_1.path, pathOr: utils_1.pathOr, properCase: utils_1.properCase };
    return AccCore;
}());
exports.AccCore = AccCore;
if (typeof window !== 'undefined') {
    window.AccCore = AccCore;
}
//# sourceMappingURL=core.js.map