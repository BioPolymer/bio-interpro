import "./bio-interpro-panel";

import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";

/**
 * `LowerCaseDashedName` Description
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class PascalCaseName extends PolymerElement {
  static get properties() {
    return {};
  }

  static get template() {
    return html`
      <h2>Hello</h2>
    `;
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }
}

customElements.define("LowerCaseDashedName", PascalCaseName);
