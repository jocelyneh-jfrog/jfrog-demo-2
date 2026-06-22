// ⚠️  DEMO FILE — intentional fake secrets for JFrog Secret Detection demo
// All values below are fabricated for demo purposes only

module.exports = {
  aws: {
    region: 'us-east-1',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',                       // ⚠️  AWS example key (from AWS docs)
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',   // ⚠️  AWS example secret (from AWS docs)
    s3Bucket: 'demo-company-bucket'
  },
  stripe: {
    secretKey: 'sk_test_DEMO_NOT_REAL_00000000000000000000000',  // ⚠️  fake Stripe-format key
  },
  sendgrid: {
    apiKey: 'SG.DEMO_KEY_NOT_REAL.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'  // ⚠️  fake SendGrid-format key
  },
  twilio: {
    accountSid: 'ACDEMO00000000000000000000000000',
    authToken:  'DEMO_AUTH_TOKEN_00000000000000000'             // ⚠️  fake Twilio-format token
  },
  slack: {
    botToken: 'xoxb-DEMO-000000000000-000000000000-AAAAAAAAAAAAAAAAAAAAAAAAA'  // ⚠️  fake Slack bot token format
  },
  github: {
    token: 'ghp_DEMO00000000000000000000000000000000'           // ⚠️  fake GitHub PAT format
  }
};
