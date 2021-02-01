/* eslint-disable unicorn/filename-case */
import Head from "next/head"
import Link from "next/link"
import React from "react"
import { Container, Header, Message } from "../collaborative/layout/InfoPage"
import { SecondaryButton } from "../common/input/button/SecondaryButton"

export default function PrivacyPolicy() {
  const message = "QuarrelPost Privacy Policy"

  return (
    <Container>
      <Head>
        <title key="title">{message}</title>
      </Head>
      <Header>{message}</Header>
      <Message>
        <strong>Privacy Policy</strong>
        <p>
          Rainbow6-RUSSIA built the QuarrelPost app as an Open Source app. This
          SERVICE is provided by Rainbow6-RUSSIA at no cost and is intended for use
          as is.
        </p>
        <p>
          This page is used to inform visitors regarding our policies with the
          collection, use, and disclosure of Personal Information if anyone
          decided to use our Service.
        </p>
        <p>
          If you choose to use our Service, then you agree to the collection and
          use of information in relation to this policy. The Personal
          Information that I collect is used for providing and improving the
          Service. I will not use or share your information with anyone except
          as described in this Privacy Policy.
        </p>
        <p>
          The terms used in this Privacy Policy have the same meanings as in our
          Terms and Conditions, which is accessible at QuarrelPost unless
          otherwise defined in this Privacy Policy.
        </p>
        <p>
          <strong>Information Collection and Use</strong>
        </p>
        <p>
          For a better experience, while using our Service, I may require you to
          provide us with certain personally identifiable information. The
          information that I request will be retained on your device and is not
          collected by us in any way.
        </p>
        <p>
          <strong>Log Data</strong>
        </p>
        <p>
          I want to inform you that whenever you use our Service, in a case of an
          error in the app I collect data and information (through third party
          products) on your phone called Log Data. This Log Data may include
          information such as your device Internet Protocol (“IP”) address,
          device name, operating system version, the configuration of the app
          when utilizing our Service, the time and date of your use of the
          Service, and other statistics.
        </p>
        <p>
          <strong>Cookies</strong>
        </p>
        <p>
          Cookies are files with a small amount of data that are commonly used
          as anonymous unique identifiers. These are sent to your browser from
          the websites that you visit and are stored on your device's internal
          memory.
        </p>
        <p>
          This Service does not use these “cookies” explicitly. However, the app
          may use third party code and libraries that use “cookies” to collect
          information and improve their services. You have the option to either
          accept or refuse these cookies and know when a cookie is being sent to
          your device. If you choose to refuse our cookies, you may not be able
          to use some portions of this Service.
        </p>
        <p>
          <strong>Service Providers</strong>
        </p>
        <p>
          I may employ third-party companies and individuals due to the
          following reasons:
        </p>
        <ul>
          <li>To facilitate our Service;</li>
          <li>To provide the Service on our behalf;</li>
          <li>To perform Service-related services; or</li>
          <li>To assist us in analyzing how our Service is used.</li>
        </ul>
        <p>
          I want to inform users of this Service that these third parties have
          access to your Personal Information. The reason is to perform the
          tasks assigned to them on our behalf. However, they are obligated not
          to disclose or use the information for any other purpose.
        </p>
        <p>
          <strong>Security</strong>
        </p>
        <p>
          I value your trust in providing us your Personal Information, thus we
          are striving to use commercially acceptable means of protecting it.
          But remember that no method of transmission over the internet, or
          method of electronic storage is 100% secure and reliable, and I cannot
          guarantee its absolute security.
        </p>
        <p>
          <strong>Links to Other Sites</strong>
        </p>
        <p>
          This Service may contain links to other sites. If you click on a
          third-party link, you will be directed to that site. Note that these
          external sites are not operated by us. Therefore, I strongly advise
          you to review the Privacy Policy of these websites. I have no control
          over and assume no responsibility for the content, privacy policies,
          or practices of any third-party sites or services.
        </p>
        <p>
          <strong>Changes to This Privacy Policy</strong>
        </p>
        <p>
          I may update our Privacy Policy from time to time. Thus, you are
          advised to review this page periodically for any changes. I will
          notify you of any changes by posting the new Privacy Policy on this
          page.
        </p>
        <p>This policy is effective as of 2021-01-01</p>
        <p>
          <strong>Contact Us</strong>
        </p>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do
          not hesitate to contact us at <a href="mailto:admin@rainbow6.ru">admin@rainbow6.ru</a>.
        </p>
      </Message>
      <Link href="/">
        <SecondaryButton onClick={() => process.browser && window.close()}>Back to Home</SecondaryButton>
      </Link>
    </Container>
  )
}
