// import { EmailMessage } from "cloudflare:email";
import {DOMParser} from 'linkedom';

export default {
  async scheduled(event, env, ctx) {
    let viewState, eventValidation, viewStateGenerator;
    fetch("https://kes.net/parent-portal/").then(d => { return d.text() })
      .then(d => {
        let parsedHTML = (new DOMParser).parseFromString(html);
        viewState = parsedHTML.getElementById("__VIEWSTATE").value;
        eventValidation = parsedHTML.getElementById("__EVENTVALIDATION").value;
        viewStateGenerator = parsedHTML.getElementById("__VIEWSTATEGENERATOR").value;
      });
    
    // TODO do this fetch
    fetch("https://kes.net/parent-portal/", {
      method: 'post'
    })
    
    const {defaultView: window} = parsedHTML;
    const {
      // provided by this module, could be native too
      Event, CustomEvent,
      // all HTML classes, such as HTMLButtonElement and others, are available
      HTMLElement,
      // the CustomElementRegistry is defined once *per document*
      // multiple documents require multiple custom elements definition
      // but classes can be reused
      customElements
    } = window;

    const pdfURL = parsedHTML.querySelector(".x_document-item a").getAttribute("href").replace("&amp;", "&");
    console.log(pdfURL);
    const response = await fetch(pdfURL);
    if (!response.ok) {
      throw new Error("PDF did not fetch successfully.");
    }
    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const data = await response.arrayBuffer();

    // Get filename
    var filename = (new URL(pdfURL)).searchParams.get('u').split('/').pop() || 'downloaded-file';

    if (env.BUCKET) {
      await env.BUCKET.put(`bulletin/${filename}`, data, {
        httpMetadata: {
          contentType
        }
      });
    } else {
      throw new Error("R2 binding does not exist!");
    }
    
    

    // console.log(html);
    /*
    console.log("Mail subject: ", parsedEmail.subject);
    console.log("Mail message ID", parsedEmail.messageId);
    console.log("HTML version of Email: ", parsedEmail.html);
    console.log("Text version of Email: ", parsedEmail.text);
    */
  },
};