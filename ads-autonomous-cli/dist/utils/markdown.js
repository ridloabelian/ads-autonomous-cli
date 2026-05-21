import { marked } from 'marked';
export const parseMarkdown = (markdown) => {
    try {
        const result = marked.parse(markdown);
        return typeof result === 'string' ? result : '';
    }
    catch (error) {
        console.error('Failed to parse markdown:', error);
        return markdown;
    }
};
export const extractTitle = (markdown) => {
    const match = markdown.match(/^#\s+(.+)$/m);
    return match?.[1] ?? 'Untitled';
};
//# sourceMappingURL=markdown.js.map