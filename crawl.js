const {JSDOM} = require("jsdom")

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll("a")
    for(const linkElement of linkElements){
        if(linkElement.href.slice(0, 1) === "/"){
            try{
                const tester = new URL(`${baseURL}${linkElement.href}`)
                urls.push(`${baseURL}${linkElement.href}`)
            }
            catch(error){
                console.log(`Error with relative URL: ${error.message}`)
            }
        }
        else{
            try{
                const tester = new URL(linkElement.href)
                urls.push(linkElement.href)
            }
            catch(error){
                console.log(`Error with relative URL: ${error.message}`)
            }
        }
    }
    return urls
}


function normalizeURL(urlString){
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    if(hostPath.length > 1 && hostPath.slice(-1) === "/"){
        return hostPath.slice(0, -1)
    }
    else{
        return hostPath
    }
}

module.exports = {
    normalizeURL,
    getURLsFromHTML
}