"use strict";

/**
 * Written by Travis from StackOverflow.
 * @returns Width of the page.
 */
function getPageWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth);
}
function getPageHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight);
}

window.onload = function() {
    let canvas = document.getElementById("header_img_canvas");
    canvas.width = getPageWidth();

    let context = canvas.getContext("2d");

    // Get lower bounds of content in the header.
    let title_area = document.getElementsByClassName("title_area")[0],
        download_resume_button = document.getElementById("download_resume_button");
    let lowerBounds = Math.max(
        title_area.getBoundingClientRect().bottom,
        download_resume_button.getBoundingClientRect().bottom);
    canvas.height = lowerBounds;

    context.fillStyle = "green";
    context.fillRect(0, 0, canvas.width, canvas.height);
}