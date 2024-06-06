// This function is used to break the cache on images
// preventing stale or broken images from being served

const CACHE_VERSION = '2'

export default function imageCacheWrapper(src) {
    const cacheParam = `?v=${CACHE_VERSION}`

    return (
        src + cacheParam
    )
}
