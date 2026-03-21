describe('Dashboard application', () => {
  it('Should load the dashboard homepage', { retries: 3 }, () => {
    cy.visit('/')

    cy.contains(/dashboard/)
    cy.contains('Refresh').click()
    cy.contains(/dashboard/)
  })
})
