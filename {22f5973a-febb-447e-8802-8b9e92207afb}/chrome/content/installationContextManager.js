/* (C) 2007 Declan Naughton <piratepenguin@gmail.com>
   Licensed under the GNU General Public License version 3 or later,
   available at http://www.gnu.org/licenses/gpl.html
   You may also have received a copy in a LICENSE file along with
   this distribution.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details. */

var fpmIInstallationContextManager;
var contextList, newOrLoad, contexts = new Array (), originalContexts = new Array ();
var selectedContextNum, modifiedContextNums = new Array ();

function init () {
  fpmIInstallationContextManager = Components.classes["@piratepenguin.is-a-geek.com/fpm/installationContextManager;1"]
                                             .getService(Components.interfaces.fpmIInstallationContextManager);
  var context, newItem, radio, vbox, titleLabel, pathLabel;
  originalContexts = fpmIInstallationContextManager.getAllContexts ({});
  //contexts = fpmIInstallationContextManager.getAllContexts ({});
  // no contexts, so create one
  if (originalContexts.length == 0) {
    var home = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties)
                     .get("Home", Components.interfaces.nsIFile);
    home.appendRelativePath('fpm');
    // TO FINISH
  }
  for (var i = 0; i < originalContexts.length; i++) {
    contexts[i] = Components.classes["@piratepenguin.is-a-geek.com/fpm/installationContext;1"]
                            .createInstance(Components.interfaces.fpmIInstallationContext);
    contexts[i].name = originalContexts[i].name;
    contexts[i].root = originalContexts[i].root;
    contexts[i].autoResolveDeps = originalContexts[i].autoResolveDeps;
    contexts[i].perPackageDirs = originalContexts[i].perPackageDirs;
    contexts[i].autoUpdate = originalContexts[i].autoUpdate;
    //contexts.push (originalContexts[i]);
  }
  contextList = document.getElementById('contextList');
  newOrLoad = document.getElementById('newOrLoad');
  var activeContext = fpmIInstallationContextManager.activeContext;
  for (var j = 0; j < contexts.length; j++) {
    var active;
    if (activeContext.root.path == originalContexts[j].root.path)
      active = true;
    else
      active = false;
    addContext (originalContexts[j], active);
    if (active)
      contextList.selectedIndex = j;
  }
  //contextList.selectedIndex = 0;
}

function saveContexts () {
  for (var i = 0; i < modifiedContextNums.length; i++) {
    fpmIInstallationContextManager.modifyContext (originalContexts[modifiedContextNums[i]], contexts[modifiedContextNums[i]]);
  }
  fpmIInstallationContextManager.activeContext = contexts[document.getElementById('contextListRadioGroup').selectedIndex];
}

function contextListOnSelect () {
  if (contextList.selectedIndex != contexts.length && (contextList.selectedIndex != selectedContextNum)) {
    //alert ('changed! ' + contextList.selectedIndex);
    selectedContextNum = contextList.selectedIndex;

    var context = contexts[selectedContextNum];
    document.getElementById('selectedContextTitle').textContent = context.name;
    document.getElementById('autoResolveDeps').checked = context.autoResolveDeps;
    document.getElementById('perPackageDirs').checked = context.perPackageDirs;
    document.getElementById('autoUpdate').checked = context.autoUpdate;
    document.getElementById('filefield').file = context.root;
  }
}

function contextPrefChanged (event) {
  contexts[selectedContextNum][event.target.id] = event.target.checked;
  //alert (contexts[selectedContextNum][event.target.id] + ' ' + originalContexts[selectedContextNum][event.target.id]);
  var dontAdd = false;
  for (var i = 0; i < modifiedContextNums.length; i++) {
    if (modifiedContextNums[i] == selectedContextNum) {
      dontAdd = true;
    }
  }
  if (!dontAdd) modifiedContextNums.push(selectedContextNum);
  //dump ('@@@@ ' + contexts[selectedContextNum][event.target.id] + '\n');
  /*switch (event.target.tagId) {
    case 'autoResolveDeps':
      contexts[selectedContextNum].autoResolveDeps = event.target.value
      dump ('@@@@ ' + contexts[selectedContextNum].autoResolveDeps + '\n');
      break;
    //case: ''
  }*/
}

function addContext (context /* fpmIInstallationContext */, active /* boolean */) {
  var newItem, radio, vbox, titleLabel, pathLabel;
  newItem = document.createElement('richlistitem');
  radio = document.createElement('radio');
  if (active) radio.setAttribute ('selected', 'true');
  vbox = document.createElement('vbox');
  titleLabel = document.createElement ('label');
  titleLabel.textContent = context.name;
  pathLabel = document.createElement ('label');
  pathLabel.setAttribute ('style', 'font-size: small');
  pathLabel.textContent = context.root.path;
  vbox.appendChild (titleLabel);
  vbox.appendChild (pathLabel);
  newItem.appendChild(radio);
  newItem.appendChild(vbox);
  contextList.insertBefore (newItem, newOrLoad);
  return newItem;
}

function contextTitleTextboxFinished () {
  var contextTitleTextbox = document.getElementById('contextTitleTextbox');
  var name = contextTitleTextbox.value;
  var item = contextTitleTextbox.parentNode;
  var radio = document.createElement('radio');
  var vbox = document.createElement('vbox');
  var titleLabel = document.createElement ('label');
  titleLabel.textContent = contextTitleTextbox.value;
  var pathLabel = document.createElement ('label');
  pathLabel.textContent = 'waiting to be configured..';
  pathLabel.setAttribute ('style', 'font-size: small; color: red');
  pathLabel.setAttribute ('id', 'pathLabel');
  vbox.appendChild (titleLabel);
  vbox.appendChild (pathLabel);
  item.removeChild(contextTitleTextbox);
  item.appendChild (radio);
  item.appendChild (vbox);

  var root = chooseRootDirectory();
  var theNewContext = Components.classes["@piratepenguin.is-a-geek.com/fpm/installationContext;1"]
                                .createInstance(Components.interfaces.fpmIInstallationContext);
  theNewContext.root = root;
  theNewContext.name = name;
  contexts.push(theNewContext);
  fpmIInstallationContextManager.addContext(theNewContext); // bleh, root not set!
}

function newContext () {
  //contextList.removeChild (newOrLoad);
  var newItem = document.createElement('richlistitem');
  /*var newItemRadio = document.createElement('radio');
  newItemRadio.setAttribute('label', 'New');
  newItem.appendChild (newItemRadio);*/
  var newItemTextbox = document.createElement('textbox');
  newItemTextbox.setAttribute ('id', 'contextTitleTextbox');
  newItemTextbox.setAttribute ('flex', '1');
  newItemTextbox.setAttribute ('value', 'New Installation Context');
  //newItemTextbox.setAttribute ('onblur', 'contextTitleTextboxFinished()');
  newItemTextbox.setAttribute ('onkeypress', 'if (event.keyCode == 13) { event.preventDefault(); contextTitleTextboxFinished(); }');
  newItem.appendChild(newItemTextbox);
  //contextList.appendChild(newItem);
  contextList.insertBefore (newItem, newOrLoad);
  //contextList.appendChild (newOrLoad);
  contextList.selectedItem = newItem;
  newItemTextbox.select();
  newItemTextbox.focus();
  newItemTextbox.onblur = function () { contextTitleTextboxFinished(); };
}

function chooseRootDirectory() {
  const nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init (window, "Select root installation directory", nsIFilePicker.modeGetFolder);
  var rv = fp.show();
  if (rv == nsIFilePicker.returnOK) {
    var file = fp.file;
    var filefield = document.getElementById ('filefield');
    filefield.file = file;

    contexts[selectedContextNum].root = file;
    var pathLabel = contextList.childNodes[selectedContextNum].lastChild.lastChild;
    pathLabel.textContent = file.path;
    var dontAdd = false;
    for (var i = 0; i < modifiedContextNums.length; i++) {
      if (modifiedContextNums[i] == selectedContextNum) {
        dontAdd = true;
      }
    }
    if (!dontAdd) modifiedContextNums.push(selectedContextNum);

    return file;
  } else {
    // TODO
  }
}

function chooseRootDirectoryForLoad () {
  const nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init (window, "Select root installation directory to load from", nsIFilePicker.modeGetFolder);
  var rv = fp.show();
  if (rv == nsIFilePicker.returnOK) {
    var file = fp.file;
    var newContext = fpmIInstallationContextManager.loadContext(file, {});
    contexts.push (newContext);
    originalContexts.push (newContext);
    var item = addContext (newContext);
    contextList.selectedItem = item;
    selectedContextNum = contexts.length - 1;
  }
}