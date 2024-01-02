// ==UserScript==
// @name         PasteOnQuill
// @namespace    http://tampermonkey.net/
// @version      2023-12-08
// @description  Allows pasting on quill.org.
// @author       Archonic
// @icon         https://quill.org/assets/favicon-3fe39791dd479c3a58684c4d9f41c3e8ba0393730c43fdae0fbb62b554e84d0c.ico
// @grant        none
// ==/UserScript==

(function() {
    //remove all listeners of type paste
window.addEventListener("paste", function(event) {
    //check if event type is paste
    if (event.type === 'paste') {
        //prevent default behavior
        event.stopImmediatePropagation();
        console.log("Paste event detected!")
        //retrieve clipboard data
        var clipboardData = event.clipboardData || window.clipboardData;
        //retrieve pasted data as string
        var pastedString = clipboardData.getData('Text');
        //pasting multiple lines messes quill up
        if(pastedString.includes("\n")) alert("Cannot paste multiple lines!");
        //append to document
        else document.execCommand('insertText', false, pastedString);
    }
}, true);

//when enter is pressed, click button with class quill-button
window.addEventListener("keydown", function(event) {
    //check if event type is keydown and key is enter
    if (event.type === 'keydown' && event.key === 'Enter') {
        //prevent default behavior
        console.log("Enter event detected!")
        //retrieve all buttons with class quill-button
        var buttons = document.getElementsByClassName("quill-button");
        //click the first visible one
        for(var i = 0; i < buttons.length; i++) {
            if(!buttons[i].hidden) {
                buttons[i].click();
                break;
            }
        }
    }
}, true);
})

