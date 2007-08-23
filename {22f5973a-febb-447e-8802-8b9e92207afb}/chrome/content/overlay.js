/* (C) 2007 Declan Naughton <piratepenguin@gmail.com>
   Licensed under the GNU General Public License version 3 or later,
   available at http://www.gnu.org/licenses/gpl.html
   You may also have received a copy in a LICENSE file along with
   this distribution.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details. */

/*function xpconaryWsLaunch () {
  var win = window.open ("chrome://xpconary/content/xpconary-ws.xhtml",
    "xpconary:workspace", "chrome,extrachrome,menubar,toolbar,resizable,statusbar,all");
  win.focus ();
}*/

/* This function taken from FireFTP (http://fireftp.mozdev.org/)
   who apparently got it from IE View (http://ieview.mozdev.org/).
   Thanks to them :)
   For now most of it is commented out, 'cause we gotta think about this stuff first.. */
function fpmUiLaunch () {
  /*var prefService    = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
  var prefSvc        = prefService.getBranch(null);

  var loadInTab      = false;
  try {
    loadInTab        = prefSvc.getIntPref("fireftp.loadmode");
  } catch (ex) {
    loadInTab = true;
  }*/ var loadInTab = true;

  if (loadInTab) {
    var theTab          = gBrowser.addTab('chrome://fpm/content/ui.xhtml');
    //theTab.label        = "FireFTP";
    gBrowser.selectedTab = theTab; // TODO: obey the browser's preferences!
    //var func = function () { gBrowser.setIcon(theTab, "chrome://fireftp/skin/icons/logo.png"); };
    //setTimeout(func, 0);
  } else {
    toOpenWindowByType('mozilla:fpm', 'chrome://fpm/content/');
  }
}
