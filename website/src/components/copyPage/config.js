/**
 * Configuration for LLM services integration
 * Add new services here to make them available in the CopyPage component
 */

export const LLM_SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chatgpt.com/?hints=search&prompt=Read+from+{url}+so+I+can+ask+questions+about+it.',
    subtitle: 'Ask questions about this page'
  },
  claude: {
    name: 'Claude',
    url: 'https://claude.ai/new?q=Read+from+{url}+so+I+can+ask+questions+about+it.',
    subtitle: 'Ask questions about this page'
  }
};

/**
 * To add a new LLM service, add a new entry to the LLM_SERVICES object:
 *
 * serviceName: {
 *   name: 'Display Name',
 *   url: 'https://service.com/?prompt={url}',  // {url} will be replaced with current page URL
 *   subtitle: 'Description shown in dropdown'
 * }
 */
