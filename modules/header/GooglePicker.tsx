import React, { Component } from "react"

const AUTH_SCOPE =
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly"

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string

export type GooglePickerProps = {
  children: JSX.Element
  onEvent: (event: unknown) => unknown
}

export type GooglePickerState = {
  signedIn?: boolean
  accessToken?: string
}

export default class GooglePicker extends Component<
  GooglePickerProps,
  GooglePickerState
> {
  componentDidMount() {
    gapi.load("auth2", this.initAuth)
    gapi.load("client", this.initClient)
    gapi.load("picker", console.log)
  }

  initAuth = () => {
    void gapi.auth2.init({ client_id: CLIENT_ID, scope: AUTH_SCOPE })

    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus)

    this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
  }

  initClient = () => {
    void gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: AUTH_SCOPE,
    })
  }

  updateSignInStatus = (newSignedIn: boolean) => {
    const accessToken = newSignedIn
      ? gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse()
          .access_token
      : undefined

    this.setState({ signedIn: newSignedIn, accessToken })
  }

  createPicker = () => {
    const { accessToken } = this.state

    if (!accessToken) {
      return
    }

    const view = new google.picker.DocsView(google.picker.ViewId.SPREADSHEETS)
    view.setMimeTypes("application/vnd.google-apps.spreadsheet")
    const picker = new google.picker.PickerBuilder()
      .setAppId(CLIENT_ID)
      .setOAuthToken(accessToken)
      .addView(view)
      .setCallback(this.props.onEvent)
      .build()
    picker.setVisible(true)
  }

  handleSelect = () => {
    const { signedIn } = this.state

    if (signedIn) {
      return this.createPicker()
    }

    void gapi.auth2.getAuthInstance().signIn()
  }

  render() {
    return React.cloneElement(this.props.children, {
      onClick: this.handleSelect,
    })
  }
}
