/* global _:true */
jQuery.sap.require("com/hack/SemDude/Utility/XlsLib"),
	sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/core/Fragment",
		"sap/ui/core/BusyIndicator",
		"sap/m/MessageBox",
		"sap/base/Log"

	], function (Controller, MessageToast, Fragment,BusyIndicator,MessageBox,Log) {
		"use strict";

		return Controller.extend("com.hack.SemDude.controller.App", {

			onInit: function () {
				var that = this;

				this.getSplitAppObj().setHomeIcon({
					'phone': 'phone-icon.png',
					'tablet': 'tablet-icon.png',
					'icon': 'desktop.ico'
				});

				//Speech Rec
				if ('webkitSpeechRecognition' in window) {
					this.recognition = new webkitSpeechRecognition();
				} else {
					this.recognition = new SpeechRecognition();
				}
				this.recognition.continuous = true;
				this.recognition.interimResults = false;
				this.recognition.lang = 'en-IN';
				this.recognition.onsoundstart = function () {
					var nf = new HTML({
						content: "<b>Hello</b> <i>world</i>"
					  })
					that.byId("idStatusLog").setValue(nf);
				};
				this.recognition.onerror = function () {
					MessageToast.show("Error");
				};
				this.recognition.onsoundhend = function () {
					var nf = new HTML({
						htmlText: "<strong>Hello</strong> <em>world</em>"
					  })
					that.byId("idStatusLog").setValue(nf);
				};
				this.recognition.onresult = function (event) {
					var vFinal = "";
					for (var i = event.resultIndex; i < event.results.length; ++i) {
						if (event.results[i].isFinal) {
							vFinal = event.results[i][0].transcript;
						}
					}
					if (vFinal !== "") {
						that.byId("idSearchField").setValue(vFinal);
					}
				};
				
				// MessageBox.information("Under Development",{
				// 	title: "Notice",                                
				// 	onClose: function(){
				// 		BusyIndicator.show();
				// 	},                              
				// 	actions: sap.m.MessageBox.Action.OK   
				// });
			},
			handleNavButtonPress: function () {
				var oSplitApp = this.getView().getParent().getParent();
				var oMaster = oSplitApp.getMasterPages()[0];
				oSplitApp.toMaster(oMaster, "flip");
			},
			onPressNavToDetail: function () {
				this.getSplitAppObj().to(this.createId("detailDetail"));
			},
	
			onPressDetailBack: function () {
				this.getSplitAppObj().backDetail();
			},
	
			onPressMasterBack: function () {
				this.getSplitAppObj().backMaster();
			},
	
			onPressGoToMaster: function () {
				this.getSplitAppObj().toMaster(this.createId("master2"));
			},
	
			onListItemPress: function (oEvent) {
				var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
	
				this.getSplitAppObj().toDetail(this.createId(sToPageId));
			},
	
			getSplitAppObj: function () {
				var result = this.byId("SplitAppDemo");
				if (!result) {
					Log.info("SplitApp object can't be found");
				}
				return result;
			},
			onVoiceRecog: function (oEvent) {
				if (oEvent.getSource().getPressed()) {
					this.recognition.start();
				} else {
					this.recognition.stop();
				}
			},
			onUploadDialogOpen: function (oEvent) {
				if (!this._uploadDialog) {
					this._uploadDialog = new sap.ui.xmlfragment("idUploadFrag", "com.hack.SemDude.view.fragment.Upload", this);
					this.getView().addDependent(this._uploadDialog);
				}
				this._uploadDialog.open();
			},
			onUploadDialogClose: function () {
				this._uploadDialog.close();
			},
			onUpload: function (oEvent) {
				var oController = this;
				var oUploader = Fragment.byId("idUploadFrag", "idfileUploader");
				var aFiles = oUploader.getFocusDomRef().files;

				for (var i = 0; i < aFiles.length; i++) {
					var _oReader = new FileReader();
					_oReader.onload = function (e) {
						var data = e.target.result;
						var cfb = XLSX.read(data, { type: 'binary' });
						cfb.SheetNames.forEach(function (sheetName) {
							var sCSV = XLS.utils.make_csv(cfb.Sheets[sheetName], { header: ["Questions", "Answers"] });
							var oJS = XLS.utils.sheet_to_json(cfb.Sheets[sheetName], { header: ["Questions", "Answers"] });
							console.log(oJS);
						});
					};
					var _oFile = aFiles[0];
					_oReader.readAsBinaryString(_oFile);
				}
			}
		});
	});