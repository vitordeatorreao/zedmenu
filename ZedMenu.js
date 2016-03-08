//=============================================================================
// ZedMenu.js
//=============================================================================

/*:
 * @plugindesc Zed-like menu layout.
 * @author Babakin
 *
 * @param Unknown face name
 * @desc The name of the file containing your unknown face.
 * @default Unknown
 *
 * @param Unknown face index
 * @desc The index (starting at zero) of the face containing your unknown face.
 * @default 0
 *
 * @help This plugin does not provide plugin commands.
 */

(function() {
	// PARAMETERS
	var parameters = PluginManager.parameters('ZedMenu');
	var unknownFaceName = parameters['Unknown face name'];
	var unknownFaceIndex = Number(parameters['Unknown face index'] || 0);

	// Changes the way the Menu Screen is created
	var _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        // The status screen will be displayed just bellow the command screen
        this._statusWindow.x = 0;
        this._statusWindow.y = this._commandWindow.height;
    };
    // Removes the Gold Window from the main menu.
    Scene_Menu.prototype.createGoldWindow = function () {
    	return;
    };
    // Changes the command window
    Scene_Menu.prototype.createCommandWindow = function() {
    	this._commandWindow = new Window_MenuCommand(0, 0);
    	this._commandWindow.setHandler('item',      this.commandItem.bind(this));
    	this._commandWindow.setHandler('skill',     this.commandPersonal.bind(this));
    	this._commandWindow.setHandler('equip',     this.commandPersonal.bind(this));
    	this._commandWindow.setHandler('status',    this.commandPersonal.bind(this));
    	this._commandWindow.setHandler('formation', this.commandFormation.bind(this));
    	this._commandWindow.setHandler('save',      this.commandSave.bind(this));
    	this._commandWindow.setHandler('options',   this.commandOptions.bind(this));
    	this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
    	this.addWindow(this._commandWindow);
    };
    // The window containing the commands will now span the whole screen width
    Window_MenuCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuCommand.prototype.maxCols = function() {
        return 6;
    };

    Window_MenuCommand.prototype.numVisibleRows = function() {
        return 1;
    };
    // Changes the order of the itens in menu commands
    Window_MenuCommand.prototype.makeCommandList = function() {
	    this.addMainCommands();
	    this.addFormationCommand();
	    this.addOriginalCommands();
	    this.addSaveCommand();
	    this.addOptionsCommand();
	};
    // Remove the status command
    Window_MenuCommand.prototype.addMainCommands = function() {
    	var enabled = this.areMainCommandsEnabled();
	    if (this.needsCommand('item')) {
	        this.addCommand(TextManager.item, 'item', enabled);
	    }
	    if (this.needsCommand('skill')) {
	        this.addCommand(TextManager.skill, 'skill', enabled);
	    }
	    if (this.needsCommand('equip')) {
	        this.addCommand(TextManager.equip, 'equip', enabled);
	    }
    };
    // Remove the Game End command
    Window_MenuCommand.prototype.addGameEndCommand = function() {
        return;
    };

    var _Window_MenuStatus_drawAllItems = Window_MenuStatus.prototype.drawAllItems;
    Window_MenuStatus.prototype.drawAllItems = function() {
    	_Window_MenuStatus_drawAllItems.call(this);
		var unknownIndex = this.maxItems();
		for (; unknownIndex < 4; unknownIndex++) {
			this.drawItemImage(unknownIndex);
		}
	};

    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuStatus.prototype.windowHeight = function() {
        var h1 = this.fittingHeight(1);
        var h2 = this.fittingHeight(2);
        return Graphics.boxHeight - SceneManager._scene._commandWindow.height;
    };

    Window_MenuStatus.prototype.maxCols = function() {
        return 4;
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    Window_MenuStatus.prototype.drawItemImage = function(index) {
		var rect = this.itemRectForText(index);
        var w = Math.min(rect.width, 144);
        var h = Math.min(rect.height, 144);
        var lineHeight = this.lineHeight();
        var faceName, faceIndex;
    	if (index > this.maxItems() - 1) {
    		faceName = unknownFaceName;
    		faceIndex = unknownFaceIndex;
	        this.changePaintOpacity(false);
    	} else {
    		var actor = $gameParty.members()[index];
    		faceName = actor.faceName();
    		faceIndex = actor.faceIndex();
    		this.changePaintOpacity(actor.isBattleMember());
    	}
        this.drawFace(faceName, faceIndex, rect.x, rect.y + lineHeight * 1, w, h);
        this.changePaintOpacity(true);
    };

    Window_MenuStatus.prototype.drawItemStatus = function(index) {
    	if (index > $gameParty.size() -1) return;
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        var faceHeight = Math.min(rect.height, 144);
        var faceSpace = Math.ceil(faceHeight / lineHeight) + 1;
        this.drawActorName(actor, x, y + lineHeight * 0, width);
        this.drawActorClass(actor, x, y + lineHeight * faceSpace, width);
        this.drawActorLevel(actor, x, y + lineHeight * (faceSpace + 1), width);
        this.drawActorHp(actor, x, y + lineHeight * (faceSpace + 2), width);
        this.drawActorMp(actor, x, y + lineHeight * (faceSpace + 3), width);
        this.drawActorIcons(actor, x, y + lineHeight * (faceSpace + 4), width);
    };



	Window_MenuStatus.prototype.drawItemBackground = function(index) {
	    if (index === this._pendingIndex) {
	        var rect = this.itemRect(index);
	        var color = this.pendingColor();
	        this.changePaintOpacity(false);
	        this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
	        this.changePaintOpacity(true);
	    }
	};

	Window_MenuStatus.prototype.setPendingIndex = function(index) {
	    var lastPendingIndex = this._pendingIndex;
	    this._pendingIndex = index;
	    this.redrawItem(this._pendingIndex);
	    this.redrawItem(lastPendingIndex);
	};

	var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
	Window_Options.prototype.makeCommandList = function() {
		_Window_Options_makeCommandList.call(this);
		this.addOriginalOptions();
	};

	Window_Options.prototype.addOriginalOptions = function() {
		var enabled = this.isGameEndEnabled();
    	this.addCommand(TextManager.gameEnd, 'gameEnd', enabled);
	};

	Window_Options.prototype.isGameEndEnabled = function() {
		return true;
	};

	var _Window_Options_drawItem = Window_Options.prototype.drawItem;
	Window_Options.prototype.drawItem = function(index) {
		if (this.commandName(index) === TextManager.gameEnd) {
			var rect = this.itemRectForText(index);
		    var statusWidth = this.statusWidth();
		    var titleWidth = rect.width - statusWidth;
		    this.resetTextColor();
		    this.changePaintOpacity(this.isCommandEnabled(index));
		    this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
		} else {
			_Window_Options_drawItem.call(this, index);
		}
	};

	var _Window_Options_processOK = Window_Options.prototype.processOk;
	Window_Options.prototype.processOk = function() {
	    var index = this.index();
	    if (this.commandName(index) === TextManager.gameEnd) {
	    	SceneManager.push(Scene_GameEnd);
	    } else {
	    	_Window_Options_processOK.call(this);
	    }
	};

    var _Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function() {
        _Window_MenuActor_initialize.call(this);
        this.y = this.fittingHeight(2);
    };

})();