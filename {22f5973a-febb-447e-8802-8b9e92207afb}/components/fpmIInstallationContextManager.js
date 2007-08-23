/* (C) 2007 Declan Naughton <piratepenguin@gmail.com>
   Licensed under the GNU General Public License version 3 or later,
   available at http://www.gnu.org/licenses/gpl.html
   You may also have received a copy in a LICENSE file along with
   this distribution.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details. */

const CLASS_ID = Components.ID("{41a78219-5d46-4470-b668-acacf2d39eff}");
const CLASS_NAME = "FPM Installation Context Manager";
const CONTRACT_ID = "@piratepenguin.is-a-geek.com/fpm/installationContextManager;1";

const nsISupports = Components.interfaces.nsISupports;
const fpmIInstallationContext = Components.interfaces.fpmIInstallationContext;

var contexts = new Array (), theActiveContext;

function initContext (contextRoot /* nsILocalFile */) {
  var contextConfigFile = Components.classes["@mozilla.org/file/local;1"]
                                    .createInstance(Components.interfaces.nsILocalFile);
  var contextConfigInStream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                                        .createInstance(Components.interfaces.nsIFileInputStream);
  var contextConfigSInStream = Components.classes["@mozilla.org/scriptableinputstream;1"]
                                         .createInstance(Components.interfaces.nsIScriptableInputStream); // TODO: explain this
  var context = Components.classes["@piratepenguin.is-a-geek.com/fpm/installationContext;1"]
                          .createInstance(Components.interfaces.fpmIInstallationContext);

  contextConfigFile.initWithFile(contextRoot);
  contextConfigFile.append('fpmInstallationContext.js');
  contextConfigInStream.init (contextConfigFile, -1, 0, 0);
  contextConfigSInStream.init(contextConfigInStream);

  var contextConfigString = ''; // shall hold stringified config
  var tempStr = contextConfigSInStream.read(4096);
  while (tempStr.length > 0) {
    contextConfigString += tempStr;
    tempStr = contextConfigSInStream.read(4096);
  } // at last we have the fpmInstallationContext.js file stringified to the contextConfigString variable

  var contextConfigObj = contextConfigString.parseJSON();
  context.name = contextConfigObj.name;
  context.root = contextRoot;
  context.autoResolveDeps = contextConfigObj.autoResolveDeps;
  context.perPackageDirs = contextConfigObj.perPackageDirs;
  context.autoUpdate = contextConfigObj.autoUpdate;
  context.username = contextConfigObj.username;

  //dump ('@@@@ ' + context.name + '\n');
  contexts.push (context);
  return context;
}

function fpmIInstallationContextManager () {
  var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                         .getService(Components.interfaces.mozIJSSubScriptLoader);
  loader.loadSubScript("chrome://fpm/content/json.js", {});
  this.init();
};

/*var numElements = 1;

function enumeratorImplementation () {};
enumeratorImplementation.prototype = {
  hasMoreElements: function () {
    //numElements--;
    if (numElements-- != 0)
      return true;
    else {
      numElements = 1;
      return false;
    }
  },
  getNext: function () {
    var data = "";
    var fpmInstallationContextFile = Components.classes["@mozilla.org/file/local;1"]
                                               .createInstance(Components.interfaces.nsILocalFile);
    fpmInstallationContextFile.initWithPath('/home/declan/fpm/fpmInstallationContext.js');
    var stream = Components.classes["@mozilla.org/network/file-input-stream;1"]
                           .createInstance(Components.interfaces.nsIFileInputStream);
    stream.init (fpmInstallationContextFile, -1, 0, 0);
    var sstream = Components.classes["@mozilla.org/scriptableinputstream;1"]
                            .createInstance(Components.interfaces.nsIScriptableInputStream);
    sstream.init(stream);
    var str = sstream.read(4096);
    while (str.length > 0) {
      data += str;
      str = sstream.read(4096);
    }
    //var data2 = '{ "perPackageDirs": true }';
    var contextSettings = data.parseJSON();
    //dump('&&&&& ' + contextSettings.autoUpdate + '\n');
    var context = Components.classes["@piratepenguin.is-a-geek.com/fpm/installationContext;1"] .createInstance(Components.interfaces.fpmIInstallationContext);
    context.name = contextSettings.name;
    var root = Components.classes["@mozilla.org/file/local;1"].
            createInstance(Components.interfaces.nsILocalFile);

    var path = '/home/declan/fpm/'; // TODO
    root.initWithPath (path);

    context.root = root;
    context.autoResolveDeps = contextSettings.autoResolveDeps;
    context.perPackageDirs = contextSettings.perPackageDirs;
    context.autoUpdate = contextSettings.autoUpdate;
    context.username = contextSettings.username;
    return context;
  }
};*/

function saveContext (context) {
  var newContextSaveObject = new Object ();
  newContextSaveObject.name = context.name;
  newContextSaveObject.autoResolveDeps = context.autoResolveDeps;
  newContextSaveObject.perPackageDirs = context.perPackageDirs;
  newContextSaveObject.autoUpdate = context.autoUpdate;
  //newContextSaveObject.username
  var saveString = newContextSaveObject.toJSONString(); // and so we have the string we need to save

  var contextConfigFile = Components.classes["@mozilla.org/file/local;1"]
                                    .createInstance(Components.interfaces.nsILocalFile);
  var contextConfigOutStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
                                         .createInstance(Components.interfaces.nsIFileOutputStream);

  var file = context.root.QueryInterface(Components.interfaces.nsILocalFile);
  contextConfigFile.initWithFile(file);
  contextConfigFile.append('fpmInstallationContext.js');
  contextConfigOutStream.init (contextConfigFile, 0x02 | 0x08 | 0x20, 0, 0);
  contextConfigOutStream.write (saveString, saveString.length);
  contextConfigOutStream.close ();
  //contextConfigInStream.init (contextConfigFile, -1, 0, 0);
  //contextConfigSInStream.init(contextConfigInStream);
  //dump ('{{{{ ' + saveString + ' ' + newContext.root.path + '\n');
}

fpmIInstallationContextManager.prototype = {
  //get enumerator () { return new enumeratorImplementation(); },

  /*get activeContext () {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
    var contextBranch = prefs.getBranch("fpm.");
    var activeContextNum = contextBranch.getIntPref("activeInstallationContext");
    return (contexts[activeContextNum]);*/
    /*var contextFolder = contextBranch.getComplexValue ("", Components.interfaces.nsILocalFile);
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i].root.path = contextFolder.path) {
        return contexts[i];
        break;
      }
    }*/
    //return new enumeratorImplementation();
  //},

  get activeContext () {
    return theActiveContext;
  },
  set activeContext (context) {
    //dump ('(((( ' + context.root.path + '\n');
    theActiveContext = context;
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
    var contextsBranch = prefs.getBranch("fpm.");
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i].root.path == context.root.path) {
        contextBranch.setIntPref("activeInstallationContext", i);
        break;
      }
    }
  },

  QueryInterface: function (aIID)
  {
    if (!aIID.equals (fpmIInstallationContextManager) &&
        !aIID.equals (nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  },

  addContext: function (context) {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
    var contextsBranch = prefs.getBranch("fpm.installationContexts.");
    contextsBranch.setComplexValue (contexts.length, Components.interfaces.nsILocalFile, context.root);
    contexts.push(context);
    saveContext(context);
  },

  getAllContexts: function (count) {
    count.value = contexts.length;
    return contexts;
  },

  modifyContext: function (oldContext, newContext) {
    for (var i = 0; i < contexts.length; i++) {
      if (contexts[i] == oldContext) {
        //dump ('++++ found oldContext ' + i + '\n');
        contexts[i] = newContext;
        break;
      }
    }
    //dump ('~~~~ ' + newContext.root.path + '\n');
    saveContext (newContext);
  },

  loadContext: function (contextRoot /* nsILocalFile */) { // TODO: error reporting - return null on error
    var context = initContext (contextRoot);
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
    var contextsBranch = prefs.getBranch("fpm.installationContexts.");
    contextsBranch.setComplexValue (contexts.length - 1, Components.interfaces.nsILocalFile, contextRoot);
    return context;
  },

  init: function () {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                          .getService(Components.interfaces.nsIPrefService);
    var contextsBranch = prefs.getBranch("fpm.installationContexts.");
    var contextsPrefs = contextsBranch.getChildList ("", { });
    for (var i = 0, contextRoot; i < contextsPrefs.length; i++) {
      contextRoot = contextsBranch.getComplexValue (i, Components.interfaces.nsILocalFile);
      initContext (contextRoot);
    }
    try {
      contextBranch = prefs.getBranch("fpm.");
      var activeContextNum = contextBranch.getIntPref("activeInstallationContext");
      theActiveContext = contexts[activeContextNum];
    } catch (e) {}
    dump ('******* fpmIInstallationContextManager initialized *******\n');
  }
};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

myHelloWorld = Components.classes["@dietrich.ganx4.com/helloworld;1"].
                          createInstance(Components.interfaces.nsIHelloWorld);

***********************************************************/
var fpmIInstallationContextManagerFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    if (!aIID.equals(Components.interfaces.fpmIInstallationContextManager) && !aIID.equals(nsISupports))
        throw Components.results.NS_ERROR_NO_INTERFACE;
    return new fpmIInstallationContextManager ();
  }
};

var fpmIInstallationContextManagerModule = {
  //_firstTime: true, ???
  registerSelf: function (aCompMgr, aFileSpec, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.registerFactoryLocation(CLASS_ID, CLASS_NAME,
        CONTRACT_ID, aFileSpec, aLocation, aType);
  },

  unregisterSelf: function (aCompMgr, aLocation, aType)
  {
    aCompMgr = aCompMgr.
        QueryInterface(Components.interfaces.nsIComponentRegistrar);
    aCompMgr.unregisterFactoryLocation(CLASS_ID, aLocation);
  },

  getClassObject: function (aCompMgr, aCID, aIID)
  {
    if (!aIID.equals(Components.interfaces.nsIFactory))
      throw Components.results.NS_ERROR_NOT_IMPLEMENTED;

    if (aCID.equals(CLASS_ID))
      return fpmIInstallationContextManagerFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function (aCompMgr) { return true; }
};

function NSGetModule (aCompMgr, aFileSpec) { return fpmIInstallationContextManagerModule; }