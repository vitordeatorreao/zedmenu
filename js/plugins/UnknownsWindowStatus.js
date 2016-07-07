//=============================================================================
// UnknownsWindowStatus.js
//=============================================================================

/*:
 * @plugindesc This plugin draws an unknown actor face in the Status Window.
 * @author vdat
 *
 * @param Unknown face name
 * @desc The name of the file containing your unknown face.
 * @default Unknown
 *
 * @param Unknown face index
 * @desc The index (starting at zero) of the face containing your unknown face.
 * @default 0
 * 
 * @param Minimum number of slots
 * @desc The number of visible slots for actors in your status window.
 * @default 4
 * 
 * @help The objective of this plugin is to get rid of the unused space in the 
 * Status Window inside the Main Menu when there are less than 4 actors in the 
 * game party.
 * 
 * To set which face you want to be displayed as an unknown face, you must 
 * configure the plugin accordingly:
 * 
 * * In the "Unknown face name" parameter, you must provide the name of the 
 * file where you have put the desired unknown face. By default, the plugin 
 * will look for a file called "Unknown.png".
 * 
 * * In the "Unknown face index" parameter, you must provide the index of the 
 * desired face inside the file provided in the above parameter. You must 
 * remember that the index starts at *zero*.
 * 
 * * In the "Minimum number of slots" parameter, you must provide the number 
 * of slots are there in your Status Window. For example, the default menu 
 * has four slots in the window. There may be more than four actors, but at 
 * anytime there are at most four actors being viewed at the window. If you 
 * have changed the Status Window, you should change this value accordingly.
 * If you provide the 'auto' value, it try to assess that value automatically
 * by analysing the Window_MenuStatus' attributes. So if you want to use the 
 * auto functionality, be sure to position the UnknownsWindowStatus plugin 
 * under any plugins that change the Status Window.
 */

(function() {
	// PARAMETERS
	var parameters = PluginManager.parameters('UnknownsWindowStatus');
	var unknownFaceName = parameters['Unknown face name'];
	var unknownFaceIndex = Number(parameters['Unknown face index'] || 0);
	var numberOfSlots = parameters['Minimum number of slots'];
	/* Try to assess the number of slots automatically if the parameters 
	   is set to 'auto' */
	if (numberOfSlots === "auto") {
		numberOfSlots = Math.max(
			Window_MenuStatus.prototype.maxCols(), 
			Window_MenuStatus.prototype.numVisibleRows()
		);
	} else {
		numberOfSlots = Number(numberOfSlots || 4);
	}
	/* Change the number of drawn images in case the number of actors is 
	   lesser than the minimum number of slots in the status window */ 
	var _Window_MenuStatus_drawAllItems = 
		Window_MenuStatus.prototype.drawAllItems;
    Window_MenuStatus.prototype.drawAllItems = function() {
    	_Window_MenuStatus_drawAllItems.call(this);
		var unknownIndex = this.maxItems();
		for (; unknownIndex < numberOfSlots; unknownIndex++) {
			this.drawUnknownFace(unknownIndex);
		}
	};
	// Draw unknown faces in the unoccupied slots
	Window_MenuStatus.prototype.drawUnknownFace = function (index) {
		var rect = this.itemRect(index);
		this.drawFace(
			unknownFaceName, 
			unknownFaceIndex, 
			rect.x + 1, 
			rect.y + 1, 
			Window_Base._faceWidth, 
			Window_Base._faceHeight
		);
	};
})();