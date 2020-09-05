sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
	"use strict";

	return UIComponent.extend("com.hack.SemDude.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set data model
			var oData = {
				recipient : {
					name : "World"
				}
			};
			var deviceModel = new sap.ui.model.json.JSONModel({
				isPhone: sap.ui.Device.system.phone
			});
			this.setModel(deviceModel, "device");
			var oModel = new JSONModel(oData);
			this.setModel(oModel);
		}
	});

});