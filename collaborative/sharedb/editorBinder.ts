import { observe } from "mobx";
import { onSnapshot, applySnapshot } from "mobx-state-tree";
import type { EditorManagerLike } from "../../modules/editor/EditorManager";
import type { ExternalServiceManager } from "../header/ExternalServiceManager";
import { ShareDBClient } from "./client";

export function bindEditorManagerToCollaborativeSession(store: EditorManagerLike, externalService: ExternalServiceManager) {
    if (process.browser) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        observe(externalService, "googleUser", async () => {
            console.log(externalService.googleUser?.email)
            const shareClient = new ShareDBClient();

            onSnapshot(store, newSnapshot => shareClient.setJSON(newSnapshot))
            
            shareClient.on("apply", () => applySnapshot(store, shareClient.doc.data));
        })
    }
    return store;
}