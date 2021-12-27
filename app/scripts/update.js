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

(function() {
    function formatBytes(a, b = 2) {
        if (0 === a) return "0 Bytes";
        const c = 0 > b ? 0 : b,
            d = Math.floor(Math.log(a) / Math.log(1024));
        return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    }

    const Variables = {
        Modal: new bootstrap.Modal(document.getElementById('UpdateModal'), { keyboard: false }),
        Buttons: {
          CheckForUpdate: $('#update-button'),
          CheckForUpdateIcon: $('#update-button-icon'),
          Cancel: $('#UpdateModalCancelBTN'),
          Update: $('#UpdateModalUpdateBTN')
        },
        Containers: {
          Message: $('#message'),
          BodyMessage: $('#body-message'),
          Label1: $('#UpdateModalLabel1'),
          Label2: $('#UpdateModalLabel2'),
          Versions: $('#CurrentVersions')
        },
        Progress: {
          Container: $('#UpdateProgressDiv'),
          Bar: $('#UpdateProgress')
        },
        ManualChecked: false
    }

    $('#node-version').html(window.api.Version('node'));
    $('#chrome-version').html(window.api.Version('chrome'));
    $('#electron-version').html(window.api.Version('electron'));

    // IPC EventHandler: No Update Available
    window.api.Receive('NoUpdateAvailable', () => {
        if(Variables["ManualChecked"]) {
          Variables["Modal"].show();
  
          Variables["Containers"]["Label1"].html('AppLibrary is up to date.');
          Variables["Containers"]["Label2"].html(`Current: v${window.api.Version()}`);
  
          Variables["Containers"]["BodyMessage"].html('No update available.');
  
          Variables["Containers"]["Versions"].removeClass('hidden');
  
          Variables["Buttons"]["Cancel"].removeClass('hidden');
          Variables["Buttons"]["Update"].addClass('hidden');
        } else {
          console.log(`No update available. Current version: v${window.api.Version()}`);
        }

        Variables["Buttons"]["CheckForUpdateIcon"].removeClass('checkingForUpdate');
  
        Variables["ManualChecked"] = false;
    });
  
    // IPC EventHandler: Update Available
    window.api.Receive('update_available', (obj) => {
        Variables["Buttons"]["CheckForUpdateIcon"].removeClass('checkingForUpdate');
        Variables["Buttons"]["CheckForUpdateIcon"].addClass('newUpdateAvailable');

        Variables["Modal"].show();
  
        Variables["Containers"]["Label1"].html('Update available');
        Variables["Containers"]["Label2"].html(`New: v${obj.version}<br>Current: v${window.api.Version()}`);
  
        Variables["Containers"]["BodyMessage"].html(`Update released on ${obj.releaseDate}<br>Click 'Update' to start update process.`);
        Variables["Containers"]["Versions"].addClass('hidden');
  
        Variables["Buttons"]["Cancel"].removeClass('hidden');
        Variables["Buttons"]["Update"].removeClass('hidden');
    });
  
    // IPC EventHandler: Update Progress
    window.api.Receive('UpdateProgress', (obj) => {
        Variables["Containers"]["BodyMessage"].html(`Download speed: ${formatBytes(obj.bytesPerSecond)}/s<br>(${formatBytes(obj.transferred)}/${formatBytes(obj.total)})`);
            
        Variables["Progress"]["Bar"].html(`${Math.round(obj.percent)}%`);
        Variables["Progress"]["Bar"].css('width', `${Math.round(obj.percent)}%`);
    });
  
    // IPC EventHandler: Update Downloaded
    window.api.Receive('update_downloaded', () => {
        Variables["Buttons"]["CheckForUpdateIcon"].removeClass('downloadingUpdate');
        Variables["Buttons"]["CheckForUpdateIcon"].addClass('downloaded');

        Variables["Containers"]["Message"].html("The application will start in <span id='InstallSeconds' class='fw-bold'>5</span> seconds.");
  
        Variables["Containers"]["BodyMessage"].addClass('hidden');
  
        var Seconds = $('#InstallSeconds');
        let i = 6;
  
        setInterval(function() {
          if(i == 0) {
            Variables["Containers"]["Message"].html("Restarting...");
            window.api.Send('RestartAndInstall');
          } else {
            i--;
            Seconds.html(i);
          }
        }, 1000);
    });
  
    // Button EventHandler: Check For Update
    Variables["Buttons"]["CheckForUpdate"].on('click', function() {
        Variables["ManualChecked"] = true;
  
        window.api.Send('CheckForUpdate');
    });
  
    // Button EventHandler: Start update
    Variables["Buttons"]["Update"].on('click', function() {
        Variables["Buttons"]["Cancel"].addClass('hidden');
        Variables["Buttons"]["Update"].addClass('hidden');
  
        Variables["Progress"]["Container"].removeClass('hidden');
  
        Variables["Containers"]["Message"].removeClass('hidden');
        Variables["Containers"]["Message"].html('The app will restart as soon as the update is downloaded.');
  
        window.api.Send('downloadUpdate');
        Variables["Buttons"]["CheckForUpdateIcon"].removeClass('newUpdateAvailable');
        Variables["Buttons"]["CheckForUpdateIcon"].addClass('downloadingUpdate');
    });

    console.log('Updater loaded.');
})();