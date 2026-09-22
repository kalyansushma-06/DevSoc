"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#07111f",
    padding: 35,
    fontFamily: "Helvetica",
    color: "#ffffff",
  },

  border: {
    flex: 1,
    border: "2px solid #22d3ee",
    padding: 35,
    justifyContent: "space-between",
  },

  top: {
    alignItems: "center",
  },

  brand: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#22d3ee",
    letterSpacing: 2,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 9,
    color: "#94a3b8",
    letterSpacing: 1,
  },

  title: {
    marginTop: 35,
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 3,
    textAlign: "center",
  },

  presented: {
    marginTop: 18,
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
  },

  name: {
    marginTop: 10,
    fontSize: 27,
    fontWeight: "bold",
    color: "#22d3ee",
    textAlign: "center",
  },

  line: {
    width: 320,
    height: 1,
    backgroundColor: "#334155",
    marginTop: 10,
    alignSelf: "center",
  },

  body: {
    marginTop: 18,
    fontSize: 12,
    color: "#cbd5e1",
    textAlign: "center",
    lineHeight: 1.6,
  },

  achievement: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },

  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  detailBox: {
    width: "30%",
    alignItems: "center",
  },

  detailLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
  },

  detailValue: {
    marginTop: 5,
    fontSize: 9,
    color: "#e2e8f0",
    textAlign: "center",
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 25,
  },

  signature: {
    width: 180,
    borderTop: "1px solid #475569",
    paddingTop: 6,
  },

  signatureName: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },

  signatureRole: {
    marginTop: 3,
    fontSize: 8,
    color: "#64748b",
  },

  qrSection: {
    alignItems: "center",
  },

  qr: {
    width: 75,
    height: 75,
  },

  verifyText: {
    marginTop: 4,
    fontSize: 7,
    color: "#64748b",
  },

  certificateId: {
    marginTop: 5,
    fontSize: 7,
    color: "#22d3ee",
  },
});

export default function CertificatePDF({
  certificate,
  qrDataUrl,
}) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View>
            <View style={styles.top}>
              <Text style={styles.brand}>DEVSOC</Text>

              <Text style={styles.subtitle}>
                UIET • TECHNOLOGY • COMMUNITY • INNOVATION
              </Text>
            </View>

            <Text style={styles.title}>
              CERTIFICATE OF ACHIEVEMENT
            </Text>

            <Text style={styles.presented}>
              This certificate is proudly presented to
            </Text>

            <Text style={styles.name}>
              {certificate.name}
            </Text>

            <View style={styles.line} />

            <Text style={styles.body}>
              In recognition of outstanding participation and achievement in
            </Text>

            <Text style={styles.achievement}>
              {certificate.issuedFor}
            </Text>
          </View>

          <View>
            <View style={styles.details}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>
                  Date Issued
                </Text>

                <Text style={styles.detailValue}>
                  {certificate.dateIssued}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>
                  Issued By
                </Text>

                <Text style={styles.detailValue}>
                  {certificate.issuedBy}
                </Text>
              </View>

              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>
                  Status
                </Text>

                <Text style={styles.detailValue}>
                  {certificate.status?.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.bottom}>
              <View style={styles.signature}>
                <Text style={styles.signatureName}>
                  {certificate.issuedBy}
                </Text>

                <Text style={styles.signatureRole}>
                  Authorized Signatory • DevSoc
                </Text>
              </View>

              {qrDataUrl && (
                <View style={styles.qrSection}>
                  <Image
                    src={qrDataUrl}
                    style={styles.qr}
                  />

                  <Text style={styles.verifyText}>
                    Scan to verify
                  </Text>

                  <Text style={styles.certificateId}>
                    {certificate.certId}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}