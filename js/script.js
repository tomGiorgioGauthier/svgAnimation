const path = "/parsedPaths/paths.json";
let svgNode, refPath;

const fetchPaths = async (path) => {
    return await fetch(path)
        .then((response) => response.json())
        .then((json) => {
            return json;
        });
};

console.log();

const loadFileAndPrintToConsole = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.text();
        return data;
    } catch (err) {
        console.error(err);
    }
}

const __centerSVG = () => {
    const pathBounds = refPath.getBoundingClientRect();
    const svgBounds = svgNode.getBoundingClientRect();
    let newLeftPosition = Math.round(-((svgBounds.width - pathBounds.width) / 2));
    let newTopPosition = Math.round(-((svgBounds.height) / 2));
    newLeftPosition = newLeftPosition - 300;
    newTopPosition = newTopPosition - 300;
    svgNode.setAttribute('viewBox', newLeftPosition + ',' + newTopPosition + ',' + 2000 + ',' + 2000);
}

window.addEventListener('load', async () => {
    svgNode = document.querySelector("svg");
    const pathData = document.querySelector("meta[name=path]").content;
    const paths = await JSON.parse(pathData);
    let clonePath = document.querySelector('#clone')
    let i = 0;
    Object.keys(paths).forEach(pathName => {
        let newPath = clonePath.cloneNode(true);
        newPath.setAttribute('id', pathName);
        newPath.setAttribute('stroke', 'black');
        newPath.setAttribute('fill', 'transparent');
        newPath.setAttribute('d', paths[pathName]);
        newPath.style.opacity = i === 0 ? 1 : 0;
        if(i === 0 ) {
            refPath = newPath;
        }
        i += 1;
        svgNode.appendChild(newPath);
    });
    clonePath.remove();
    svgNode.setAttribute('height', window.innerHeight);
    svgNode.setAttribute('width', window.innerWidth);
    __centerSVG();

    const repeatDelay = 0.25;
    let morphTimeline = new TimelineMax({
        repeat: -1,
        repeatDelay: 0.25,
    });
    morphTimeline
        .timeScale(0.25)
        .to(document.getElementById('logo_1'), repeatDelay, { morphSVG: { shape: document.getElementById("logo_2") }, },)
        .to(document.getElementById('logo_1'), repeatDelay, { morphSVG: { shape: document.getElementById("logo_3") }, }, "+=0.25")
        .to(document.getElementById('logo_1'), repeatDelay, { morphSVG: { shape: document.getElementById("logo_4") }, }, "+=0.25");
});