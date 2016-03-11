//=============================================================================
// NoGoldOnMenu.js
//=============================================================================

/*:
 * @plugindesc This plugin gets rid of the gold window in the game's main menu.
 * @author Zed
 *
 * @help This plugin removes the gold window that, by default, appears on the 
 * bottom left of the Menu Scene.
 */

(function() {
	Scene_Menu.prototype.createGoldWindow = function () {};
})();