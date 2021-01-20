import ShareDB from "sharedb"

type DeepRecord<T> = Record<string, Record<string, T>>

export class TempMemoryDB extends ShareDB.MemoryDB {
  docs: DeepRecord<ShareDB.Doc> = {}
  ops: DeepRecord<ShareDB.Op[]> = {}

  deleteDoc(collection: string, id: string) {
    delete this.docs[collection][id]
    delete this.ops[collection][id]
  }

  deleteCollection(collection: string) {
    delete this.docs[collection]
    delete this.ops[collection]
  }
}