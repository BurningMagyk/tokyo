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
        document.documentElement.clientWidth
    );
}
function getPageHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

function drawImage(ctx, image, { x: xPos, y: yPos }, { width: rightBound, height: lowerBound }) {
    if (rightBound === 0 && lowerBound === 0) {
        console.error("Invalid arguments: rightBound or lowerBound must be non-zero.");
        return null;
    }
    if (rightBound === 0) {
        let scaledWidth = image.width / image.height * lowerBound,
            scaledHeight = lowerBound;
        ctx.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, scaledWidth, scaledHeight);
        return scaledWidth;
    } else {
        let scaledHeight = image.height / image.width * rightBound,
            scaledWidth = rightBound;
        ctx.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, scaledWidth, scaledHeight);
        return scaledHeight;
    }
}

const headerCanvas = document.getElementById("header_canvas"),
      headerCtx = headerCanvas.getContext("2d");
const titleArea = document.getElementsByClassName("title_area")[0],
      downloadResumeButton = document.getElementById("download_resume_button");

// Import images for head block.
const headerImageGoat = document.getElementById("header_img_goat"),
      headerImageGoatFlipped = document.getElementById("header_img_goat_flipped"),
      headerImageRobin = document.getElementById("header_img_robin"),
      headerImageRobinFlipped = document.getElementById("header_img_robin_flipped"),
      headerImageFence = document.getElementById("header_img_fence"),
      headerImageFenceFlipped = document.getElementById("header_img_fence_flipped");

function drawHeader() {
    let titleAreaRect = titleArea.getBoundingClientRect(),
        buttonRect = downloadResumeButton.getBoundingClientRect();

    // Get lower bounds of content in the header.
    let lowerBound = Math.max(titleAreaRect.bottom, buttonRect.bottom);
    headerCanvas.width = getPageWidth();
    headerCanvas.height = lowerBound;

    headerCtx.fillStyle = "green";
    headerCtx.fillRect(0, 0, headerCanvas.width, headerCanvas.height);
    
    // Draw header images according to how much space there is.
    let imageGoatScaledWidth = headerImageGoat.width / headerImageGoat.height * lowerBound,
        imageGoatArea = titleAreaRect.right - imageGoatScaledWidth,
        imageGoatFlip = true,
        imagesRightBound = imageGoatArea;
    // Fill from the left with goat image just until title area is covered.
    while (imageGoatArea > 0) {
        imageGoatArea -= imageGoatScaledWidth;
        drawImage(headerCtx,
            imageGoatFlip ? headerImageGoatFlipped : headerImageGoat,
            {x: imageGoatArea, y: 0},
            {width: 0, height: lowerBound}
        );
        imageGoatFlip = !imageGoatFlip;
    }
    let imageRobinScaledWidth = headerImageRobin.width / headerImageRobin.height * lowerBound,
        imageFenceScaledWidth = headerImageFence.width / headerImageFence.height * lowerBound;
    imagesRightBound += drawImage(headerCtx,
        headerImageRobin,
        {x: imagesRightBound, y: 0},
        {width: 0, height: lowerBound}
    );
    if (buttonRect.left > 2 * imageFenceScaledWidth + imageRobinScaledWidth + imagesRightBound) {
        // Draw fence image if it won't cause the flipped robin image to enter button area after.
        imagesRightBound += drawImage(headerCtx,
            headerImageFence,
            {x: imagesRightBound, y: 0},
            {width: 0, height: lowerBound}
        );
        imagesRightBound += drawImage(headerCtx,
            headerImageFenceFlipped,
            {x: imagesRightBound, y: 0},
            {width: 0, height: lowerBound}
        );
    }
    imagesRightBound += drawImage(headerCtx,
        headerImageRobinFlipped,
        {x: imagesRightBound, y: 0},
        {width: 0, height: lowerBound}
    );
    // Fill rest of the area with goat image.
    while (imagesRightBound < headerCanvas.width) {
        imageGoatFlip = !imageGoatFlip;
        imagesRightBound += drawImage(headerCtx,
            imageGoatFlip ? headerImageGoatFlipped : headerImageGoat,
            {x: imagesRightBound, y: 0},
            {width: 0, height: lowerBound}
        );
    }

    // Set spacer to be the same height.
    document.getElementById('header_spacer').setAttribute("style", "height: " + lowerBound + "px");

    return lowerBound;
}

function DemoProject(name, shotCount) {
    this.cardImage = document.getElementById("card_img_" + name);
    this.cardShots = [];
    for (let i = 1; i <= shotCount; i++) {
        this.cardShots.push(document.getElementById("shot_img_" + name + "_" + i));
    }
}

const demoProjects = [];

function drawCards(upperBound, lowerBound) {
    let dims = [getPageWidth(), lowerBound - upperBound];
    console.log(dims);
}

const footerCanvas = document.getElementById("footer_canvas"),
      footerCtx = footerCanvas.getContext("2d");
const footerArea = document.getElementsByClassName("footer_area")[0];

function drawFooter() {
    let textAreaRect = footerArea.getBoundingClientRect(),
        upperBound = textAreaRect.top;
    
    footerCanvas.width = getPageWidth();
    footerCanvas.height = textAreaRect.height;

    footerCtx.fillStyle = "gray";
    footerCtx.fillRect(0, 0, footerCanvas.width, footerCanvas.height);

    return upperBound;
}

var headerLowerBound, footerUpperBound;

window.onload = function() {
    headerLowerBound = drawHeader();
    footerUpperBound = drawFooter();

    // Load project stuff.
    demoProjects.push(
        new DemoProject("cloudcast", 1),
        new DemoProject("bokkusu", 3),
        new DemoProject("wizzers", 1),
        new DemoProject("rainfall", 0),
        new DemoProject("droserogis", 2),
        new DemoProject("dauntless", 3),
    );

    drawCards(headerLowerBound, footerUpperBound);
}

window.onresize = function() {
    drawHeader();
    drawFooter();
    drawCards(headerLowerBound, footerUpperBound);
}