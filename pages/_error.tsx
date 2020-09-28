import * as Sentry from "@sentry/node"
import type { NextPageContext } from "next"
import React from "react"
import { ErrorPage } from "../common/ErrorPage"

export type ErrorProps = {
  err?: Error
  statusCode?: number
}

export default function MyError(props: ErrorProps) {
  const { statusCode, err } = props

  Sentry.captureException(err)

  return <ErrorPage statusCode={statusCode} />
}

MyError.getInitialProps = (context: NextPageContext): ErrorProps => {
  return {
    statusCode: context.res?.statusCode,
  }
}
