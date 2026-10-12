const DB_NAME = 'huamanga_images_db';
const STORE_NAME = 'images';
const DB_VERSION = 1;

export interface StoredImage {
  imageId: string;
  attractionId: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  altText?: string;
  source?: string;
  license?: string;
  isReferential?: boolean;
  createdAt: number;
}

export interface StoredImageMeta {
  imageId: string;
  attractionId: string;
  fileName: string;
  mimeType: string;
  altText?: string;
  source?: string;
  license?: string;
  isReferential?: boolean;
  createdAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB no soportado'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'imageId' });
        store.createIndex('attractionId', 'attractionId', { unique: false });
      }
    };
  });
}

export async function saveImage(
  imageId: string,
  attractionId: string,
  blob: Blob,
  fileName: string,
  mimeType: string,
  meta?: Partial<Pick<StoredImage, 'altText' | 'source' | 'license' | 'isReferential'>>
): Promise<StoredImageMeta> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const rec: StoredImage = {
    imageId,
    attractionId,
    blob,
    fileName,
    mimeType,
    altText: meta?.altText,
    source: meta?.source,
    license: meta?.license,
    isReferential: meta?.isReferential,
    createdAt: Date.now(),
  };
  await new Promise<void>((res, rej) => {
    const r = store.put(rec);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
  db.close();
  return {
    imageId,
    attractionId,
    fileName,
    mimeType,
    altText: rec.altText,
    source: rec.source,
    license: rec.license,
    isReferential: rec.isReferential,
    createdAt: rec.createdAt,
  };
}

export async function getImageAsBlobURL(imageId: string): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const rec = await new Promise<StoredImage | undefined>((res, rej) => {
      const r = store.get(imageId);
      r.onsuccess = () => res(r.result as StoredImage | undefined);
      r.onerror = () => rej(r.error);
    });
    db.close();
    if (!rec || !rec.blob) return null;
    return URL.createObjectURL(rec.blob);
  } catch {
    return null;
  }
}

export async function getImageMeta(imageId: string): Promise<StoredImageMeta | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const rec = await new Promise<StoredImage | undefined>((res, rej) => {
      const r = store.get(imageId);
      r.onsuccess = () => res(r.result as StoredImage | undefined);
      r.onerror = () => rej(r.error);
    });
    db.close();
    if (!rec) return null;
    return {
      imageId: rec.imageId,
      attractionId: rec.attractionId,
      fileName: rec.fileName,
      mimeType: rec.mimeType,
      altText: rec.altText,
      source: rec.source,
      license: rec.license,
      isReferential: rec.isReferential,
      createdAt: rec.createdAt,
    };
  } catch {
    return null;
  }
}

export async function deleteImage(imageId: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await new Promise<void>((res, rej) => {
      const r = store.delete(imageId);
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
    db.close();
  } catch {}
}

export async function deleteImagesByAttraction(attractionId: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const idx = store.index('attractionId');
    const keys: string[] = [];
    await new Promise<void>((res, rej) => {
      const c = idx.openCursor(IDBKeyRange.only(attractionId));
      c.onsuccess = (e: any) => {
        const cursor = e.target.result;
        if (cursor) {
          keys.push(cursor.value.imageId);
          cursor.continue();
        } else res();
      };
      c.onerror = () => rej(c.error);
    });
    for (const k of keys) {
      await new Promise<void>((res, rej) => {
        const r = store.delete(k);
        r.onsuccess = () => res();
        r.onerror = () => rej(r.error);
      });
    }
    db.close();
  } catch {}
}
