/* (C) 2007 Declan Naughton <piratepenguin@gmail.com>
   Licensed under the GNU General Public License version 3 or later,
   available at http://www.gnu.org/licenses/gpl.html
   You may also have received a copy in a LICENSE file along with
   this distribution.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details. */

const CLASS_ID = Components.ID("{6bb7a202-b3be-4d6a-9091-9dee7acb0bd1}");
const CLASS_NAME = "FPM Installation Context";
const CONTRACT_ID = "@piratepenguin.is-a-geek.com/fpm/installationContext;1";

const nsISupports = Components.interfaces.nsISupports;

function fpmIInstallationContext () {
};

fpmIInstallationContext.prototype = {
  name: null,
  root: null,
  autoResolveDeps: false,
  perPackageDirs: false,
  autoUpdate: false,
  username: null,
  password: null,

  QueryInterface: function (aIID)
  {
    if (!aIID.equals (Components.interfaces.fpmIInstallationContext) &&
        !aIID.equals (nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

/***********************************************************
class factory

This object is a member of the global-scope Components.classes.
It is keyed off of the contract ID. Eg:

myHelloWorld = Components.classes["@dietrich.ganx4.com/helloworld;1"].
                          createInstance(Components.interfaces.nsIHelloWorld);

***********************************************************/
var fpmIInstallationContextFactory = {
  createInstance: function (aOuter, aIID)
  {
    if (aOuter != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;
    if (!aIID.equals(Components.interfaces.fpmIInstallationContext) && !aIID.equals(nsISupports))
        throw Components.results.NS_ERROR_NO_INTERFACE;
    return new fpmIInstallationContext ();
  }
};

var fpmIInstallationContextModule = {
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
      return fpmIInstallationContextFactory;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function (aCompMgr) { return true; }
};

function NSGetModule (aCompMgr, aFileSpec) { return fpmIInstallationContextModule; }