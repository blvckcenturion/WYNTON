import { dataDir } from "@tauri-apps/api/path"
import { BaseDirectory, copyFile, createDir, exists } from "@tauri-apps/api/fs";
import { o } from "@tauri-apps/api/dialog-15855a2f";


const createImage = async (dirname : string, photoSrc : string) => {
    let ap = await dataDir();
    let dir = await exists(`wynton/assets/images/${dirname}`, { dir: BaseDirectory.Data })

    if(!dir) {
        await createDir(`wynton/assets/images/${dirname}`, { dir: BaseDirectory.Data, recursive: true })
    }
    
    let name = `${Math.floor(Date.now() / 1000)}.${photoSrc.split('.').pop()}`;
    
    let img = await exists(photoSrc)

    if(!img) {
        throw new Error("No existe la imagen")
    } else {
        await copyFile(photoSrc, `wynton/assets/images/${dirname}/${name}`, { dir: BaseDirectory.Data})
    }

    return `${ap}/wynton/assets/images/${dirname}/${name}`
}

export default createImage