import { onSnapshot, applySnapshot } from "mobx-state-tree";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import { debounce } from "../helpers/debounce";
import { ShareDBClient } from "./client";

export function boundEditorManagerToCollaborativeSession(store: EditorManagerLike) {
    if (process.browser) {
        const shareClient = new ShareDBClient();

        onSnapshot(store, newSnapshot => {
            console.log(JSON.parse(JSON.stringify(newSnapshot)))
            shareClient.setJSON(JSON.parse(JSON.stringify(newSnapshot)))
        }) 
        
        const apply = () => applySnapshot(store, shareClient.doc.data)
        
        shareClient.doc.subscribe(apply)
        
        shareClient.doc.on("op", debounce(apply, 50))
    }
    return store;
}