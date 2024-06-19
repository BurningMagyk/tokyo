"use strict";

/**
 * getPatgeWidth and getPageHeight written by Travis from StackOverflow.
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

const headerCanvas = document.getElementById("header_canvas"),
      headerCtx = headerCanvas.getContext("2d");
const titleArea = document.getElementsByClassName("title_area")[0],
      downloadResumeButton = document.getElementById("download_resume_button");
const headerImageGoat = document.getElementById("header_img_goat"),
      headerImageRobin = document.getElementById("header_img_robin");

function drawImage(ctx, image, { x: xPos, y: yPos }, { width: rightBound, height: lowerBound }, { xFlip, yFlip }) {
    if (rightBound === 0 && lowerBound === 0) {
        console.error("Invalid arguments: rightBound or lowerBound must be non-zero.");
        return null;
    }
    let originalWidth = image.width,
        originalHeight = image.height;
    if (rightBound === 0) {
        let scaledWidth = image.width / image.height * lowerBound,
            scaledHeight = lowerBound,
            scaledX = xPos,
            scaledY = yPos;
        if (xFlip) {
            scaledX += scaledWidth;
            originalWidth *= -1;
        }
        if (yFlip) {
            scaledY += scaledHeight;
            originalHeight *= -1;
        }
        ctx.drawImage(image, 0, 0, originalWidth, originalHeight, scaledX, scaledY, scaledWidth, scaledHeight);
    } else {
        let scaledHeight = image.height / image.width * rightBound,
            scaledWidth = rightBound,
            scaledX = xPos,
            scaledY = yPos;
        if (xFlip) {
            scaledX += scaledWidth;
            originalWidth *= -1;
        }
        if (yFlip) {
            scaledY += scaledHeight;
            originalHeight *= -1;
        }
        ctx.drawImage(image, 0, 0, originalWidth, originalHeight, scaledX, scaledY, scaledWidth, scaledHeight);
    }
}

function drawHeader() {
    let titleAreaRect = titleArea.getBoundingClientRect();

    // Get lower bounds of content in the header.
    let lowerBound = Math.max(
        titleAreaRect.bottom,
        downloadResumeButton.getBoundingClientRect().bottom);
    headerCanvas.width = getPageWidth();
    headerCanvas.height = lowerBound;

    headerCtx.fillStyle = "green";
    headerCtx.fillRect(0, 0, headerCanvas.width, headerCanvas.height);
    
    let imageGoatScaledWidth = headerImageGoat.width / headerImageGoat.height * lowerBound;
    let imageGoatArea = titleAreaRect.right - imageGoatScaledWidth;
    // while (imageGoatArea > 0) {
    //     imageGoatArea -= imageGoatScaledWidth;
    //     drawImage(headerCtx, headerImageGoat, {x: 0, y: 0}, {width: 0, height: lowerBound});
    // }
    drawImage(headerCtx, headerImageGoat, {x: 0, y: 0}, {width: 0, height: lowerBound}, {xFlip: false, yFlip: true});
}

window.onload = function() {
    drawHeader();
}

window.onresize = function() {
    drawHeader();
}