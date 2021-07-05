import { ShortCodeReverseTransformers, convertShortcode } from './Shortcode';
import { reactBridge } from './ReactBridge';

// replaceShortcodeToDOM
export function handleContentModificationOnInit(articleDOM) /*:void*/{
    // let parsed;
    try {
        convertShortcode(articleDOM);
    } catch (e) {
        console.warn(e);
    }
}

export function handleContentModificationOnSubmission(article) {
    window.EditorControl.refresh();
    let transformed;
    try {
        reactBridge(articleAdmin => {
            const content = articleAdmin._content;
            transformed = ShortCodeReverseTransformers.cleanupContent(content);
            transformed = ShortCodeReverseTransformers.transformFancyArticleImage(transformed);
            transformed = ShortCodeReverseTransformers.transformFancyArticleGallery(transformed);
            if (window.isWhitelabelV2) {
                transformed = ShortCodeReverseTransformers.transformFancyArticleProduct(transformed);
                transformed = ShortCodeReverseTransformers.transformFancyArticleProductSlideshow(transformed);
            }
        });
    } catch (e) {
        console.warn(e);
        transformed = article;
    }
    return transformed;
}
