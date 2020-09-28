declare module "react-drive" {
    export default function Drive(props: DriveProps): JSX.Element;
    
    export type DriveProps = {
        children: JSX.Element;
        clientId: string;
        apiKey: string;
        onEvent: (event: Events, payload) => unknown;
        exportAsBlobs?: boolean;
        exportMimeTypeOverrides?: MimeTypesOverrides;
        origin?: string,
        multiSelect?: boolean,
        injectOnClick?: boolean,
        allowSharedDrives?: boolean,
        allowedMimeTypes?: string[],
        downloadSelectedFiles?: boolean
    }

    export type MimeTypesOverrides = {
        document: string;
        drawing: string;
        presentation: string;
        script: string;
        spreadsheet: string;
    }

    export type Events = "SELECTED_FILE" | "SELECTED_FILES" | "START_REMOTE_PULL" | "CANCEL" | "ERROR"

    // type Payload = {
    //     files
    // }
  }
  