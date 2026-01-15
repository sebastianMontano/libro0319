sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageToast",
  "sap/ui/model/json/JSONModel",
  "sap/ui/export/Spreadsheet",
  "sap/ui/export/library"
], function (
  Controller, UIComponent, Filter, FilterOperator, MessageToast, JSONModel, Spreadsheet, exportLibrary
) {
  "use strict";

  const EdmType = exportLibrary.EdmType;

  return Controller.extend("libro0319.libro0319.controller.Libro", {

    onInit: function () {
      const oRouter = UIComponent.getRouterFor(this);
      oRouter.getRoute("RouteLibro").attachPatternMatched(this._onRouteMatched, this);

      this.getView().setModel(new JSONModel({
        busy: false,
        count: 0,
        params: {}
      }), "vm");
    },

    onToggleFilters: function () {
      const oBar = this.byId("filterVBox");
      const oBtn = this.byId("btnToggleFilters");

      if (!oBar || !oBtn) return;

      const bShow = !oBar.getVisible();
      oBar.setVisible(bShow);

      oBtn.setText(bShow ? "Ocultar Filtros" : "Mostrar Filtros");
      oBtn.setIcon(bShow ? "sap-icon://hide" : "sap-icon://filter");

      if (!bShow) {
        this.onClearFilters();
      }
    },

    _setBusy: function (b) {
      this.getView().getModel("vm").setProperty("/busy", b);
    },

    _onRouteMatched: async function (oEvent) {
      const oArgs = oEvent.getParameter("arguments") || {};
      const oQuery = oArgs["?query"] || {};

      const sCompanyCode = oArgs.companyCode;
      const sFiscalYear = oArgs.fiscalYear;
      const sFiscalPeriod = oArgs.fiscalPeriod;
      const sOportunidadEEFF = oArgs.oportunidadEEFF;

      const sAssetClassLow = oQuery.assetClassLow;
      const sAssetClassHigh = oQuery.assetClassHigh;
      const sMasterFixedAssetLow = oQuery.masterFixedAssetLow;
      const sMasterFixedAssetHigh = oQuery.masterFixedAssetHigh;
      const sFixedAssetLow = oQuery.fixedAssetLow;
      const sFixedAssetHigh = oQuery.fixedAssetHigh;
      const sDepreciationAreaLow = oQuery.depreciationAreaLow;
      const sDepreciationAreaHigh = oQuery.depreciationAreaHigh;
      const bGenerarPle = (oQuery.generarPle === "true" || oQuery.generarPle === true);
      const bActivarMonedaUSD = (oQuery.activarMonedaUSD === "true" || oQuery.activarMonedaUSD === true);
      const sCompanyCodeCurrency = bActivarMonedaUSD ? "USD" : "PEN";

      const oVM = this.getView().getModel("vm");
      oVM.setProperty("/params", {
        companyCode: sCompanyCode,
        fiscalYear: sFiscalYear,
        fiscalPeriod: sFiscalPeriod,
        oportunidadEEFF: sOportunidadEEFF,
        companyCodeCurrency: sCompanyCodeCurrency,
        assetClassLow: sAssetClassLow,
        assetClassHigh: sAssetClassHigh,
        masterFixedAssetLow: sMasterFixedAssetLow,
        masterFixedAssetHigh: sMasterFixedAssetHigh,
        fixedAssetLow: sFixedAssetLow,
        fixedAssetHigh: sFixedAssetHigh,
        depreciationAreaLow: sDepreciationAreaLow,
        depreciationAreaHigh: sDepreciationAreaHigh,
        generarPle: bGenerarPle,
        taxNumber: "" // lo llenamos abajo
      });

      try {
        this._setBusy(true);

        // 1) Obtener TAXNR (RUC) y guardarlo en vm>/params/taxNumber
        const sTaxnr = await this._fetchTaxnr(sCompanyCode);
        oVM.setProperty("/params/taxNumber", sTaxnr || "");

        // 2) Cargar datos del reporte
        const sReportingPeriodStartDate = `${sFiscalYear}-${sFiscalPeriod}-01`;
        const sPath = `/ZCDS_RES_LIB0319(P_ReportingPeriodStartDate=${sReportingPeriodStartDate},p_CompanyCode='${sCompanyCode}',p_FiscalYear='${sFiscalYear}',p_FiscalPeriod='${sFiscalPeriod}',p_CurrencyCode='${sCompanyCodeCurrency}')/Set`;

        const aFilters = [];
        if (sAssetClassLow && sAssetClassHigh) {
          aFilters.push(new Filter("AssetClass", FilterOperator.GE, sAssetClassLow));
          aFilters.push(new Filter("AssetClass", FilterOperator.LE, sAssetClassHigh));
        } else if (sAssetClassLow) {
          aFilters.push(new Filter("AssetClass", FilterOperator.EQ, sAssetClassLow));
        }
        if (sMasterFixedAssetLow && sMasterFixedAssetHigh) {
          aFilters.push(new Filter("MasterFixedAsset", FilterOperator.GE, sMasterFixedAssetLow));
          aFilters.push(new Filter("MasterFixedAsset", FilterOperator.LE, sMasterFixedAssetHigh));
        } else if (sMasterFixedAssetLow) {
          aFilters.push(new Filter("MasterFixedAsset", FilterOperator.EQ, sMasterFixedAssetLow));
        }
        if (sFixedAssetLow && sFixedAssetHigh) {
          aFilters.push(new Filter("FixedAsset", FilterOperator.GE, sFixedAssetLow));
          aFilters.push(new Filter("FixedAsset", FilterOperator.LE, sFixedAssetHigh));
        } else if (sFixedAssetLow) {
          aFilters.push(new Filter("FixedAsset", FilterOperator.EQ, sFixedAssetLow));
        }
        if (sDepreciationAreaLow && sDepreciationAreaHigh) {
          aFilters.push(new Filter("AssetDepreciationArea", FilterOperator.GE, sDepreciationAreaLow));
          aFilters.push(new Filter("AssetDepreciationArea", FilterOperator.LE, sDepreciationAreaHigh));
        } else if (sDepreciationAreaLow) {
          aFilters.push(new Filter("AssetDepreciationArea", FilterOperator.EQ, sDepreciationAreaLow));
        }


        const oModel = this.getView().getModel("res_lib0319");
        if (!oModel) {
          throw new Error("No se encontró el modelo OData 'res_lib0319' en la vista.");
        }

        const oCombinedFilter = aFilters.length ? new Filter({ filters: aFilters, and: true }) : undefined;
        const oBinding = oModel.bindList(sPath, undefined, undefined, oCombinedFilter);
        const aContexts = await oBinding.requestContexts(0, 10000);
        const aData = aContexts.map(ctx => ctx.getObject());

        this.getView().setModel(new JSONModel(aData), "resultsModel");
        oVM.setProperty("/count", aData.length);

        // 3) Si pidieron generar PLE automáticamente
        if (bGenerarPle && aData.length) {
          this.onGenerateTxt(); // llama al handler público
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error al cargar datos o al leer TAXNR:", e);
        MessageToast.show("Ocurrió un error al cargar el reporte.");
      } finally {
        this._setBusy(false);
      }
    },

    /**
     * Lee TAXNR desde el servicio get_company_code_info (OData V4)
     * Retorna string con el RUC o "" si no hay.
     */
    _fetchTaxnr: async function (sCompanyCode) {
      try {
        const oModel = this.getView().getModel("get_company_code_info");
        if (!oModel) { return ""; }

        const sPath = `/ZCDS_GET_COMPANY_CODE_INFO(p_company_code='${sCompanyCode}')/Set`;
        const oBinding = oModel.bindList(sPath);
        const aCtx = await oBinding.requestContexts(0);
        const aInfo = aCtx.map(c => c.getObject());
        const oTax = (aInfo || []).find(o => o.CompanyCodeParameterType === "TAXNR");
        return oTax ? oTax.CompanyCodeParameterValue : "";
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("No fue posible obtener TAXNR:", e);
        return "";
      }
    },

    /* =======================
       Filtros en la tabla
       ======================= */

    _getTableBinding: function () {
      const oTable = this.byId("tblResultados");
      if (!oTable) { return null; }
      // Detecta si es sap.m.Table (items) o sap.ui.table.Table (rows)
      return oTable.getBinding("items") || oTable.getBinding("rows") || null;
    },

    onFilter: function () {
      const oView = this.getView();
      const oBinding = this._getTableBinding();
      if (!oBinding) { return; }

      const aFilterInputs = oView.findAggregatedObjects(true, function (oControl) {
        return oControl.isA("sap.m.Input") &&
          oControl.getCustomData().some(cd => cd.getKey() === "field");
      });

      const aFilters = aFilterInputs.map(oInput => {
        const sValue = oInput.getValue();
        const sField = oInput.getCustomData().find(cd => cd.getKey() === "field")?.getValue();
        return sValue ? new Filter(sField, FilterOperator.Contains, sValue) : null;
      }).filter(Boolean);

      oBinding.filter(aFilters);
    },

    onClearFilters: function () {
      const oView = this.getView();
      const oBinding = this._getTableBinding();
      if (!oBinding) { return; }

      const aFilterInputs = oView.findAggregatedObjects(true, function (oControl) {
        return oControl.isA("sap.m.Input") &&
          oControl.getCustomData().some(cd => cd.getKey() === "field");
      });

      aFilterInputs.forEach(oInput => oInput.setValue(""));
      oBinding.filter([]);
    },

    /* =======================
       Generar TXT (PLE)
       ======================= */

    onGenerateTxt: function () {
      const aData = (this.getView().getModel("resultsModel") || new JSONModel([])).getData() || [];
      if (!aData.length) {
        MessageToast.show("No hay datos para exportar.");
        return;
      }
      this._generarTxtDesdeData(aData);
    },

    _generarTxtDesdeData: function (aData) {
      // Ajusta el mapeo a tus campos reales del CDS:
      const aFields = [
        "c01periodo", "c02catalogo", "c03rubro", "c04capital", "c05accinv",
        "c06capadi", "c07resnre", "c08resleg", "c09otrres", "c10resacu",
        "c11difcnv", "c12ajuptr", "c13resnej", "c14excrev", "c15reseje",
        "c16estadooperacion",
      ];

      const formatDate = (s) => {
        if (!s) return "";
        const [yyyy, mm, dd] = s.split("-");
        return `${yyyy}${mm.padStart(2, "0")}${dd.padStart(2, "0")}`;
      };

      const hasData = Array.isArray(aData) && aData.length > 0 && aData.some(oRow =>
        aFields.some(field => {
          const v = oRow[field];
          if (v == null) return false;
          const s = String(v).trim();
          return s !== "";
        })
      );

      const sIndContenido = hasData ? "1" : "0";

      const aLines = aData.map((oRow) => {
        return aFields.map((field) => {
          let v = oRow[field] ?? "";
          if (field === "c01periodo") {
            v = formatDate(v);
          }
          return v;
        }).join("|") + "|";
      });

      const sContent = aLines.join("\n");

      const oParams = this.getView().getModel("vm").getProperty("/params") || {};
      const sTaxnr = oParams.taxNumber || "00000000000";
      const sYear = oParams.fiscalYear || "0000";
      const sMonth = oParams.fiscalPeriod || "00";
      const sDia = this.getLastDayNumberOfMonth(sYear, sMonth);
      const sOportunidadEEFF = oParams.oportunidadEEFF;
      const sTipoMoneda = (oParams.companyCodeCurrency === "PEN") ? 1 : 2;

      const sFile = `LE${sTaxnr}${sYear}${sMonth}${sDia}031900${sOportunidadEEFF}1${sIndContenido}${sTipoMoneda}1.txt`;

      const oBlob = new Blob([sContent], { type: "text/plain;charset=utf-8" });
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(oBlob, sFile);
      } else {
        const oLink = document.createElement("a");
        oLink.href = URL.createObjectURL(oBlob);
        oLink.download = sFile;
        document.body.appendChild(oLink);
        oLink.click();
        document.body.removeChild(oLink);
      }
      MessageToast.show("TXT generado.");
    },

    /* =======================
       Exportar a Excel
       ======================= */

    onExportExcel: function () {
      const aData = (this.getView().getModel("resultsModel") || new JSONModel([])).getData() || [];
      if (!aData.length) {
        MessageToast.show("No hay datos para exportar.");
        return;
      }

      // Define columnas (ajusta labels y propiedades reales)
      const aCols = [
        { label: "Periodo", property: "c01periodo", type: EdmType.String },
        { label: "Cód.Catálogo", property: "c02catalogo", type: EdmType.String },
        { label: "Cód.Rubro", property: "c03rubro", type: EdmType.String },
        { label: "Capital", property: "c04capital", type: EdmType.String },
        { label: "Acciones.Inversión", property: "c05accinv", type: EdmType.String },
        { label: "Capital Adicional", property: "c06capadi", type: EdmType.String },
        { label: "Resultados No.Realiz", property: "c07resnre", type: EdmType.String },
        { label: "Reservas Legales", property: "c08resleg", type: EdmType.String },
        { label: "Otras Reservas", property: "c09otrres", type: EdmType.String },
        { label: "Resultados Acumulado", property: "c10resacu", type: EdmType.String },
        { label: "Dif.Conversión", property: "c11difcnv", type: EdmType.String },
        { label: "Ajustes.Patrimonio", property: "c12ajuptr", type: EdmType.String },
        { label: "Res.Neto.Ejercicio", property: "c13resnej", type: EdmType.String },
        { label: "Excedente.Reval.", property: "c14excrev", type: EdmType.String },
        { label: "Res.Ejercicio", property: "c15reseje", type: EdmType.String },
        { label: "Estado.Operación", property: "c16estadooperacion", type: EdmType.String },
      ];

      const oSheet = new Spreadsheet({
        workbook: { columns: aCols },
        dataSource: aData,
        fileName: "libro0319.xlsx"
      });

      oSheet.build().finally(function () {
        oSheet.destroy();
      });
    },

    getLastDayNumberOfMonth: function (sYear, sMonth) {
      const year = parseInt(sYear, 10);
      const month = parseInt(sMonth, 10);
      const lastDay = new Date(year, month, 0).getDate();
      return String(lastDay).padStart(2, "0");
    },

    onNavBack: function () {
      const oHistory = sap.ui.core.routing.History.getInstance();
      const sPrevious = oHistory.getPreviousHash();
      if (sPrevious !== undefined) {
        window.history.go(-1);
      } else {
        UIComponent.getRouterFor(this).navTo("RouteSelection", {}, true);
      }
    }
  });
});
