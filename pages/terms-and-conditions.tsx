/* eslint-disable react/jsx-handler-names */
/* eslint-disable unicorn/filename-case */
import Head from "next/head"
import Link from "next/link"
import React from "react"
import { Container, Header, Message } from "../collaborative/layout/InfoPage"
import { SecondaryButton } from "../common/input/button/SecondaryButton"

export default function TermsAndConditions() {
  const message = "QuarrelPost Terms & Conditions"

  return (
    <Container>
      <Head>
        <title key="title">{message}</title>
      </Head>
      <Header>{message}</Header>
      <Message>
        <strong>Terms &amp; Conditions</strong>
        <p>
          By downloading or using the app, these terms will automatically apply
          to you – you should make sure therefore that you read them carefully
          before using the app. The app is a fork of Discohook (
          <a href="https://discohook.org" target="blank" rel="noopener">
            discohook.org
          </a>
          ) that made available under the terms of the GNU AGPL v3 license.
        </p>
        <p>
          The QuarrelPost app stores and processes personal data that you have
          provided to us, in order to provide our Service. It’s your
          responsibility to keep your phone and access to the app secure. We
          therefore recommend that you do not jailbreak or root your phone,
          which is the process of removing software restrictions and limitations
          imposed by the official operating system of your device. It could make
          your phone vulnerable to malware/viruses/malicious programs,
          compromise your phone’s security features and it could mean that the
          QuarrelPost app won’t work properly or at all.
        </p>
        <p>
          You should be aware that there are certain things that Rainbow6-RUSSIA
          will not take responsibility for. Certain functions of the app will
          require the app to have an active internet connection. The connection
          can be Wi-Fi, or provided by your mobile network provider, but
          Rainbow6-RUSSIA cannot take responsibility for the app not working at
          full functionality if you don’t have access to Wi-Fi, and you don’t
          have any of your data allowance left.
        </p>
        <p />
        <p>
          If you’re using the app outside of an area with Wi-Fi, you should
          remember that your terms of the agreement with your mobile network
          provider will still apply. As a result, you may be charged by your
          mobile provider for the cost of data for the duration of the
          connection while accessing the app, or other third party charges. In
          using the app, you’re accepting responsibility for any such charges,
          including roaming data charges if you use the app outside of your home
          territory (i.e. region or country) without turning off data roaming.
          If you are not the bill payer for the device on which you’re using the
          app, please be aware that we assume that you have received permission
          from the bill payer for using the app.
        </p>
        <p>
          With respect to Rainbow6-RUSSIA’s responsibility for your use of the
          app, when you’re using the app, it’s important to bear in mind that
          although we endeavour to ensure that it is updated and correct at all
          times, we do rely on third parties to provide information to us so
          that we can make it available to you. Rainbow6-RUSSIA accepts no
          liability for any loss, direct or indirect, you experience as a result
          of relying wholly on this functionality of the app.
        </p>
        <p>
          At some point, we may wish to update the app. The app is currently
          available on – the requirements for system(and for any additional
          systems we decide to extend the availability of the app to) may
          change, and you’ll need to download the updates if you want to keep
          using the app. Rainbow6-RUSSIA does not promise that it will always
          update the app so that it is relevant to you and/or works with the
          version that you have installed on your device. However, you promise
          to always accept updates to the application when offered to you, We
          may also wish to stop providing the app, and may terminate use of it
          at any time without giving notice of termination to you. Unless we
          tell you otherwise, upon any termination, (a) the rights and licenses
          granted to you in these terms will end; (b) you must stop using the
          app, and (if needed) delete it from your device.
        </p>
        <p>
          <strong>Changes to This Terms and Conditions</strong>
        </p>
        <p>
          I may update our Terms and Conditions from time to time. Thus, you are
          advised to review this page periodically for any changes. I will
          notify you of any changes by posting the new Terms and Conditions on
          this page.
        </p>
        <p>These terms and conditions are effective as of 2021-01-01</p>
        <p>
          <strong>Contact Us</strong>
        </p>
        <p>
          If you have any questions or suggestions about our Terms and
          Conditions, do not hesitate to contact us at{" "}
          <a href="mailto:admin@rainbow6.ru">admin@rainbow6.ru</a>.
        </p>
      </Message>
      <Link href="/">
        <SecondaryButton onClick={() => process.browser && window.close()}>
          Back to Home
        </SecondaryButton>
      </Link>
    </Container>
  )
}
