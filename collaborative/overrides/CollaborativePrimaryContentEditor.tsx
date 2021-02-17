import { useObserver } from "mobx-react-lite"
import React from "react"
import { FileInputField } from "../../common/input/file/FileInputField"
import { InputField } from "../../common/input/text/InputField"
import { RowContainer } from "../../common/layout/RowContainer"
import { Stack } from "../../common/layout/Stack"
import type { MessageItemFormState } from "../../modules/message/state/editorForm"
import type { MessageLike } from "../../modules/message/state/models/MessageModel"

export type PrimaryContentEditorProps = {
  message: MessageLike
  form: MessageItemFormState
}

export function CollaborativePrimaryContentEditor(props: PrimaryContentEditorProps) {
  const { message, form } = props

  return useObserver(() => (
    <Stack gap={12}>
      <InputField
        id={`_${message.id}_content`}
        label="Content"
        maxLength={2000}
        rows={4}
        error={form.field("content").error}
        {...form.field("content").inputProps}
      />
    </Stack>
  ))
}
