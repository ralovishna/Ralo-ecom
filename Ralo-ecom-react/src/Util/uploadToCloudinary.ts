const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!file) {
        throw new Error('No file provided for upload');
    }

    if (!cloudName || !uploadPreset) {
        throw new Error('Missing Cloudinary config: Check your .env file');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Cloudinary upload failed: ${errorText}`);
        }

        const fileData = await response.json();
        return fileData.secure_url || fileData.url;
    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error.message || error);
        throw new Error('Upload to Cloudinary failed. Please try again.');
    }
};

export default uploadToCloudinary;
