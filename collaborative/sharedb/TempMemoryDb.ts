/* eslint-disable @typescript-eslint/ban-ts-comment */
// eslint-disable-next-line max-classes-per-file
import ShareDB from "sharedb"
// eslint-disable-next-line @typescript-eslint/no-var-requires

export class TempMemoryDB extends ShareDB.MemoryDB {

  deleteDoc(collection: string, id: string) {
    // @ts-ignore
    delete this.docs[collection][id]
    // @ts-ignore
    delete this.ops[collection][id]
  }

}