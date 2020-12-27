import React, { Component } from "react"

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string

export type GoogleDriveItem = {
  description: string
  driveSuccess: boolean
  embedUrl: string
  iconUrl: string
  id: string
  lastEditedUtc: number
  mimeType: string
  name: string
  parentId: string
  serviceId: string
  sizeBytes: number
  type: string
  url: string
}

export type GooglePickerCallback =
  | {
      action: "loaded" | "cancel"
    }
  | {
      action: "picked"
      docs: GoogleDriveItem[]
      viewToken: unknown[]
    }

export type GooglePickerProps = {
  children: JSX.Element
  onEvent: (event: GooglePickerCallback) => unknown
  accessToken: string
}

export default class GooglePicker extends Component<GooglePickerProps> {
  componentDidMount = () => {
    gapi.load("picker", console.log)
  }

  createPicker = () => {
    const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
    view.setMimeTypes("application/vnd.google-apps.spreadsheet")

    const picker = new google.picker.PickerBuilder()
      .setAppId(CLIENT_ID)
      .setOAuthToken(this.props.accessToken)
      .addView(view)
      .setCallback(this.props.onEvent)
      .build()
    picker.setVisible(true)
  }

  render() {
    return React.cloneElement(this.props.children, {
      onClick: this.createPicker,
    })
  }
}
