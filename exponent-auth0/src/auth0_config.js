
// replace `<Client Id>` with your personal Auth0 Client Id
export const auth0_client_id = '<Client Id>'

// replace `<Domain>` with your Auth0 Domain
export const authorize_url = 'https://<Domain>/authorize'

// replace `<Graphcool Project Id>` with the Project Id of the Instagram project that you find
// in the Graphcool console in Settings --> General
export const graphQL_endpoint = 'https://api.graph.cool/simple/v1/<Graphcool Project Id>'

if (Exponent.Constants.manifest.xde) {
  // replace `<Exponent URL without Port>` with the app's URL when you open it in exponent
  // without the colon and the port
  redirect_uri = '<Exponent URL without Port>/+/redirect'
} else {
  // this URL will be used when you publish your app
  redirect_uri = `${Exponent.Constants.linkingUri}/redirect`
}

