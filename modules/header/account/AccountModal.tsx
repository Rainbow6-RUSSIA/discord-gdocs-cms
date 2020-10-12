import type { DriveProps } from "react-drive"

export default function PickerStub(props: Partial<DriveProps>) {
  return props.children
}

/*
const GooglePicker = dynamic<GooglePickerProps>(async () =>
  import("./account/GooglePicker").then(module => module.default),
)

  {!loading && session?.google ? (
        <GooglePicker
          accessToken={session.google.accessToken}
          onEvent={headerManager.handlePickerEvent}
        >
          <HeaderButton>Select Spreadsheet</HeaderButton>
        </GooglePicker>
      ) : null}
*/
