/**
 * @license
 * Copyright 2021 Kukk Péter
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// All of the Node.js apis are available in the preload process.
// It has the same sandbox as a Chrome extension.
const {
  ipcRenderer
} = require('electron');
const fs = require('fs');

const win = require('@electron/remote').getCurrentWindow();
const appVersion = require('@electron/remote').app.getVersion();
const path = require('path');

document.onreadystatechange = (event) => {
  if (document.readyState == "complete") {
      handleWindowControls();
  }
};

window.onbeforeunload = (event) => {
  /* If window is reloaded, remove win event listeners
  (DOM element listeners get auto garbage collected but not
  Electron win listeners as the win is not dereferenced unless closed) */
  win.removeAllListeners();
}

function handleWindowControls() {
  // Make minimise/maximise/restore/close buttons work when they are clicked
  document.getElementById('min-button').addEventListener("click", event => {
      win.minimize();
  });

  document.getElementById('max-button').addEventListener("click", event => {
      win.maximize();
  });

  document.getElementById('restore-button').addEventListener("click", event => {
      win.unmaximize();
  });

  document.getElementById('close-button').addEventListener("click", event => {
      win.close();
  });

  // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
  toggleMaxRestoreButtons();
  win.on('maximize', toggleMaxRestoreButtons);
  win.on('unmaximize', toggleMaxRestoreButtons);

  function toggleMaxRestoreButtons() {
      if (win.isMaximized()) {
          document.body.classList.add('maximized');
      } else {
          document.body.classList.remove('maximized');
      }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.Versions = (type) => {
    var t = type || 'console';

    switch(t) {
      case 'html': 
        return `<div id="versions"><h1>Versions</h1>Application: <span id="app-version">${appVersion}</span><br>Firebase: <span id="firebase-version">9.6.1</span><br>Ares: <span id="ares-version">${process.versions.ares}</span><br>Chromium: <span id="chrome-version">${process.versions.chrome}</span><br>Electron: <span id="electron-version">${process.versions.electron}</span><br>Node.JS: <span id="node-version">${process.versions.node}</span><br>OpenSSL: <span id="openssl-version">${process.versions.openssl}</span><br>uv: <span id="uv-version">${process.versions.uv}</span><br>v8: <span id="v8-version">${process.versions.v8}</span><br>zlib: <span id="zlib-version">${process.versions.zlib}</span></div>`;
      case 'console':
        console.log(`Application: ${appVersion}\nFirebase: 9.6.1\nAres: ${process.versions.ares}\nChromium: ${process.versions.chrome}\nElectron: ${process.versions.electron}\nNode.JS: ${process.versions.node}\nOpenSSL: ${process.versions.openssl}\nuv: ${process.versions.uv}\nv8: ${process.versions.v8}\nzlib: ${process.versions.zlib}`);
        break;
      default:
        return `Application: ${appVersion}\nFirebase: 9.6.1\nAres: ${process.versions.ares}\nChromium: ${process.versions.chrome}\nElectron: ${process.versions.electron}\nNode.JS: ${process.versions.node}\nOpenSSL: ${process.versions.openssl}\nuv: ${process.versions.uv}\nv8: ${process.versions.v8}\nzlib: ${process.versions.zlib}`;
    }
  }
});

window.api = new Object();
window.api.Send = (channel, data) => {
  ipcRenderer.send(channel, data);
}

window.api.Receive = (channel, func) => {
  ipcRenderer.on(channel, (event, ...args) => func(...args));
}

window.api.Remove = (channel) => {
  ipcRenderer.removeAllListeners(channel);
}

window.api.Version = (type = "app") => {
  switch(type) {
    case 'app':
      return appVersion;
    default:
      return process.versions[type]
  }
}

window.api.readFiles = (dir, onFileContent, onError) => {
  var dirname = path.join(__dirname, dir);
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}