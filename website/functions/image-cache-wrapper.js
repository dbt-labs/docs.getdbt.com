import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// This function is used to break the cache on images
// preventing stale or broken images from being served

const CACHE_VERSION = '2'

export default function imageCacheWrapper(src) {
    const { siteConfig: {customFields} } = useDocusaurusContext();

    const cacheParam = customFields?.isVercel === '1'
    ? `?v=${CACHE_VERSION}`
    : ``

    return (
        src + cacheParam
    )
}
