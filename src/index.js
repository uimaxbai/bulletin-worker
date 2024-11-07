import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";
import {DOMParser} from 'linkedom';


const PostalMime = require("postal-mime");

async function streamToArrayBuffer(stream, streamSize) {
  let result = new Uint8Array(streamSize);
  let bytesRead = 0;
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result.set(value, bytesRead);
    bytesRead += value.length;
  }
  return result;
}

export default {
  async email(event, env, ctx) {
    // console.log(event.from);
    switch (event.from) {
      case "21mbai@kes.net":
        console.log("yay!")
        break;
      default:
        console.log("nay...")
        break;
    }
    const rawEmail = await streamToArrayBuffer(event.raw, event.rawSize);
    const parser = new PostalMime.default();
    const parsedEmail = await parser.parse(rawEmail);
    const html = parsedEmail.html;
    const parsedHTML = (new DOMParser).parseFromString(html);
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
    

    // console.log(html);
    /*
    console.log("Mail subject: ", parsedEmail.subject);
    console.log("Mail message ID", parsedEmail.messageId);
    console.log("HTML version of Email: ", parsedEmail.html);
    console.log("Text version of Email: ", parsedEmail.text);
    */
  },
};