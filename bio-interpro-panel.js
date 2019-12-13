import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-listbox/paper-listbox";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-item/paper-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-input/paper-textarea";
import "@polymer/iron-icon/iron-icon";
import "@biopolymer-elements/bio-icons";

/**
 * `BioInterproPanel`
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class BioInterproPanel extends PolymerElement {
  static get properties() {
    return {
      /** An array of InterPro domains. */
      model: {
        type: Array,
        value: []
      },

      /** The domain detail record. */
      detail: {
        type: Object,
        value: null,
        notify: true
      },

      /** An array of literature reference objects. */
      literature: {
        type: Array,
        value: []
      }
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        paper-listbox {
          height: 200px;
          overflow-y: scroll;
        }

        paper-item {
          border-bottom: 1px solid #cacaca;
          width: 100%;
          text-align: left;
          @apply --layout-vertical;
        }

        .domain-item {
          @apply --layout-horizontal;
        }

        .domain-item {
          margin-top: 0px;
        }

        .title {
          text-align: left;
          font-size: 0.9em;
          font-weight: bold;
          color: #909090;
          word-wrap: break-word;
          max-width: 400px;
        }
        .desc {
          text-align: left;
          font-size: 0.7em;
          color: #aaaaaa;
          width: 100%;
          margin-top: -10px;
        }

        fieldset {
          border-radius: 5px;
          border-color: var(--app-header-color);
          color: var(--app-header-color);

          @apply --layout-horizontal;
          @apply --layout-wrap;
        }
        iron-icon {
          color: var(--app-header-color);
        }

        .content-panel {
          @apply --layout-horizontal;
        }

        .domain-panel {
          padding: 10px;
          @apply --layout-vertical;
        }
        .detail-panel {
          border-left: 1px solid #909090;
          padding: 10px;
          overflow-y: scroll;
        }

        label {
          font-size: 0.9em;
          font-weight: 100;
        }
        .domain-list {
          background-color: #909090;
          border-radius: 5px;
          max-width: 400px;
        }
        .domain-list .title {
          color: white;
          max-width: 400px;
        }
        .domain-list .desc {
          color: white;
        }

        .lit-panel {
          margin-top: 10px;
        }

        #detailDesc {
          color: #909090;
          font-size: 0.8em;
          max-width: 400px;
        }
        #detailDescContainer {
          @apply --layout-vertical;
          width: fit-content;
        }
      </style>

      <fieldset>
        <legend>InterPro Domains</legend>
        <div class="content-panel">
          <div class="domain-panel">
            <label>Domains</label>
            <paper-listbox class="domain-list" on-iron-select="__handleSelect">
              <template is="dom-repeat" items="[[model]]">
                <paper-item id="[[item.id]]">
                  <div class="title">[[item.short_desc]]</div>
                  <div class="desc">[[item.desc]]</div>
                </paper-item>
              </template>
            </paper-listbox>
          </div>

          <div class="detail-panel">
            <label>Domain Details</label>
            <paper-input
              label="Name"
              value="[[detail.name.name]]"
            ></paper-input>

            <div id="detailDescContainer">
              <label>Description</label>
              <div id="detailDesc"></div>
            </div>

            <div class="lit-panel">
              <label style="margin-top: 5px;">Literature</label>
              <paper-listbox on-iron-select="__handleLitSelect">
                <template is="dom-repeat" items="[[literature]]">
                  <paper-item id="[[item.PMID]]" class="domain-item">
                    <paper-item-body two-line>
                      <div class="title">[[item.title]]</div>
                      <div class="desc">[PMID: [[item.PMID]] ]</div>
                    </paper-item-body>
                  </paper-item>
                </template>
              </paper-listbox>
            </div>
          </div>
        </div>
      </fieldset>
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

  __computeDesc(detail) {
    if (detail && detail.description) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(detail.description, "text/html").body;
      let descNode = this.shadowRoot.querySelector("#detailDesc");
      for (let i = 0; i < doc.childElementCount; i++) {
        descNode.appendChild(doc.childNodes[i]);
      }
    }
  }

  /**
   * This method calls the InterPro API and fetches the details of the domain record.
   * @param {Event} e the event object
   */

  __handleSelect(e) {
    let id = e.detail.item.id;
    let url = `https://www.ebi.ac.uk/interpro/beta/api/entry/interpro/${id}`;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        let detail = json.metadata;
        this.set("detail", detail);

        if (detail.literature) {
          let literature = [];
          Object.keys(detail.literature).map(key =>
            literature.push(detail.literature[key])
          );

          this.set("literature", literature);
        }
      })
      .catch(reason => {
        console.error(reason);
      });
  }

  /**
   * Whenever the user clicks on a literature reference, this method opens the selected article
   * in a new window.
   * @param {Event} e the event object
   */

  __handleLitSelect(e) {
    let id = e.detail.item.id;
    let url = `https://www.ncbi.nlm.nih.gov/pubmed/${id}`;
    window.open(url);
  }
}

customElements.define("bio-interpro-panel", BioInterproPanel);
