describe('Once before all tests', () => {
  it('should make a request to warm up the backend endpoint', () => {
    cy.request({
      url: Cypress.env('backendUrl'),
      timeout: 180000, // 3 minutes in ms
      failOnStatusCode: false
    })
  })
})
