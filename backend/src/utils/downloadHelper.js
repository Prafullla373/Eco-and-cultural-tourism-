/**
 * Helper function to trigger file downloads in the browser
 * This function should be used in frontend components
 */

export const downloadFile = async (url, filename, onProgress) => {
    try {
        if (onProgress) onProgress('Preparing download...');

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include', // Important for auth cookies
        });

        if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
        }

        if (onProgress) onProgress('Downloading...');

        // Get the blob from response
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

        if (onProgress) onProgress('Download complete!');

        return { success: true };
    } catch (error) {
        console.error('Download error:', error);
        if (onProgress) onProgress(null);
        return { success: false, error: error.message };
    }
};
