/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    mediaRec: null,
    mediaTimer: null,
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('start').addEventListener('click', this.startRecord, false);
        document.getElementById('stop').addEventListener('click', this.stopRecord, false);
        document.getElementById('pause').addEventListener('click', this.pauseRecord, false);
        document.getElementById('resume').addEventListener('click', this.resumeRecord, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    startRecord: function() {
      var src = null;
      if (device.platform.toLowerCase() == 'android') {
        src = 'myrecording.amr';
      } else {
        src = 'myrecording.wav';
      }
      app.mediaRec = new Media(src,
          // success callback
          function() {
              console.log("recordAudio():Audio Success");
              var my_media = new Media(src,
                  // success callback
                  function () {
                      console.log("playAudio():Audio Success");
                  },
                  // error callback
                  function (err) {
                      console.log("playAudio():Audio Error: " + err);
                  }
              );
              // Play audio
              my_media.play();
          },

          // error callback
          function(err) {
              console.log("recordAudio():Audio Error: "+ err.code);
          }, function(status) {
              console.log("status = " + status);
          });

      // Record audio
      app.mediaRec.startRecord();

      app.mediaTimer = setInterval(function () {
          // get media position
          app.mediaRec.getCurrentAmplitude(
              // success callback
              function (amp) {
                  console.log(amp + "%");
              },
              // error callback
              function (e) {
                  console.log("Error getting amp=" + e);
              }
          );
      }, 1000);
    },
    stopRecord: function() {
      app.mediaRec.stopRecord();
      clearInterval(app.mediaTimer);
    },
    pauseRecord: function() {
      app.mediaRec.pauseRecord();
    },
    resumeRecord: function() {
      app.mediaRec.resumeRecord();
    }
};

app.initialize();
