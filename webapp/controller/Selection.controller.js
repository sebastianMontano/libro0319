sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/UIComponent",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel"
], function (Controller, Fragment, Filter, FilterOperator, UIComponent, MessageToast, JSONModel) {
  "use strict";

  return Controller.extend("libro0319.libro0319.controller.Selection", {
    onInit: function () {
      // Modelo local para meses
      const aMonths = [
        { key: "01", text: "Enero" },
        { key: "02", text: "Febrero" },
        { key: "03", text: "Marzo" },
        { key: "04", text: "Abril" },
        { key: "05", text: "Mayo" },
        { key: "06", text: "Junio" },
        { key: "07", text: "Julio" },
        { key: "08", text: "Agosto" },
        { key: "09", text: "Septiembre" },
        { key: "10", text: "Octubre" },
        { key: "11", text: "Noviembre" },
        { key: "12", text: "Diciembre" }
      ];
      const oModel = new JSONModel({ months: aMonths });
      this.getView().setModel(oModel, "modelMonths");

      // Modelo para oportunidad EEFF
      const aOportunidadEEFF = [
        { key: "01", text: "01 - Al 31 de diciembre" },
        { key: "02", text: "02 - Al 31 de enero, por modificación de porcentaje" },
        { key: "03", text: "03 - Al 30 de junio, por modificación del coeficiente o porcentaje" },
        { key: "04", text: "04 - Al último día del mes que sustentará la suspensión o modificación del coeficiente (distinto al 31 de enero o 30 de junio)" },
        { key: "05", text: "05 - Al día anterior a la entrada en vigencia de la fusión, escisión y demás formas de reorganización de sociedades o empresas o extinción de la persona jurídica" },
        { key: "06", text: "06 - A la fecha del balance de liquidación, cierre o cese definitivo del deudor tributario" },
        { key: "07", text: "07 - A la fecha de presentación para libre propósito" }
      ];
      const oModelEEFF = new JSONModel({ oportunidadEEFF: aOportunidadEEFF });
      this.getView().setModel(oModelEEFF, "modelOportunidadEEFF");
    },

    // Abrir ayuda de búsqueda según vhType
    onValueHelpRequest: function (oEvent) {
      const oView = this.getView();
      const sVhType = oEvent.getSource().getCustomData().find(d => d.getKey() === "vhType").getValue();
      let sFragmentName, sFilterField;

      switch (sVhType) {
        case "Sociedad":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogSociedad";
          sFilterField = "CompanyCodeName";
          break;
        case "capitalLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "capitalHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "accionesInversionLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "accionesInversionHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "capitalAdicionalLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "capitalAdicionalHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadosNoRealizadosLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadosNoRealizadosHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "reservaLegalLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "reservaLegalHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "otrasReservasLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "otrasReservasHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadoAcomuladoLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadoAcomuladoHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "diferenciasConversionLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "diferenciasConversionHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "ajustePatrimonioLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "ajustePatrimonioHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadoNetoEjercicioLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadoNetoEjercicioHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "excedenteRevaluacionLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "excedenteRevaluacionHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadoEjercicioLow":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountLow";
          sFilterField = "GLAccountLongName";
          break;
        case "resultadoEjercicioHigh":
          sFragmentName = "libro0319.libro0319.view.ValueHelpDialogGLAccountHigh";
          sFilterField = "GLAccountLongName";
          break;
        default:
          return;
      }

      const mModels = {
        "Sociedad": "hv_company_code",
        "capitalLow": "hv_gl_account",
        "capitalHigh": "hv_gl_account",
        "accionesInversionLow": "hv_gl_account",
        "accionesInversionHigh": "hv_gl_account",
        "capitalAdicionalLow": "hv_gl_account",
        "capitalAdicionalHigh": "hv_gl_account",
        "resultadosNoRealizadosLow": "hv_gl_account",
        "resultadosNoRealizadosHigh": "hv_gl_account",
        "reservaLegalLow": "hv_gl_account",
        "reservaLegalHigh": "hv_gl_account",
        "otrasReservasLow": "hv_gl_account",
        "otrasReservasHigh": "hv_gl_account",
        "resultadoAcomuladoLow": "hv_gl_account",
        "resultadoAcomuladoHigh": "hv_gl_account",
        "diferenciasConversionLow": "hv_gl_account",
        "diferenciasConversionHigh": "hv_gl_account",
        "ajustePatrimonioLow": "hv_gl_account",
        "ajustePatrimonioHigh": "hv_gl_account",
        "resultadoNetoEjercicioLow": "hv_gl_account",
        "resultadoNetoEjercicioHigh": "hv_gl_account",
        "excedenteRevaluacionLow": "hv_gl_account",
        "excedenteRevaluacionHigh": "hv_gl_account",
        "resultadoEjercicioLow": "hv_gl_account",
        "resultadoEjercicioHigh": "hv_gl_account"
      };

      if (!this._pValueHelpDialogs) {
        this._pValueHelpDialogs = {};
      }

      if (!this._pValueHelpDialogs[sVhType]) {
        this._pValueHelpDialogs[sVhType] = sap.ui.core.Fragment.load({
          id: oView.getId() + "-" + sVhType,
          name: sFragmentName,
          controller: this
        }).then(function (oDialog) {
          oView.addDependent(oDialog);
          const sModelName = mModels[sVhType];
          console.log(sModelName);
          if (sModelName) {
            oDialog.setModel(oView.getModel(sModelName), sModelName);
          }
          return oDialog;
        });
      }

      this._pValueHelpDialogs[sVhType].then(function (oDialog) {
        // Guarda quién abrió la ayuda (id local del input) ---
        const sLocalInputId = oView.getLocalId(oEvent.getSource().getId());
        oDialog.data("targetInputId", sLocalInputId);
        // Si requiere parámetro Sociedad (FixedAsset / SubActivo / Área Valorización)
        const oItemsBinding = oDialog.getBinding("items");
        if (oItemsBinding && sFilterField) {
          oItemsBinding.filter([
            new sap.ui.model.Filter(sFilterField, sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue())
          ]);
        }
        oDialog.open();
      }.bind(this));
    },

    // Buscar dentro del SelectDialog
    onValueHelpSearch: function (oEvent) {
      const sValue = oEvent.getParameter("value");
      const oDialog = oEvent.getSource();
      const sFilterField = oDialog.data("filterProperty");

      if (sFilterField) {
        oDialog.getBinding("items").filter([new Filter(sFilterField, FilterOperator.Contains, sValue)]);
      }
    },

    // Al cerrar el ValueHelp
    onValueHelpClose: function (oEvent) {
      const oSelectedItem = oEvent.getParameter("selectedItem");
      const oDialog = oEvent.getSource();
      if (!oSelectedItem) {
        oDialog.getBinding("items").filter([]);
        return;
      }
      const sValue = oSelectedItem.getTitle();

      const mInputIds = {
        "valueHelpDialogSociedad": "inpSociedad",
        "valueHelpDialogGLAccountLow": "inpCapitalLow",
        "valueHelpDialogGLAccountHigh": "inpCapitalHigh",
        "valueHelpDialogGLAccountLow": "inpAccionesInversionLow",
        "valueHelpDialogGLAccountHigh": "inpAccionesInversionHigh",
        "valueHelpDialogGLAccountLow": "inpCapitalAdicionalLow",
        "valueHelpDialogGLAccountHigh": "inpCapitalAdicionalHigh",
        "valueHelpDialogGLAccountLow": "inpResultadosNoRealizadosLow",
        "valueHelpDialogGLAccountHigh": "inpResultadosNoRealizadosHigh",
        "valueHelpDialogGLAccountLow": "inpReservaLegalLow",
        "valueHelpDialogGLAccountHigh": "inpReservaLegalHigh",
        "valueHelpDialogGLAccountLow": "inpOtrasReservasLow",
        "valueHelpDialogGLAccountHigh": "inpOtrasReservasHigh",
        "valueHelpDialogGLAccountLow": "inpResultadoAcomuladoLow",
        "valueHelpDialogGLAccountHigh": "inpResultadoAcomuladoHigh",
        "valueHelpDialogGLAccountLow": "inpDiferenciasConversionLow",
        "valueHelpDialogGLAccountHigh": "inpDiferenciasConversionHigh",
        "valueHelpDialogGLAccountLow": "inpAjustePatrimonioLow",
        "valueHelpDialogGLAccountHigh": "inpAjustePatrimonioHigh",
        "valueHelpDialogGLAccountLow": "inpResultadoNetoEjercicioLow",
        "valueHelpDialogGLAccountHigh": "inpResultadoNetoEjercicioHigh",
        "valueHelpDialogGLAccountLow": "inpExcedenteRevaluacionLow",
        "valueHelpDialogGLAccountHigh": "inpExcedenteRevaluacionHigh",
        "valueHelpDialogGLAccountLow": "inpResultadoEjercicioLow",
        "valueHelpDialogGLAccountHigh": "inpResultadoEjercicioHigh"
      };

      // se repite la misma HV
      const sTargetFromOpen = oDialog.data && oDialog.data("targetInputId");

      const sDialogKey = oDialog.getId().split("-").pop();
      const sInputId = sTargetFromOpen || mInputIds[sDialogKey];   // <— usa primero el target dinámico

      if (sInputId) {
        this.byId(sInputId).setValue(sValue);
      }
      oDialog.getBinding("items").filter([]);
    },

    getRouter: function () {
      return UIComponent.getRouterFor(this);
    },

    // Navegar a vista Libro con validaciones
    onNavToLibro: function () {
      const sCompanyCode = this.byId("inpSociedad").getValue();
      const sFiscalYear = this.byId("inpEjercicio").getValue();
      const sFiscalPeriod = this.byId("selPeriodo").getSelectedKey();
      const sOportunidadEEFF = this.byId("selEEFF").getSelectedKey();
      const bGenerarPle = this.byId("generarPle").getSelected();
      const bActivarMonedaUSD = this.byId("activarMonedaUSD").getSelected();

      if (!sCompanyCode) {
        MessageToast.show("Por favor, seleccione una sociedad.");
        return;
      }
      if (!sFiscalYear) {
        MessageToast.show("Por favor, seleccione un ejercicio.");
        return;
      }
      if (!sFiscalPeriod) {
        MessageToast.show("Por favor, seleccione un periodo.");
        return;
      }

      this.getRouter().navTo("RouteLibro", {
        companyCode: sCompanyCode,
        fiscalYear: sFiscalYear,
        fiscalPeriod: sFiscalPeriod,
        oportunidadEEFF: sOportunidadEEFF,
        query: {
          generarPle: bGenerarPle,
          activarMonedaUSD : bActivarMonedaUSD
        }
      });
    }
  });
});
