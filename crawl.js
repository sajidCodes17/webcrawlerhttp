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
    normalizeURL
}