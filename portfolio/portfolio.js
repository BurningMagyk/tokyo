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

function drawImage(ctx, image, { x: xPos, y: yPos }, { width: fixedWidth, height: fixedHeight }) {
    if (fixedWidth !== 0 && fixedHeight !== 0) {
        ctx.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, fixedWidth, fixedHeight);
        return null;
    }
    if (fixedWidth !== 0) {
        let scaledHeight = image.height / image.width * fixedWidth;
        ctx.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, fixedWidth, scaledHeight);
        return scaledHeight;
    }
    if (fixedHeight !== 0) {
        let scaledWidth = image.width / image.height * fixedHeight;
        ctx.drawImage(image, 0, 0, image.width, image.height, xPos, yPos, scaledWidth, fixedHeight);
        return scaledWidth;
    }
    console.error("Invalid arguments: fixedWidth or fixedHeight must be non-zero.");
    return null;
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
    headerCanvas.width = document.documentElement.clientWidth;
    headerCanvas.height = lowerBound;
    
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
    this.bounds = {left: 0, up: 0, right: 0, down: 0};
    this.inbounds = function(position) {
        return position.x > this.bounds.left
            && position.x < this.bounds.right
            && position.y > this.bounds.up
            && position.y < this.bounds.down;
    }
    this.canvasPos = null;
    this.canvasDims = null;
}

const demoProjects = [];
const cardResolutionRatio = 0.5625;
const demoCanvas = document.getElementById("demo_canvas"),
      demoCtx = demoCanvas.getContext("2d");

var selectedCard = null,
    hoveredCard = null;

function hoverCard(demo) {
    if (hoveredCard != null) {
        // Unhighlight the formerly hovered card.
        drawImage(demoCtx,
            hoveredCard.cardImage,
            hoveredCard.canvasPos,
            hoveredCard.canvasDims
        );
    }
    hoveredCard = demo;
    // Highlight the newly hovered card.
    // drawImage(demoCtx,
    //     cardHighlightImage,
    //     hoveredCard.canvasPos,
    //     hoveredCard.canvasDims
    // );
}

demoCanvas.onmousemove = function(event) {
    demoProjects.forEach((element) => {
        if (element.inbounds({x: event.clientX, y: event.clientY})) {
            hoverCard(element);
        }
    });
}

demoCanvas.onmousedown = function(event) {
    if (hoveredCard == null) return;
    console.log(hoveredCard.bounds);
}

function drawCards() {
    let upperBound = demoCanvas.getBoundingClientRect().top;
    demoCanvas.width = document.documentElement.clientWidth;
    
    // Determine how many cards should be in a given row.
    let cardCountPerRow = demoProjects.length + 1;
    do {
        cardCountPerRow--;
        var cardWidth = demoCanvas.width / cardCountPerRow,
            cardHeight = cardWidth * cardResolutionRatio;
    } 
    while (cardHeight * 3 < document.documentElement.clientHeight && cardCountPerRow > 1);

    // Detrmine how many rows are needed.
    let rowCount = Math.ceil(demoProjects.length / cardCountPerRow);

    // Determine canvas height after calculating card height and row count.
    demoCanvas.height = cardHeight * rowCount;

    // demoCtx.fillStyle = "black";
    // demoCtx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);

    let cardCountToDraw = demoProjects.length,
        rowCountDrawn = 0,
        cardDrawPosition = {x: 0, y: 0};
    while (cardCountToDraw > 0) {
        for (let i = 0; i < cardCountPerRow && cardCountToDraw > 0; i++) {
            let demo = demoProjects[i + rowCountDrawn * cardCountPerRow];
            // Object.assign makes a copy so that we can keep mutating cardDrawPosition.
            demo.canvasPos = Object.assign(cardDrawPosition);
            demo.canvasDims = {width: cardWidth, height: cardHeight};
            drawImage(demoCtx,
                demo.cardImage,
                demo.canvasPos,
                demo.canvasDims
            );
            demo.bounds = {
                left: cardDrawPosition.x,
                up: cardDrawPosition.y + upperBound,
                right: cardDrawPosition.x + cardWidth,
                down: cardDrawPosition.y + cardHeight + upperBound,
            }
            cardDrawPosition.x += cardWidth;
            cardCountToDraw--;
        }
        cardDrawPosition.y += cardHeight;
        cardDrawPosition.x = 0;
        rowCountDrawn++;
    }
}

const footerCanvas = document.getElementById("footer_canvas"),
      footerCtx = footerCanvas.getContext("2d");
const footerArea = document.getElementsByClassName("footer_area")[0];

function drawFooter() {
    let textAreaRect = footerArea.getBoundingClientRect(),
        upperBound = textAreaRect.top;
    
    footerCanvas.width = document.documentElement.clientWidth;
    footerCanvas.height = textAreaRect.height;

    footerCtx.fillStyle = "gray";
    footerCtx.fillRect(0, 0, footerCanvas.width, footerCanvas.height);

    return upperBound;
}

var headerLowerBound, footerUpperBound;

window.onload = function() {
    // Load project stuff.
    demoProjects.push(
        new DemoProject("cloudcast", 1),
        new DemoProject("bokkusu", 3),
        new DemoProject("wizzers", 1),
        new DemoProject("rainfall", 0),
        new DemoProject("droserogis", 2),
        new DemoProject("dauntless", 3),
    );
    // var cardHighlightImage = document.getElementById("card_img_highlight");

    // A scroll bug shows up if drawCards isn't called first.
    drawCards();

    headerLowerBound = drawHeader();
    footerUpperBound = drawFooter();
    drawCards();
}

window.onresize = function() {
    headerLowerBound = drawHeader();
    footerUpperBound = drawFooter();
    drawCards();
}