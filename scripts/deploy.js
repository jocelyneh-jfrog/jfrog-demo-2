#!/usr/bin/env node
// ⚠️  DEMO FILE — hardcoded secrets intentionally present for JFrog Secret Detection demo

// ─── Deployment config with embedded credentials ─────────────────────────────
const DEPLOY_CONFIG = {
  // ⚠️  Private key hardcoded — should be in vault/secrets manager
  privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIDEMO0000000000000000000000000000000000000000000000000000000000
0000000000000000000000000000000000000000000000000000000000000000
AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
-----END RSA PRIVATE KEY-----`,

  // ⚠️  Artifactory deploy credentials hardcoded
  artifactory: {
    url: 'https://demo.jfrog.io/artifactory',
    user: 'deploy-svc-account',
    apiKey: 'AKCpDEMO00000000000000000000000000000000000000000000000000000'
  },

  // ⚠️  Kubernetes service account token hardcoded
  kubernetes: {
    server: 'https://k8s.demo-cluster.internal:6443',
    token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.DEMO.FAKESIGNATURE',
    namespace: 'production'
  },

  // ⚠️  DockerHub credentials hardcoded
  docker: {
    registry: 'registry.hub.docker.com',
    username: 'demo-deploy-bot',
    password: 'Dock3rDEMOP@ssw0rd!'
  }
};

async function deploy() {
  console.log('Starting deployment...');
  console.log(`Deploying to: ${DEPLOY_CONFIG.artifactory.url}`);
  console.log(`Kubernetes namespace: ${DEPLOY_CONFIG.kubernetes.namespace}`);
  // In a real deploy this would push artifacts and apply k8s manifests
  console.log('Deployment complete (demo — no actual deploy performed)');
}

deploy().catch(console.error);
