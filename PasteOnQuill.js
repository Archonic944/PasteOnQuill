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

window.addEventListener("keydown", function(event) {
    //if alt + number
    if (event.code.startsWith("Digit") && event.altKey){
        //get sentence fragments
        let fragElements = document.querySelectorAll(".sentence-fragments > p");
        if(fragElements.length === 0) return;
        //get the number
        let num = parseInt(event.code.slice(-1));
        if(num > 4) return;
        event.preventDefault();
        //if the number is out of range, return
        if(num < 1 || num > fragElements.length) return;
        //  get the fragment
        let frag = fragElements[num - 1].innerText;
        //get content of focused text box
        let content = document.activeElement.innerText;
        //remove the starting part of the fragment that it shares with the start of the content
        //need to iterate in case the text box contains additional content
        //this is good for sentence combination tasks
        let sub = 0;
        while(content.startsWith(frag.slice(0, sub + 1))){
            sub++;
            //debug
            console.log("sub: " + sub);
            console.log("does " + content + " start with " + frag.slice(0, sub + 1) + "? " + content.startsWith(frag.slice(0, sub + 1)));
        } 
        if(content.length > 0){
            //change to lowercase
            frag = frag.charAt(0).toLowerCase() + frag.slice(1);
        }
        //remove period
        if(frag.charAt(frag.length - 1) == '.') frag = frag.slice(0, -1);
        document.execCommand('insertText', false, frag.slice(sub));
    }
}, true)
})