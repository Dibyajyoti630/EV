import { keyTracker, storage } from "./app.js"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js"


// Upload image to storage & tracking next image id in database
const NIMGID = "nextImgId"
const IMAGES = "images/"
export const uploadImage = async (ownerId, file, path) => {
    try {
        // Get & Update new image id
        const pathNotEmpty = String(path).length > 0 && path != ""
        if (pathNotEmpty === false) {
            path = IMAGES + await keyTracker(NIMGID)
        }
        const isFile = file instanceof File
        if (isFile) {
            const metaData = {
                customMetadata: {
                    owner: ownerId
                }
            }
            const image = await uploadBytes(ref(storage, path), file, metaData) //  Uploading image
            return image.metadata.fullPath
        }
        else if (pathNotEmpty) return path
        else throw null
    } catch (error) {
        throw error.message
    }
}

// Convert image path as a download url
export const getImgUrl = async (path) => {
    try {
        return await getDownloadURL(ref(storage, path))
    } catch (error) {
        throw error.message
    }
}

// Delete image
export const deleteImage = async (path) => {
    try {
        return await deleteObject(ref(storage, path))
    } catch (error) {
        throw error.message
    }
}