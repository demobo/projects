var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;

if (navigator.mozGetUserMedia) {
//  console.log("This appears to be Firefox");

    webrtcDetectedBrowser = "firefox";

    // The RTCPeerConnection object.
    RTCPeerConnection = mozRTCPeerConnection;

    // The RTCSessionDescription object.
    RTCSessionDescription = mozRTCSessionDescription;

    // The RTCIceCandidate object.
    RTCIceCandidate = mozRTCIceCandidate;

    // Get UserMedia (only difference is the prefix).
    // Code from Adam Barth.
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);

    // Attach a media stream to an element.
    attachMediaStream = function(element, stream) {
        console.log("Attaching media stream");
        element.mozSrcObject = stream;
        element.play();
    };

    reattachMediaStream = function(to, from) {
        console.log("Reattaching media stream");
        to.mozSrcObject = from.mozSrcObject;
        to.play();
    };

    // Fake get{Video,Audio}Tracks
    MediaStream.prototype.getVideoTracks = function() {
        return [];
    };

    MediaStream.prototype.getAudioTracks = function() {
        return [];
    };
} else if (navigator.webkitGetUserMedia) {
//  console.log("This appears to be Chrome");

    webrtcDetectedBrowser = "chrome";

    // The RTCPeerConnection object.
    RTCPeerConnection = webkitRTCPeerConnection;

    // Get UserMedia (only difference is the prefix).
    // Code from Adam Barth.
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

    // Attach a media stream to an element.
    attachMediaStream = function(element, stream) {
        element.src = webkitURL.createObjectURL(stream);
    };

    reattachMediaStream = function(to, from) {
        to.src = from.src;
    };

    // The representation of tracks in a stream is changed in M26.
    // Unify them for earlier Chrome versions in the coexisting period.
    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function() {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function() {
            return this.audioTracks;
        };
    }

    // New syntax of getXXXStreams method in M26.
    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function() {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
            return this.remoteStreams;
        };
    }
} else {
    console.log("Browser does not appear to be WebRTC-capable");
}

window.moz = !! navigator.mozGetUserMedia;

function WebrtcFirebase(options) {
//    Object.apply(this, arguments);
    var self = this;
    this.firebaseUrl = options.firebaseUrl;
    this.channel = options.channel;
    this.guid = options.guid;

    this.init = function () {
//            console.log("init", this.pc1, this.pc2);
        var sdp="";

        var cfg = {"iceServers":[{"url":"stun:23.21.150.121"}]},
            con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] };

        /* THIS IS ALICE, THE CALLER/SENDER */

        var pc1 = new RTCPeerConnection(cfg, con),
            dc1 = null, tn1 = null;
        this.pc1 = pc1;

        var activedc;

        var pc1icedone = false;

        function setOffer(offer) {
            var offerDesc = new RTCSessionDescription(JSON.parse(offer));
            handleOfferFromPC1(offerDesc);
        };

        function setAnswer(answer) {
            var answerDesc = new RTCSessionDescription(JSON.parse(answer));
            handleAnswerFromPC2(answerDesc);
        };

        function sendMessage(message) {
            if (message) {
                var channel = new RTCMultiSession();
                writeToChatLog(message, "text-success");
                return channel.send({message: message});
            }
            return false;
        };
        self.sendMessage = sendMessage;

        function setupDC1() {
            try {
                var fileReceiver1 = new FileReceiver();
                dc1 = pc1.createDataChannel('test', {reliable:true});
                activedc = dc1;
//                    console.log("Created datachannel (pc1)");
                dc1.onopen = function (e) {
                    self.onOpen();
                }
                dc1.onmessage = function (e) {
//                    console.log("Got message (pc1)", e.data);
                    if (e.data.size) {
                        fileReceiver1.receive(e.data, {});
                    }
                    else {
                        if (e.data.charCodeAt(0) == 2) {
                            // The first message we get from Firefox (but not Chrome)
                            // is literal ASCII 2 and I don't understand why -- if we
                            // leave it in, JSON.parse() will barf.
                            return;
                        }
                        var data = JSON.parse(e.data);
                        if (data.type === 'file') {
                            fileReceiver1.receive(e.data, {});
                        }
                        else {
                            if (self.messageCallback) self.messageCallback(data.message);
                            writeToChatLog(data.message, "text-info");
                        }
                    }
                };
                dc1.onclose = function () {
                    console.log("dc1 The Data Channel is Closed");
                };
            } catch (e) { console.warn("No data channel (pc1)", e); }
        }

        function createLocalOffer() {
            setupDC1();
            pc1.createOffer(function (desc) {
                pc1.setLocalDescription(desc, function () {});
//                    console.log("created local offer", desc);
            }, function () {console.warn("Couldn't create offer");});
        }
        this.createLocalOffer = createLocalOffer;

        pc1.onicecandidate = function (e) {
            if (e.candidate == null) {
                sdp = JSON.stringify(pc1.localDescription);
                self.firebaseRef.set(sdp);
            }
        };

        function handleOnconnection() {
            console.log("Datachannel connected");
            writeToChatLog("Datachannel connected", "text-success");
        }

        pc1.onconnection = handleOnconnection;

        function onRemoveStream(state) {
            console.log("onRemoveStream", state);
        }

        function onsignalingstatechange(state) {
//            console.log("onsignalingstatechange", state);
        }

        function oniceconnectionstatechange(state) {
//            console.log("oniceconnectionstatechange", state);
        }

        function onicegatheringstatechange(state) {
//            console.log("onicegatheringstatechange", state);
        }

        pc1.onRemoveStream = onRemoveStream;
        pc1.onsignalingstatechange = onsignalingstatechange;
        pc1.oniceconnectionstatechange = oniceconnectionstatechange;
        pc1.onicegatheringstatechange = onicegatheringstatechange;

        function handleAnswerFromPC2(answerDesc) {
            pc1.setRemoteDescription(answerDesc);
        }

        function handleCandidateFromPC2(iceCandidate) {
            pc1.addIceCandidate(iceCandidate);
        }


        /* THIS IS BOB, THE ANSWERER/RECEIVER */

        var pc2 = new RTCPeerConnection(cfg, con),
            dc2 = null;
        this.pc2 = pc2;

        var pc2icedone = false;

        pc2.ondatachannel = function (e) {
            var fileReceiver2 = new FileReceiver();
            var datachannel = e.channel || e; // Chrome sends event, FF sends raw channel
//                console.log("Received datachannel (pc2)", arguments);
            dc2 = datachannel;
            activedc = dc2;
            dc2.onopen = function() {
                self.onOpen();
            };
            dc2.onmessage = function (e) {
//                console.log("Got message (pc2)", e.data);
                if (e.data.size) {
                    fileReceiver2.receive(e.data, {});
                }
                else {
                    var data = JSON.parse(e.data);
                    if (data.type === 'file') {
                        fileReceiver2.receive(e.data, {});
                    }
                    else {
                        if (self.messageCallback) self.messageCallback(data.message);
                        writeToChatLog(data.message, "text-info");
                    }
                }
            };
            dc2.onclose = function () {
                console.log("dc2 The Data Channel is Closed");
            };
        };

        function handleOfferFromPC1(offerDesc) {
            pc2.setRemoteDescription(offerDesc);
            pc2.createAnswer(function (answerDesc) {
                writeToChatLog("Created local answer", "text-success");
//                    console.log("Created local answer: ", answerDesc);
                pc2.setLocalDescription(answerDesc);
            }, function () { console.warn("No create answer"); });
        }

        pc2.onicecandidate = function (e) {
            if (e.candidate == null) {
                sdp = JSON.stringify(pc2.localDescription);
                self.firebaseRef.set(sdp);
            }
        };

        pc2.onRemoveStream = onRemoveStream;
        pc2.onsignalingstatechange = onsignalingstatechange;
        pc2.oniceconnectionstatechange = oniceconnectionstatechange;
        pc2.onicegatheringstatechange = onicegatheringstatechange;

        function handleCandidateFromPC1(iceCandidate) {
            pc2.addIceCandidate(iceCandidate);
        }

        pc2.onaddstream = function (e) {
            console.log("Got remote stream", e);
            var el = new Audio();
            el.autoplay = true;
            attachMediaStream(el, e.stream);
        };

        pc2.onconnection = handleOnconnection;

        function writeToChatLog(message, message_type) {
//            console.log(">>>", message_type, message);
        }

        var RTCMultiSession = function(options) {
            return {
                send: function (message) {
                    if (moz && message.file)
                        data = message.file;
                    else
                        data = JSON.stringify(message);

                    if (activedc) activedc.send(data);
                }
            }
        };

        var FileSender = {
            send: function (config) {
                var channel = config.channel || new RTCMultiSession();
                var file = config.file;

                /* if firefox nightly: share file blob directly */
                if (moz) {
                    /* used on the receiver side to set received file name */
                    channel.send({
                        fileName: file.name,
                        type: 'file'
                    });

                    /* sending the entire file at once */
                    channel.send({
                        file: file
                    });

                    if (config.onFileSent) config.onFileSent(file);
                }

                /* if chrome */
                if (!moz) {
                    var reader = new window.FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = onReadAsDataURL;
                }

                var packetSize = 1000 /* chars */ ,
                    textToTransfer = '',
                    numberOfPackets = 0,
                    packets = 0;

                function onReadAsDataURL(event, text) {
                    var data = {
                        type: 'file'
                    };

                    if (event) {
                        text = event.target.result;
                        numberOfPackets = packets = data.packets = parseInt(text.length / packetSize);
                    }

                    if (config.onFileProgress)
                        config.onFileProgress({
                            remaining: packets--,
                            length: numberOfPackets,
                            sent: numberOfPackets - packets
                        });

                    if (text.length > packetSize)
                        data.message = text.slice(0, packetSize);
                    else {
                        data.message = text;
                        data.last = true;
                        data.name = file.name;

                        if (config.onFileSent) config.onFileSent(file);
                    }

                    channel.send(data);

                    textToTransfer = text.slice(data.message.length);

                    if (textToTransfer.length)
                        setTimeout(function () {
                            onReadAsDataURL(null, textToTransfer);
                        }, 500);
                }
            }
        };

        function FileReceiver() {
            var content = [],
                fileName = '',
                packets = 0,
                numberOfPackets = 0;

            function receive(data, config) {
                /* if firefox nightly & file blob shared */
                if (moz) {
                    if (!data.size) {
                        var parsedData = JSON.parse(data);
                        if (parsedData.fileName) {
                            fileName = parsedData.fileName;
                        }
                    }
                    else {
                        var reader = new window.FileReader();
                        reader.readAsDataURL(data);
                        reader.onload = function (event) {
                            FileSaver.SaveToDisk(event.target.result, fileName);
                            if (config.onFileReceived) config.onFileReceived(fileName);
                        };
                    }
                }

                if (!moz) {
                    if (data.packets)
                        numberOfPackets = packets = parseInt(data.packets);

                    if (config.onFileProgress)
                        config.onFileProgress({
                            remaining: packets--,
                            length: numberOfPackets,
                            received: numberOfPackets - packets
                        });

                    content.push(data.message);

                    if (data.last) {
                        FileSaver.SaveToDisk(content.join(''), data.name);
                        if (config.onFileReceived)
                            config.onFileReceived(data.name);
                        content = [];
                    }
                }
            }

            return {
                receive: receive
            };
        }

        var FileSaver = {
            SaveToDisk: function (fileUrl, fileName) {
                var save = document.createElement('a');
                save.href = fileUrl;
                save.target = '_blank';
                save.download = fileName || fileUrl;

                var evt = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });

                save.dispatchEvent(evt);

                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            }
        };





        this.firebaseRef = new Firebase(this.firebaseUrl + "/wrtc_"+this.channel);
        this.hostRef = new Firebase(this.firebaseUrl + "/wrtc_host_"+this.channel);
        this.guestRef = new Firebase(this.firebaseUrl + "/wrtc_guest_"+this.channel);
        this.hostRef.once("value", function(snapshot) {
            var data = snapshot.val();
            if (!data) {
                this.hostRef.set(this.guid);
                this.hostRef.onDisconnect().remove();
                var onGuest = _.after(2,function(snapshot) {
                    var data = snapshot.val();
                    if (!data) {
//                            console.log("guest left")
                        this.reset();
                    }
                    else if (data!=this.guid)
                        createLocalOffer();
                }.bind(this));
                this.guestRef.on("value", onGuest);
            } else {
                this.guestRef.set(this.guid);
                this.guestRef.onDisconnect().remove();
                var onHost = _.after(2,function(snapshot) {
                    var data = snapshot.val();
                    if (!data) {
//                            console.log("host left")
                        this.reset();
                    }
                }.bind(this));
                this.hostRef.on("value", onHost);
            }
        }.bind(this));
        this.firebaseRef.onDisconnect().remove();
        var onValue = _.after(2,function(snapshot) {
            var data = snapshot.val();
            if (data && data!=sdp) {
                var desc = JSON.parse(data);
                if (desc.type=="offer") {
                    setOffer(data);
                } else {
                    setAnswer(data);
                }
            }
        }.bind(this));
        this.firebaseRef.on("value", onValue);
    };
    this.reset = function () {
        this.firebaseRef.off();
        this.hostRef.off();
        this.guestRef.off();
        this.firebaseRef.remove();
        this.hostRef.remove();
        this.guestRef.remove();
        delete this.firebaseRef;
        delete this.hostRef;
        delete this.guestRef;
        delete this.pc1;
        delete this.pc2;
        this.init();
    };
    this.init();
}
WebrtcFirebase.prototype = Object.create(Object.prototype);
WebrtcFirebase.prototype.constructor = WebrtcFirebase;
WebrtcFirebase.DEFAULT_OPTIONS = {};