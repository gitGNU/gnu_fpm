/* (C) 2007 Declan Naughton <piratepenguin@gmail.com>
   Licensed under the GNU General Public License version 3 or later,
   available at http://www.gnu.org/licenses/gpl.html
   You may also have received a copy in a LICENSE file along with
   this distribution.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details. */

function init () {
  Components.classes["@piratepenguin.is-a-geek.com/fpm/installationContextManager;1"]
            .getService(Components.interfaces.fpmIInstallationContextManager);
}

// adapted from http://mxr.mozilla.org/seamonkey/source/browser/base/content/utilityOverlay.js
function openInstallationContextManager (/*paneID*/)
{
  //var instantApply = getBoolPref("browser.preferences.instantApply", false);
  var features = "chrome,titlebar=no,toolbar,centerscreen,dialog=no";// + (instantApply ? ",dialog=no" : ",modal");

  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);
  var win = wm.getMostRecentWindow("FPM:InstallationContextManager");
  if (win) {
    win.focus();
    /*if (paneID) {
      var pane = win.document.getElementById(paneID);
      win.document.documentElement.showPane(pane);
    }*/
  }
  else
    openDialog("chrome://fpm/content/installationContextManager.xul",
               "installationContextManager", features/*, paneID*/);
}



/* These two functions taken from:
    http://lxr.mozilla.org/mozilla/source/extensions/xml-rpc/test/xml-rpc.xul */
function getClient() {
    // TODO: shouldn't we ...enablePrivilege('UniversalXPConnect') ?
    return Components.classes['@mozilla.org/xml-rpc/client;1']
        .createInstance(Components.interfaces.nsIXmlRpcClient);
}

var xmlRpcClient;
function getXmlRpc() {
  if (!xmlRpcClient) xmlRpcClient = getClient();
  return xmlRpcClient;
}

function listTroves (label) {
  var xmlRpc = getXmlRpc(); // TODO: offload this work to the component...
  xmlRpc.init('http://' + label.split('@')[0] + '/conary/');
  var protocolVersion = xmlRpc.createType(xmlRpc.INT, {});
  protocolVersion.data = 37;
  var labelString = xmlRpc.createType(xmlRpc.STRING, {});http://mxr.mozilla.org/seamonkey/source/browser/base/content/utilityOverlay.js
  labelString.data = label;
  //xmlRpc.asyncCall(listener, null, 'troveNames', [protocolVersion, labelString], 2);
  alert ('TODO');
}


function repoQuery (troveName, label) {
  /*var xmlRpc = getXmlRpc();
  xmlRpc.init('http://' + label.split('@')[0] + '/conary/');
  var protocolVersion = xmlRpc.createType(xmlRpc.INT, {});
  protocolVersion.data = 37;
  var outterDetailsStruct = xmlRpc.createType(xmlRpc.STRUCT, {});
  var detailsStruct = xmlRpc.createType(xmlRpc.STRUCT, {});
  var theBool = xmlRpc.createType(xmlRpc.BOOLEAN, {});
  theBool.data = 1;
  var flavor = xmlRpc.createType(xmlRpc.STRING, {});
  flavor.data = '1#x86:~3dnow:~3dnowext:~cmov:~i486:~i586:~i686:~mmx:~mmxext:~sse|5#use:~X:~!alternatives:!bootstrap:~builddocs:~buildtests:~desktop:~dietlibc:~!dom0:~!domU:~emacs:~gcj:~gnome:~gtk:~ipv6:~kde:~krb:~ldap:~nptl:pam:~pcre:~perl:~!pie:~python:~';
  var flavorArray = xmlRpc.createType(xmlRpc.ARRAY, {});
  flavorArray.AppendElement(flavor);
  detailsStruct.setValue(label, flavorArray);
  outterDetailsStruct.setValue(troveName, detailsStruct);

  var context = Components.classes['@mozilla.org/supports-cstring;1']
        .createInstance(Components.interfaces.nsISupportsCString);
  context.data = troveName;
  xmlRpc.asyncCall(listener, context, 'getTroveLeavesByLabel', [protocolVersion, outterDetailsStruct, theBool], 3);*/

  var repo = Components.classes['@piratepenguin.is-a-geek.com/xpconary/repository;1']
        .createInstance(Components.interfaces.xpcIRepository);
  repo.label = label;
  /*var r = Components.classes['@piratepenguin.is-a-geek.com/xpconary/remote-trove;1']
          .createInstance(Components.interfaces.xpcIRemoteTrove);*/
  //repo.onResult = function () { alert ('blahhh') };
  repo.query (listener, troveName);
}

const id = "{22f5973a-febb-447e-8802-8b9e92207afb}";
var dbLocation = Components.classes["@mozilla.org/extensions/manager;1"]
                    .getService(Components.interfaces.nsIExtensionManager)
                    .getInstallLocation(id)
                    .getItemLocation(id);
dbLocation.append("conarydb");

function localQuery (troveName) {
  // TODO: offload this work to the component...
  var storageService = Components.classes["@mozilla.org/storage/service;1"]
                          .getService(Components.interfaces.mozIStorageService);
  var mDBConn = storageService.openDatabase(dbLocation);

  var statement = mDBConn.createStatement("SELECT * FROM Instances WHERE troveName = ?1");
  statement.bindUTF8StringParameter(0, troveName);

  var instanceId;
  while (statement.executeStep()) {
    instanceId = statement.getInt32(0);
  }
  if (instanceId == null) { alert("we don't have it :("); return; }
  var toAlert = 'yep, we have it, instanceId: ' + instanceId + '\n';
  var statement2 = mDBConn.createStatement("SELECT infoType, data FROM TroveInfo WHERE instanceId = ?1");
  statement2.bindInt32Parameter(0, instanceId);
  var fromTrove, fullVersion, version;
  while (statement2.executeStep()) {
    switch (statement2.getInt32(0)) {
      case 1:
        fromTrove = statement2.getString(1);
        break;
      case 3:
        version = statement2.getString(1);
        break;
      case 8:
        fullVersion = statement2.getString(1);
        break;
    }
  }
  toAlert += 'build from trove: ' + fromTrove + '\n';
  toAlert += 'full version: ' + fullVersion + '\n';
  toAlert += 'version: ' + version;
  alert(toAlert);
}

function listLocalTroves () {
  alert('TODO');
}

function xpconaryWsOnload () {
  /*try {
    // this is needed to generally allow usage of components in javascript
    netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
    var myComponent = Components.classes['@dietrich.ganx4.com/helloworld;1']
     .createInstance(Components.interfaces.nsIHelloWorld);
    var greeting = myComponent.hello();
  } catch (anError) {
    alert('ERROR: ' + anError);
  }*/

  /*var xmlRpc = getXmlRpc(), result;
  if (xmlRpc == null)
    result = "..Damnit!, didn't get it :("; // TODO: provide a link for support
  else
    result = '..woot, we got it!';

  var newSpan = document.createElement("span");
  var newText = document.createTextNode(result);
  newSpan.appendChild(newText);

  //var para = document.getElementById("para");
  var spanElm = document.getElementById("result");
  spanElm.parentNode.replaceChild(newSpan,spanElm);

  if (xmlRpc == null) return;
  //xmlRpc.init('http://piratepenguin.is-a-geek.com/conary/');
  //xmlRpc.init('http://contrib.rpath.org/conary/');  //WHY DOES IT HATE ME??
  xmlRpc.init('http://conary.rpath.com/conary/');
  var protocolVersion = xmlRpc.createType(xmlRpc.INT, {});
  protocolVersion.data = 37;
  var outterDetailsStruct = xmlRpc.createType(xmlRpc.STRUCT, {});
  var detailsStruct = xmlRpc.createType(xmlRpc.STRUCT, {});
  var theBool = xmlRpc.createType(xmlRpc.BOOLEAN, {});
  theBool.data = 1;
  var flavor = xmlRpc.createType(xmlRpc.STRING, {});
  flavor.data = '1#x86:~3dnow:~3dnowext:~cmov:~i486:~i586:~i686:~mmx:~mmxext:~sse|5#use:~X:~!alternatives:!bootstrap:~builddocs:~buildtests:~desktop:~dietlibc:~!dom0:~!domU:~emacs:~gcj:~gnome:~gtk:~ipv6:~kde:~krb:~ldap:~nptl:pam:~pcre:~perl:~!pie:~python:~';
  var flavorArray = xmlRpc.createType(xmlRpc.ARRAY, {});
  flavorArray.AppendElement(flavor);
  detailsStruct.setValue('conary.rpath.com@rpl:1', flavorArray);
  //detailsStruct.setValue('contrib.rpath.org@rpl:devel', flavorArray);
  //detailsStruct.setValue('piratepenguin.is-a-geek.com@fros:devel', flavorArray);
  outterDetailsStruct.setValue('group-core', detailsStruct);
  xmlRpc.asyncCall(listener, null, 'getTroveLeavesByLabel', [protocolVersion, outterDetailsStruct, theBool], 3);*/
}

var listener = {
  onResult: function (repository, result) {
    repository = repository.QueryInterface(Components.interfaces.xpcIRepository);
    if (result == null) {
      alert (repository.label + ' has no version of the trove.');
      return;
    }
    result = result.QueryInterface (Components.interfaces.xpcITrove);
    alert (repository.label + ' has: ' + result.name + ' version: ' + result.version);
  }
};
