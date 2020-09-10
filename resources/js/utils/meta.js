/**
 * Returns value of meta tag by given name
 *
 * @param {String} name - meta tag name attribute value
 * @param {*} defaultValue - value to return if no meta tag found
 *
 * @returns content attribute value if meta tag found or default value otherwise
 *
 * If the name param is empty, default value is returned
 *
 */

export function getMeta(name, defaultValue, doc = document) {
    if (typeof name === undefined) return defaultValue
    const meta = doc.head.querySelector(`meta[name="${name}"]`)
    return meta ? meta.content : defaultValue
}


/**
 * Set meta tag value or create one if not exist
 * if content is null, meta tag will be removed
 * 
 * @param {String} name    - name attribute value
 * @param {String, null} content - content attribute value
 */

export function setMeta(name, content) {

    let tag = document.querySelector(`meta[name="${name}"]`)

    if ( tag ) {

        if ( content === null ) {
            tag.parentNode.removeChild(tag)
        } else {
            // update content
            tag.content = content
        }

    } else if ( content !== null ) {

        // create tag
        tag = document.createElement('META')
        tag.name = name
        tag.content = content
        document.head.appendChild(tag)
    }
}
