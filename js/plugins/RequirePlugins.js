//=============================================================================
// RequirePlugins.js
//=============================================================================

/*:
 * @plugindesc This plugin adds a function to help import other plugins.
 * @author Zed
 *
 * @help This plugin adds a function called Require into the PluginManager. 
 * This function provides a facility for importing other plugins into your own.
 * 
 * With this Require function, selected plugins will be loaded, before yours, 
 * with the parameters you specify and without the need for the end user to 
 * add all the all the required plugins through the Plugin Manager interface 
 * in RPG Maker MV.
 */

(function() {

	PluginManager.RequirePlugin = function (pluginName, pluginParameters, relativePath) {
		if (!relativePath) 
			relativePath = "";
		else if (relativePath.charAt(relativePath.length-1) !== "/")
			relativePath = relativePath + '/';
		console.log(relativePath + pluginName + '.js');
		PluginManager._parameters[pluginName.toLowerCase()] = pluginParameters;
		PluginManager.loadScript(relativePath + pluginName + '.js');
		PluginManager._scripts.push(pluginName);
	};

})();