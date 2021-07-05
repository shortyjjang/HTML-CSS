// This stores initial static page history info that needs to be restored when modal get closed.
export const historyData = {
    initialPath: location.pathname,
    /* mut */preservedHref: location.href, // Preserved Href just before open, and to be returned when closed.
    initialTitle: document.title
};
