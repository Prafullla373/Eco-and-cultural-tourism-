import toast from 'react-hot-toast';

/**
 * Universal report download function
 * Uses fetch API to avoid IDM interference and handle CORS properly
 */
export const downloadReport = async (endpoint, { format, startDate, endDate, status, type }) => {
    const toastId = toast.loading(`Generating ${format.toUpperCase()} report...`);

    try {
        const params = new URLSearchParams();
        params.append('format', format);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (status) params.append('status', status);
        if (type) params.append('type', type);

        const response = await fetch(`http://localhost:5000/api/admin/reports/${endpoint}?${params}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': format === 'pdf' ? 'application/pdf' : 'text/csv'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error(`Server returned ${response.status}`);
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${endpoint}_report.${format}`;
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 100);

        toast.success('Report downloaded!', { id: toastId });
        return { success: true };
    } catch (error) {
        console.error('Download error:', error);
        toast.error('Download failed. Restart backend server!', { id: toastId });
        return { success: false, error: error.message };
    }
};
