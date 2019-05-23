/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  TabRegisterEventDetail,
} from './interfaces/TabRegister';
import {
  TabChangeEventDetail,
} from './interfaces/TabChange';


export namespace Components {
  interface CalciteAlert {
    'close': () => Promise<void>;
    'color': string;
    'currentAlert': string;
    'dismiss': boolean;
    'duration': string;
    'icon': boolean;
    'id': string;
    'queueLength': number;
    'theme': string;
  }
  interface CalciteAlerts {
    'id': string;
    'open': (requestedAlert: any) => Promise<void>;
  }
  interface CalciteLoader {
    'isActive': boolean;
    'text': string;
  }
  interface CalciteModal {
    /**
    * The first name
    */
    'first': string;
    /**
    * The last name
    */
    'last': string;
    /**
    * The middle name
    */
    'middle': string;
  }
  interface CalciteProgress {
    'percentage': number;
    'text': string;
    'type': "indeterminate" | "indeterminate-reversed" | "progress";
  }
  interface CalciteTab {
    'getTabIndex': () => Promise<any>;
    'id': string;
    'isActive': boolean;
    'registerLabeledBy': (id: any) => Promise<void>;
    'tab': string;
  }
  interface CalciteTabNav {
    'id': string;
    'selectedTab': number | string;
  }
  interface CalciteTabTitle {
    'getTabIndex': () => Promise<any>;
    'id': string;
    'isActive': boolean;
    'setControledBy': (id: string) => Promise<void>;
    'tab': string;
  }
  interface CalciteTabs {
    'theme': "light" | "dark";
  }
}

declare namespace LocalJSX {
  interface CalciteAlert extends JSXBase.HTMLAttributes {
    'color'?: string;
    'currentAlert'?: string;
    'dismiss'?: boolean;
    'duration'?: string;
    'icon'?: boolean;
    'id'?: string;
    'onAlertClose'?: (event: CustomEvent<any>) => void;
    'onAlertOpen'?: (event: CustomEvent<any>) => void;
    'queueLength'?: number;
    'theme'?: string;
  }
  interface CalciteAlerts extends JSXBase.HTMLAttributes {
    'id'?: string;
    'onAlertsClose'?: (event: CustomEvent<any>) => void;
    'onAlertsOpen'?: (event: CustomEvent<any>) => void;
  }
  interface CalciteLoader extends JSXBase.HTMLAttributes {
    'isActive'?: boolean;
    'text'?: string;
  }
  interface CalciteModal extends JSXBase.HTMLAttributes {
    /**
    * The first name
    */
    'first'?: string;
    /**
    * The last name
    */
    'last'?: string;
    /**
    * The middle name
    */
    'middle'?: string;
  }
  interface CalciteProgress extends JSXBase.HTMLAttributes {
    'percentage'?: number;
    'text'?: string;
    'type'?: "indeterminate" | "indeterminate-reversed" | "progress";
  }
  interface CalciteTab extends JSXBase.HTMLAttributes {
    'id'?: string;
    'isActive'?: boolean;
    'onCalciteRegisterTab'?: (event: CustomEvent<TabRegisterEventDetail>) => void;
    'tab'?: string;
  }
  interface CalciteTabNav extends JSXBase.HTMLAttributes {
    'id'?: string;
    'onCalciteTabChange'?: (event: CustomEvent<TabChangeEventDetail>) => void;
    'selectedTab'?: number | string;
  }
  interface CalciteTabTitle extends JSXBase.HTMLAttributes {
    'id'?: string;
    'isActive'?: boolean;
    'onCalciteActivateTab'?: (event: CustomEvent<TabChangeEventDetail>) => void;
    'onCalciteFocusNextTab'?: (event: CustomEvent<any>) => void;
    'onCalciteFocusPreviousTab'?: (event: CustomEvent<any>) => void;
    'onCalciteRegisterTabTitle'?: (event: CustomEvent<TabRegisterEventDetail>) => void;
    'tab'?: string;
  }
  interface CalciteTabs extends JSXBase.HTMLAttributes {
    'theme'?: "light" | "dark";
  }

  interface IntrinsicElements {
    'calcite-alert': CalciteAlert;
    'calcite-alerts': CalciteAlerts;
    'calcite-loader': CalciteLoader;
    'calcite-modal': CalciteModal;
    'calcite-progress': CalciteProgress;
    'calcite-tab': CalciteTab;
    'calcite-tab-nav': CalciteTabNav;
    'calcite-tab-title': CalciteTabTitle;
    'calcite-tabs': CalciteTabs;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


declare global {



  interface HTMLCalciteAlertElement extends Components.CalciteAlert, HTMLStencilElement {}
  var HTMLCalciteAlertElement: {
    prototype: HTMLCalciteAlertElement;
    new (): HTMLCalciteAlertElement;
  };

  interface HTMLCalciteAlertsElement extends Components.CalciteAlerts, HTMLStencilElement {}
  var HTMLCalciteAlertsElement: {
    prototype: HTMLCalciteAlertsElement;
    new (): HTMLCalciteAlertsElement;
  };

  interface HTMLCalciteLoaderElement extends Components.CalciteLoader, HTMLStencilElement {}
  var HTMLCalciteLoaderElement: {
    prototype: HTMLCalciteLoaderElement;
    new (): HTMLCalciteLoaderElement;
  };

  interface HTMLCalciteModalElement extends Components.CalciteModal, HTMLStencilElement {}
  var HTMLCalciteModalElement: {
    prototype: HTMLCalciteModalElement;
    new (): HTMLCalciteModalElement;
  };

  interface HTMLCalciteProgressElement extends Components.CalciteProgress, HTMLStencilElement {}
  var HTMLCalciteProgressElement: {
    prototype: HTMLCalciteProgressElement;
    new (): HTMLCalciteProgressElement;
  };

  interface HTMLCalciteTabElement extends Components.CalciteTab, HTMLStencilElement {}
  var HTMLCalciteTabElement: {
    prototype: HTMLCalciteTabElement;
    new (): HTMLCalciteTabElement;
  };

  interface HTMLCalciteTabNavElement extends Components.CalciteTabNav, HTMLStencilElement {}
  var HTMLCalciteTabNavElement: {
    prototype: HTMLCalciteTabNavElement;
    new (): HTMLCalciteTabNavElement;
  };

  interface HTMLCalciteTabTitleElement extends Components.CalciteTabTitle, HTMLStencilElement {}
  var HTMLCalciteTabTitleElement: {
    prototype: HTMLCalciteTabTitleElement;
    new (): HTMLCalciteTabTitleElement;
  };

  interface HTMLCalciteTabsElement extends Components.CalciteTabs, HTMLStencilElement {}
  var HTMLCalciteTabsElement: {
    prototype: HTMLCalciteTabsElement;
    new (): HTMLCalciteTabsElement;
  };

  interface HTMLElementTagNameMap {
    'calcite-alert': HTMLCalciteAlertElement;
    'calcite-alerts': HTMLCalciteAlertsElement;
    'calcite-loader': HTMLCalciteLoaderElement;
    'calcite-modal': HTMLCalciteModalElement;
    'calcite-progress': HTMLCalciteProgressElement;
    'calcite-tab': HTMLCalciteTabElement;
    'calcite-tab-nav': HTMLCalciteTabNavElement;
    'calcite-tab-title': HTMLCalciteTabTitleElement;
    'calcite-tabs': HTMLCalciteTabsElement;
  }

  interface ElementTagNameMap extends HTMLElementTagNameMap {}
}

