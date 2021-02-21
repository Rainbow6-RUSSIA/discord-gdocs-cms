/* eslint-disable react/jsx-curly-brace-presence */
import { Trans } from "next-i18next"
import Head from "next/head"
import Link from "next/link"
import Router from "next/router"
import React, { ErrorInfo } from "react"
import styled from "styled-components"
import { useTranslation } from "../../modules/i18n"
import { CodeBlockContainer } from "../../modules/markdown/styles/CodeBlockContainer"
import { PrimaryButton } from "../input/button/PrimaryButton"
import { SecondaryButton } from "../input/button/SecondaryButton"
import { SCREEN_SMALL } from "../layout/breakpoints"

const Container = styled.div`
  height: 100%;

  overflow: auto;

  padding: 64px 32px 0;

  ${SCREEN_SMALL} {
    padding: 32px 16px;
  }
`

const Header = styled.h1`
  margin: 0;

  color: ${({ theme }) => theme.header.primary};
  font-size: 28px;
`

const Message = styled.p`
  margin: 16px 0;

  max-width: 600px;

  font-size: 16px;
  line-height: 1.375;
`

const ErrorDetails = styled(CodeBlockContainer)`
  max-width: 1200px;
  margin-bottom: 32px;
`

export type ErrorPageProps = {
  error?: Error
  info?: ErrorInfo
  title?: string
  statusCode?: number
}

export function ErrorPage(props: ErrorPageProps) {
  const { error, info, title, statusCode } = props

  const { t, i18n } = useTranslation("error")

  const message =
    title ??
    (statusCode && i18n.exists(`error:${statusCode}`)
      ? t("error", { code: statusCode, name: t(statusCode.toString()) })
      : t("unexpected"))

  return (
    <Container>
      <Head>
        <title key="title">{message}</title>
      </Head>
      <Header>{message}</Header>
      <Message>
        {t("unexpected1")}
        <Trans i18nKey="unexpected1" t={t}>
          <i>0</i>
        </Trans>
        {/* {" "}
          If you didnt expect this, please report it on the{" "}
          <i>Discord support server</i>, or create an issue on the{" "}
          <strong>GitHub repository</strong>.
        <a href="/discord" target="blank" rel="noopener">
          
        </a>
        {" "}
        <a
          href="https://github.com/discohook/site"
          target="blank"
          rel="noopener"
        >
          
        </a>
        . */}
      </Message>
      {statusCode ? (
        <Link href="/">
          <SecondaryButton>Home</SecondaryButton>
        </Link>
      ) : (
        <PrimaryButton onClick={() => Router.reload()}>Refresh</PrimaryButton>
      )}
      {error && info && (
        <>
          <Message>{t("technical-details")}</Message>
          <ErrorDetails>
            {String(error)}
            {"\n"}
            {error.stack?.replace(String(error), "").replace(/^\n|\n$/g, "")}
            {info.componentStack}
          </ErrorDetails>
        </>
      )}
    </Container>
  )
}
