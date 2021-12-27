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
    // Toasts
    const Toasts = {
        Show: function(element) {
            $(element).insertAfter('#InsertAfterHere');

            var toastElList = [].slice.call(document.querySelectorAll('.toast'));
            var toastList = toastElList.map(function (toastEl) {
                return new bootstrap.Toast(toastEl, { animation: true, autohide: true, delay: 5000 });
            });

            toastList[0].show();
        },
        Normal: function(TEXT, COLOR) {
            var text = TEXT || "Lorem ipsum";
            var color = COLOR || "primary";
            function Color(c) {
                switch(c) {
                    case 'primary':
                        return '#0d6efd';
                    case 'secondary':
                        return '#6c757d';
                    case 'success':
                        return '#198754';
                    case 'info':
                        return '#0dcaf0';
                    case 'warning':
                        return '#ffc107';
                    case 'danger':
                        return '#dc3545';
                    case 'light':
                        return '#f8f9fa';
                    case 'dark':
                        return '#212529';
                    default:
                        return '#0d6efd';
                }
            }

            function GetToastElement() {
                return `<div class="toast hide" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><svg class="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="${Color(color)}"></rect></svg><strong class="me-auto">AppLibrary</strong><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body">${text}</div></div>`
            }

            Toasts.Show(GetToastElement());
        },
        Simple: function(TEXT, COLOR) {
            var text = TEXT || "Lorem ipsum";
            var color = COLOR || "primary";
            function GetToastElement() {
                switch(color) {
                    case 'primary':
                        return `<div class="toast hidr align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'secondary':
                        return `<div class="toast hidr align-items-center text-white bg-secondary border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'success':
                        return `<div class="toast hidr align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'info':
                        return `<div class="toast hidr align-items-center text-white bg-info border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'warning':
                        return `<div class="toast hidr align-items-center text-white bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'danger':
                        return `<div class="toast hidr align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'light':
                        return `<div class="toast hidr align-items-center text-black bg-light border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-black" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    case 'dark':
                        return `<div class="toast hidr align-items-center text-white bg-dark border-0" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                    default:
                        return `<div class="toast hide align-items-center" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">${text}</div><button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div></div>`;
                }
            }

            Toasts.Show(GetToastElement());
        }
    };

    // ID 
    const ID = {
        Characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        SessionEntry: 'ID',
        Generate: function(length) {
            var result = '';
            var charactersLength = this.Characters.length;
            for ( var i = 0; i < length; i++ ) { result += this.Characters.charAt(Math.floor(Math.random() * charactersLength)); }

            if(WebStorage(sessionStorage).Get(this.SessionEntry) != -1) {
                var OBJ = JSON.parse(WebStorage(sessionStorage).Get(this.SessionEntry));
                if(OBJ.includes(result)) {
                    var SameLenghtOBJ = [];
                    OBJ.forEach(e => {
                        if(e.length == length) { SameLenghtOBJ.push(e); }
                    });

                    if(SameLenghtOBJ.length == charactersLength) {
                        console.error(`Maximum stack size reached in this session from '${length}' char length unique ID.`);
                    } else {
                        return ID.Generate(length);
                    }
                } else {
                    OBJ.push(result);
                    WebStorage(sessionStorage).Set(this.SessionEntry, JSON.stringify(OBJ));
                    return result;
                }
            } else {
                var OBJ = [];
                if(OBJ.includes(result)) {
                    var SameLenghtOBJ = [];
                    OBJ.forEach(e => {
                        if(e.length == length) { SameLenghtOBJ.push(e); }
                    });

                    if(SameLenghtOBJ.length == charactersLength) {
                        console.error(`Maximum stack size reached in this session from '${length}' char length unique ID.`);
                    } else {
                        return ID.Generate(length);
                    }
                } else {
                    OBJ.push(result);
                    WebStorage(sessionStorage).Set(this.SessionEntry, JSON.stringify(OBJ));
                    return result;
                }
                WebStorage(sessionStorage).Set(this.SessionEntry, JSON.stringify(OBJ));
                return result;
            }
        },
        Unlock: function(id) {
            var OBJ = JSON.parse(WebStorage(sessionStorage).Get(this.SessionEntry));
            OBJ = OBJ.filter(item => item !== id);
            WebStorage(sessionStorage).Set(this.SessionEntry, JSON.stringify(OBJ));
        },
        UnlockAll: function() {
            WebStorage(sessionStorage).Remove(this.SessionEntry);
        }
    };

    // Storage
    const WebStorage = (storageType) => {
        const storage = storageType || localStorage;

        function Set(key, value) {
            storage.setItem(key, value);
            return storage.getItem(key);
        }

        function Get(key) {
            var value;
            if (storage.getItem(key) === null) {
                value = -1;
            } else {
                value = storage.getItem(key)
            }
            return value;
        }

        function Remove(key) {
            storage.removeItem(key);
            return 0;
        }

        function Clear() {
            storage.clear();
            return 0;
        }

        return { Set, Get, Remove, Clear };
    }

    // Page Handler
    const PageHandler = {
        Ready: false,
        Current: null,
        Data: {},
        Pages: [],
        Init: () => {
            window.api.readFiles('app/pages/', function(filename, content) {
                PageHandler.Data[filename] = content;
                PageHandler.Pages.push(filename.split('.')[0]);
            }, function(err) { 
                throw err; 
            });
            PageHandler.Current = "Preload"
            PageHandler.Ready = true;
        },
        Redirect: (page) => {
            if(PageHandler.Ready) {
                if(jQuery.inArray(page, PageHandler.Pages) != -1) {
                    if(page != "Auth") {
                        if(AuthSystem.User != null) {
                            if(page == PageHandler.Current) {
                                console.error(`[RENDERER] "${page}" already loaded.`);
                            } else {
                                $('.page').after(`<div id="RENDERER_ELEMENT" renderer="${page}"></div>`);
                                PageHandler.CheckForChanges();
                            }
                        } else {
                            console.error('[RENDERER] Authentication failure.');
                            if(PageHandler.Current != "Auth") {
                                $('.page').after(`<div id="RENDERER_ELEMENT" renderer="Auth"></div>`);
                                PageHandler.CheckForChanges();
                            }     
                        }
                    } else {
                        if(page == PageHandler.Current) {
                            console.error(`[RENDERER] "${page}" already loaded.`);
                        } else {
                            $('.page').after(`<div id="RENDERER_ELEMENT" renderer="${page}"></div>`);
                            PageHandler.CheckForChanges();
                        }
                    }
                } else {
                    console.error(`No page found with name '${page}'`);
                }
            } else {
                console.error('Page handler not ready');
            }
        },
        CheckForChanges: () => {
            var rendererAdd = $('#RENDERER_ELEMENT');

            var NextPage = `${rendererAdd.attr('renderer')}.html`;
            $(`#RENDERER_ELEMENT`).replaceWith(PageHandler.Data[NextPage]);
                
            $(`#${PageHandler.Current}`).fadeOut(1000);

            $(`#${NextPage.split('.')[0]}`).fadeIn(1800);

            setTimeout(function() {
                $(`#${PageHandler.Current}`).remove();
                PageHandler.Current = NextPage.split('.')[0];
            }, 2000);
        }
    }

    window.Renderer = new Object();
    
    window.Renderer.ID = new Object();
    window.Renderer.ID.Generate = ID.Generate;
    window.Renderer.ID.Unlock = ID.Unlock;
    window.Renderer.ID.UnlockAll = ID.UnlockAll;
    
    window.Renderer.Toasts = new Object();
    window.Renderer.Toasts.Normal = Toasts.Normal;
    window.Renderer.Toasts.Simple = Toasts.Simple;
    
    window.Renderer.Page = new Object();
    window.Renderer.Page.Redirect = PageHandler.Redirect;

    window.Renderer.WebStorage = WebStorage;

    PageHandler.Init();
})();
