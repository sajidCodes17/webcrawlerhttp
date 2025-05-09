const {JSDOM} = require("jsdom")


async function crawlPage(baseURL, currentURL, pages){

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname != currentURLObj.hostname){
        return pages
    }

    const normalizedCurrentUrl = normalizeURL(currentURL)

    if(pages[normalizedCurrentUrl] > 0){
        pages[normalizedCurrentUrl]++
        return pages
    }

    pages[normalizedCurrentUrl] = 1

    console.log(`Actively crawling ${currentURL}`)

    try{
        const resp = await fetch(currentURL)

        if(resp.status > 399){
            console.log(`Error in fetch with status code ${resp.status}, on page ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")

        if(!contentType.includes("text/html")){
            console.log(`Non HTML response, content type: ${contentType}, on page ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for(element of nextURLs){
            pages = await crawlPage(baseURL, element, pages)
        }
    }
    catch(error){
        console.log(`Error in fetch ${error.message} on page ${currentURL}`)
    }

    return pages
  
}


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
                console.log(`Error with absolute URL: ${error.message}`)
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
    getURLsFromHTML,
    crawlPage
}