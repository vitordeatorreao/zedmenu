//=============================================================================
// JoinedPlugin.js
//=============================================================================

/*:
 * @plugindesc This plugin is an example of the RequirePlugins.js
 * @author vdat
 *
 * @help This plugin removes the gold window that, by default, appears on the 
 * bottom left of the Menu Scene. It also adds unknown faces to the status 
 * window.
 */

(function() {

	PluginManager.RequirePlugin('NoGoldOnMenu', {});
	PluginManager.RequirePlugin('UnknownsWindowStatus', {
		'Unknown face name' : 'Unknown',
		'Unknown face index' : 0,
		'Minimum number of slots' : 'auto'
	});

})();