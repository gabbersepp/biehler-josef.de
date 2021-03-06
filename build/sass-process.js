const sass = require('sass');
const fs = require('fs');
const path = require('path');

function transform(scssPath, cssPath) {
    let partialDir = ""
    cssPath.split(/[\/\\]/).forEach(x => {
        if (x.indexOf(".css") > -1) {
            return;
        }
        partialDir = partialDir + x + "/";
        console.log(`ensure >${partialDir} `)
        if (!fs.existsSync(partialDir)) {
            fs.mkdirSync(partialDir);
        }
    });
    console.log(`Watching ${path.dirname(scssPath)}...`);
    //Encapsulate rendered css from scssPath into watchResult variable
    const watchResult = sass.renderSync({file: scssPath});
    //Then write result css string to cssPath file
    fs.writeFileSync(cssPath, watchResult.css.toString())
}

module.exports = (scssPath, cssPath) => {
    console.log(`Transforming '${scssPath}' to '${cssPath}'`)
    transform(scssPath, cssPath);

    if (process.env.SASSWATCH == 1) {
        console.log("starting watch task for sass");
        //Watch for changes to scssPath directory...
        fs.watch(path.dirname(scssPath), () => {
            transform(scssPath, cssPath);
        });
    }
}